import { combineReducers } from 'redux';
import navigation from './navigation';
import alerts from './alerts';

export default combineReducers({
  alerts,
  navigation,
});
