import {
	submitAccountInfo as submitAccountInfoAction,
	updateAccountInfo as updateAccountInfoAction
} from 'actions/account-actions';
import {getLoginUrl} from 'constants/url-constants';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
	shouldActivateAtSignUp,
	shouldSkipPlanAndPayment
} from 'selectors/account-selectors';

import {CircularProgress, IconButton, ListSubheader} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {withStyles} from '@material-ui/core/styles';
import EyeIcon from '@material-ui/icons/Visibility';
import EyeOffIcon from '@material-ui/icons/VisibilityOff';
import {Alert, Terms, getHelperText, hasErrors} from '@www-forms/components';

import AccountInfoExtendedForm from './account-info-extended-form';

const styles = theme => ({
	button: {
		width: '200px'
	},
	container: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '420px',
		padding: theme.spacing(3)
	},
	form: {
		marginTop: theme.spacing(3)
	},
	subHeader: {
		alignSelf: 'flex-start'
	}
});

const inputProps = {
	maxLength: 50
};

const AccountInfoForm = props => {
	const {
		classes,
		email,
		emailError,
		emailTouched,
		firstName,
		firstNameError,
		firstNameTouched,
		isPosting,
		isUsernameValid,
		lastName,
		lastNameError,
		lastNameTouched,
		password,
		passwordError,
		passwordTouched,
		shouldSkipPayment,
		showExtendedForm,
		submitAccountInfo,
		updateAccountInfo
	} = props;

	const formHasError = hasErrors(props);

	const handleChange = e => {
		const {name, value} = e.target;
		updateAccountInfo({
			[name]: value,
			[`${name}Touched`]: true,
			isUsernameValid: true
		});
	};

	const [showPassword, setShowPassword] = useState(false);

	const PasswordIcon = showPassword ? EyeOffIcon : EyeIcon;
	const buttonLabel = shouldSkipPayment
		? 'Complete Sign Up'
		: 'Proceed to payment';
	const isButtonDisabled = isPosting || formHasError;

	const passwordToggle = (
		<IconButton onClick={() => setShowPassword(!showPassword)}>
			<PasswordIcon />
		</IconButton>
	);

	const userNameErrorElement = (
		<>
			This email is already being used.&nbsp;
			<a href={getLoginUrl()}>Login</a>
		</>
	);

	const handleFormKeyDown = event => {
		// Handle Enter key like the submit button
		if (event.key === 'Enter' && !isButtonDisabled) {
			submitAccountInfo();
		}
	};

	return (
		<div className={classes.container}>
			<ListSubheader disableGutters className={classes.subHeader}>
				Account Info
			</ListSubheader>
			<Alert
				isError
				message={userNameErrorElement}
				open={!isUsernameValid}
			/>
			<form>
				<Grid
					container
					className={classes.form}
					spacing={1}
					align="left"
				>
					<Grid item xs={6}>
						<TextField
							autoFocus
							fullWidth
							required
							helperText={getHelperText(
								firstNameTouched,
								firstNameError
							)}
							inputProps={inputProps}
							label="First Name"
							error={firstNameTouched && Boolean(firstNameError)}
							value={firstName}
							placeholder="James"
							variant="outlined"
							name="firstName"
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							required
							name="lastName"
							inputProps={inputProps}
							label="Last Name"
							error={lastNameTouched && Boolean(lastNameError)}
							value={lastName}
							placeholder="Smith"
							helperText={getHelperText(
								lastNameTouched,
								lastNameError
							)}
							variant="outlined"
							onChange={handleChange}
						/>
					</Grid>
					{showExtendedForm && <AccountInfoExtendedForm />}
					<Grid item xs={12}>
						<TextField
							fullWidth
							required
							error={emailTouched && Boolean(emailError)}
							inputProps={inputProps}
							label="Email"
							name="email"
							variant="outlined"
							value={email}
							placeholder="e.g. jamessmith@gmail.com"
							helperText={getHelperText(emailTouched, emailError)}
							onKeyDown={handleFormKeyDown}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							required
							error={passwordTouched && Boolean(passwordError)}
							InputProps={{
								endAdornment: passwordToggle
							}}
							label="Password"
							name="password"
							variant="outlined"
							value={password}
							helperText={getHelperText(
								passwordTouched,
								passwordError
							)}
							type={showPassword ? 'text' : 'password'}
							onKeyDown={handleFormKeyDown}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						{/* TODO: pass in the name of the button */}
						<Terms />
					</Grid>
					<Grid item align="center" xs={12}>
						<Button
							className={classes.button}
							color="primary"
							disabled={isButtonDisabled || undefined}
							variant="contained"
							size="large"
							onClick={submitAccountInfo}
						>
							{isPosting ? (
								<CircularProgress size={25} color="inherit" />
							) : (
								buttonLabel
							)}
						</Button>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

AccountInfoForm.propTypes = {
	classes: PropTypes.shape({}).isRequired,
	email: PropTypes.string,
	emailError: PropTypes.string,
	emailTouched: PropTypes.bool,
	firstName: PropTypes.string,
	firstNameError: PropTypes.string,
	firstNameTouched: PropTypes.bool,
	isPosting: PropTypes.bool,
	isUsernameValid: PropTypes.bool,
	lastName: PropTypes.string,
	lastNameError: PropTypes.string,
	lastNameTouched: PropTypes.bool,
	password: PropTypes.string,
	passwordError: PropTypes.string,
	passwordTouched: PropTypes.bool,
	shouldSkipPayment: PropTypes.bool,
	showExtendedForm: PropTypes.bool,
	submitAccountInfo: PropTypes.func.isRequired,
	updateAccountInfo: PropTypes.func.isRequired
};

AccountInfoForm.defaultProps = {
	email: '',
	emailError: '',
	emailTouched: false,
	firstName: '',
	firstNameError: '',
	firstNameTouched: false,
	isPosting: false,
	isUsernameValid: true,
	lastName: '',
	lastNameError: '',
	lastNameTouched: false,
	password: '',
	passwordError: '',
	passwordTouched: false,
	shouldSkipPayment: false,
	showExtendedForm: false
};

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			updateAccountInfo: updateAccountInfoAction,
			submitAccountInfo: submitAccountInfoAction
		},
		dispatch
	);

const mapStateToProps = state => ({
	...state.accountInfo,
	shouldSkipPayment: shouldSkipPlanAndPayment(state),
	showExtendedForm: shouldActivateAtSignUp(state)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(AccountInfoForm));
