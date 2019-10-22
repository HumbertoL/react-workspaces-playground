import { getTaxExemptHelpUrl } from 'constants/url-constants';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
  Collapse,
  Grid,
  IconButton,
  Link,
  Tooltip,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';

const styles = (theme) => ({
  bottomBorder: {
    margin: theme.spacing(2, 0, 1),
    borderBottom: `4px solid ${theme.palette.border}`,
  },
  collapse: {
    width: '100%',
  },
  help: {
    color: theme.palette.border,
  },
  taxRow: {
    display: 'flex',
    alignItems: 'center',
  },
});


const TaxSection = (props) => {
  const {
    classes,
    Amount,
    IsTaxable,
    SalesTaxCharged,
  } = props;

  const formattedSubtotal = `$${Amount.toFixed(2)}`;
  const formattedTax = `$${SalesTaxCharged.toFixed(2)}`;

  const taxTooltipElement = (
    <>
       Tax exempt? Learn more about updating your account &nbsp;
      <Link
        href={getTaxExemptHelpUrl()}
        target="_blank"
      >
        here.
      </Link>
    </>
  );

  return (
    <Collapse className={classes.collapse} in={IsTaxable}>
      <Grid container>
        <Grid className={classes.bottomBorder} item xs={12} />
        <Grid item xs={6} align="left">
           Total Before Tax
        </Grid>
        <Grid item xs={6} align="right">
          {formattedSubtotal}
        </Grid>
        <Grid item xs={6} align="left">
          <div className={classes.taxRow}>
           Tax
            <Tooltip interactive title={taxTooltipElement} tabIndex={0}>
              <IconButton>
                <HelpIcon className={classes.help} fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </Grid>
        <Grid item xs={6} align="right">
          {formattedTax}
        </Grid>
      </Grid>
    </Collapse>
  );
};

const mapStateToProps = (state) => ({
  ...state.summary,
});

TaxSection.propTypes = {
  Amount: PropTypes.number,
  IsTaxable: PropTypes.bool,
  SalesTaxCharged: PropTypes.number,
};

TaxSection.defaultProps = {
  Amount: 0,
  IsTaxable: false,
  SalesTaxCharged: 0,
};

export default connect(mapStateToProps)(withStyles(styles)(TaxSection));
