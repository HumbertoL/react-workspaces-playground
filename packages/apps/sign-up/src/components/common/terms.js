import PropTypes from 'prop-types';
import React from 'react';
import { Typography, withStyles } from '@material-ui/core';

import PrivacyPolicy from './privacy-policy';
import ResponsibleUsePolicy from './responsible-use-policy';
import TermsOfUse from './terms-of-use';

const styles = (theme) => ({
  terms: {
    fontSize: '12px',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
});

const Terms = (props) => {
  const { classes } = props;

  return (
    <>
      <Typography
        align="center"
        className={classes.terms}
        color="textPrimary"
        variant="body1"
      >
        By clicking &quot;Complete Sign Up&quot;, you&apos;re creating a
        Call&ndash;Em&ndash;All account and agree to
        Call&ndash;Em&ndash;All&apos;s &nbsp;
        <TermsOfUse />
        ,&nbsp;
        <ResponsibleUsePolicy />
        , and&nbsp;
        <PrivacyPolicy />
.
      </Typography>
    </>
  );
};

Terms.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Terms);
