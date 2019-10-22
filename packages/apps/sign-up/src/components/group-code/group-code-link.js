import {openGroupCode as openGroupCodeAction} from 'actions/group-code-actions';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

// External Dependencies
import {Typography, withStyles} from '@material-ui/core';
import {LinkButton} from '@www-forms/components';

const styles = {
	groupCode: {
		display: 'flex'
	}
};

// Component Definition
const GroupCodeLink = props => {
	const {classes, groupCode, openGroupCode} = props;

	const linkText = groupCode ? 'change' : 'Have a group code?';
	return (
		<div className={classes.groupCode}>
			{groupCode && (
				<>
					<Typography color="textSecondary">
						Group Code:&nbsp;
					</Typography>
					<Typography>
						{groupCode}
						&nbsp;
					</Typography>
				</>
			)}

			<LinkButton onClick={openGroupCode}>{linkText}</LinkButton>
		</div>
	);
};

GroupCodeLink.propTypes = {
	classes: PropTypes.shape({}).isRequired,
	groupCode: PropTypes.string,
	openGroupCode: PropTypes.func.isRequired
};

GroupCodeLink.defaultProps = {
	groupCode: ''
};

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			openGroupCode: openGroupCodeAction
		},
		dispatch
	);

const mapStateToProps = state => ({
	groupCode: state.groupCode.groupCode
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(GroupCodeLink));
