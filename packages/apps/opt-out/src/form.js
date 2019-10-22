import React from 'react';

import { CircularProgress, Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import { postOptOut } from './actions';
import Alert from './components/alert';
import { formatPhone, validatePhone } from './utils/optOutUtils';

// Local Variables
const styles = (theme) => ({
  button: {
    display: 'block',
    fontSize: 'large',
    height: '50px',
    margin: '24px auto 0 auto',
    width: '180px',
  },
  firstName: {
    marginRight: theme.spacing(2),
    width: '98%',
  },
  root: {
    display: 'block',
    padding: theme.spacing(0, 1, 2, 1),
    width: '100%',
  },
});
class OptOut extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apiError: null,
      isPosting: false,
      isSuccessful: false,
      phoneError: null,
      phoneNumber: '',
      successPhone: '',
    };
  }

  onPhoneError = (message) => {
    this.setState({ phoneError: message });
  };

  onApiError = (message) => {
    this.setState({ apiError: message, isPosting: false });
  };

  onSuccess = () => {
    const { phoneNumber } = this.state;
    this.setState({
      isPosting: false,
      isSuccessful: true,
      phoneError: null,
      phoneNumber: '',
      successPhone: phoneNumber,
    });
  };

  onChange = (e) => {
    const phoneNumber = e.target.value;
    const isValidPhone = validatePhone(phoneNumber);

    const phoneError = isValidPhone ? null : 'The phone number is not valid.';

    this.setState({
      apiError: null, isSuccessful: false, phoneError, phoneNumber,
    });
  };

  onBlur = () => {
    const { phoneNumber, phoneError } = this.state;
    const formattedPhone = formatPhone(phoneNumber, phoneError);
    this.setState({ phoneNumber: formattedPhone });
  }

  onPost = () => {
    const { phoneNumber } = this.state;
    this.setState({ isPosting: true });
    postOptOut(phoneNumber, this.onSuccess, this.onApiError);
  }

  onKeyDown = (event) => {
    // Handle Enter key like the submit button
    if (event.key === 'Enter') {
      // Format the number
      this.onBlur();

      // Submit the form
      this.onPost();

      // Don't refresh the page
      event.preventDefault();
    }
  };

  render() {
    const { classes } = this.props;
    const {
      apiError,
      isPosting,
      isSuccessful,
      phoneError,
      phoneNumber,
      successPhone,
    } = this.state;

    const alertMessage = ` ${successPhone} has been added to our Opt-out list and will no longer
                          receive voice or text messages. If you have any questions or concerns
                          please contact us.`;

    return (
      <Container component="main" className={classes.root}>
        <form>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                error={Boolean(phoneError)}
                fullWidth
                helperText={phoneError}
                inputProps={{ maxLength: 20 }}
                label="Phone Number"
                margin="normal"
                onBlur={this.onBlur}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                placeholder="(555) 555-5555"
                required
                type="tel"
                value={phoneNumber}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Alert message={alertMessage} open={isSuccessful} />
            </Grid>
            <Grid item xs={12}>
              <Alert message={apiError} open={apiError} isError />
            </Grid>
            <Button
              className={classes.button}
              color="primary"
              disabled={isPosting || Boolean(phoneError) || undefined}
              onClick={this.onPost}
              variant="contained"
              size="large"
            >
              {isPosting ? <CircularProgress size={25} color="inherit" /> : 'Opt out'}
            </Button>
          </Grid>
        </form>
      </Container>
    );
  }
}

export default withStyles(styles)(OptOut);
