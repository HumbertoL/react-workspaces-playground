import { pricingPlans } from 'constants/pricing-constants';

export const getIsPayg = (state) => {
  const { pricingPlan } = state.pricing;
  return pricingPlan === pricingPlans.PAYG;
};

export const getDefaultPricing = (state) => {
  const { paygPricing, monthlyPricing } = state.pricing;
  const isPayg = getIsPayg(state);
  return isPayg ? paygPricing : monthlyPricing;
};

export const getDiscountedPricing = (state) => {
  const { groupCode, BulkPricing, SubscriptionPricing } = state.groupCode;

  if (!groupCode) {
    // No discounts available if there's no groupcode
    return null;
  }

  const isPayg = getIsPayg(state);
  return isPayg ? BulkPricing : SubscriptionPricing;
};

export const getPricing = (state) => {
  const defaultPricing = getDefaultPricing(state);
  const discountedPricing = getDiscountedPricing(state);

  return discountedPricing || defaultPricing;
};

// Gets the correct pricing item (or group size) based on the selected id
export const getPricingItem = (state) => {
  const {
    pricingId,
  } = state.pricing;

  const pricing = getPricing(state);

  if (!pricing) {
    return null;
  }

  const pricingItem = pricing.PricingDetails.find(
    (detail) => detail.PricingDetailID === pricingId,
  );

  return pricingItem;
};

export const getSelectionPrice = (state) => {
  const { amount } = state.pricing;
  const pricingItem = getPricingItem(state);

  if (!pricingItem) {
    // No pricing item selected
    return 0;
  }

  const isPayg = getIsPayg(state);

  if (isPayg) {
    // Pay as you go has a per credit cost
    return pricingItem.Cost * amount;
  }

  // Monthly has a fixed dollar cost. No need to multiply here.
  return pricingItem.Cost;
};

// Selects correct number of credits or  groupsize based on the entered amount
export const getPricingLevel = (state) => {
  const {
    amount,
  } = state.pricing;


  const pricing = getPricing(state);

  const pricingLevel = pricing.PricingDetails.find(
    (detail) => detail.LowerLimit <= amount
      && (detail.UpperLimit >= amount || detail.UpperLimit === null),
  );

  return (pricingLevel && pricingLevel.PricingDetailID) || 0;
};

export const getIsAmountExceedingLimit = (state) => {
  const {
    amount, monthlyPricing, paygPricing,
  } = state.pricing;

  const selectedPricing = getPricingItem(state);

  if (!selectedPricing || !amount) {
    // No pricing selected
    return false;
  }

  if (selectedPricing.UpperLimit === null) {
    // If the upper limit is null, this is the Contact Us row
    return true;
  }

  const pricing = getIsPayg(state) ? paygPricing : monthlyPricing;
  const highestPricing = pricing.PricingDetails[pricing.PricingDetails.length - 1];

  return highestPricing.UpperLimit && amount >= highestPricing.UpperLimit;
};

export const getCostPerCredit = (state) => {
  const pricingItem = getPricingItem(state);

  return (pricingItem && pricingItem.Cost) || 0;
};

export const getMinUnits = (state) => {
  const { monthlyPricing, paygPricing } = state.pricing;
  const isPayg = getIsPayg(state);

  // Determine whether to look for credits or numbers
  const pricingDetails = isPayg ? paygPricing.PricingDetails : monthlyPricing.PricingDetails;

  // Get the lower limit from the first pricing level in the list
  const { 0: { LowerLimit } } = pricingDetails;
  return LowerLimit;
};

export const getPricingDetails = (state) => {
  const defaultPricing = getDefaultPricing(state);

  if (!defaultPricing || !defaultPricing.PricingDetails) {
    return [];
  }

  const discountedPricing = getDiscountedPricing(state);

  return (discountedPricing && discountedPricing.PricingDetails) || defaultPricing.PricingDetails;
};

export const getDefaultCost = (state, pricingDetail) => {
  const { LowerLimit } = pricingDetail;
  const defaultCost = getDefaultPricing(state);

  if (!defaultCost) {
    // not done loading
    return pricingDetail.Cost;
  }

  const { PricingDetails } = defaultCost;
  const defaultDetail = PricingDetails.find((detail) => detail.LowerLimit === LowerLimit);

  return defaultDetail ? defaultDetail.Cost : PricingDetails[0].Cost;
};

export const getFirstPricingDetail = (state) => {
  const pricing = getPricing(state);
  const { PricingDetails: { 0: defaultDetail } } = pricing;
  return defaultDetail;
};

export const getGroupCodeFromUrl = () => {
  const { search } = window.location;
  if (search) {
    const queryParams = search.split('&');
    const groupCodeParam = queryParams.find((p) => p.indexOf('GroupCode=') > -1) || '';
    const paramIndex = groupCodeParam.indexOf('GroupCode=');
    if (paramIndex > -1) {
      return groupCodeParam.substr(paramIndex + 10, groupCodeParam.length);
    }
  }

  return null;
};
