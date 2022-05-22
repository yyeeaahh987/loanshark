export const CHANGE_NUMBER_OF_ETH = 'CHANGE_NUMBER_OF_ETH';
export const CHANGE_USER_DEPOSIT_BALANCE = 'CHANGE_USER_DEPOSIT_BALANCE';
export const CHANGE_USER_DEBT_BALANCE = 'CHANGE_USER_DEBT_BALANCE';


export function changeNumberOfEth(payload) {
  return {
    type: CHANGE_NUMBER_OF_ETH,
    payload,
  };
}

export function changeUserDepositBalance(payload) {
  return {
    type: CHANGE_USER_DEPOSIT_BALANCE,
    payload,
  };
}

export function changeUserDebtBalance(payload) {
  return {
    type: CHANGE_USER_DEBT_BALANCE,
    payload,
  };
}
