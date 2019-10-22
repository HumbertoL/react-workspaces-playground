// Run polyfills for old browsers
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
// eslint-disable-next-line no-unused-vars
import ceaStyleCss from '@www-forms/components';

import React from 'react';
import ReactDOM from 'react-dom';

import {MuiThemeProvider} from '@material-ui/core/styles';
import {theme} from '@www-forms/components';

import Form from './form';

ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<Form />
	</MuiThemeProvider>,
	document.getElementById('root')
);
