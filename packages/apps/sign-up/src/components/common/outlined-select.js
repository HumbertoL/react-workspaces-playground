import PropTypes from 'prop-types';
import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

const OutlinedSelect = (props) => {
  const {
    children,
    error,
    helperText,
    label,
    name,
    onChange,
    options,
    value,
  } = props;

  // Required to correctly display label in the Outlined variant of Select.
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <FormControl
      error={error}
      fullWidth
      required
      variant="outlined"
    >
      <InputLabel ref={inputLabel} htmlFor={name}>
        {label}
      </InputLabel>
      <Select
        labelWidth={labelWidth}
        name={name}
        native
        onChange={onChange}
        value={value}
      >
        {children || options.map((s) => <option value={s.value} key={s.value}>{s.text}</option>)}
      </Select>
      <FormHelperText>
        {helperText}
      </FormHelperText>
    </FormControl>
  );
};

OutlinedSelect.propTypes = {
  error: PropTypes.bool.isRequired,
  helperText: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    text: PropTypes.string,
  })).isRequired,
  value: PropTypes.string,
};

OutlinedSelect.defaultProps = {
  helperText: ' ',
  value: '',
};


export default OutlinedSelect;
