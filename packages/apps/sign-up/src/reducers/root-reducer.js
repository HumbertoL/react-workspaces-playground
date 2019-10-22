import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';

import accountInfo from './account-info-reducer';
import billing from './billing-reducer';
import groupCode from './group-code-reducer';
import pricing from './pricing-reducer';
import step from './step-reducer';
import summary from './summary-reducer';

export const rootReducer = combineReducers({
  accountInfo,
  billing,
  groupCode,
  pricing,
  step,
  summary,
});


// Include redux dev tools in the store enhancer if on development
const initialStoreEnhancer = () => {
  // Render redux dev tools if on development
  const composeEnhancers = composeWithDevTools({
    name: 'Call-Em-All Sign Up',
    shouldCatchErrors: true,
    trace: process.env.REACT_APP_ENABLE_REDUX_TOOLS_TRACE,
  });

  const storeEnhancer = process.env.NODE_ENV === 'development'
    ? composeEnhancers(
      applyMiddleware(
        ReduxThunk,
      ),
    )
    : applyMiddleware(
      ReduxThunk,
    );

  return storeEnhancer;
};

// Creates a redux store
export const initializeStore = (initialState) => createStore(
  rootReducer, initialState, initialStoreEnhancer(),
);
