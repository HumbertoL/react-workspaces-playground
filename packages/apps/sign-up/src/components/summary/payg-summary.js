import { goToPricing as goToPricingAction } from 'actions/step-actions';
import CostDisplay from 'components/pricing/cost-display';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCostPerCredit, getFirstPricingDetail } from 'selectors/pricing-selectors';

import Grid from '@material-ui/core/Grid';

import LinkButton from '../common/link-button';

const PaygSummary = (props) => {
  const {
    amount, goToPricing, groupCode, priceDetail,
  } = props;

  const formattedAmount = amount.toLocaleString();
  const { FreeCredits } = groupCode;

  return (
    <>
      {
        FreeCredits ? (
          <>
            <Grid item xs={6} align="left">
              Free Credits
            </Grid>
            <Grid item xs={6} align="right">
              {FreeCredits}
            </Grid>
          </>
        )
          : (
            <>
              <Grid item xs={6} align="left">
                Credits
              </Grid>
              <Grid item xs={6} align="right">
                {formattedAmount}
                &nbsp;
                <LinkButton onClick={goToPricing}>change</LinkButton>
              </Grid>
            </>
          )
      }
      <Grid item xs={8} align="left">
        Cost Per Credit
      </Grid>
      <Grid item xs={4} align="right">
        <CostDisplay align="right" priceDetail={priceDetail} />
      </Grid>
    </>
  );
};

PaygSummary.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  goToPricing: PropTypes.func.isRequired,
  groupCode: PropTypes.shape({
    FreeCredits: PropTypes.number.isRequired,
  }).isRequired,
  priceDetail: PropTypes.shape({
    Cost: PropTypes.number.isRequired,
    LowerLimit: PropTypes.number.isRequired,
    UpperLimit: PropTypes.number,
    PricingDetailID: PropTypes.number.isRequired,
  }).isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    goToPricing: goToPricingAction,
  },
  dispatch,
);

const mapStateToProps = (state) => ({
  ...state.pricing,
  costPerCredit: getCostPerCredit(state),
  groupCode: state.groupCode,
  priceDetail: getFirstPricingDetail(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaygSummary);
