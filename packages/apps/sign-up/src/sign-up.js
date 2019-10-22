import {completeSignUp} from 'actions/billing-actions';
import Billing from 'components/billing/billing';
import LoadingGroupCode from 'components/group-code/loading-group-code';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
	getIsFreeTrial,
	shouldSkipPlanAndPayment
} from 'selectors/account-selectors';

import {Container} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {SuccessDialog} from '@www-forms/components';

import {updateGroupCodeFromUrl as updateGroupCodeFromUrlAction} from './actions/group-code-actions';
import {
	getPricing as getPricingAction,
	updatePlanFromUrl as updatePlanFromUrlAction
} from './actions/pricing-actions';
import AccountInfo from './components/account-info/account-info';
import Pricing from './components/pricing/pricing';
import steps from './constants/step-constants';

const styles = theme => ({
	root: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2)
	}
});

class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.initializeSignUp();
	}

	initializeSignUp = () => {
		const {
			getPricing,
			updateGroupCodeFromUrl,
			updatePlanFromUrl
		} = this.props;

		// Show loading screen if there's a groupcode in the URL
		updateGroupCodeFromUrl();

		// Load default pricing
		getPricing();

		// Go to the correct plan if it's specified in the URL
		updatePlanFromUrl();
	};

	renderStep = step => {
		switch (step) {
			case steps.ACCOUNT_INFO:
				return <AccountInfo />;
			case steps.BILLING:
				return <Billing />;
			case steps.LOADING:
				return <LoadingGroupCode />;
			case steps.PRICING:
			default:
				return <Pricing />;
		}
	};

	render() {
		const {
			classes,
			isCollectingPayment,
			isFreeTrial,
			loginToken,
			step
		} = this.props;

		const handleCompleteSignup = () => {
			completeSignUp(loginToken);
		};

		return (
			<Container component="main" className={classes.root}>
				{this.renderStep(step)}
				<SuccessDialog
					isCollectingPayment={isCollectingPayment}
					isFreeTrial={isFreeTrial}
					isOpen={Boolean(loginToken)}
					onContinue={handleCompleteSignup}
				/>
			</Container>
		);
	}
}

SignUp.propTypes = {
	classes: PropTypes.shape({}).isRequired,
	getPricing: PropTypes.func.isRequired,
	isCollectingPayment: PropTypes.bool,
	isFreeTrial: PropTypes.bool,
	loginToken: PropTypes.string,
	step: PropTypes.string.isRequired,
	updateGroupCodeFromUrl: PropTypes.func.isRequired,
	updatePlanFromUrl: PropTypes.func.isRequired
};

SignUp.defaultProps = {
	isCollectingPayment: false,
	isFreeTrial: false,
	loginToken: ''
};

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			getPricing: getPricingAction,
			updateGroupCodeFromUrl: updateGroupCodeFromUrlAction,
			updatePlanFromUrl: updatePlanFromUrlAction
		},
		dispatch
	);

const mapStateToProps = state => ({
	step: state.step.step,
	loginToken: state.billing.loginToken,
	isFreeTrial: getIsFreeTrial(state),
	isCollectingPayment: !shouldSkipPlanAndPayment(state)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(SignUp));
