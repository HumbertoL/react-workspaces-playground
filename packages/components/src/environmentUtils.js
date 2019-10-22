export const getEnvironmentUrlPrefix = () => {
	const environment = process.env.REACT_APP_ENV;
	if (environment === 'stg') {
		return 'staging-app';
	}
	if (environment === 'dev') {
		return 'dev-app';
	}
	if (environment === 'beta') {
		return 'beta-app';
	}

	// default to prod
	return 'app';
};
