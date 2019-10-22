import {
  updatePriceItem as updatePricingItemAction,
} from 'actions/pricing-actions';
import cx from 'classnames';
import { getContactUsUrl } from 'constants/url-constants';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDefaultCost } from 'selectors/pricing-selectors';

import {
  Grid,
  Link,
  MenuItem,
  Typography,
  withStyles,
} from '@material-ui/core';

import CostDisplay from './cost-display';

const styles = (theme) => ({
  contactUs: {
    padding: theme.spacing(1, 1, 1, 2),
  },
  cost: {
    marginLeft: theme.spacing(1),
  },
  option: {
    height: 48,
  },
  selected: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.action.selected,
  },
});

const PriceRow = (props) => {
  const {
    classes,
    priceDetail,
    pricingId,
    pricingPlan,
    updatePriceItem,
  } = props;

  const handlePriceLevel = (pricingDetail) => () => {
    updatePriceItem(pricingPlan, pricingDetail);
  };

  const isContactUsRow = priceDetail.UpperLimit === null;

  // Format number with commas for the thousands separators
  const lowerLimit = priceDetail.LowerLimit.toLocaleString();

  const isSelected = priceDetail.PricingDetailID === pricingId;

  if (isContactUsRow) {
    return (
      <Grid align="left" container className={cx(classes.contactUs, isSelected && classes.selected)}>
        <Grid item xs={6}>
          <Typography>
            {lowerLimit}
            +
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Link href={getContactUsUrl()} target="_blank">
            Contact Us
          </Link>
        </Grid>
      </Grid>
    );
  }

  const upperLimit = priceDetail.UpperLimit.toLocaleString();
  const prettyRange = `${lowerLimit} - ${upperLimit}`;

  return (
    <MenuItem
      className={classes.option}
      selected={isSelected}
      onClick={handlePriceLevel(priceDetail)}
      tabIndex={0}
    >
      <Grid item xs={6}>
        <Typography color={isSelected ? 'secondary' : 'textPrimary'}>
          {prettyRange}
        </Typography>
      </Grid>
      <Grid item xs={6} className={classes.cost}>
        <CostDisplay priceDetail={priceDetail} />
      </Grid>
    </MenuItem>
  );
};

PriceRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  priceDetail: PropTypes.shape({
    Cost: PropTypes.number.isRequired,
    LowerLimit: PropTypes.number.isRequired,
    UpperLimit: PropTypes.number,
    PricingDetailID: PropTypes.number.isRequired,
  }).isRequired,
  pricingId: PropTypes.number,
  pricingPlan: PropTypes.string.isRequired,
  updatePriceItem: PropTypes.func.isRequired,
};

PriceRow.defaultProps = {
  pricingId: null,
};


const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    updatePriceItem: updatePricingItemAction,
  },
  dispatch,
);

const mapStateToProps = (state, props) => ({
  ...state.pricing,
  defaultCost: getDefaultCost(state, props.priceDetail),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PriceRow));
