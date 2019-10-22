import {
  openGroupCode as openGroupCodeAction,
} from 'actions/group-code-actions';
import {
  updatePriceItem as updatePricingItemAction,
} from 'actions/pricing-actions';
import cx from 'classnames';
import GroupCodeLink from 'components/group-code/group-code-link';
import { pricingPlans } from 'constants/pricing-constants';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { animateScroll } from 'react-scroll';
import { bindActionCreators } from 'redux';
import { getPricingDetails } from 'selectors/pricing-selectors';

import {
  Grid,
  Typography,
  withStyles,
} from '@material-ui/core';

import SkeletonRow from '../skeleton-row';
import PriceRow from './price-row';

const styles = (theme) => ({
  bottomBorder: {
    borderBottom: `2px solid ${theme.palette.border}`,
  },
  button: {
    display: 'flex',
    margin: '24px auto 0 auto',
    width: '180px',
    marginBottom: theme.spacing(3),
  },
  columnHeader: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  container: {
    [theme.breakpoints.up('sm')]: {
      maxWidth: '350px',
    },
  },
  groupCode: {
    alignItems: 'center',
    display: 'flex',
    padding: theme.spacing(2),
  },
  instructions: {
    padding: theme.spacing(0, 3, 2, 3),
  },
  monthlyTitle: {
    padding: theme.spacing(2, 4, 2, 4),
  },
  price: {
    paddingTop: theme.spacing(6),
  },
  pricingTable: {
    display: 'block',
    height: '340px',
    overflow: 'auto',
    width: '100%',
  },
  paygTitle: {
    padding: theme.spacing(2, 8, 2, 8),
  },
  term: {
    paddingBottom: theme.spacing(4),
  },
  title: {
    padding: theme.spacing(2),
  },
});

// Use empty rows while loading
const dummyRows = [0, 1, 2, 3, 4, 5, 6];

const PricingTable = (props) => {
  const {
    classes, isLoaded, pricingId, pricingPlan, pricingDetails,
  } = props;

  const isPayg = pricingPlan === pricingPlans.PAYG;

  const units = isPayg ? 'CREDITS' : 'PHONE NUMBERS';
  const term = isPayg ? 'COST PER CREDIT' : 'COST PER MONTH';

  useEffect(() => {
    const selectedIndex = pricingDetails.findIndex(
      (priceDetail) => priceDetail.PricingDetailID === pricingId,
    );

    // Every row is 48 pixels in height.
    const position = (selectedIndex - 3) * 48;
    animateScroll.scrollTo(position, {
      containerId: 'pricingRowsContainer',
      duration: 350,
    });
  });

  return (
    <div align="left" className={classes.container}>
      <Grid container className={cx(classes.title, classes.bottomBorder)}>
        <Grid item xs={6}>
          <Typography className={classes.columnHeader} color="textSecondary" variant="caption">
            {units}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.columnHeader} color="textSecondary" variant="caption">
            {term}
          </Typography>
        </Grid>
      </Grid>

      <div className={cx(classes.pricingTable, classes.bottomBorder)} id="pricingRowsContainer">
        {
          isLoaded && pricingDetails.map((priceDetail) => (
            <PriceRow priceDetail={priceDetail} key={priceDetail.PricingDetailID} />
          ))
        }
        {
          !isLoaded && dummyRows.map((value) => (
            <SkeletonRow key={value} />
          ))
        }
      </div>

      <div className={classes.groupCode}>
        <GroupCodeLink />
      </div>
    </div>
  );
};

PricingTable.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  isLoaded: PropTypes.bool,
  pricingDetails: PropTypes.arrayOf(PropTypes.object).isRequired,
  pricingId: PropTypes.number,
  pricingPlan: PropTypes.string.isRequired,
};

PricingTable.defaultProps = {
  isLoaded: true,
  pricingId: null,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    openGroupCode: openGroupCodeAction,
    updatePriceItem: updatePricingItemAction,
  },
  dispatch,
);

const mapStateToProps = (state) => ({
  ...state.pricing,
  pricingDetails: getPricingDetails(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PricingTable));
