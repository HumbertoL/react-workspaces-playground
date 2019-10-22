import axios from 'axios';

import {
  stripPhone,
  validatePhone,
} from './utils/optOutUtils';

export const postOptOut = (PhoneNumber, onSuccess, onError) => {
  const isValidPhone = validatePhone(PhoneNumber);

  if (isValidPhone) {
    const strippedPhoneNumber = stripPhone(PhoneNumber);

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_PROXY_URL}/optouts/global`,
      data: {
        PhoneNumber: strippedPhoneNumber,
      },
    })
      .then(onSuccess)
      .catch((e) => {
        // Default error in case API does not have a message
        onError(
          (e.response && e.response.data.Message)
        || 'An error has occured. Please check the number and try again.',
        );
      });
  } else {
    onError('Please enter your phone number.');
  }
};
