import PromoCodeDisplay from 'components/group-code/promo-code-display';
import { pricingPlans } from 'constants/pricing-constants';
import { getInvoiceHelpUrl } from 'constants/url-constants';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { getSelectionPrice } from 'selectors/pricing-selectors';

import {
  Grid,
  Link,
  ListSubheader,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { getIsSanofi } from 'selectors/account-selectors';
import MonthlySummary from './monthly-summary';
import PaygSummary from './payg-summary';
import TaxSection from './tax-section';
import WellconnectSummary from './wellconnect-summary';

const styles = (theme) => ({
  bottomBorder: {
    margin: theme.spacing(2, 0, 1),
    borderBottom: `4px solid ${theme.palette.border}`,
  },
  invoice: {
    height: '100%',
    alignItems: 'flex-end',
    display: 'flex',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(3),
  },
  subHeader: {
    alignSelf: 'flex-start',
  },
  summaryTable: {
    marginTop: theme.spacing(2),
  },
});

const Summary = (props) => {
  const {
    classes,
    isSanofi,
    pricingPlan,
    TotalAmount,
    SkipPlanAndPayment,
  } = props;


  const isPayg = pricingPlan === pricingPlans.PAYG;
  const title = isPayg ? 'Pay-as-you-go' : 'Monthly';

  const summaryElement = isPayg ? <PaygSummary /> : <MonthlySummary />;

  // Always show two decimal points on the summary screen
  const fixedTotal = TotalAmount.toFixed(2);
  const formattedTotal = `$${fixedTotal}`;
  if (isSanofi) {
    return (
      <div className={classes.container}>
        <Grid container className={classes.summaryTable}>
          <WellconnectSummary />
        </Grid>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <ListSubheader className={classes.subHeader} disableGutters>{title}</ListSubheader>
      <Grid container className={classes.summaryTable}>
        {<PromoCodeDisplay />}
        {summaryElement}
        <Grid item xs={12}>
          <TaxSection />
        </Grid>

        {!SkipPlanAndPayment && (
        <>
          <Grid className={classes.bottomBorder} item xs={12} />
          <Grid item xs={4} align="left">
           Total
          </Grid>
          <Grid item xs={8} align="right">
            <Typography variant="h4">{formattedTotal}</Typography>
          </Grid>

        </>
        )}
      </Grid>
      <div className={classes.invoice}>
        <Link href={getInvoiceHelpUrl()} target="_blank">Need an invoice?</Link>
      </div>
    </div>
  );
};

Summary.propTypes = {
  isSanofi: PropTypes.bool,
  pricingPlan: PropTypes.string.isRequired,
  SkipPlanAndPayment: PropTypes.bool.isRequired,
  TotalAmount: PropTypes.number,
};

Summary.defaultProps = {
  isSanofi: false,
  TotalAmount: 0,
};

const mapStateToProps = (state) => ({
  ...state.pricing,
  ...state.summary,
  SkipPlanAndPayment: state.groupCode.SkipPlanAndPayment,
  price: getSelectionPrice(state),
  isSanofi: getIsSanofi(state),
});

export default connect(mapStateToProps)(withStyles(styles)(Summary));
