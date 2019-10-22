// Run polyfills for old browsers
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';

import {MuiThemeProvider} from '@material-ui/core/styles';
import {theme} from '@www-forms/components';

// This imports CSS, which does not need to be referenced directly
// eslint-disable-next-line no-unused-vars
import ceaStyleCss from '@www-forms/components';

import Form from './form';

ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<Form />
	</MuiThemeProvider>,
	document.getElementById('root')
);
