// External Dependencies
import PropTypes from 'prop-types';
import React from 'react';
import {
  deepOrange,
} from '@material-ui/core/colors';

// Material-UI Dependencies
import { withStyles } from '@material-ui/core/styles';

const deepOrange700 = deepOrange['700'];

// Local Variables
const propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

const styles = (theme) => {
  const { primary } = theme.palette;
  const { fontFamily, fontSize } = theme.typography;
  return {
    root: {
      backgroundColor: 'inherit',
      border: 'none',
      borderRadius: 0,
      color: primary.main,
      cursor: 'pointer',
      fontSize,
      fontFamily,
      lineHeight: '24px',
      padding: 0,
      '&:hover': {
        color: deepOrange700,
      },
      '&:focus': {
        color: deepOrange700,
      },
    },
  };
};

// Component Definition
const LinkButton = (props) => {
  const {
    children,
    classes,
    ...other
  } = props;

  return (
    <button type="button" className={classes.root} {...other}>
      {children}
    </button>
  );
};

LinkButton.propTypes = propTypes;
export default withStyles(styles)(LinkButton);
