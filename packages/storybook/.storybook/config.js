import {addParameters, configure} from '@storybook/react';
import {themes} from '@storybook/theming';

const comps = require.context(
	'@www-forms/components/src',
	true,
	/.stories.js$/
);

configure(() => {
	comps.keys().forEach(filename => comps(filename));
}, module);
