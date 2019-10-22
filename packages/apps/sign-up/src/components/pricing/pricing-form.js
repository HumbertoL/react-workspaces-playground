import {
	goToBuy as goToBuyAction,
	updateAmount as updateAmountAction
} from 'actions/pricing-actions';
import cx from 'classnames';
import {pricingPlans} from 'constants/pricing-constants';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
	getIsAmountExceedingLimit,
	getSelectionPrice
} from 'selectors/pricing-selectors';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {formatDollars} from '@www-forms/components';

const styles = theme => ({
	amountElement: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center'
	},
	button: {
		display: 'flex',
		height: '36px',
		marginBottom: theme.spacing(2),
		transition: 'width 150ms',
		width: '140px'
	},
	contactUsButton: {
		width: '200px'
	},
	input: {
		textAlign: 'center'
	},
	instructions: {
		paddingBottom: theme.spacing(2)
	},
	noPricing: {
		color: theme.palette.action.disabled,
		height: '134px',
		padding: theme.spacing(4, 2, 2, 1)
	},
	monthlyTitle: {
		fontWeight: 'bold',
		margin: theme.spacing(2, 3, 2, 3),
		[theme.breakpoints.only('sm')]: {
			margin: theme.spacing(2)
		}
	},
	price: {
		fontFamily: 'NoeDisplay,serif',
		paddingTop: theme.spacing(4)
	},
	term: {
		paddingBottom: theme.spacing(4)
	},
	textField: {
		width: '130px'
	},
	pricingForm: {
		height: '100%',
		padding: theme.spacing(2),
		[theme.breakpoints.down('xs')]: {
			borderBottom: `1px solid ${theme.palette.border}`
		},
		[theme.breakpoints.up('sm')]: {
			borderRight: `1px solid ${theme.palette.border}`,
			maxWidth: '350px'
		}
	},
	paygTitle: {
		fontWeight: 'bold',
		margin: theme.spacing(2, 8, 2, 8),
		[theme.breakpoints.only('sm')]: {
			margin: theme.spacing(2)
		}
	},
	units: {
		marginLeft: theme.spacing(1),
		paddingBottom: theme.spacing(2)
	}
});

const PricingForm = props => {
	const {
		amount,
		amountError,
		classes,
		goToBuy,
		isExceeding,
		isGetting,
		price,
		pricingPlan,
		updateAmount
	} = props;

	const isPayg = pricingPlan === pricingPlans.PAYG;

	const title = isPayg
		? 'How many credits do you need?'
		: 'How many phone numbers do you want to reach?';

	const titleClass = isPayg ? classes.paygTitle : classes.monthlyTitle;

	const instructions = isPayg
		? "Enter the number of credits you need and we'll automatically calculate the total."
		: 'Enter a number below to see how much you might pay each month.';

	const units = isPayg ? 'credits' : 'numbers';

	const term = isPayg ? 'one time' : 'per month';

	const buyLabel = isPayg ? 'Buy Credits' : 'Buy Monthy';

	const buttonLabel = isExceeding ? 'Contact us for pricing' : buyLabel;

	const formattedPrice = formatDollars(price);

	const handleAmountChange = e => updateAmount(e.target.value);

	const isButtonDisabled = !amount || Boolean(amountError);

	const handleFormKeyDown = event => {
		// Handle Enter key like the submit button
		if (event.key === 'Enter' && !isButtonDisabled) {
			goToBuy();
		}
	};

	const priceElement = isExceeding ? (
		<Typography className={classes.noPricing} variant="h3" align="center">
			N/A
		</Typography>
	) : (
		<>
			<Typography className={classes.price} variant="h3" align="center">
				{formattedPrice}
			</Typography>
			<Typography
				className={classes.term}
				variant="subtitle2"
				align="center"
			>
				{term}
			</Typography>
		</>
	);

	return (
		<div className={classes.pricingForm}>
			<Typography className={titleClass} variant="h6" align="center">
				{title}
			</Typography>
			<Typography className={classes.instructions} align="center">
				{instructions}
			</Typography>
			<div className={classes.amountElement}>
				<TextField
					className={classes.textField}
					error={Boolean(amountError)}
					helperText={amountError || ' '}
					inputProps={{
						className: classes.input
					}}
					margin="dense"
					placeholder="100"
					value={amount}
					variant="outlined"
					onChange={handleAmountChange}
					onKeyDown={handleFormKeyDown}
				/>
				<Typography className={classes.units}>{units}</Typography>
			</div>

			{priceElement}

			<Button
				className={cx(
					classes.button,
					isExceeding && classes.contactUsButton
				)}
				color="primary"
				disabled={isButtonDisabled || undefined}
				variant="contained"
				onClick={goToBuy}
			>
				{isGetting ? (
					<CircularProgress size={25} color="inherit" />
				) : (
					<div className={classes.submit}>{buttonLabel}</div>
				)}
			</Button>
		</div>
	);
};

PricingForm.propTypes = {
	amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	amountError: PropTypes.string,
	classes: PropTypes.shape({}).isRequired,
	isGetting: PropTypes.bool,
	isExceeding: PropTypes.bool,
	price: PropTypes.number.isRequired,
	pricingPlan: PropTypes.string.isRequired,
	goToBuy: PropTypes.func.isRequired,
	updateAmount: PropTypes.func.isRequired
};

PricingForm.defaultProps = {
	amount: '',
	amountError: null,
	isExceeding: false,
	isGetting: false
};

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			updateAmount: updateAmountAction,
			goToBuy: goToBuyAction
		},
		dispatch
	);

const mapStateToProps = state => ({
	...state.pricing,
	price: getSelectionPrice(state),
	isExceeding: getIsAmountExceedingLimit(state),
	isGetting: state.summary.isGetting
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(PricingForm));
