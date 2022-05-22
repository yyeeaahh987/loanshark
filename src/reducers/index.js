import { combineReducers } from 'redux';
import navigation from './navigation';
import alerts from './alerts';
import loanshark from './loanshark';

export default combineReducers({
  alerts,
  navigation,
  loanshark,
});
