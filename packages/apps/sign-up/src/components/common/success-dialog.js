import PropTypes from 'prop-types';
import React from 'react';

// External Dependencies
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ContactUs from './contact-us';
import ConfettiBall from './confetti-ball';

const useStyles = makeStyles((theme) => ({
  button: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  dialog: {
    padding: theme.spacing(2),
  },
  icon: {
    height: 192,
    marginBottom: 16,
    width: 192,
  },
  title: {
    display: 'flex',
    fontFamily: 'NoeDisplay,serif',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
  },
}));

// Component Definition
const SuccessDialog = (props) => {
  const {
    isOpen, isCollectingPayment, isFreeTrial, onContinue,
  } = props;
  const classes = useStyles();

  let successMessage = "We've completed your payment and created your account. ";

  if (isFreeTrial) {
    successMessage = "We've created a free trial account and it's ready for you to use. ";
  } else if (!isCollectingPayment) {
    // Sanofi is not a free trial, but it doesn't collect payment either
    successMessage = "We've created an account and it's ready for you to use. ";
  }

  return (
    <Dialog maxWidth="xs" open={isOpen}>
      <DialogContent className={classes.dialog}>
        <DialogTitle>
          <Typography className={classes.title} variant="h4">Thank you!</Typography>
        </DialogTitle>
        <section className={classes.content}>
          <ConfettiBall className={classes.icon} />
          <Typography>
            {successMessage}
            Feel free to&nbsp;
            <ContactUs />
            &nbsp;if you have any questions. We&apos;d love to help!
          </Typography>
          <Button
            className={classes.button}
            color="primary"
            onClick={onContinue}
            variant="contained"
          >
            Continue to Account Setup
          </Button>
        </section>
      </DialogContent>
    </Dialog>
  );
};

SuccessDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isCollectingPayment: PropTypes.bool,
  isFreeTrial: PropTypes.bool,
  onContinue: PropTypes.func.isRequired,
};


SuccessDialog.defaultProps = {
  isCollectingPayment: false,
  isFreeTrial: true,
};

export default SuccessDialog;
