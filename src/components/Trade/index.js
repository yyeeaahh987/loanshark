import React from "react";
import { connect } from "react-redux";

import { Row, Col, Button, Input, DropdownToggle, ButtonDropdown, InputGroup, DropdownMenu, DropdownItem } from "reactstrap";
import "./trade.less";
import "./trade.scss"
import s from "../../pages/tables/Tables.modules.scss";

import {
    toggleLoading,
} from "../../actions/navigation";

import API from '../../utils/API'

import {
    changeInputEthDeposit,
    changeInputBtcDebt,
} from "../../actions/loanshark";

import {
    toDecimalNumber
} from '../../utils/commonFunction'

class BalanceAmount extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <div className="balanceBox">
                    <div className="balanceBox__content">
                        <div>{`You balance: ${toDecimalNumber(this.props.amount, 6)}`}</div>
                    </div>
                </div>
            </>
        )
    }
};


class Trade extends React.Component {
    constructor(props) {
        super(props);

        this.depositAndBorrow = this.depositAndBorrow.bind(this);
        this.setInputEthDeposit = this.setInputEthDeposit.bind(this);
        this.setInputBtcBorrow = this.setInputBtcBorrow.bind(this);
        this.calltoggleLoading = this.calltoggleLoading.bind(this);

        this.state = {
            myAccount: false,
            ethNeededCollateral: 0,
            userDepositBalance: 0,
            userDebtBalance: 0,
            myFujiVaultETHBTC: '',
            myFliquidatorAVAX: '',
            myFujiController: '',
            myFujiOracle: '',
            myETHContract: '',
            myBTCContract: '',
            inputEthDeposit: 0,
            inputBtcBorrow: 0,
            myBtcAmount: 0,
            myEthAmount: 0,
        };
    }

    calltoggleLoading() {
        this.props.dispatch(toggleLoading());
    }

    setInputEthDeposit(event) {
        this.setState({ inputEthDeposit: event.target.value });
        this.props.dispatch(changeInputEthDeposit(event.target.value));
    }

    setInputBtcBorrow(event) {
        this.setState({ inputBtcBorrow: event.target.value });
        this.props.dispatch(changeInputBtcDebt(event.target.value));
    }

    depositAndBorrow() {
        if (this.props.myETHContract) {
            let approveArgs = [
                this.props.myFujiVaultETHBTC.options.address,
                window.web3.utils.toBN(window.web3.utils.toWei(this.state.inputEthDeposit, 'ether')).toString()
            ]
            let finalInputBtcBorrow = (this.state.inputBtcBorrow / 10).toString() + "";

            let args = [
                window.web3.utils.toBN(window.web3.utils.toWei(this.state.inputEthDeposit, 'ether')).toString(),
                window.web3.utils.toBN(window.web3.utils.toWei(finalInputBtcBorrow, 'shannon')).toString()
            ]

            this.calltoggleLoading();

            this.props.myETHContract.methods
                .approve(...approveArgs)
                .send({ from: this.props.myAccount })
                .on("error", (error, receipt) => {
                    this.calltoggleLoading();
                })
                .then((receipt) => {
                    this.props.myFujiVaultETHBTC.methods
                        .depositAndBorrow(...args)
                        .send({ from: this.props.myAccount })
                        .on("error", (error, receipt) => {
                            this.calltoggleLoading();
                        })
                        .then((receipt) => {
                            this.calltoggleLoading();

                            this.setState({ inputEthDeposit: 0 });
                            this.props.dispatch(changeInputEthDeposit(0));

                            this.setState({ inputBtcBorrow: 0 });
                            this.props.dispatch(changeInputBtcDebt(0));

                            API(this.props);
                        });
                });
        }
    }

    render() {
        return (
            <>
                <Row style={{ marginBottom: 9, marginTop: 1 }}>
                    <Col lg={12}>
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "column",
                            alignItems: "center"
                        }}>
                            <InputGroup >
                                <ButtonDropdown
                                    toggle={function noRefCheck() { }}
                                >
                                    <DropdownToggle color="info">
                                        ETH
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem header>
                                            ETH
                                        </DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                                <Input
                                    title="Input"
                                    placeholder="Enter deposit amount..."
                                    value={this.state.inputEthDeposit}
                                    onChange={this.setInputEthDeposit}
                                />
                                <Button style={{ borderRadius: "0px 10px 10px 0px" }} color="dark" onClick={() => {
                                    this.setState({ inputEthDeposit: this.props.myETHAmount });
                                    this.props.dispatch(changeInputEthDeposit(this.props.myETHAmount));
                                }}>Max</Button>

                            </InputGroup>
                            <BalanceAmount
                                amount={this.state.myEthAmount}
                            ></BalanceAmount>
                            <Button outline className="primary">
                                ⇅
                            </Button>
                            <InputGroup style={{ width: "100%" }}  >
                                <ButtonDropdown
                                    toggle={function noRefCheck() { }}
                                >
                                    <DropdownToggle color="warning">
                                        BTC
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem header>
                                            BTC
                                        </DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                                <Input
                                    title="Input"
                                    placeholder="Enter borrow amount..."
                                    value={this.state.inputBtcBorrow}
                                    onChange={this.setInputBtcBorrow}
                                />
                                <Button style={{ borderRadius: "0px 10px 10px 0px" }} color="dark" onClick={() => {
                                    this.setState({ inputBtcBorrow: this.props.myBTCAmount });
                                    this.props.dispatch(changeInputBtcDebt(this.props.myBTCAmount));
                                }}>Max</Button>
                            </InputGroup>
                            <BalanceAmount
                                amount={this.state.myBtcAmount}
                            ></BalanceAmount>
                        </div>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 9, marginTop: 20 }}>
                    <Col lg={12} className={s.root}>
                        <Button disabled={!this.props.myFujiVaultETHBTC || !(this.state.inputEthDeposit > 0)} color={"primary"} style={{ width: "100%" }} onClick={this.depositAndBorrow} >
                            Deposit and Borrow
                        </Button>
                    </Col>
                </Row>
            </>
        )
    }
};



function mapStateToProps(store) {
    return {
        myAccount: store.loanshark.myAccount,
        numberOfEth: store.loanshark.userDebtBalance,
        userDepositBalance: store.loanshark.userDepositBalance,
        userDebtBalance: store.loanshark.userDebtBalance,
        myFujiVaultETHBTC: store.loanshark.myFujiVaultETHBTC,
        myFliquidatorAVAX: store.loanshark.myFliquidatorAVAX,
        myFujiController: store.loanshark.myFujiController,
        myFujiOracle: store.loanshark.myFujiOracle,
        myETHContract: store.loanshark.myETHContract,
        myBTCContract: store.loanshark.myBTCContract,
        inputBtcDept: store.loanshark.inputBtcDept,
        inputEthDeposit: store.loanshark.inputEthDeposit,
        myETHAmount: store.loanshark.myETHAmount,
        myBTCAmount: store.loanshark.myBTCAmount
    };
}

export default connect(mapStateToProps)(Trade);
