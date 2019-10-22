// Run polyfills for old browsers
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

export {default as Alert} from './src/alert';
export {default as PrivacyPolicy} from './src/privacy-policy';
export {default as ResponsibleUsePolicy} from './src/responsible-use-policy';
export {default as SuccessDialog} from './src/success-dialog';
export {default as TermsOfUse} from './src/terms-of-use';

// Common utils
export {default as ceaStyleCss} from './src/call-em-all-style-2019.css';
export {default as theme} from './src/theme';
export * from './src/create-reducer';
export * from './src/currency';
export * from './src/environmentUtils';
export * from './src/form-helpers';
export * from './src/marketing';
export * from './src/validation';
