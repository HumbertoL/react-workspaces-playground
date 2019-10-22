// Run polyfills for old browsers
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
// eslint-disable-next-line no-unused-vars
import ceaStyleCss from '@www-forms/components';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import SignUp from 'sign-up';

import {MuiThemeProvider} from '@material-ui/core/styles';
import {theme} from '@www-forms/components';

import {initializeStore} from './reducers/root-reducer';

const store = initializeStore();

ReactDOM.render(
	<Provider store={store}>
		<MuiThemeProvider theme={theme}>
			<SignUp />
		</MuiThemeProvider>
	</Provider>,
	document.getElementById('root')
);
