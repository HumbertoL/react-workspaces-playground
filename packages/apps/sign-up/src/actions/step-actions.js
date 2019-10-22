import { UPDATE_SIGNUP_STEP } from 'constants/action-constants';
import steps from 'constants/step-constants';

const updateStep = (step) => ({ type: UPDATE_SIGNUP_STEP, step });


export const goToAccountDetails = () => (dispatch) => dispatch(updateStep(steps.ACCOUNT_INFO));

export const goToPricing = () => (dispatch) => dispatch(updateStep(steps.PRICING));

export const goToBilling = () => (dispatch) => dispatch(updateStep(steps.BILLING));

export const goToLoadingGroupCode = () => (dispatch) => dispatch(updateStep(steps.LOADING));
