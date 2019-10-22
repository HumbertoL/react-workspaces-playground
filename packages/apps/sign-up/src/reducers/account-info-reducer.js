import {
	UPDATE_ACCOUNT_DETAILS,
	UPDATE_PHONE_VALID,
	UPDATE_PROMO_VALID,
	UPDATE_USERNAME_VALID
} from 'constants/action-constants';

import {createReducer} from '@www-forms/components';

const initialState = {
	email: '',
	firstName: '',
	lastName: '',
	password: '',

	// Extended fields
	companyName: '',
	howTheyHeard: '',
	industry: '',
	phoneNumber: '',
	promoCode: '',
	state: '',
	timeZone: ''
};

export default createReducer(initialState, {
	[UPDATE_ACCOUNT_DETAILS]: (state, action) => ({
		...state,
		...action.form
	}),
	[UPDATE_USERNAME_VALID]: (state, action) => ({
		...state,
		isUsernameValid: !action.error,
		emailError: action.error
	}),
	[UPDATE_PHONE_VALID]: (state, action) => ({
		...state,
		phoneNumberError: action.error
	}),
	[UPDATE_PROMO_VALID]: (state, action) => ({
		...state,
		promoCodeError: action.error
	})
});
