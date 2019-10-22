import {
	submitBilling as submitBillingAction,
	updateBillingForm as updateBillingFormAction,
	updateBillingState as updateBillingStateAction
} from 'actions/billing-actions';
import Alert from 'components/common/alert';
import Terms from 'components/common/terms';
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
import OutlinedSelect from 'components/common/outlined-select';

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

			<ListSubheader className={classes.subHeader} disableGutters>
				Account Info
			</ListSubheader>
			<Alert message={apiError} open={Boolean(apiError)} isError />
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
							className={classes.textFieldStyles}
							error={Boolean(firstNameError)}
							fullWidth
							helperText={getHelperText(
								firstNameTouched,
								firstNameError
							)}
							inputProps={inputProps}
							label="First Name"
							name="firstName"
							onChange={handleChange}
							placeholder="James"
							required
							value={firstName}
							variant="outlined"
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							error={Boolean(lastNameError)}
							fullWidth
							helperText={getHelperText(
								lastNameTouched,
								lastNameError
							)}
							inputProps={inputProps}
							label="Last Name"
							name="lastName"
							onChange={handleChange}
							placeholder="Smith"
							required
							value={lastName}
							variant="outlined"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							error={Boolean(cardNumberError)}
							fullWidth
							helperText={getHelperText(
								cardNumberTouched,
								cardNumberError
							)}
							label="Card Number"
							name="cardNumber"
							onChange={handleChange}
							onKeyDown={handleFormKeyDown}
							placeholder="4444333322221111"
							required
							value={cardNumber}
							variant="outlined"
						/>
					</Grid>
					<Grid item md={4} sm={5} xs={4}>
						<TextField
							error={Boolean(ccExpirationMonthError)}
							fullWidth
							helperText={getHelperText(
								ccExpirationMonthTouched,
								ccExpirationMonthError
							)}
							label="Exp Month"
							name="ccExpirationMonth"
							onChange={handleChange}
							onKeyDown={handleFormKeyDown}
							placeholder="05 for May"
							required
							value={ccExpirationMonth}
							variant="outlined"
						/>
					</Grid>
					<Grid item md={1} sm={2} xs={1} className={classes.slash}>
						/
					</Grid>
					<Grid item md={4} sm={5} xs={4}>
						<TextField
							className={classes.textFieldStyles}
							error={Boolean(ccExpirationYearError)}
							fullWidth
							helperText={getHelperText(
								ccExpirationYearTouched,
								ccExpirationYearError
							)}
							label="Exp Year"
							name="ccExpirationYear"
							onChange={handleChange}
							onKeyDown={handleFormKeyDown}
							placeholder="22 for 2022"
							required
							value={ccExpirationYear}
							variant="outlined"
						/>
					</Grid>
					<Grid item md={3} sm={12} xs={3}>
						<TextField
							error={Boolean(cvcError)}
							fullWidth
							helperText={getHelperText(cvcTouched, cvcError)}
							label="CVN"
							name="cvc"
							onChange={handleChange}
							onKeyDown={handleFormKeyDown}
							placeholder="123"
							required
							value={cvc}
							variant="outlined"
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
							onChange={handleBillingState}
							options={StateOptions}
							value={billingState}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							error={Boolean(billingZipCodeError)}
							fullWidth
							helperText={getHelperText(
								billingZipCodeTouched,
								billingZipCodeError
							)}
							label="Postal Code"
							name="billingZipCode"
							onChange={handleChange}
							onKeyDown={handleFormKeyDown}
							placeholder="75095"
							required
							value={billingZipCode}
							variant="outlined"
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
							onClick={submitBilling}
							size="large"
							variant="contained"
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
