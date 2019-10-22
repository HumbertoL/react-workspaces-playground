import {createReducer} from '@www-forms/components';

import {GET_PREVIEW_REQUEST, UPDATE_PREVIEW} from 'constants/action-constants';
import steps from 'constants/step-constants';

const initialState = {
	step: steps.pricing,
	isGetting: false
};

export default createReducer(initialState, {
	[GET_PREVIEW_REQUEST]: state => ({
		...state,
		isGetting: true
	}),
	[UPDATE_PREVIEW]: (state, action) => ({
		...state,
		...action.preview,
		isGetting: false
	})
});
