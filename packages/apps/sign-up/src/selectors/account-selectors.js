export const shouldActivateAtSignUp = (state) => state.groupCode.ActivateAtSignup;
export const shouldSkipPlanAndPayment = (state) => state.groupCode.SkipPlanAndPayment;
export const getPromoCodeLabel = (state) => state.groupCode.PromoCodeLabel;
export const getIsSanofi = (state) => state.groupCode.groupCode.toLowerCase().includes('sanofi');
export const getIsFreeTrial = (state) => state.groupCode.IsFreeTrial;
