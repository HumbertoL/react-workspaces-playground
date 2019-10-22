import axios from 'axios';
import {
  GROUP_CODE_DIALOG_CLOSE,
  GROUP_CODE_DIALOG_OPEN,
  GROUP_CODE_DIALOG_UPDATE,
  GROUP_CODE_ERROR,
  GROUP_CODE_REQUEST,
  GROUP_CODE_RESET,
  GROUP_CODE_UPDATE_DETAILS,
} from 'constants/action-constants';
import { getGroupCodeUrl } from 'constants/url-constants';

import { getGroupCodeFromUrl } from 'selectors/pricing-selectors';
import { selectFirstPriceDetails, syncAmountPrice } from './pricing-actions';
import { goToAccountDetails, goToLoadingGroupCode, goToPricing } from './step-actions';

const closeDialog = () => ({ type: GROUP_CODE_DIALOG_CLOSE });
const openDialog = () => ({ type: GROUP_CODE_DIALOG_OPEN });
const requestGroupCode = () => ({ type: GROUP_CODE_REQUEST });
const reset = () => ({ type: GROUP_CODE_RESET });
const update = (groupCode) => ({ type: GROUP_CODE_DIALOG_UPDATE, groupCode });
const updateDetails = (details) => ({ type: GROUP_CODE_UPDATE_DETAILS, details });
const updateError = (error = '') => ({ type: GROUP_CODE_ERROR, error });

const getGroupCodePricing = (groupCode) => axios({
  method: 'get',
  url: getGroupCodeUrl(groupCode),
});


export const openGroupCode = () => (dispatch) => {
  dispatch(openDialog());
};

export const closeGroupCode = () => (dispatch) => {
  dispatch(closeDialog());
};

export const updateGroupCode = (groupCode) => (dispatch, getState) => {
  // Update code
  // post to server
  // close dialog and update state with pricing information
  // redirect if applicable
  const prevGroupCode = getState().groupCode.groupCode;

  if (prevGroupCode && !groupCode) {
    // User is removing the group code
    // Reset discount data and update price of selected item
    return Promise.resolve()
      .then(() => dispatch(reset()))
      .then(() => dispatch(syncAmountPrice()));
  }

  dispatch(requestGroupCode());

  return getGroupCodePricing(groupCode).then((response) => {
    const groupCodeDetails = response.data;
    const { SkipPlanAndPayment } = groupCodeDetails;

    const promises = [
      dispatch(update(groupCode)),
      dispatch(updateDetails(groupCodeDetails)),
      dispatch(closeDialog()),
    ];

    if (SkipPlanAndPayment) {
      promises.push(
        dispatch(selectFirstPriceDetails()),
        dispatch(goToAccountDetails()),
      );
    } else {
      promises.push(
        dispatch(selectFirstPriceDetails()),
        dispatch(goToPricing()),
      );
    }

    return Promise.all(promises)
      .catch((e) => {
        const errorMessage = (e.response && e.response.data.Message) || e.message
        || 'Invalid group code';

        dispatch(updateError(errorMessage));
        dispatch(goToPricing());
      });
  });
};

export const resetGroupCodeError = () => (dispatch) => {
  dispatch(updateError());
};

export const updateGroupCodeFromUrl = () => (dispatch) => {
  const groupCode = getGroupCodeFromUrl();

  if (groupCode) {
    dispatch(goToLoadingGroupCode());
    dispatch(updateGroupCode(groupCode));
  }
};
