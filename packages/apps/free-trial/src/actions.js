import axios from 'axios';

import {
	getEnvironmentUrlPrefix,
	hasErrors,
	validate
} from '@www-forms/components';

const freeTrialValidationRules = {
	firstName: {
		required: true,
		maxLength: 50,
		name: true
	},
	lastName: {
		required: true,
		maxLength: 50,
		name: true
	},
	email: {
		required: true,
		requiredMessage: 'Enter an Email',
		email: true,
		maxLength: 50,
		minLength: 8 // Email doubles as username in this case
	},
	password: {
		required: true,
		maxLength: 25,
		minLength: 8,
		password: true
	}
};

export const validateForm = form => validate(form, freeTrialValidationRules);

const postFreeTrial = form =>
	axios({
		method: 'post',
		url: `${process.env.REACT_APP_PROXY_URL}/signup`,
		data: form
	});

const validateUsername = userName =>
	axios({
		method: 'post',
		url: `${process.env.REACT_APP_PROXY_URL}/validation/username`,
		data: {Source: userName}
	});

export const submitFreeTrial = (form, onFormError, onSuccess, onError) => {
	const {firstName, lastName, email, password} = form;

	const validatedForm = validate(form, freeTrialValidationRules);

	if (hasErrors(validatedForm)) {
		// Update form with error
		onFormError(validatedForm);
	} else {
		const freeTrialPayload = {
			Account: {
				IsFreeTrial: true
			},
			User: {
				Email: email,
				FirstName: firstName,
				LastName: lastName,
				PinCode: password,
				UserName: email
			}
		};

		// Check if email is unique
		validateUsername(email)
			.then(userNameResponse => {
				const isSuccess = userNameResponse.data.Success;
				if (isSuccess) {
					// Only post free trial if email was validated
					postFreeTrial(freeTrialPayload).then(response => {
						const loginToken = response.data.LoginToken;
						onSuccess(loginToken);
					});
				} else {
					onError(userNameResponse.data.ErrorMessage);
				}
			})
			.catch(e => {
				// Default error in case API does not have a message
				onError(
					(e.response && e.response.data.Message) ||
						'An error has occured. Please check the email and try again.'
				);
			});
	}
};

export const completeSignUp = loginToken => {
	const prefix = getEnvironmentUrlPrefix();

	const redirectUrl = `https://${prefix}.call-em-all.com/sso.aspx?LoginToken=${loginToken}`;
	window.location.replace(redirectUrl);
};
