import { 
  CHANGE_LP_POOL_BTC,
  CHANGE_LP_TOKEN_BTC,
  CHANGE_VAULT_BTC, 
  CHANGE_TOPUP_ACTION,
  CHANGE_GAS_BANK,
  CHANGE_MY_BTC_LP_AMOUNT,
  CHANGE_TOTAL_BTC_LP_AMOUNT,
  CHANGE_MY_PROTECTION,
  CHANGE_BTC_LP_EXCHANGE_RATE,
  CHANGE_MY_GAS_BANK_BALANCE
} from '../actions/backd';

const defaultState = {
  lpPoolBtc: null,
  lpTokenBtc: null,
  vaultBtc: null,
  topupAction: null,
  gasBank: null,
  myBtcLpAmount: null,
  totalBtcLpAmount: null,
  btcLpExchangeRate: 0,
  myProtection: [],
  myGasBankBalance: null,
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
    case CHANGE_GAS_BANK:
      return {...state,gasBank: action.payload};
    case CHANGE_MY_BTC_LP_AMOUNT:
      return {...state,myBtcLpAmount: action.payload};
    case CHANGE_TOTAL_BTC_LP_AMOUNT:
      return {...state,totalBtcLpAmount: action.payload};
    case CHANGE_BTC_LP_EXCHANGE_RATE:
      return {...state,btcLpExchangeRate: action.payload};
    case CHANGE_MY_PROTECTION:
      return {...state,myProtection: action.payload};
    case CHANGE_MY_GAS_BANK_BALANCE:
      return {...state,myGasBankBalance: action.payload};
     default:
      return state;
  }
}
