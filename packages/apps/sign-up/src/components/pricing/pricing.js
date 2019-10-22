import {
  getPricing as getPricingAction,
  updatePricingPlan as updatePricingPlanAction,
} from 'actions/pricing-actions';
import cx from 'classnames';
import { pricingPlans } from 'constants/pricing-constants';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  ButtonGroup,
  Card,
  Grid,
  Typography,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import PricingForm from './pricing-form';
import PricingTable from './pricing-table';
import GroupCodeDialog from '../group-code/group-code-dialog';

const styles = (theme) => ({
  buttonSelected: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary[800],
      borderColor: theme.palette.secondary[800],
    },
  },
  card: {
    maxWidth: '700px',
  },
  planType: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: theme.spacing(3),
  },
  planTypeLabel: {
    paddingRight: theme.spacing(3),
  },
});

const Pricing = (props) => {
  const {
    classes,
    pricingPlan,
    updatePricingPlan,
  } = props;


  const updatePlan = (plan) => () => {
    updatePricingPlan(plan);
  };

  const isPayg = pricingPlan === pricingPlans.PAYG;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} align="center" className={classes.planType}>
        <Typography className={classes.planTypeLabel}>
            Type of Plan:
        </Typography>
        <ButtonGroup className={classes.buttonGroup} color="primary" variant="outlined">
          <Button
            className={cx(isPayg && classes.buttonSelected)}
            onClick={updatePlan(pricingPlans.PAYG)}
          >
                Pay-As-You-Go
          </Button>
          <Button
            className={cx(!isPayg && classes.buttonSelected)}
            onClick={updatePlan(pricingPlans.MONTHLY)}
          >
                Monthly
          </Button>
          <Button
            onClick={updatePlan(pricingPlans.FREE_TRIAL)}
          >
                Free Trial
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12} align="center">
        <Card className={classes.card}>
          <Grid container>
            <Grid item sm={6} xs={12}>
              <PricingForm />
            </Grid>
            <Grid item sm={6} xs={12}>
              <PricingTable />
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <GroupCodeDialog />
    </Grid>
  );
};

Pricing.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  pricingPlan: PropTypes.string.isRequired,
  updatePricingPlan: PropTypes.func.isRequired,
};


const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getPricing: getPricingAction,
    updatePricingPlan: updatePricingPlanAction,
  },
  dispatch,
);

const mapStateToProps = (state) => ({
  ...state.pricing,
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Pricing));
