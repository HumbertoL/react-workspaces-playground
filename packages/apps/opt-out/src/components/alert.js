import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { Collapse, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

// Local Variables
const styles = (theme) => ({
  alert: {
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: theme.spacing(2),
  },
  errorContent: {
    borderColor: theme.palette.error.dark,
    backgroundColor: theme.palette.error.light,
  },
  errorIcon: {
    color: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
    marginRight: theme.spacing(2),
    opacity: 0.9,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  successContent: {
    borderColor: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
  },
  successIcon: {
    color: theme.palette.success.dark,
  },
});

// TODO: move this to the common code directory
const Alert = (props) => {
  const {
    classes, isError, open, message,
  } = props;

  const contentClassName = isError ? classes.errorContent : classes.successContent;
  const alertClassname = isError ? classes.errorIcon : classes.successIcon;
  const Icon = isError ? ErrorIcon : CheckCircleIcon;

  return (
    <Collapse in={open}>
      <div className={clsx(classes.alert, contentClassName)}>
        <Typography className={classes.message} color="textPrimary">
          <Icon className={clsx(classes.icon, alertClassname)} />
          {message}
        </Typography>
      </div>
    </Collapse>
  );
};

Alert.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  isError: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
};


export default withStyles(styles)(Alert);
