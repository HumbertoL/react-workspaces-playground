import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
  Card,
  Grid,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

// import BillingForm from './account-info-form';
import Summary from '../summary/summary';
import BillingForm from './billing-form';

const styles = (theme) => ({
  card: {
    maxWidth: '900px',
  },
  planType: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: theme.spacing(3),
  },
  summary: {
    [theme.breakpoints.down('sm')]: {
      borderBottom: `1px solid ${theme.palette.border}`,
    },
    [theme.breakpoints.up('sm')]: {
      borderRight: `1px solid ${theme.palette.border}`,
    },
  },
});

const Billing = (props) => {
  const {
    classes,
  } = props;


  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item xs={12} align="center">
        <Card className={classes.card}>
          <Grid container>
            <Grid item sm={5} xs={12} className={classes.summary}>
              <Summary />
            </Grid>
            <Grid item sm={7} xs={12} className={classes.pricingTable}>
              <BillingForm />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

Billing.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  ...state.pricing,
});

export default connect(mapStateToProps)(withStyles(styles)(Billing));
