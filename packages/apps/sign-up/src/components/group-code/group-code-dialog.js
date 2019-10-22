import {
	closeGroupCode as closeGroupCodeAction,
	openGroupCode as openGroupCodeAction,
	resetGroupCodeError as resetGroupCodeErrorAction,
	updateGroupCode as updateGroupCodeAction
} from 'actions/group-code-actions';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {withStyles} from '@material-ui/core';
// External Dependencies
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {ContactUs} from '@www-forms/components';

const styles = theme => ({
	body: {
		paddingBottom: theme.spacing(2)
	},
	button: {
		marginBottom: theme.spacing(2),
		marginTop: theme.spacing(3),
		transition: 'width 150ms',
		width: '80px'
	},
	removeCodeButton: {
		width: '175px'
	},
	content: {
		display: 'flex',
		flexDirection: 'column'
	},
	dialog: {
		padding: theme.spacing(2, 4, 0, 4)
	},
	title: {
		display: 'flex',
		fontFamily: 'NoeDisplay,serif',
		padding: theme.spacing(2, 0, 2)
	},
	submit: {
		overflowX: 'hidden',
		whiteSpace: 'nowrap'
	}
});

// Lenght limit from database
const inputProps = {
	maxLength: 50
};

// Component Definition
const GroupCodeDialog = props => {
	const {
		classes,
		closeGroupCode,
		groupCode,
		groupCodeError,
		isGetting,
		isOpen,
		resetGroupCodeError,
		updateGroupCode
	} = props;

	// Use local state sot that the redux store isn't updated until the user clicks submit
	const [localGroupCode, setGroupCode] = useState(groupCode);

	const handleClose = () => {
		// Update the redux state to close the dialog
		closeGroupCode();

		// Reset local state to match redux state
		setGroupCode(groupCode);
	};

	const handleChange = e => {
		setGroupCode(e.target.value);

		resetGroupCodeError();
	};

	const isRemove = groupCode && !localGroupCode;
	const submitLabel = isRemove ? 'Remove group code' : 'Submit';
	const isSubmitDisabled = !groupCode && !localGroupCode;

	const handleFormKeyDown = event => {
		// Handle Enter key like the submit button
		if (event.key === 'Enter' && !isSubmitDisabled) {
			updateGroupCode(localGroupCode);
		}
	};

	return (
		<Dialog maxWidth="xs" open={isOpen} onClose={handleClose}>
			<DialogContent className={classes.dialog}>
				<Typography className={classes.title} variant="h5">
					Have a group code?
				</Typography>
				<section className={classes.content}>
					<Typography className={classes.body}>
						If you&apos;re part of a franchise or a larger
						organization, we may be able to set up a group discount
						that can be passed along to every member in your group.
						To find out more&nbsp;
						<ContactUs />.
					</Typography>

					<TextField
						autoFocus
						variant="outlined"
						helperText={groupCodeError}
						inputProps={inputProps}
						margin="dense"
						error={Boolean(groupCodeError)}
						value={localGroupCode}
						placeholder="Group Code"
						name="groupCode"
						onKeyDown={handleFormKeyDown}
						onChange={handleChange}
					/>
					<DialogActions>
						<Button
							className={classes.button}
							color="secondary"
							variant="outlined"
							onClick={handleClose}
						>
							Cancel
						</Button>
						<Button
							className={cx(
								classes.button,
								isRemove && classes.removeCodeButton
							)}
							disabled={isSubmitDisabled || undefined}
							color="primary"
							variant="contained"
							onClick={() => updateGroupCode(localGroupCode)}
						>
							{isGetting ? (
								<CircularProgress size={25} color="inherit" />
							) : (
								<div className={classes.submit}>
									{submitLabel}
								</div>
							)}
						</Button>
					</DialogActions>
				</section>
			</DialogContent>
		</Dialog>
	);
};

GroupCodeDialog.propTypes = {
	closeGroupCode: PropTypes.func.isRequired,
	groupCode: PropTypes.string,
	groupCodeError: PropTypes.string,
	isOpen: PropTypes.bool,
	isGetting: PropTypes.bool,
	resetGroupCodeError: PropTypes.func.isRequired,
	updateGroupCode: PropTypes.func.isRequired
};

GroupCodeDialog.defaultProps = {
	isOpen: false,
	isGetting: false,
	groupCode: '',
	groupCodeError: ''
};

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			openGroupCode: openGroupCodeAction,
			closeGroupCode: closeGroupCodeAction,
			updateGroupCode: updateGroupCodeAction,
			resetGroupCodeError: resetGroupCodeErrorAction
		},
		dispatch
	);

const mapStateToProps = state => ({
	...state.groupCode
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(GroupCodeDialog));
