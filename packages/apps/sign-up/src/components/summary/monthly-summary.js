import { goToPricing as goToPricingAction } from 'actions/step-actions';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPricingItem } from 'selectors/pricing-selectors';

import Grid from '@material-ui/core/Grid';

import CostDisplay from 'components/pricing/cost-display';
import LinkButton from '../common/link-button';

const MonthlySummary = (props) => {
  const {
    goToPricing,
    pricingItem,
    SubscriptionEndDate,
  } = props;

  const { LowerLimit, UpperLimit } = pricingItem;
  const formattedRenewal = moment(SubscriptionEndDate).format('MMM D, YYYY');
  const formattedPricingItem = `${LowerLimit}-${UpperLimit}`;

  return (
    <>
      <Grid item xs={7} align="left">
        New Group Size
      </Grid>
      <Grid item xs={5} align="right">
        {formattedPricingItem}
        &nbsp;
        <LinkButton onClick={goToPricing}>change</LinkButton>
      </Grid>
      <Grid item xs={7} align="left">
        New Monthly Fee
      </Grid>
      <Grid item xs={5} align="right">
        <CostDisplay align="right" priceDetail={pricingItem} />
      </Grid>
      <Grid item xs={7} align="left">
      Automatically Renews
      </Grid>
      <Grid item xs={5} align="right">
        {formattedRenewal}
      </Grid>
    </>
  );
};

MonthlySummary.propTypes = {
  pricingItem: PropTypes.shape({
    LowerLimit: PropTypes.number.isRequired,
    UpperLimit: PropTypes.number.isRequired,
  }).isRequired,
  SubscriptionEndDate: PropTypes.string.isRequired,
  goToPricing: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    goToPricing: goToPricingAction,
  },
  dispatch,
);

const mapStateToProps = (state) => ({
  ...state.summary,
  pricingItem: getPricingItem(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MonthlySummary);
