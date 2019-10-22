import {
	GROUP_CODE_DIALOG_CLOSE,
	GROUP_CODE_DIALOG_OPEN,
	GROUP_CODE_DIALOG_UPDATE,
	GROUP_CODE_ERROR,
	GROUP_CODE_RESET,
	GROUP_CODE_UPDATE_DETAILS,
	GROUP_CODE_REQUEST
} from 'constants/action-constants';

import {createReducer} from '@www-forms/components';

const initialState = {
	FreeCredits: 0,
	groupCode: '',
	groupCodeError: '',
	isGetting: false,
	isOpen: false,
	IsFreeTrial: false,
	SkipPlanAndPayment: false
};

export default createReducer(initialState, {
	[GROUP_CODE_DIALOG_OPEN]: state => ({
		...state,
		isOpen: true
	}),
	[GROUP_CODE_DIALOG_CLOSE]: state => ({
		...state,
		isOpen: false
	}),
	[GROUP_CODE_DIALOG_UPDATE]: (state, action) => ({
		...state,
		groupCode: action.groupCode,
		groupCodeError: ''
	}),
	[GROUP_CODE_UPDATE_DETAILS]: (state, action) => ({
		...state,
		...action.details,
		groupCode: action.details.Name,
		isGetting: false
	}),
	[GROUP_CODE_ERROR]: (state, action) => ({
		...state,
		groupCodeError: action.error,
		isGetting: false
	}),
	[GROUP_CODE_RESET]: () => ({
		initialState
	}),
	[GROUP_CODE_REQUEST]: state => ({
		...state,
		isGetting: true
	})
});
