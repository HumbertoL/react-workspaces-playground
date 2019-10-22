import {updateAccountInfo as updateAccountInfoAction} from 'actions/account-actions';
import {
	StateOptions,
	TimeZoneOptions,
	IndustryDropDownOptions
} from 'constants/settings-constants';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getPromoCodeLabel, getIsSanofi} from 'selectors/account-selectors';

import {ListSubheader} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {withStyles} from '@material-ui/core/styles';
import {getHelperText, OutlinedSelect} from '@www-forms/components';

const styles = theme => ({
	subHeader: {
		alignSelf: 'flex-start',
		marginBottom: theme.spacing(2)
	}
});

const inputProps = {
	maxLength: 50
};

const ExtendedAccountInfoForm = props => {
	const {
		classes,
		companyName,
		companyNameError,
		companyNameTouched,
		howTheyHeard,
		howTheyHeardError,
		howTheyHeardTouched,
		industry,
		industryError,
		industryTouched,
		isSanofi,
		phoneNumber,
		phoneNumberError,
		phoneNumberTouched,
		promoCode,
		promoCodeError,
		promoCodeLabel,
		promoCodeTouched,
		state,
		stateError,
		stateTouched,
		timeZone,
		timeZoneError,
		timeZoneTouched,
		updateAccountInfo
	} = props;

	const shouldShowPromo = Boolean(promoCodeLabel);

	const handleChange = e => {
		const {name, value} = e.target;
		updateAccountInfo({
			[name]: value,
			[`${name}Touched`]: true
			// IsUsernameValid: true,
		});
	};

	// TODO: consider getting this data from the server if there's time
	const getIndustryOptions = () =>
		IndustryDropDownOptions.map((industryOption, index) =>
			index === 0 ? (
				// eslint-disable-next-line jsx-a11y/control-has-associated-label
				<option key="" value="" text="" />
			) : (
				<optgroup key={industryOption.name} label={industryOption.name}>
					{industryOption.content.map(subIndustry => (
						<option
							key={subIndustry.value}
							text={subIndustry.value}
							value={`${industryOption.name} - ${subIndustry.value}`}
						>
							{subIndustry.value}
						</option>
					))}
				</optgroup>
			)
		);

	return (
		<>
			<Grid item xs={12}>
				<TextField
					fullWidth
					required
					error={phoneNumberTouched && Boolean(phoneNumberError)}
					helperText={getHelperText(
						phoneNumberTouched,
						phoneNumberError
					)}
					label="Phone Number"
					name="phoneNumber"
					placeholder="e.g. (972) 123-4567"
					value={phoneNumber}
					variant="outlined"
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<OutlinedSelect
					error={Boolean(stateError)}
					helperText={getHelperText(stateTouched, stateError)}
					label="State"
					name="state"
					options={StateOptions}
					value={state}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<OutlinedSelect
					error={Boolean(timeZoneError)}
					helperText={getHelperText(timeZoneTouched, timeZoneError)}
					label="Time Zone"
					name="timeZone"
					options={TimeZoneOptions}
					value={timeZone}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					required
					name="companyName"
					inputProps={inputProps}
					label="Organization Name"
					error={companyNameTouched && Boolean(companyNameError)}
					value={companyName}
					placeholder="Call-Em-All"
					helperText={getHelperText(
						companyNameTouched,
						companyNameError
					)}
					variant="outlined"
					onChange={handleChange}
				/>
			</Grid>

			{!isSanofi && (
				<Grid item xs={12}>
					<OutlinedSelect
						error={Boolean(industryError)}
						helperText={getHelperText(
							industryTouched,
							industryError
						)}
						label="Industry"
						name="industry"
						options={IndustryDropDownOptions}
						value={industry}
						onChange={handleChange}
					>
						{getIndustryOptions()}
					</OutlinedSelect>
				</Grid>
			)}
			<Grid item xs={12}>
				<TextField
					fullWidth
					error={howTheyHeardTouched && Boolean(howTheyHeardError)}
					helperText={getHelperText(
						howTheyHeardTouched,
						howTheyHeardError
					)}
					inputProps={inputProps}
					label="How did you hear about us?"
					name="howTheyHeard"
					value={howTheyHeard}
					variant="outlined"
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={12}>
				<ListSubheader disableGutters className={classes.subHeader}>
					Login Info
				</ListSubheader>
			</Grid>
			{shouldShowPromo && (
				<Grid item xs={12}>
					<TextField
						fullWidth
						required
						error={promoCodeTouched && Boolean(promoCodeError)}
						helperText={getHelperText(
							promoCodeTouched,
							promoCodeError
						)}
						inputProps={inputProps}
						label={promoCodeLabel}
						name="promoCode"
						value={promoCode}
						variant="outlined"
						onChange={handleChange}
					/>
				</Grid>
			)}
		</>
	);
};

ExtendedAccountInfoForm.propTypes = {
	classes: PropTypes.shape({}).isRequired,
	companyName: PropTypes.string,
	companyNameError: PropTypes.string,
	companyNameTouched: PropTypes.bool,
	howTheyHeard: PropTypes.string,
	howTheyHeardError: PropTypes.string,
	howTheyHeardTouched: PropTypes.bool,
	industry: PropTypes.string,
	industryError: PropTypes.string,
	industryTouched: PropTypes.bool,
	isSanofi: PropTypes.bool,
	phoneNumber: PropTypes.string,
	phoneNumberError: PropTypes.string,
	phoneNumberTouched: PropTypes.bool,
	promoCode: PropTypes.string,
	promoCodeError: PropTypes.string,
	promoCodeLabel: PropTypes.string,
	promoCodeTouched: PropTypes.bool,
	state: PropTypes.string,
	stateError: PropTypes.string,
	stateTouched: PropTypes.bool,
	timeZone: PropTypes.string,
	timeZoneError: PropTypes.string,
	timeZoneTouched: PropTypes.bool,
	updateAccountInfo: PropTypes.func.isRequired
};

ExtendedAccountInfoForm.defaultProps = {
	companyName: '',
	companyNameError: '',
	companyNameTouched: false,
	howTheyHeard: '',
	howTheyHeardError: '',
	howTheyHeardTouched: false,
	industry: '',
	industryError: '',
	industryTouched: false,
	isSanofi: false,
	phoneNumber: '',
	phoneNumberError: '',
	phoneNumberTouched: false,
	promoCode: '',
	promoCodeError: '',
	promoCodeLabel: '',
	promoCodeTouched: false,
	state: '',
	stateError: '',
	stateTouched: false,
	timeZone: '',
	timeZoneError: '',
	timeZoneTouched: false
};

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			updateAccountInfo: updateAccountInfoAction
		},
		dispatch
	);

const mapStateToProps = state => ({
	...state.accountInfo,
	promoCodeLabel: getPromoCodeLabel(state),
	isSanofi: getIsSanofi(state)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(ExtendedAccountInfoForm));
