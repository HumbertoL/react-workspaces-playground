import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {getDefaultCost} from 'selectors/pricing-selectors';

import {Typography, withStyles} from '@material-ui/core';
import {green, red} from '@material-ui/core/colors';
import {formatCost} from '@www-forms/components';

const green500 = green['500'];
const red500 = red['500'];

const styles = theme => ({
	alignLeft: {
		display: 'flex',
		justifyContent: 'flex-start'
	},
	alignRight: {
		display: 'flex',
		justifyContent: 'flex-end'
	},
	strikethrough: {
		color: red500,
		textDecoration: 'line-through',
		marginRight: theme.spacing(1)
	},
	discount: {
		color: green500
	}
});

const CostDiplay = props => {
	const {align, classes, defaultCost, cost} = props;

	const isDiscounted = cost < defaultCost;
	const alignment = align === 'left' ? classes.alignLeft : classes.alignRight;
	return (
		<div className={alignment}>
			{isDiscounted && (
				<Typography
					className={cx(isDiscounted && classes.strikethrough)}
				>
					{formatCost(defaultCost)}
				</Typography>
			)}
			<Typography className={cx(isDiscounted && classes.discount)}>
				{formatCost(cost)}
			</Typography>
		</div>
	);
};

CostDiplay.propTypes = {
	align: PropTypes.string,
	classes: PropTypes.shape({}).isRequired,
	cost: PropTypes.number.isRequired,
	defaultCost: PropTypes.number.isRequired
};

CostDiplay.defaultProps = {
	align: 'left'
};

const mapStateToProps = (state, props) => ({
	cost: props.priceDetail.Cost,
	defaultCost: getDefaultCost(state, props.priceDetail)
});

export default connect(mapStateToProps)(withStyles(styles)(CostDiplay));
