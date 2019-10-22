import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
  Typography,
  withStyles,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';


const styles = (theme) => ({
  promo: {
    marginBottom: theme.spacing(3),
  },
});

const PromoCodeDisplay = (props) => {
  const {
    classes, groupCode, PromoMessage, SkipPlanAndPayment,
  } = props;

  return SkipPlanAndPayment ? (
    <>
      <Grid item xs={6} align="left">
           Promo Code
      </Grid>
      <Grid item xs={6} align="right">
        <Typography>{groupCode}</Typography>
      </Grid>
      <Grid item xs={12} align="right" className={classes.promo}>
        <Typography color="textSecondary">{PromoMessage}</Typography>
      </Grid>
    </>
  ) : null;
};

PromoCodeDisplay.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  groupCode: PropTypes.string,
  PromoMessage: PropTypes.string,
  SkipPlanAndPayment: PropTypes.bool,
};

PromoCodeDisplay.defaultProps = {
  groupCode: '',
  PromoMessage: '',
  SkipPlanAndPayment: false,
};


const mapStateToProps = (state) => ({
  ...state.groupCode,
});

export default connect(
  mapStateToProps,
)(withStyles(styles)(PromoCodeDisplay));
