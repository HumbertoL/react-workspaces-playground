import {createReducer} from '@www-forms/components';

import {
	GET_PRICING_REQUEST,
	UPDATE_MONTHLY_PRICING,
	UPDATE_PAYG_PRICING,
	UPDATE_PRICING_ITEM,
	UPDATE_PRICING_PLAN,
	UPDATE_UNIT_AMOUNT
} from 'constants/action-constants';
import {pricingPlans} from 'constants/pricing-constants';

const initialState = {
	amount: '',
	amountError: null,
	pricingPlan: pricingPlans.PAYG,
	isLoaded: false
};

export default createReducer(initialState, {
	[GET_PRICING_REQUEST]: state => ({
		...state,
		isLoaded: false
	}),
	[UPDATE_MONTHLY_PRICING]: (state, action) => ({
		...state,
		monthlyPricing: action.pricing
	}),
	[UPDATE_PAYG_PRICING]: (state, action) => ({
		...state,
		isLoaded: true,
		paygPricing: action.pricing
	}),
	[UPDATE_PRICING_ITEM]: (state, action) => ({
		...state,
		pricingId: action.pricingId
	}),
	[UPDATE_PRICING_PLAN]: (state, action) => ({
		...state,
		pricingPlan: action.plan,
		amount: '',
		amountError: null
	}),
	[UPDATE_UNIT_AMOUNT]: (state, action) => ({
		...state,
		amount: action.amount,
		amountError: action.amountError
	})
});
