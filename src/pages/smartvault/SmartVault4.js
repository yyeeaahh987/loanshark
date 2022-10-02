import React from "react";
import { connect } from "react-redux";

import {
    Row, Col, Table,
    Input,
    Button,
    Modal,
    ModalBody,
} from 'reactstrap';
import './SmartVault2.css';

import {
    toggleLoading,
} from "../../actions/navigation";

import API from '../../utils/API'
import Widget from "../../components/Widget/Widget";

class SmartVault4 extends React.Component {
    constructor() {
        super();
        this.setSelected = this.setSelected.bind(this);
        this.stakeToVault = this.stakeToVault.bind(this);
        this.calltoggleLoading = this.calltoggleLoading.bind(this);
        this.setStakeAmount = this.setStakeAmount.bind(this);
        this.setTriggerHealthFactor = this.setTriggerHealthFactor.bind(this);
        this.setSingleTopupAmount = this.setSingleTopupAmount.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
            selected: 'repay',
            htmlContent: '',
            modalTitle: '',
            modalButton: '',
            stakeAmount: 1,
            triggerHealthFactor: 1.2,
            singleTopupAmount: 0.01,
            modal: false
        }
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
        })
    }

    calltoggleLoading() {
        this.props.dispatch(toggleLoading());
    }

    setSelected(value) {
        this.setState({ selected: value });
    }

    setStakeAmount(event) {
        this.setState({ stakeAmount: event.target.value });
    }

    setTriggerHealthFactor(event) {
        this.setState({ triggerHealthFactor: event.target.value });
    }

    setSingleTopupAmount(event) {
        this.setState({ singleTopupAmount: event.target.value });
    }

    stakeToVault() {
        if (!this.props.lpPoolBtc) {
            return;
        }

        this.setState({
            modal: !this.state.modal,
            htmlContent:
                (
                    this.state.triggerHealthFactor < 1.05 ?
                        "Please set the target health factor higher than 1.05"
                        :
                        this.state.singleTopupAmount > this.state.stakeAmount ?
                            "Please deposit more than the amount to repay for you each time the target heath factor is hit."
                            :
                            this.state.stakeAmount > this.props.myBTCAmount ?
                                "You do not have " + this.state.stakeAmount + " BTC to stake. You have " + this.props.myBTCAmount + " BTC only."
                                :
                                "When the health factor drops below <span style='color: #00ff00'>" + this.state.triggerHealthFactor + "</span>, " +
                                "it will be topped up with <span class='fw-bold'>" + this.state.singleTopupAmount + " BTC (~" + parseFloat((this.state.singleTopupAmount * this.props.priceOfBtc / 100).toFixed(8)) + ")</span>. " +
                                "This will be repeated each time the health factor drops below <span style='color: #00ff00'>" + this.state.triggerHealthFactor + "</span>, " +
                                "until a total of <span class='fw-bold'>" + this.state.stakeAmount + " BTC (~$" + parseFloat((this.state.stakeAmount * this.props.priceOfBtc / 100).toFixed(8)) + ")</span> is topped up."
                ),
            modalButton:
                (
                    this.state.triggerHealthFactor < 1.05 || this.state.singleTopupAmount > this.state.stakeAmount || this.state.stakeAmount > this.props.myBTCAmount ?
                        "Close" : "Confirm"
                ),
            modalTitle:
                (
                    this.state.triggerHealthFactor < 1.05 || this.state.singleTopupAmount > this.state.stakeAmount || this.state.stakeAmount > this.props.myBTCAmount ?
                        "Cannot add Smart Vault" : "Confirm to add Smart Vault?"
                ),
            modalCall:
                this.state.triggerHealthFactor < 1.05 || this.state.singleTopupAmount > this.state.stakeAmount || this.state.stakeAmount > this.props.myBTCAmount ?
                    () => { this.toggle() } :
                    () => {
                        let approveArgs = [
                            this.props.lpPoolBtc.options.address,
                            window.web3.utils.toBN((this.state.stakeAmount * 100000000).toFixed(0)).toString()
                        ]

                        let args = [
                            window.web3.utils.toBN((this.state.stakeAmount * 100000000).toFixed(0)).toString(),
                        ];

                        let approveArgsForTopupAction = [
                            this.props.topupAction.options.address,
                            window.web3.utils.toBN((this.state.stakeAmount / this.props.btcLpExchangeRate * 100000000).toFixed(0)).toString()
                        ]

                        let argsRegister = [
                            this.props.myAccount + "000000000000000000000000",
                            "0x66756a6964616f00000000000000000000000000000000000000000000000000",
                            window.web3.utils.toBN((this.state.stakeAmount / this.props.btcLpExchangeRate * 100000000).toFixed(0)).toString(),
                            [
                                window.web3.utils.toBN(window.web3.utils.toWei((this.state.triggerHealthFactor).toString(), 'ether')).toString(),
                                "0",
                                "1",
                                "0x9c1dcacb57ada1e9e2d3a8280b7cfc7eb936186f",
                                "0x9f2b4eeb926d8de19289e93cbf524b6522397b05",
                                window.web3.utils.toBN((this.state.singleTopupAmount * 0.9999 * 100000000).toFixed(0)).toString(),
                                window.web3.utils.toBN((this.state.stakeAmount * 0.9999 * 100000000).toFixed(0)).toString(),
                                window.web3.utils.toBN((this.state.stakeAmount * 0.9999 * 100000000).toFixed(0)).toString(),
                                "0x0000000000000000000000000000000000000000000000000000000000000001"
                            ]
                        ];

                        this.toggle();
                        this.calltoggleLoading();

                        this.props.myBTCContract.methods
                            .approve(...approveArgs)
                            .send({ from: this.props.myAccount })
                            .on("error", (error, receipt) => {
                                this.calltoggleLoading();
                            })
                            .then((receipt) => {
                                this.props.lpPoolBtc.methods
                                    .deposit(...args)
                                    .send({ from: this.props.myAccount })
                                    .on("error", (error, receipt) => {
                                        this.calltoggleLoading();
                                    })
                                    .then((receipt) => {
                                        this.props.lpTokenBtc.methods
                                            .approve(...approveArgsForTopupAction)
                                            .send({ from: this.props.myAccount })
                                            .on("error", (error, receipt) => {
                                                this.calltoggleLoading();
                                            })
                                            .then((receipt) => {
                                                this.props.topupAction.methods
                                                    .register(...argsRegister)
                                                    .send({ from: this.props.myAccount, value: 1000000000000 })
                                                    .on("error", (error, receipt) => {
                                                        this.calltoggleLoading();
                                                    })
                                                    .then((receipt) => {
                                                        this.calltoggleLoading();
                                                        API(this.props);
                                                    })
                                            })
                                    })
                            })
                    }
        })
    }

    render() {
        return (
            <div>
                <h3 className={"fw-bold"}>Protection Setup</h3>
                <Row>
                    <Col lg={8} md={12}>
                        <Table className={"mb-5"} responsive borderless>
                            <thead>
                                <tr>
                                    <th key={0} scope="col" className={`pl-4 protection-text-${this.props.theme==="light"?"light":"dark"}`}>
                                    
                                    </th>
                                    <th key={1} scope="col" className={`pl-0 protection-text-${this.props.theme==="light"?"light":"dark"}`}>
                                        Collateral
                                    </th>
                                    <th key={3} scope="col" className={`pl-0 protection-text-${this.props.theme==="light"?"light":"dark"}`}>
                                        Debt
                                    </th>
                                    <th key={4} scope="col" className={`pl-0 protection-text-${this.props.theme==="light"?"light":"dark"}`}>
                                        Health Factor
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="">
                                <tr key={0} className={`rowHovered ${this.props.theme === "light" ? "rowHovered-light" : "rowHovered-dark"}`}>
                                    <td className="fw-thin pl-4 firstOne">
                                        <img style={{ padding: '5px' }} className="icon" src="/assets/icon/eth-logo.svg" alt="x"></img> ETH / <img style={{ padding: '5px' }} className="icon" src="/assets/icon/btc-logo.svg" alt="x"></img> BTC
                                    </td>
                                    <td className={"pl-0 fw-thin middle"}>
                                        ${parseFloat((this.props.userDepositBalanceEth * this.props.priceOfEth / 100).toFixed(2))}<br />
                                        {Number(this.props.userDepositBalanceEth)} ETH
                                    </td>
                                    <td className={"pl-0 fw-thin middle"}>
                                        ${parseFloat((this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100).toFixed(2))}<br />
                                        {Number(this.props.userDebtBalanceBtc)} BTC
                                    </td>
                                    <td className={"pl-0 fw-normal lastOne"}>
                                        {((this.props.userDepositBalanceEth * this.props.priceOfEth / 100) * this.props.LTV["ETHBTC"] / (this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100)).toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>

                        {
                            this.props.myProtection[0] <= 0 ?
                                <>
                                    <p className={"fw-bold"}>Input the amount of BTC you would like to deposit into the smart vault</p>
                                    <Input className={`my-protection-text-${this.props.theme === "light" ? "light" : "dark"}`} value={this.state.stakeAmount} onChange={this.setStakeAmount}></Input>
                                    <br />
                                    <p className={"fw-bold"}>Input the target health factor to trigger the automatic top-up/repayment action</p>
                                    <Input className={`my-protection-text-${this.props.theme === "light" ? "light" : "dark"}`} value={this.state.triggerHealthFactor} onChange={this.setTriggerHealthFactor}></Input>
                                    <br />
                                    <p className={"fw-bold"}>Input the amount of BTC you would like Loanshark to repay for you each time the target heath factor is hit</p>
                                    <Input className={`my-protection-text-${this.props.theme === "light" ? "light" : "dark"}`} value={this.state.singleTopupAmount} onChange={this.setSingleTopupAmount}></Input>
                                    <br />
                                </>
                                :
                                !this.props.myAccount ?
                                    <Row>
                                        <Col sm={6}>
                                            <p className={"fw-bold"}>Please connect your wallet first.</p>
                                        </Col>
                                    </Row>
                                    :
                                    <Row>
                                        <Col sm={12}>
                                            <p className={"fw-bold"}>
                                                You are already protected. <br />
                                                {`If you want to modify your deposit or protection parameters, please withdraw your smart vault balance in Dashboard > Manage.`}
                                            </p>
                                        </Col>
                                    </Row>
                        }
                    </Col>

                    <Col lg={4} md={12}>
                        <Widget style={{ paddingTop: '20px' }} theme={this.props.theme}>
                            <p className={"fw-bold"}>Selected Smart Vault</p>
                            <p className={"fw-bold"}><img style={{ padding: '5px' }} className="icon" src="/assets/icon/btc-logo.svg" alt="x"></img> BTC</p>

                            <Row style={{ paddingTop: '20px' }} >
                                <Col lg={4} md={12}>Your Balance:</Col>
                                <Col style={{ textAlign: 'right' }} lg={8} md={12}>
                                    ${parseFloat(this.props.myBtcLpAmount * this.props.btcLpExchangeRate * this.props.priceOfBtc / 100).toFixed(2)}<br />
                                </Col>
                            </Row>
                            <Row style={{ paddingTop: '20px' }} >
                                <Col lg={4} md={12}>APY:</Col>
                                <Col style={{ textAlign: 'right' }} lg={8} md={12}>5.4%</Col>
                            </Row>
                            <Row style={{ paddingTop: '20px' }} >
                                <Col lg={4} md={12}>TVL:</Col>
                                <Col style={{ textAlign: 'right' }} lg={8} md={12}> ${parseFloat(this.props.totalBtcLpAmount * this.props.btcLpExchangeRate * this.props.priceOfBtc / 100).toFixed(2)}</Col>
                            </Row>
                        </Widget>
                    </Col>
                    {
                        this.props.myProtection[0] <= 0 ?
                            <Col md={12}>
                                <Button block className={`manage-button__${this.props.theme === "light" ? "light" : "dark"}`} style={{ padding: '20px' }} onClick={() => {
                                    this.stakeToVault();
                                }}>Confirm</Button>
                            </Col>
                            :
                            <></>
                    }
                </Row>
                <Modal centered isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalBody style={{ color: '#ffffff', backgroundColor: '#000000', border: 'solid', borderRadius: '5px', borderColor: '#ffffff' }}>
                        <Row>
                            <Col style={{ paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px' }} sm={11}>
                                <h4 className={"fw-bold"}>{this.state.modalTitle}</h4>
                            </Col>
                            <Col sm={1}>
                                <Button close color="secondary" onClick={this.toggle}></Button>
                            </Col>
                            <Col style={{ paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px' }} sm={12}>
                                <div className="content" dangerouslySetInnerHTML={{ __html: this.state.htmlContent }}></div>
                            </Col>
                            <Col style={{ paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px' }} sm={12}>
                                <Button block className={'manage-button'} style={{ padding: '20px' }} onClick={this.state.modalCall}>{this.state.modalButton}</Button>
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
        lpPoolBtc: store.backd.lpPoolBtc,
        myBTCAmount: store.loanshark.myBTCAmount,
        priceOfBtc: store.loanshark.priceOfBtc,
        priceOfEth: store.loanshark.priceOfEth,
        myBTCContract: store.loanshark.myBTCContract,
        userDepositBalanceEth: store.loanshark.userDepositBalanceEth,
        userDebtBalanceBtc: store.loanshark.userDebtBalanceBtc,

        LTV: store.loanshark.LTV,
        myBtcLpAmount: store.backd.myBtcLpAmount,
        totalBtcLpAmount: store.backd.totalBtcLpAmount,
        topupAction: store.backd.topupAction,
        btcLpExchangeRate: store.backd.btcLpExchangeRate,
        lpTokenBtc: store.backd.lpTokenBtc,
        myProtection: store.backd.myProtection,

        theme: store.layout.theme,
    };
}

export default connect(mapStateToProps)(SmartVault4);
