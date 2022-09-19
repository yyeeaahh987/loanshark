import { 
  CHANGE_MY_PROTECTION_TYPE
} from '../actions/smartvault';

const defaultState = {
  myProtectionType: "",
}

export default function loansharkReducer(state = defaultState, action) {
  switch (action.type) {
    case CHANGE_MY_PROTECTION_TYPE:
      return {...state,myProtectionType: action.payload};
     default:
      return state;
  }
}
