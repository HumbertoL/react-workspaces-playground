import axios from 'axios';
import {
	UPDATE_ACCOUNT_DETAILS,
	UPDATE_PHONE_VALID,
	UPDATE_PROMO_VALID,
	UPDATE_USERNAME_VALID
} from 'constants/action-constants';
import {
	getIsSanofi,
	getPromoCodeLabel,
	shouldActivateAtSignUp
} from 'selectors/account-selectors';

import {hasErrors, validate} from '@www-forms/components';

import {postSignUp} from './billing-actions';
import {goToBilling} from './step-actions';

const accountInfoValidationRules = {
	firstName: {
		required: true,
		maxLength: 50,
		name: true
	},
	lastName: {
		required: true,
		maxLength: 50,
		name: true
	},
	email: {
		required: true,
		requiredMessage: 'Enter an Email',
		email: true,
		maxLength: 50,
		minLength: 8
	},
	password: {
		required: true,
		maxLength: 25,
		minLength: 8,
		password: true
	}
};

const extendedValidationRules = {
	howTheyHeard: {
		displayName: 'How You Heard',
		maxLength: 50
	},
	companyName: {
		required: true,
		maxLength: 50
	},
	phoneNumber: {
		required: true,
		requiredMessage: 'Enter a Phone Number',
		phone: true
	},
	state: {
		required: true
	},
	timeZone: {
		required: true
	}
};

const industryValidationRules = {
	industry: {
		required: true,
		requiredMessage: 'Enter an Industry'
	}
};

const promoValidationRules = {
	promoCode: {
		required: true
	}
};

export const validateForm = (form, state) => {
	let extendedValidation = {};
	if (shouldActivateAtSignUp(state)) {
		// Only validate extended rules when the form is rendered
		extendedValidation = extendedValidationRules;
	}

	let industryValidation = {};
	if (shouldActivateAtSignUp(state) && !getIsSanofi(state)) {
		// Sanofi's industry is hardcoded
		industryValidation = industryValidationRules;
	}

	let promoValidation = {};
	if (getPromoCodeLabel(state)) {
		// Only validate promo code if the group code specifies a promo code
		promoValidation = promoValidationRules;
	}

	const validationRules = {
		...accountInfoValidationRules,
		...extendedValidation,
		...industryValidation,
		...promoValidation
	};

	return validate(form, validationRules);
};

const updateAccountInfoForm = form => ({type: UPDATE_ACCOUNT_DETAILS, form});
const updateValidUserName = error => ({type: UPDATE_USERNAME_VALID, error});
const updateValidPhone = error => ({type: UPDATE_PHONE_VALID, error});
const updateValidPromo = error => ({type: UPDATE_PROMO_VALID, error});

const getValidateUsername = userName =>
	axios({
		method: 'post',
		url: `${process.env.REACT_APP_PROXY_URL}/validation/username`,
		data: {Source: userName}
	});

const getValidatePhone = phone =>
	axios({
		method: 'post',
		url: `${process.env.REACT_APP_PROXY_URL}/validation/phone`,
		data: {Source: phone}
	});

const getValidatePromocode = promocode =>
	axios({
		method: 'post',
		url: `${process.env.REACT_APP_PROXY_URL}/validation/promocode`,
		data: {Source: promocode}
	});

export const updateAccountInfo = form => (dispatch, getState) => {
	const validatedForm = validateForm(form, getState());
	dispatch(updateAccountInfoForm(validatedForm));
};

export const validateUserName = (dispatch, getState) => {
	const state = getState();
	const {email} = state.accountInfo;

	return getValidateUsername(email).then(userNameResponse => {
		const {Success, ErrorMessage} = userNameResponse.data;
		dispatch(updateValidUserName(ErrorMessage));

		return Success ? Promise.resolve() : Promise.reject(ErrorMessage);
	});
};

export const validatePhone = (dispatch, getState) => {
	const state = getState();
	const {phoneNumber} = state.accountInfo;
	if (shouldActivateAtSignUp(state)) {
		// Only validate phone when displaying the extended form
		return getValidatePhone(phoneNumber)
			.then(phoneResponse => {
				const {Success, ErrorMessage} = phoneResponse.data;
				dispatch(updateValidPhone(ErrorMessage));

				return Success
					? Promise.resolve()
					: Promise.reject(ErrorMessage);
			})
			.catch(error => {
				// Handle internal server errors
				const errorMessage =
					error.response.data && error.response.data.Message;
				dispatch(updateValidPhone(errorMessage));
				return Promise.reject(errorMessage);
			});
	}

	return Promise.resolve();
};

export const validatePromo = (dispatch, getState) => {
	const state = getState();
	const {promoCode} = state.accountInfo;

	if (getPromoCodeLabel(state)) {
		return getValidatePromocode(promoCode).then(promoResponse => {
			const {Success, ErrorMessage} = promoResponse.data;
			dispatch(updateValidPromo(ErrorMessage));

			return Success ? Promise.resolve() : Promise.reject(ErrorMessage);
		});
	}

	return Promise.resolve();
};

export const submitAccountInfo = () => (dispatch, getState) => {
	const state = getState();
	const {accountInfo, groupCode} = state;
	const {SkipPlanAndPayment} = groupCode;
	const validatedForm = validateForm(accountInfo, state);

	// Don't submit while the form has errors
	if (hasErrors(validatedForm)) {
		// Update all fields to allow the error messages to show
		const updatedForm = {
			...validatedForm,
			emailTouched: true,
			firstNameTouched: true,
			lastNameTouched: true,
			passwordTouched: true,
			companyNameTouched: true,
			howTheyHeardTouched: true,
			industryTouched: true,
			phoneNumberTouched: true,
			promoCodeTouched: true,
			stateTouched: true,
			timeZoneTouched: true
		};

		dispatch(updateAccountInfo(updatedForm));
	} else {
		// The form is valid, now validate against the server
		const promises = [
			dispatch(validatePhone),
			dispatch(validatePromo),
			dispatch(validateUserName)
		];
		return Promise.all(promises).then(() =>
			SkipPlanAndPayment ? dispatch(postSignUp) : dispatch(goToBilling())
		);
	}
};
