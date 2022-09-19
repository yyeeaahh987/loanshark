import { combineReducers } from 'redux';
import navigation from './navigation';
import alerts from './alerts';
import loanshark from './loanshark';
import backd from './backd';
import smartvault from './smartvault';

const appReducer = combineReducers({
  alerts,
  navigation,
  loanshark,
  backd,
  smartvault
});
const rootReducer = (state, action) => {
  if (action.type === 'RESET') {
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

export default rootReducer;