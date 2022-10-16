import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom"
import { Grid } from '@mui/material';
import { Row, Col, Table, Button, Modal, ModalBody } from 'reactstrap';
import { ThemeProvider, createGlobalStyle } from 'styled-components'
// import {
// 	Title
// } from './TestExpport'
// import { toggleLoading } from "../../actions/navigation";
// import API from '../../utils/API'
// import Widget from "../../components/Widget";
// import './Dashboard.scss'


const lightTheme = {
	primary: '#fff',
	text: '#000',
	fontFamily: 'Segoe UI'
}
const darkTheme = {
	primary: '#000',
	text: '#fff',
	fontFamily: 'Segoe UI'
}


class Dashboardv2 extends React.Component<{}> {
    // constructor() {
	// 	// super();
	// }

	render() {
		return (
            <div>this is new dsahboard</div>
		);
	}
}

// function mapStateToProps(store) {
// 	return {
// 		myAccount: store.loanshark.myAccount,
// 		selectedPair: store.loanshark.selectedPair,
// 		numberOfEth: store.loanshark.numberOfEth,
// 		aaveBtcBorrowRate: store.loanshark.aaveBtcBorrowRate,
// 		userDepositBalanceEth: store.loanshark.userDepositBalanceEth,
// 		userDepositBalanceAvax: store.loanshark.userDepositBalanceAvax,
// 		userDebtBalanceBtc: store.loanshark.userDebtBalanceBtc,
// 		userDebtBalanceUsdt: store.loanshark.userDebtBalanceUsdt,
// 		myFujiVaultETHBTC: store.loanshark.myFujiVaultETHBTC,
// 		myFujiVaultAVAXUSDT: store.loanshark.myFujiVaultAVAXUSDT,
// 		myFliquidatorAVAX: store.loanshark.myFliquidatorAVAX,
// 		myFujiController: store.loanshark.myFujiController,
// 		myFujiOracle: store.loanshark.myFujiOracle,
// 		mySmartVaultBtc: store.loanshark.mySmartVaultBtc,
// 		mySmartVaultUsdt: store.loanshark.mySmartVaultUsdt,
// 		myETHContract: store.loanshark.myETHContract,
// 		myBTCContract: store.loanshark.myBTCContract,
// 		myUSDTContract: store.loanshark.myUSDTContract,
// 		priceOfEth: store.loanshark.priceOfEth,
// 		priceOfBtc: store.loanshark.priceOfBtc,
// 		priceOfAvax: store.loanshark.priceOfAvax,
// 		priceOfUsdt: store.loanshark.priceOfUsdt,
// 		providerAAVEAVAX: store.loanshark.providerAAVEAVAX,
// 		smartVaultBtc: store.loanshark.smartVaultBtc,
// 		smartVaultUsdt: store.loanshark.smartVaultUsdt,
// 		myETHAmount: store.loanshark.myETHAmount,
// 		myBTCAmount: store.loanshark.myBTCAmount,
// 		LTV: store.loanshark.LTV,

// 		myBtcLpAmount: store.backd.myBtcLpAmount,
// 		myEthLpAmount: store.backd.myEthLpAmount,
// 		totalBtcLpAmount: store.backd.totalBtcLpAmount,
// 		totalEthLpAmount: store.backd.totalEthLpAmount,
// 		btcLpExchangeRate: store.backd.btcLpExchangeRate,
// 		ethLpExchangeRate: store.backd.ethLpExchangeRate,
// 		myProtection: store.backd.myProtection,

// 		theme: store.layout.theme,
// 	};
// }

export default Dashboardv2;
// connect(mapStateToProps)(Dashboardv2);


