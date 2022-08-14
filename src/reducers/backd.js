import { 
  CHANGE_LP_POOL_BTC,
  CHANGE_LP_TOKEN_BTC,
  CHANGE_VAULT_BTC, 
  CHANGE_TOPUP_ACTION,
  CHANGE_MY_BTC_LP_AMOUNT,
  CHANGE_TOTAL_BTC_LP_AMOUNT,
  CHANGE_BTC_LP_EXCHANGE_RATE,
  CHANGE_MY_PROTECTION
} from '../actions/backd';

const defaultState = {
  lpPoolBtc: null,
  lpTokenBtc: null,
  vaultBtc: null,
  topupAction: null,
  myBtcLpAmount: null,
  totalBtcLpAmount: null,
  btcLpExchangeRate: 0,
  myProtection: [],
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
    case CHANGE_MY_BTC_LP_AMOUNT:
      return {...state,myBtcLpAmount: action.payload};
    case CHANGE_TOTAL_BTC_LP_AMOUNT:
      return {...state,totalBtcLpAmount: action.payload};
    case CHANGE_BTC_LP_EXCHANGE_RATE:
      return {...state,btcLpExchangeRate: action.payload};
    case CHANGE_MY_PROTECTION:
      return {...state,myProtection: action.payload};
     default:
      return state;
  }
}
