import './call-em-all-style-2019.css';
import React from 'react';
import {muiTheme} from 'storybook-addon-material-ui';

import {storiesOf} from '@storybook/react';

import Alert from './alert';
import theme from './theme';

const successMessage = 'Your information has been submitted succesfully';
const errorMessage = 'An error occured while submitting your informaiton';

storiesOf('Alert', module)
	.addDecorator(muiTheme(theme))
	.add('Success', () => <Alert open message={successMessage} />)
	.add('Error', () => <Alert open isError message={errorMessage} />)
	.add('Closed', () => <Alert isError message={errorMessage} />);
