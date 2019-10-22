import {createReducer} from '@www-forms/components';

import {UPDATE_SIGNUP_STEP} from 'constants/action-constants';
import steps from 'constants/step-constants';

const initialState = {
	step: steps.PRICING
};

export default createReducer(initialState, {
	[UPDATE_SIGNUP_STEP]: (state, action) => ({
		...state,
		step: action.step
	})
});
