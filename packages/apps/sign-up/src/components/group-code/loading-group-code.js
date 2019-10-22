import PropTypes from 'prop-types';
import React from 'react';

import {
  CircularProgress,
  Grid,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  container: {
    alignItems: 'center',
    display: 'flex',
    minHeight: '500px',
    width: '100%',
  },
  message: {
    paddingBottom: theme.spacing(4),
  },
});

const LoadingGroupCode = (props) => {
  const {
    classes,
  } = props;

  return (
    <Grid container align="center" className={classes.container}>
      <Grid item xs={12}>
        <CircularProgress size={100} color="textSecondary" />
      </Grid>
    </Grid>
  );
};

LoadingGroupCode.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};


export default withStyles(styles)(LoadingGroupCode);
