import axios from 'axios';
import { GET_PREVIEW_REQUEST, UPDATE_PREVIEW } from 'constants/action-constants';
import { pricingPlans } from 'constants/pricing-constants';
import { getPricingPreviewUrl } from 'constants/url-constants';
import { getPricingItem } from 'selectors/pricing-selectors';

const requestPreview = (plan) => ({ type: GET_PREVIEW_REQUEST, plan });
const updatePreview = (preview) => ({ type: UPDATE_PREVIEW, preview });

const getPricingPreview = (payload) => axios({
  method: 'post',
  url: getPricingPreviewUrl(),
  data: payload,
});


export const getSummaryPreview = () => (dispatch, getState) => {
  dispatch(requestPreview());
  const state = getState();
  const { pricing, billing } = state;
  const { billingState } = billing;
  const { amount, pricingPlan } = pricing;
  const { groupCode } = state.groupCode;

  const isPayg = pricingPlan === pricingPlans.PAYG;

  const previewPayload = {
    BillingState: billingState || '',
    GroupCode: groupCode,
  };

  if (isPayg) {
    previewPayload.ChargeType = 'CreditPurchase';
    previewPayload.NumberOfCredits = amount;
  } else {
    const pricingItem = getPricingItem(state);
    previewPayload.ChargeType = 'SubscriptionUpgrade';
    previewPayload.MaxPeople = pricingItem.UpperLimit;
  }


  return getPricingPreview(previewPayload)
    .then((response) => {
      const preview = response.data;
      dispatch(updatePreview(preview));
    });
};
