import axios from 'axios';
import {
	GET_PRICING_REQUEST,
	UPDATE_MONTHLY_PRICING,
	UPDATE_PAYG_PRICING,
	UPDATE_PRICING_ERROR,
	UPDATE_PRICING_ITEM,
	UPDATE_PRICING_PLAN,
	UPDATE_UNIT_AMOUNT
} from 'constants/action-constants';
import {pricingPlans} from 'constants/pricing-constants';
import {
	getContactUsUrl,
	getFreeTrialUrl,
	getMonthlyPricingUrl,
	getPaygPricingUrl
} from 'constants/url-constants';
import {matchPath} from 'react-router-dom';
import {
	getFirstPricingDetail,
	getIsAmountExceedingLimit,
	getMinUnits,
	getPricingLevel
} from 'selectors/pricing-selectors';

import {validate} from '@www-forms/components';

import {goToAccountDetails} from './step-actions';
import {getSummaryPreview} from './summary-actions';

const requestPricing = plan => ({type: GET_PRICING_REQUEST, plan});
const updateAmountForm = form => ({type: UPDATE_UNIT_AMOUNT, ...form});
const updateMonthlyPricing = pricing => ({
	type: UPDATE_MONTHLY_PRICING,
	pricing
});
const updatePaygPricing = pricing => ({type: UPDATE_PAYG_PRICING, pricing});
const updatePlan = plan => ({type: UPDATE_PRICING_PLAN, plan});
const updatePricingError = error => ({type: UPDATE_PRICING_ERROR, error});
const updatePricingItemId = pricingId => ({
	type: UPDATE_PRICING_ITEM,
	pricingId
});
const updateUnitAmount = amount => ({type: UPDATE_UNIT_AMOUNT, amount});

export const updateAmount = amount => (dispatch, getState) =>
	new Promise(() => {
		const strippedAmount = amount.replace(/\D/g, '');
		const state = getState();

		// Base the minumum on the values returned from the database
		const minValue = getMinUnits(state);
		const validationRules = {
			amount: {
				number: true,
				minValue
			}
		};

		const validatedForm = validate(
			{amount: strippedAmount},
			validationRules
		);
		dispatch(updateAmountForm(validatedForm));

		const pricingId = getPricingLevel(getState());

		dispatch(updatePricingItemId(pricingId));
	});

export const syncAmountPrice = () => (dispatch, getState) => {
	const {
		pricing: {amount}
	} = getState();

	// When group code changes, select the correct pricing detail and update price
	if (amount) {
		return dispatch(updateAmount(amount.toString()));
	}
};

export const updatePriceItem = (planType, pricingDetails) => dispatch =>
	new Promise(() => {
		dispatch(updatePricingItemId(pricingDetails.PricingDetailID));

		return dispatch(
			updateUnitAmount(
				planType === pricingPlans.PAYG
					? pricingDetails.LowerLimit
					: pricingDetails.UpperLimit
			)
		);
	});

export const updatePricingPlan = plan => dispatch =>
	new Promise(() => {
		if (plan === pricingPlans.FREE_TRIAL) {
			window.location.href = getFreeTrialUrl();
		} else {
			dispatch(updatePlan(plan));
			dispatch(updatePricingItemId(null));
		}
	});

export const selectFirstPriceDetails = () => (dispatch, getState) => {
	// When we give the user free credits, select the first pricing option just for comparison.
	// The user will not actually be charged according to this data
	dispatch(updatePricingPlan(pricingPlans.PAYG)).then(() => {
		const defaultDetail = getFirstPricingDetail(getState());
		return dispatch(updatePriceItem(pricingPlans.PAYG, defaultDetail));
	});
};

const getPaygPricing = () =>
	axios({
		method: 'get',
		url: getPaygPricingUrl()
	});

const getMonthlyPricing = () =>
	axios({
		method: 'get',
		url: getMonthlyPricingUrl()
	});

export const getPricing = () => dispatch =>
	new Promise(() => {
		dispatch(requestPricing());

		getPaygPricing()
			.then(response => {
				const pricing = response.data;
				dispatch(updatePaygPricing(pricing));
			})
			.then(getMonthlyPricing)
			.then(response => {
				const pricing = response.data;
				dispatch(updateMonthlyPricing(pricing));
			})
			.catch(e => {
				const errorMessage =
					(e.response && e.response.data.Message) ||
					'An error has occured. Please try again.';

				dispatch(updatePricingError(errorMessage));
			});
	});

export const goToBuy = () => (dispatch, getState) => {
	const isExceeding = getIsAmountExceedingLimit(getState());
	if (isExceeding) {
		window.open(getContactUsUrl(), '_blank');
	} else {
		dispatch(getSummaryPreview()).then(() =>
			dispatch(goToAccountDetails())
		);
	}
};

export const updatePlanFromUrl = () => dispatch => {
	const {hash} = window.location;
	const matchesMonthly = matchPath(hash, {
		path: '*/monthly',
		strict: false
	});

	if (matchesMonthly) {
		dispatch(updatePricingPlan(pricingPlans.MONTHLY));
	}
};
