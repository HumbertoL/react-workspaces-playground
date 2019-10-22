import CostDisplay from 'components/pricing/cost-display';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import {
  getCostPerCredit,
  getFirstPricingDetail,
} from 'selectors/pricing-selectors';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const styles = (theme) => ({
  bottomBorder: {
    margin: theme.spacing(2, 0, 1),
    borderBottom: `4px solid ${theme.palette.border}`,
  },
  support: {
    marginBottom: theme.spacing(4),
  },
  title: {
    fontSize: 20,
    fontWeight: 400,
    marginBottom: theme.spacing(2),
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

const WellconnectSummary = (props) => {
  const { classes, priceDetail } = props;
  return (
    <>
      <Grid item xs={12} align="center">
        <Typography color="primary" className={classes.title}>
        WELLCONNECT PROMO
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        Credits Renew Annually
      </Grid>
      <Grid item xs={12} align="center">
        No contracts, cancel anytime
      </Grid>
      <Grid item xs={12} align="center" className={classes.support}>
        24/7 customer support
      </Grid>

      <Grid item xs={6} align="left">
        Cost Per Credit
      </Grid>
      <Grid item xs={6} align="right">
        <CostDisplay align="right" priceDetail={priceDetail} />
      </Grid>
      <Grid className={classes.bottomBorder} item xs={12} />
    </>
  );
};

WellconnectSummary.propTypes = {
  priceDetail: PropTypes.shape({
    Cost: PropTypes.number.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  ...state.pricing,
  costPerCredit: getCostPerCredit(state),
  priceDetail: getFirstPricingDetail(state),
});

export default connect(mapStateToProps)(withStyles(styles)(WellconnectSummary));
