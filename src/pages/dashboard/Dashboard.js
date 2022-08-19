import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom"
import { Grid } from '@mui/material';
import { Row, Col, Table, Button, Modal, ModalBody } from 'reactstrap';
import { toggleLoading } from "../../actions/navigation";
import API from '../../utils/API'
import Widget from "../../components/Widget";
import './Dashboard.scss'

class Dashboard extends React.Component {
	constructor() {
		super();
		this.forceUpdate = this.forceUpdate.bind(this);
		this.toggle = this.toggle.bind(this);
		this.calltoggleLoading = this.calltoggleLoading.bind(this);
		this.setInput = this.setInput.bind(this);
		this.state = {
			modal: false,
			modalTitle: '',
			subHeading: "",
			modalToken: '',
			modalAction: '',
			modalCall: () => { },
			modalInputValue: 0,
			modalValue: 0,
			modalOnChange: () => { },
			modalOnCall: () => { },
			loadingActive: false,
		};
	}

	toggle() {
		this.setState({
			modal: !this.state.modal,
		})
	}

	calltoggleLoading() {
		this.props.dispatch(toggleLoading());
	}

	setInput(event) {
		this.setState({ modalInputValue: event.target.value });
	}

	calculateHealthFactor(depositeAmouont, priceOfDeposite, LTV, debtAmount, priceOfDebt) {
		if (debtAmount === undefined || debtAmount === null || debtAmount === 0) return "-"
		return ((depositeAmouont * priceOfDeposite / 100) * LTV / (debtAmount * priceOfDebt / 100)).toFixed(2)
	}

	componentDidMount() {
		window.addEventListener("resize", this.forceUpdate.bind(this))
	}

	forceUpdate() {
		return this.setState({})
	}

	toggleLeaveSmartVault(inputModalToken, inputModalAction, pair) {
		this.setState({
			modal: !this.state.modal,
			modalTitle: inputModalAction,
			modalToken: inputModalToken,
			modalAction: inputModalAction,
			modalInputValue: this.props.myBtcLpAmount,
			modalCall: () => {
				let args = [
					window.web3.utils.toBN((this.state.modalInputValue * 100000000).toFixed(0)).toString(),
				];

				this.toggle();
				this.calltoggleLoading();

				this.props.lpPoolBtc.methods
					.redeem(...args)
					.send({ from: this.props.myAccount })
					.on("error", (error, receipt) => {
						this.calltoggleLoading();
					})

					.then((receipt) => {
						this.calltoggleLoading();
						API(this.props);
					})
			}
		});
	}

	render() {
		return (
			<div abc={console.log(this.props)}>
				<Grid container spacing={2}>
					<Grid item xl={3} lg={3} xs={12}>
						<Widget
							title={<p style={{ fontSize: '40px', fontWeight: 700 }}>
								${((this.props.userDepositBalanceEth * this.props.priceOfEth / 100) + (this.props.userDepositBalanceAvax * this.props.priceOfAvax / 100)).toFixed(2)}
							</p>}
							customDropDown={false}
						>
							<Row className={`justify-content-between mt-3`} noGutters>
								<Col sm={12} className={"d-flex align-items-center"}>
									<p style={{ fontSize: '20px', fontWeight: 700 }} className={"fw-semi-bold mb-0"}>
										Your Collateral
									</p>
								</Col>
							</Row>
						</Widget>
					</Grid>

					<Grid item xl={3} lg={3} xs={12}>
						<Widget
							title={<p style={{ fontSize: '40px', fontWeight: 700 }}>
								${((this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100) + (this.props.userDebtBalanceUsdt * this.props.priceOfUsdt / 100)).toFixed(2)}
							</p>}
							customDropDown={false}
						>
							<Row className={`justify-content-between mt-3`} noGutters>
								<Col sm={12} className={"d-flex align-items-center"}>
									<p style={{ fontSize: '20px', fontWeight: 700 }} className={"fw-semi-bold mb-0"}>
										Your Debt
									</p>
								</Col>
							</Row>
						</Widget>
					</Grid>
					<Grid item xl={3} lg={3} xs={12}>
						<Widget
							title={<p style={{ fontSize: '40px', fontWeight: 700 }}>
								${(this.props.myBtcLpAmount * this.props.btcLpExchangeRate * this.props.priceOfBtc / 100).toFixed(2)}
							</p>}
							customDropDown={false}
						>
							<Row className={`justify-content-between mt-3`} noGutters>
								<Col sm={12} className={"d-flex align-items-center"}>
									<p style={{ fontSize: '20px', fontWeight: 700 }} className={"fw-semi-bold mb-0"}>
									Your Smart Vault Balance
									</p>
								</Col>
							</Row>
						</Widget>
					</Grid>

					<Grid item xl={3} lg={3} xs={12}>
						<Widget
							title={<p style={{ fontSize: '40px', fontWeight: 700 }}>
								{
								parseFloat(
									(
										0.0103 * (this.props.userDepositBalanceEth * this.props.priceOfEth / 100)
										- this.props.aaveBtcBorrowRate / 100 * (this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100)
										+ 0.054 * (this.props.myBtcLpAmount * this.props.btcLpExchangeRate * this.props.priceOfBtc / 100) 
									) / (this.props.userDepositBalanceEth * this.props.priceOfEth / 100)  * 100
								).toFixed(4)
								}%
							</p>}
							customDropDown={false}
						>
							<Row className={`justify-content-between mt-3`} noGutters>
								<Col sm={12} className={"d-flex align-items-center"}>
									<p style={{ fontSize: '20px', fontWeight: 700 }} className={"fw-semi-bold mb-0"}>
									Net Interest Rate
									</p>
								</Col>
							</Row>
						</Widget>
					</Grid>

				</Grid>

				<Grid container>
					<Grid item xs={12}>
						<span style={{
							fontWeight: "800",
							fontSize: "20px",
						}}>My Borrowing Position</span>
					</Grid>

					<Grid item xs={12}>
						<Table className={"mb-0"} borderless responsive style={{ borderCollapse: "separate", borderSpacing: "0" }}>
							<thead className="customTable">
								<tr className="customTable__headRow">
									<th key={0} scope="col" className={"customTable__headRow__item"}>
										Asset
									</th>
									<th key={1} scope="col" className={"customTable__headRow__item"}>
										Borrowing Rate<br/>Net Interest Rate
									</th>
									<th key={2} scope="col" className={"customTable__headRow__item"}>
										Collateral
									</th>
									<th key={3} scope="col" className={"customTable__headRow__item"}>
										Debt
									</th>
									<th key={4} scope="col" className={"customTable__headRow__item"}>
										Health Factor
									</th>
									<th key={5} scope="col" className={"customTable__headRow__item"}>
										Protection
									</th>
									<th key={6} scope="col" className={"customTable__headRow__item"}>

									</th>
								</tr>
							</thead>
							<tbody hidden={this.props.userDepositBalanceEth <= 0} className="customTable">
								<tr key={0} className="customTable__dataRow">
									<td className="firstOne">
										<span style={{ paddingRight: "5px" }}>
											<img className="icon" src="/assets/icon/eth-logo.svg" alt="x"></img>
										</span>
										/
										<span style={{ padding: "5px" }}>
											<img className="icon" src="/assets/icon/btc-logo.svg" alt="x"></img>
										</span>
										ETH/BTC
									</td>
									<td className="middle">
										<Grid container>
											<Grid xs={12}>
												<span>{this.props.aaveBtcBorrowRate}%</span>
											</Grid>
											<Grid xs={12}>
												<span>{
													parseFloat(
														(
															  0.0103 * (this.props.userDepositBalanceEth * this.props.priceOfEth / 100)
															- this.props.aaveBtcBorrowRate / 100 * (this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100)
															+ 0.054 * (this.props.myBtcLpAmount * this.props.btcLpExchangeRate * this.props.priceOfBtc / 100) 
														) / (this.props.userDepositBalanceEth * this.props.priceOfEth / 100) * 100
													).toFixed(4)
													}%
												</span>
											</Grid>
										</Grid>
									</td>
									<td className="middle">
										<Grid container>
											<Grid xs={12}>
												<span>{`$${(this.props.userDepositBalanceEth * this.props.priceOfEth / 100).toFixed(2)}`}</span>
											</Grid>
											<Grid xs={12}>
												<span>{this.props.userDepositBalanceEth} ETH</span>
											</Grid>
										</Grid>
									</td>
									<td className="middle">
										<Grid container>
											<Grid xs={12}>
												<span>{`$${(this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100).toFixed(2)}`}</span>
											</Grid>
											<Grid xs={12}>
												<span>{this.props.userDebtBalanceBtc} BTC</span>
											</Grid>
										</Grid>
									</td>
									<td className="middle">
										<span
											className={
												`customTable__dataRow__healthFactor__
                      ${(this.calculateHealthFactor(this.props.userDepositBalanceEth, this.props.priceOfEth, this.props.LTV["ETHBTC"], this.props.userDebtBalanceBtc, this.props.priceOfBtc) === "" || this.calculateHealthFactor(this.props.priceOfEth, this.props.priceOfEth, this.props.LTV["ETHBTC"], this.props.userDebtBalanceBtc, this.props.priceOfBtc) < 5
												) ? "safe" : "danger"}`
											}
										>
											{
												`${this.calculateHealthFactor(this.props.userDepositBalanceEth, this.props.priceOfEth, this.props.LTV["ETHBTC"], this.props.userDebtBalanceBtc, this.props.priceOfBtc) !== "-" ? " " : ""}
                      ${this.calculateHealthFactor(this.props.userDepositBalanceEth, this.props.priceOfEth, this.props.LTV["ETHBTC"], this.props.userDebtBalanceBtc, this.props.priceOfBtc)}`
											}
										</span>
									</td>
									<td className="middle" style={{ color: "orange" }}>
										{this.props.myBtcLpAmount > 0 ? <span>Protected by ${parseFloat(this.props.myBtcLpAmount * this.props.btcLpExchangeRate * this.props.priceOfBtc / 100).toFixed(2)}</span>: <span>Unprotected</span>}
									</td>
									<td className="lastOne">
										<NavLink
											to={{
												pathname: "/app/main/manage",
												state: {
													pair: "ETH_BTC"
												}
											}}
										>
											<Button className={"manage-button"}
											>Manage
											</Button>
										</NavLink>
									</td>
								</tr>
								<br></br>
								<tr hidden key={1} className="customTable__dataRow">
									{/* asset */}
									<td className="firstOne" key={1}>
										<span style={{ paddingRight: "5px" }}>
											<img className="icon" src="/assets/icon/avax-logo.svg" alt="x"></img>
										</span>
										/
										<span style={{ padding: "5px" }}>
											<img className="icon" src="/assets/icon/usdt-logo.svg" alt="x"></img>
										</span>
										AVAX/USDT
									</td>
									{/* collateral */}
									<td className="middle" key={2}>
										<Grid container>
											<Grid xs={12}>
												<span>{`$${(this.props.userDepositBalanceAvax * this.props.priceOfAvax / 100).toFixed(2)}`}</span>
											</Grid>
											<Grid xs={12}>
												<span>{this.props.userDepositBalanceAvax} AVAX</span>
											</Grid>
										</Grid>
									</td>
									<td className="middle" key={3}>
										<Grid container>
											<Grid xs={12}>
												<span>{`$${(this.props.userDebtBalanceUsdt * Number(this.props.priceOfUsdt) / 100).toFixed(2)}`}</span>
											</Grid>
											<Grid xs={12}>
												<span>{`${Number(this.props.userDebtBalanceUsdt).toFixed(2)}`} USDT</span>
											</Grid>
										</Grid>
									</td>
									<td className="middle" key={4}>
										<span
											className={
												`customTable__dataRow__healthFactor__
                      ${(this.calculateHealthFactor(this.props.userDepositBalanceAvax, this.props.priceOfAvax, this.props.LTV["AVAXUSDT"], this.props.userDebtBalanceUsdt, this.props.priceOfUsdt) === "" || this.calculateHealthFactor(this.props.priceOfEth, this.props.priceOfEth, this.props.LTV["ETHBTC"], this.props.userDebtBalanceBtc, this.props.priceOfBtc) < 5
												) ? "safe" : "danger"}`
											}
										>
											{
												`${this.calculateHealthFactor(this.props.userDepositBalanceAvax, this.props.priceOfEth, this.props.LTV["AVAXUSDT"], this.props.userDebtBalanceUsdt, this.props.priceOfUsdt) !== "-" ? " " : ""}
                      ${this.calculateHealthFactor(this.props.userDepositBalanceAvax, this.props.priceOfEth, this.props.LTV["AVAXUSDT"], this.props.userDebtBalanceUsdt, this.props.priceOfUsdt)}`

											}
										</span>
									</td>

									<td className="middle">
										-
									</td>
									<td className="middle">
										-
									</td>
									<td className="lastOne" key={8}>
										<NavLink
											to={{
												pathname: "/app/main/manage",
												state: {
													pair: "AVAX_USDT"
												}
											}}
										>
											<Button className={"manage-button"}
											>Manage
											</Button>
										</NavLink>
									</td>
								</tr>
							</tbody>
						</Table>
						<NavLink
							to={{
								pathname: "/app/main/borrow",
							}}
						>
							<Button block outline color={"secondary"} className={"customTable__dataRow__borrow"}>+ Borrow</Button>
						</NavLink>
					</Grid>
				</Grid>

				<br></br>
				<br></br>
				<Grid container>
					<Grid item xs={12}>
						<span style={{
							fontWeight: "800",
							fontSize: "20px",
						}}>My Smart Vault Position</span>
					</Grid>

					<Grid item xs={12}>
						<Table className={"mb-0"} borderless responsive style={{ borderCollapse: "separate", borderSpacing: "0" }}>
							<thead className="customTable">
								<tr className="customTable__headRow">
									<th key={0} scope="col" className={"customTable__headRow__item"}>
										Asset
									</th>
									<th key={1} scope="col" className={"customTable__headRow__item"}>
										Staking Amount
									</th>
									<th key={2} scope="col" className={"customTable__headRow__item"}>
										APY
									</th>
									<th key={3} scope="col" className={"customTable__headRow__item"}>
										TVL
									</th>
								</tr>
							</thead>
							<tbody className="customTable">
								<tr hidden={this.props.myBtcLpAmount <= 0} key={0} className="customTable__dataRow">
									<td className="firstOne">
										<span style={{ padding: "5px" }}>
											<img className="icon" src="/assets/icon/btc-logo.svg" alt="x"></img>
										</span>
										BTC
									</td>
									<td className="middle">
										${parseFloat(this.props.myBtcLpAmount * this.props.btcLpExchangeRate * this.props.priceOfBtc / 100).toFixed(2)}<br />
										{parseFloat(this.props.myBtcLpAmount * this.props.btcLpExchangeRate).toFixed(8)} BTC<br/>
									</td>
									<td className="middle">
										5.4%
									</td>
									<td className="lastOne">
										${parseFloat(this.props.totalBtcLpAmount * this.props.btcLpExchangeRate * this.props.priceOfBtc / 100).toFixed(2)}
									</td>
								</tr>
								<br></br>
								<br></br>
							</tbody>
						</Table>

						<NavLink
							to={{
								pathname: "/app/main/smartVault1",
							}}
							hidden={this.props.myBtcLpAmount > 0}
						>
							<Button block outline color={"secondary"} className={"customTable__dataRow__borrow"}>+ Smart Vault</Button>
						</NavLink>
					</Grid>
				</Grid>

				<Modal centered isOpen={this.state.modal} toggle={this.toggle} style={{ color: '#000000' }}>
					<ModalBody style={{ color: '#ffffff', backgroundColor: '#000000', border: 'solid', borderRadius: '5px', borderColor: '#ffffff' }}>
						<Row>
							<Col style={{ paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px' }} sm={11}>
								<h4 className={"fw-bold"}>{this.state.modalTitle}</h4>
							</Col>
							<Col sm={1}>
								<Button close color="secondary" onClick={this.toggle}></Button>
							</Col>
							<Col style={{ paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px' }} sm={12}>
								<Button block color={'secondary'} style={{ padding: '5px', color: '#000000' }} onClick={this.state.modalCall}>Confirm</Button>
							</Col>
						</Row>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}

function mapStateToProps(store) {
	return {
		myAccount: store.loanshark.myAccount,
		selectedPair: store.loanshark.selectedPair,
		numberOfEth: store.loanshark.numberOfEth,
		aaveBtcBorrowRate: store.loanshark.aaveBtcBorrowRate,
		userDepositBalanceEth: store.loanshark.userDepositBalanceEth,
		userDepositBalanceAvax: store.loanshark.userDepositBalanceAvax,
		userDebtBalanceBtc: store.loanshark.userDebtBalanceBtc,
		userDebtBalanceUsdt: store.loanshark.userDebtBalanceUsdt,
		myFujiVaultETHBTC: store.loanshark.myFujiVaultETHBTC,
		myFujiVaultAVAXUSDT: store.loanshark.myFujiVaultAVAXUSDT,
		myFliquidatorAVAX: store.loanshark.myFliquidatorAVAX,
		myFujiController: store.loanshark.myFujiController,
		myFujiOracle: store.loanshark.myFujiOracle,
		mySmartVaultBtc: store.loanshark.mySmartVaultBtc,
		mySmartVaultUsdt: store.loanshark.mySmartVaultUsdt,
		myETHContract: store.loanshark.myETHContract,
		myBTCContract: store.loanshark.myBTCContract,
		myUSDTContract: store.loanshark.myUSDTContract,
		priceOfEth: store.loanshark.priceOfEth,
		priceOfBtc: store.loanshark.priceOfBtc,
		priceOfAvax: store.loanshark.priceOfAvax,
		priceOfUsdt: store.loanshark.priceOfUsdt,
		providerAAVEAVAX: store.loanshark.providerAAVEAVAX,
		smartVaultBtc: store.loanshark.smartVaultBtc,
		smartVaultUsdt: store.loanshark.smartVaultUsdt,
		myETHAmount: store.loanshark.myETHAmount,
		myBTCAmount: store.loanshark.myBTCAmount,
		LTV: store.loanshark.LTV,

		myBtcLpAmount: store.backd.myBtcLpAmount,
		totalBtcLpAmount: store.backd.totalBtcLpAmount,
        btcLpExchangeRate: store.backd.btcLpExchangeRate,
		myProtection: store.backd.myProtection
	};
}

export default connect(mapStateToProps)(Dashboard);


