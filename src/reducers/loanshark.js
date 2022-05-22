import { CHANGE_NUMBER_OF_ETH, CHANGE_USER_DEPOSIT_BALANCE, CHANGE_USER_DEBT_BALANCE } from '../actions/loanshark';

const defaultState = {
  numberOfEth: 0,
  userDepositBalance: 0,
  userDebtBalance: 0
};

export default function alertsReducer(state = defaultState, action) {
  switch (action.type) {
    case CHANGE_NUMBER_OF_ETH:
      return {
        ...state,
        numberOfEth: action.payload
      };
    case CHANGE_USER_DEPOSIT_BALANCE:
      return {
        ...state,
        userDepositBalance: action.payload
      };
    case CHANGE_USER_DEBT_BALANCE:
      return {
        ...state,
        userDebtBalance: action.payload
      };
    default:
      return state;
  }
}
