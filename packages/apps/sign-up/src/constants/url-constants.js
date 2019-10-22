import {getEnvironmentUrlPrefix} from '@www-forms/components';

export function getPaygPricingUrl() {
	return `${process.env.REACT_APP_PROXY_URL}/pricing/1`;
}

export function getMonthlyPricingUrl() {
	return `${process.env.REACT_APP_PROXY_URL}/pricing/2`;
}

export function getGroupCodeUrl(groupCode) {
	return `${process.env.REACT_APP_PROXY_URL}/groupcode/${groupCode}`;
}

export function getPricingPreviewUrl() {
	return `${process.env.REACT_APP_PROXY_URL}/charges/preview/signup`;
}

export function getFreeTrialUrl() {
	switch (process.env.REACT_APP_ENV) {
		case 'dev':
		case 'stg':
			return 'https://2513604.hs-sites.com/-temporary-slug-fafd065b-baa6-4b03-af4e-f1fbaf24ae4d?hs_preview=FwIEhfNA-13895801003';
		case 'prd':
		default:
			return 'http://call-em-all.com/freetrial';
	}
}

export const getOnboardingUrl = loginToken => {
	const prefix = getEnvironmentUrlPrefix();

	const redirectUrl = `https://${prefix}.call-em-all.com/sso.aspx?LoginToken=${loginToken}`;
	return redirectUrl;
};

export const getLoginUrl = () => {
	const prefix = getEnvironmentUrlPrefix();
	return `https://${prefix}.call-em-all.com/login`;
};

export const getInvoiceHelpUrl = () =>
	'http://support.call-em-all.com/article/299-invoicing-options';

export const getTaxExemptHelpUrl = () =>
	'https://support.call-em-all.com/article/417-updating-your-tax-exempt-status';

export const getContactUsUrl = () =>
	'https://support.call-em-all.com/#collection-category-443';
