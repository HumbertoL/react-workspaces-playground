import PropTypes from 'prop-types';
import React from 'react';

import {
	CircularProgress,
	Container,
	IconButton,
	Typography
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {grey} from '@material-ui/core/colors';
import {withStyles} from '@material-ui/core/styles';
import EyeIcon from '@material-ui/icons/Visibility';
import EyeOffIcon from '@material-ui/icons/VisibilityOff';
import {
	Alert,
	PrivacyPolicy,
	ResponsibleUsePolicy,
	SuccessDialog,
	Terms,
	getHelperText
} from '@www-forms/components';

import {completeSignUp, submitFreeTrial, validateForm} from './actions';

// MUI Color Variables
const grey400 = grey['400'];

// Local Variables
const styles = theme => ({
	button: {
		display: 'block',
		fontSize: 'large',
		height: '50px',
		margin: '24px auto 0 auto',
		width: '180px'
	},
	disclaimer: {
		fontSize: '12px'
	},
	root: {
		display: 'block',
		padding: theme.spacing(4, 1, 2, 1)
	}
});

const inputProps = {
	maxLength: 50
};

class FreeTrial extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			apiError: null,
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			isDialogOpen: false,
			isPosting: false,
			showPassword: false
		};
	}

	handleChange = e => {
		const {name, value} = e.target;

		const newState = {
			...this.state,
			apiError: null,
			[name]: value,
			[`${name}Touched`]: true
		};

		const validatedForm = validateForm(newState);

		this.setState(validatedForm);
	};

	onFormError = form => {
		// Update form, show errors on all relevant fields
		this.setState({
			...form,
			isPosting: false,
			emailTouched: true,
			firstNameTouched: true,
			lastNameTouched: true,
			passwordTouched: true
		});
	};

	onApiError = error => {
		this.setState({isPosting: false, apiError: error});
	};

	onSuccess = loginToken => {
		this.setState({isPosting: false, isDialogOpen: true, loginToken});
	};

	onPost = () => {
		const {firstName, lastName, email, password} = this.state;

		const form = {
			firstName,
			lastName,
			email,
			password
		};

		this.setState({isPosting: true});

		submitFreeTrial(
			form,
			this.onFormError,
			this.onSuccess,
			this.onApiError
		);
	};

	onPasswordToggle = () => {
		const {showPassword} = this.state;
		this.setState({showPassword: !showPassword});
	};

	sendToOnboarding = () => {
		const {loginToken} = this.state;
		completeSignUp(loginToken);
	};

	render() {
		const {classes} = this.props;
		const {
			apiError,
			email,
			emailError,
			emailTouched,
			firstName,
			firstNameError,
			firstNameTouched,
			isDialogOpen,
			isPosting,
			lastName,
			lastNameError,
			lastNameTouched,
			password,
			passwordError,
			passwordTouched,
			showPassword
		} = this.state;

		const PasswordIcon = showPassword ? EyeOffIcon : EyeIcon;
		const hasError =
			apiError ||
			firstNameError ||
			lastNameError ||
			emailError ||
			passwordError;

		const passwordToggle = (
			<IconButton
				key="showPasswordIconButton"
				onClick={this.onPasswordToggle}
			>
				<PasswordIcon color={grey400} />
			</IconButton>
		);

		return (
			<Container component="main" className={classes.root}>
				<form>
					<Grid container spacing={1}>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								required
								name="firstName"
								helperText={getHelperText(
									firstNameTouched,
									firstNameError
								)}
								inputProps={inputProps}
								label="First Name"
								error={
									firstNameTouched && Boolean(firstNameError)
								}
								value={firstName}
								placeholder="James"
								className={classes.firstName}
								variant="outlined"
								onChange={this.handleChange}
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								required
								name="lastName"
								inputProps={inputProps}
								label="Last Name"
								error={
									lastNameTouched && Boolean(lastNameError)
								}
								value={lastName}
								placeholder="Smith"
								helperText={getHelperText(
									lastNameTouched,
									lastNameError
								)}
								variant="outlined"
								onChange={this.handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								name="email"
								inputProps={inputProps}
								label="Email"
								error={emailTouched && Boolean(emailError)}
								value={email}
								placeholder="e.g. jamessmith@gmail.com"
								helperText={getHelperText(
									emailTouched,
									emailError
								)}
								variant="outlined"
								onChange={this.handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								name="password"
								InputProps={{
									endAdornment: passwordToggle
								}}
								label="Password"
								error={
									passwordTouched && Boolean(passwordError)
								}
								value={password}
								helperText={getHelperText(
									passwordTouched,
									passwordError
								)}
								type={showPassword ? 'text' : 'password'}
								variant="outlined"
								onChange={this.handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<Alert isError message={apiError} open={apiError} />
						</Grid>
						<Grid item xs={12}>
							<Typography
								align="center"
								className={classes.disclaimer}
								color="textPrimary"
								variant="body1"
							>
								By clicking &quot;Get Started&quot;, you&apos;re
								creating a Call&ndash;Em&ndash;All account and
								agree to Call&ndash;Em&ndash;All&apos;s &nbsp;
								<Terms />
								,&nbsp;
								<ResponsibleUsePolicy />
								, and&nbsp;
								<PrivacyPolicy />.
							</Typography>
						</Grid>
						<Button
							className={classes.button}
							color="primary"
							disabled={isPosting || hasError || undefined}
							variant="contained"
							size="large"
							onClick={this.onPost}
						>
							{isPosting ? (
								<CircularProgress size={25} color="inherit" />
							) : (
								' Get Started'
							)}
						</Button>
					</Grid>
				</form>
				<SuccessDialog
					isFreeTrial
					isOpen={isDialogOpen}
					onContinue={this.sendToOnboarding}
				/>
			</Container>
		);
	}
}

FreeTrial.propTypes = {
	classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(FreeTrial);
