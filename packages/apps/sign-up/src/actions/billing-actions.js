import axios from 'axios';
import {
	POST_BILLING_FORM,
	POST_BILLING_FORM_ERROR,
	POST_BILLING_FORM_SUCCESS,
	UPDATE_BILLING_FORM
} from 'constants/action-constants';
import {TimeZoneOptions} from 'constants/settings-constants';
import {getOnboardingUrl} from 'constants/url-constants';
import {
	getIsSanofi,
	getPromoCodeLabel,
	shouldActivateAtSignUp
} from 'selectors/account-selectors';
import {getIsPayg} from 'selectors/pricing-selectors';

import {getMarketingMetrics, hasErrors, validate} from '@www-forms/components';

import {getSummaryPreview} from './summary-actions';

const ccExpirationMonthError = 'Enter a 2 digit month';
const ccExpirationYearError = 'Enter a 2 digit year';

const accountInfoValidationRules = {
	billingState: {
		required: true
	},
	billingZipCode: {
		postalCode: true,
		required: true
	},
	cardNumber: {
		required: true,
		minLength: 13,
		maxLength: 16,
		creditCardNumber: true
	},
	ccExpirationMonth: {
		required: true,
		requiredMessage: ccExpirationMonthError,
		maxLength: 2,
		maxLengthMessage: ccExpirationMonthError,
		maxValue: 12,
		maxValueMessage: ccExpirationMonthError,
		minLength: 2,
		minLengthMessage: ccExpirationMonthError,
		minValue: 1,
		minValueMessage: ccExpirationMonthError,
		number: true,
		numberMessage: ccExpirationMonthError
	},
	ccExpirationYear: {
		required: true,
		requiredMessage: ccExpirationYearError,
		number: true,
		numberMessage: ccExpirationYearError,
		year: true
	},
	cvc: {
		required: true,
		requiredMessage: 'Enter a CVN',
		maxLength: 4,
		minLength: 3,
		number: true,
		minLengthMessage: 'Only 3-4 digits',
		maxLengthMessage: 'Only 3-4 digits'
	},
	firstName: {
		required: true,
		name: true,
		maxLength: 50
	},
	lastName: {
		required: true,
		name: true,
		maxLength: 50
	}
};

export const validateForm = form => validate(form, accountInfoValidationRules);

const updateBilling = form => ({type: UPDATE_BILLING_FORM, form});
const updateBillingInfoError = error => ({
	type: POST_BILLING_FORM_ERROR,
	error
});
const updateBillingInfoSuccess = loginToken => ({
	type: POST_BILLING_FORM_SUCCESS,
	loginToken
});
const submitBillingFormRequest = () => ({type: POST_BILLING_FORM});

export const updateBillingState = field => dispatch => {
	const validatedForm = validateForm(field);
	dispatch(updateBilling(validatedForm));
	dispatch(getSummaryPreview());
};

export const updateBillingForm = field => dispatch => {
	const validatedForm = validateForm(field);
	dispatch(updateBilling(validatedForm));
};

const postBilling = payload =>
	axios({
		method: 'post',
		url: `${process.env.REACT_APP_PROXY_URL}/signup`,
		data: payload
	});

export const postSignUp = (dispatch, getState) => {
	// Extract relevant data from the state tree
	const state = getState();
	const {
		accountInfo: {
			email,
			firstName,
			lastName,
			password,
			// Extended details
			companyName: CompanyName,
			howTheyHeard: HowTheyHeard,
			phone: Phone,
			promoCode: PromoCode,
			state: State,
			timeZone: TimeZone
		},
		billing: {
			billingState,
			billingZipCode,
			cardNumber,
			ccExpirationMonth,
			ccExpirationYear,
			cvc,
			firstName: billingFirstName,
			lastName: billingLastName
		},
		groupCode: {
			groupCode: GroupCode,
			IsFreeTrial,
			SkipPlanAndPayment,
			BulkPricing,
			SubscriptionPricing
		},
		summary: {MaxPeople, MonthlyFee, NumberOfCredits}
	} = state;

	const isSanofi = getIsSanofi(state);
	const isPayg = getIsPayg(state);

	let userDetails = {
		Email: email,
		FirstName: firstName,
		LastName: lastName,
		PinCode: password,
		UserName: email
	};

	let accountDetails = {};

	if (isPayg) {
		accountDetails.IsSubscription = false;
		accountDetails.CallBalance = NumberOfCredits;
	} else {
		accountDetails.IsSubscription = true;
		accountDetails.MonthlyLevel = MaxPeople;
		accountDetails.MonthlyFee = MonthlyFee;
	}

	if (shouldActivateAtSignUp(state)) {
		// Get details from extended form
		accountDetails = {
			...accountDetails,
			CompanyName,
			HowTheyHeard,
			State,
			IndustryID: isSanofi ? 45 : null
		};

		const ObservesDaylightSavings = State !== 'AZ' || State !== 'HI';
		const TimeZoneOffset = TimeZoneOptions.find(t => t.value === TimeZone)
			.offset;

		userDetails = {
			...userDetails,
			Phone,
			CallerID: Phone,
			ObservesDaylightSavings,
			TimeZoneOffset
		};
	}

	const promoCodeDetails = {};
	if (getPromoCodeLabel(state)) {
		promoCodeDetails.PromoCode = PromoCode;
	}

	const creditCard = {};
	if (SkipPlanAndPayment) {
		const BulkPricingID = BulkPricing.PricingID;
		const SubPricingId = SubscriptionPricing.PricingID;

		accountDetails.BulkPricingID = BulkPricingID;
		accountDetails.SubPricingId = SubPricingId;
	} else {
		// Take last 2 digits of card year. 22 -> 22 and 2022 -> 22
		const expYear = ccExpirationYear.slice(-2);

		// Format as YYYY-MM-DD
		const formattedExpirationDate = `20${expYear}-${ccExpirationMonth}-01`;

		creditCard.CreditCard = {
			BillingState: billingState,
			BillingZipCode: billingZipCode,
			CVN: cvc,
			CardNumber: cardNumber,
			ExpirationDate: formattedExpirationDate,
			FirstName: billingFirstName,
			LastName: billingLastName
		};
	}

	const marketing = getMarketingMetrics();
	const {HTTPReferer, AdTracking} = marketing;

	// Create API payload
	const signUpPayload = {
		Account: {
			AccountID: 0,
			CommissionAccount: GroupCode,
			FreeTrialConversion: false, // TODO
			GroupCode,
			HTTPReferer,
			IsFreeTrial,
			State: billingState,
			...accountDetails
		},
		AdTracking,
		...promoCodeDetails,
		...creditCard,
		User: {
			...userDetails
		}
	};

	dispatch(submitBillingFormRequest());

	postBilling(signUpPayload)
		.then(response => {
			const loginToken = response.data.LoginToken;
			dispatch(updateBillingInfoSuccess(loginToken));
		})
		.catch(e => {
			dispatch(
				updateBillingInfoError(
					(e.response && e.response.data.Message) ||
						'An error has occured. Please check your information and try again.'
				)
			);
		});
};

export const submitBilling = () => (dispatch, getState) => {
	const {billing} = getState();
	const validatedForm = validateForm(billing);

	// Don't submit while the form has errors
	if (hasErrors(validatedForm)) {
		// Update all fields to allow the error messages to show
		const updatedForm = {
			...validatedForm,
			billingStateTouched: true,
			billingZipCodeTouched: true,
			cardNumberTouched: true,
			ccExpirationMonthTouched: true,
			ccExpirationYearTouched: true,
			cvcTouched: true,
			firstNameTouched: true,
			lastNameTouched: true
		};
		dispatch(updateBilling(updatedForm));
	} else {
		dispatch(postSignUp);
	}
};

export const completeSignUp = loginToken => {
	const redirectUrl = getOnboardingUrl(loginToken);
	window.location.replace(redirectUrl);
};
