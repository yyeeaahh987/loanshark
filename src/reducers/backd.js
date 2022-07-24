import { 
  CHANGE_LP_POOL_BTC,
  CHANGE_LP_TOKEN_BTC,
  CHANGE_VAULT_BTC, 
  CHANGE_TOPUP_ACTION
} from '../actions/backd';

const defaultState = {
  lpPoolBtc: null,
  lpTokenBtc: null,
  vaultBtc: null,
  topupAction: null
}

export default function backdReducer(state = defaultState, action) {
  switch (action.type) {
    case CHANGE_LP_POOL_BTC:
      return {...state,lpPoolBtc: action.payload};
    case CHANGE_LP_TOKEN_BTC:
      return {...state,lpTokenBtc: action.payload};
    case CHANGE_VAULT_BTC:
      return {...state,vaultBtc: action.payload};
    case CHANGE_TOPUP_ACTION:
      return {...state,topupAction: action.payload};
     default:
      return state;
  }
}
