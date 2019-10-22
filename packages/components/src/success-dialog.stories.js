import './call-em-all-style-2019.css';

import React from 'react';
import {muiTheme} from 'storybook-addon-material-ui';

import {storiesOf} from '@storybook/react';

import SuccessDialog from './success-dialog';
import theme from './theme';

storiesOf('Success Dialog', module)
	.addDecorator(muiTheme(theme))
	.add('Created account', () => <SuccessDialog isOpen isFreeTrial={false} />)
	.add('Free trial', () => <SuccessDialog isOpen isFreeTrial />)

	.add('Payment submitted', () => (
		<SuccessDialog isOpen isCollectingPayment isFreeTrial={false} />
	))
	.add('Closed', () => <SuccessDialog isOpen={false} />);
