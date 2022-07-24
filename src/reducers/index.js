import { combineReducers } from 'redux';
import navigation from './navigation';
import alerts from './alerts';
import loanshark from './loanshark';
import backd from './backd';

export default combineReducers({
  alerts,
  navigation,
  loanshark,
  backd,
});
