import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';

import * as supportedRules from './rules';

export const removeErrorKeys = (form) => {
  let found = false;
  const result = { ...form };
  const resultKeys = Object.keys(result);

  // We remove any error keys in a form before we send it to the backend
  for (let i = 0; i < resultKeys.length; i += 1) {
    const currentKey = resultKeys[i];
    if (currentKey.endsWith('Error')) {
      delete result[currentKey];
      found = true;
    }
  }

  // If error keys for found, return the new object
  // If not, return the original object
  return found ? result : form;
};


export const validate = (form = {}, rules = {}) => {
  // Return the form if either rules or form are empty
  if (isEmpty(form) || isEmpty(rules)) return form;

  // Initialize the validated form. We'll use this object to add error messages to.
  const validatedForm = { ...form };

  // Loop through each key in the rules and apply them
  Object.keys(rules).forEach((key) => {
    // If this rule key exists in the form, apply the validation
    if (key in form) {
      // Loop through each key in the rule and apply the validation rule.
      // Apply the rules in the order that it appears in the object.
      // Validate a field until we get an error. All subsquent validation
      // rules for that field should be abandoned.
      const currentRule = rules[key];

      forEach(Object.keys(currentRule), (ruleKey) => {
        // If this ruleKey is a supported rule, then apply it
        if (ruleKey in supportedRules) {
          const formValue = form[key];
          const ruleValue = currentRule[ruleKey];
          const errorKey = `${key}Error`;
          const displayName = currentRule.displayName || startCase(key);
          const customMessageKey = `${ruleKey}Message`;
          const customErrorMessage = currentRule[customMessageKey];
          // eslint-disable-next-line operator-linebreak
          const errorMessage =
            supportedRules[ruleKey](formValue, ruleValue, displayName, customErrorMessage);
          validatedForm[errorKey] = errorMessage;
          if (errorMessage) return false;
        }
        return true;
      });
    }
  });

  return validatedForm;
};
export const hasErrors = (form) => {
  const formKeys = Object.keys(form);
  for (let i = 0; i < formKeys.length; i += 1) {
    const currentKey = formKeys[i];
    if (currentKey.endsWith('Error')) {
      // Accounts for custom data error object
      const isObject = typeof form[currentKey] === 'object';
      if (isObject && form[currentKey] != null && Object.keys(form[currentKey]).length) {
        return true;
      // eslint-disable-next-line no-else-return
      } else if (!isObject && form[currentKey]) {
        return true;
      }
    }
  }
  return false;
};
