import {
	POST_BILLING_FORM,
	POST_BILLING_FORM_ERROR,
	POST_BILLING_FORM_SUCCESS,
	UPDATE_BILLING_FORM
} from 'constants/action-constants';

import {createReducer} from '@www-forms/components';

const initialState = {
	billingState: '',
	billingZipCode: '',
	cardNumber: '',
	ccExpirationMonth: '',
	ccExpirationYear: '',
	cvc: '',
	isPosting: false,
	firstName: '',
	lastName: ''
};

export default createReducer(initialState, {
	[UPDATE_BILLING_FORM]: (state, action) => ({
		...state,
		...action.form,
		apiError: undefined // Clear error
	}),
	[POST_BILLING_FORM]: state => ({
		...state,
		isPosting: true
	}),
	[POST_BILLING_FORM_ERROR]: (state, action) => ({
		...state,
		apiError: action.error,
		isPosting: false
	}),
	[POST_BILLING_FORM_SUCCESS]: (state, action) => ({
		...state,
		isPosting: false,
		loginToken: action.loginToken
	})
});
