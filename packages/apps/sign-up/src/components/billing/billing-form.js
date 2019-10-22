import {
	submitBilling as submitBillingAction,
	updateBillingForm as updateBillingFormAction,
	updateBillingState as updateBillingStateAction
} from 'actions/billing-actions';
import {StateOptions} from 'constants/settings-constants';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {CircularProgress, ListSubheader, Tooltip} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {amber} from '@material-ui/core/colors';
import {withStyles} from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import {getHelperText} from '@www-forms/components';
import {Alert, OutlinedSelect, Terms} from '@www-forms/components';

const amber800 = amber['800'];

const styles = theme => ({
	button: {
		width: '200px'
	},
	container: {
		display: 'flex',
		flexDirection: 'column',
		padding: theme.spacing(3),
		position: 'relative'
	},
	form: {
		marginTop: theme.spacing(3)
	},
	formControl: {
		minWidth: 120
	},
	lock: {
		color: amber800
	},
	secure: {
		position: 'absolute',
		top: theme.spacing(5),
		right: theme.spacing(4)
	},
	subHeader: {
		alignSelf: 'flex-start'
	},
	slash: {
		alignSelf: 'flex-end',
		color: theme.palette.text.secondary,
		fontSize: 24,
		fontWeight: 300,
		lineHeight: 1,
		marginBottom: theme.spacing(4),
		padding: 0,
		textAlign: 'center',
		width: 16
	}
});

const inputProps = {
	maxLength: 50
};

const BillingForm = props => {
	const {
		apiError,
		billingState,
		billingStateError,
		billingStateTouched,
		billingZipCode,
		billingZipCodeError,
		billingZipCodeTouched,
		cardNumber,
		cardNumberError,
		cardNumberTouched,
		ccExpirationMonth,
		ccExpirationMonthError,
		ccExpirationMonthTouched,
		ccExpirationYear,
		ccExpirationYearError,
		ccExpirationYearTouched,
		classes,
		cvc,
		cvcError,
		cvcTouched,
		firstName,
		firstNameError,
		firstNameTouched,
		isPosting,
		lastName,
		lastNameError,
		lastNameTouched,
		submitBilling,
		updateBillingForm,
		updateBillingState
	} = props;

	const hasError = Boolean(
		billingStateError ||
			billingZipCodeError ||
			cardNumberError ||
			ccExpirationMonthError ||
			ccExpirationYearError ||
			cvcError ||
			firstNameError ||
			lastNameError
	);
	const isButtonDisabled = isPosting || hasError;

	const handleChange = e => {
		const {name, value} = e.target;
		updateBillingForm({[name]: value, [`${name}Touched`]: true});
	};

	const handleBillingState = e => {
		const {name, value} = e.target;

		// API has to recalculate tax when the state changes
		updateBillingState({[name]: value});
	};

	const handleFormKeyDown = event => {
		// Handle Enter key like the submit button
		if (event.key === 'Enter' && !isButtonDisabled) {
			submitBilling();
		}
	};

	return (
		<div className={classes.container}>
			<div className={classes.secure}>
				<Tooltip title="Secure form">
					<LockIcon className={classes.lock} />
				</Tooltip>
			</div>

			<ListSubheader disableGutters className={classes.subHeader}>
				Account Info
			</ListSubheader>
			<Alert isError message={apiError} open={Boolean(apiError)} />
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
							variant="outlined"
							helperText={getHelperText(
								firstNameTouched,
								firstNameError
							)}
							inputProps={inputProps}
							className={classes.textFieldStyles}
							name="firstName"
							value={firstName}
							placeholder="James"
							error={Boolean(firstNameError)}
							label="First Name"
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
							error={Boolean(lastNameError)}
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
					<Grid item xs={12}>
						<TextField
							fullWidth
							required
							error={Boolean(cardNumberError)}
							label="Card Number"
							name="cardNumber"
							variant="outlined"
							value={cardNumber}
							placeholder="4444333322221111"
							helperText={getHelperText(
								cardNumberTouched,
								cardNumberError
							)}
							onKeyDown={handleFormKeyDown}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item md={4} sm={5} xs={4}>
						<TextField
							fullWidth
							required
							error={Boolean(ccExpirationMonthError)}
							label="Exp Month"
							name="ccExpirationMonth"
							variant="outlined"
							value={ccExpirationMonth}
							placeholder="05 for May"
							helperText={getHelperText(
								ccExpirationMonthTouched,
								ccExpirationMonthError
							)}
							onKeyDown={handleFormKeyDown}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item md={1} sm={2} xs={1} className={classes.slash}>
						/
					</Grid>
					<Grid item md={4} sm={5} xs={4}>
						<TextField
							fullWidth
							required
							className={classes.textFieldStyles}
							helperText={getHelperText(
								ccExpirationYearTouched,
								ccExpirationYearError
							)}
							label="Exp Year"
							name="ccExpirationYear"
							error={Boolean(ccExpirationYearError)}
							value={ccExpirationYear}
							placeholder="22 for 2022"
							variant="outlined"
							onKeyDown={handleFormKeyDown}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item md={3} sm={12} xs={3}>
						<TextField
							fullWidth
							required
							error={Boolean(cvcError)}
							label="CVN"
							name="cvc"
							variant="outlined"
							value={cvc}
							placeholder="123"
							helperText={getHelperText(cvcTouched, cvcError)}
							onKeyDown={handleFormKeyDown}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={6}>
						<OutlinedSelect
							error={Boolean(billingStateError)}
							helperText={getHelperText(
								billingStateTouched,
								billingStateError
							)}
							label="State"
							name="billingState"
							options={StateOptions}
							value={billingState}
							onChange={handleBillingState}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							required
							error={Boolean(billingZipCodeError)}
							label="Postal Code"
							name="billingZipCode"
							variant="outlined"
							value={billingZipCode}
							placeholder="75095"
							helperText={getHelperText(
								billingZipCodeTouched,
								billingZipCodeError
							)}
							onKeyDown={handleFormKeyDown}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<Terms />
					</Grid>
					<Grid item align="center" xs={12}>
						<Button
							className={classes.button}
							color="primary"
							disabled={isButtonDisabled || undefined}
							size="large"
							variant="contained"
							onClick={submitBilling}
						>
							{isPosting ? (
								<CircularProgress size={25} color="inherit" />
							) : (
								'Complete Sign Up'
							)}
						</Button>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

BillingForm.propTypes = {
	apiError: PropTypes.string,
	billingState: PropTypes.string,
	billingStateError: PropTypes.string,
	billingStateTouched: PropTypes.bool,
	billingZipCode: PropTypes.string,
	billingZipCodeError: PropTypes.string,
	billingZipCodeTouched: PropTypes.bool,
	cardNumber: PropTypes.string,
	cardNumberError: PropTypes.string,
	cardNumberTouched: PropTypes.bool,
	ccExpirationMonth: PropTypes.string,
	ccExpirationMonthError: PropTypes.string,
	ccExpirationMonthTouched: PropTypes.bool,
	ccExpirationYear: PropTypes.string,
	ccExpirationYearError: PropTypes.string,
	ccExpirationYearTouched: PropTypes.bool,
	classes: PropTypes.shape({}).isRequired,
	cvc: PropTypes.string,
	cvcError: PropTypes.string,
	cvcTouched: PropTypes.bool,
	firstName: PropTypes.string,
	firstNameError: PropTypes.string,
	firstNameTouched: PropTypes.bool,
	isPosting: PropTypes.bool,
	lastName: PropTypes.string,
	lastNameError: PropTypes.string,
	lastNameTouched: PropTypes.bool,
	loginToken: PropTypes.string,
	submitBilling: PropTypes.func.isRequired,
	updateBillingForm: PropTypes.func.isRequired,
	updateBillingState: PropTypes.func.isRequired
};

BillingForm.defaultProps = {
	apiError: '',
	billingState: '',
	billingStateError: '',
	billingStateTouched: false,
	billingZipCode: '',
	billingZipCodeError: '',
	billingZipCodeTouched: false,
	cardNumber: '',
	cardNumberError: '',
	cardNumberTouched: false,
	ccExpirationMonth: '',
	ccExpirationMonthError: '',
	ccExpirationMonthTouched: false,
	ccExpirationYear: '',
	ccExpirationYearError: '',
	ccExpirationYearTouched: false,
	cvc: '',
	cvcError: '',
	cvcTouched: false,
	firstName: '',
	firstNameError: '',
	firstNameTouched: false,
	isPosting: false,
	lastName: '',
	lastNameError: '',
	lastNameTouched: false,
	loginToken: ''
};

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			submitBilling: submitBillingAction,
			updateBillingForm: updateBillingFormAction,
			updateBillingState: updateBillingStateAction
		},
		dispatch
	);

const mapStateToProps = state => ({
	...state.billing
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(BillingForm));
