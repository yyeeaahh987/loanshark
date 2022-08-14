import React from "react";
import { connect } from "react-redux";
import {
    Dropdown
} from 'react-bootstrap';
import {
    Row,
    Col,
    Button,
    Input,
    InputGroup,
    Modal,
    ModalBody
} from "reactstrap";
import SearchModal from '../SearchModal/index'
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
    changeSelectedPair,
} from "../../actions/loanshark";

const ownAssetType = [
    // {
    //     "chainId": 1,
    //     "address": "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
    //     "name": "Avalanche",
    //     "symbol": "AVAX",
    //     "decimals": 8,
    //     "logoURI": ""
    // },
    {
        "chainId": 1,
        "address": "0xf20d962a6c8f70c731bd838a3a388d7d48fa6e15",
        "name": "Ethereum",
        "symbol": "ETH",
        "decimals": 8,
        "logoURI": ""
    },
]
class BalanceAmount extends React.Component {
    render() {
        return (
            <>
                <div className="balanceBox">
                    <div className="balanceBox__content">
                        <div>{`${this.props.displayPrefixText}${(this.props.amount)}`}</div>
                    </div>
                </div>
            </>
        )
    }
};


class Trade extends React.Component {
    constructor(props) {
        super(props);

        this.calltoggleLoading = this.calltoggleLoading.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.calltoggleLoading = this.calltoggleLoading.bind(this);
        this.setInputEthDeposit = this.setInputEthDeposit.bind(this);
        this.setInputBtcBorrow = this.setInputBtcBorrow.bind(this);
        this.depositWETHAndBorrowWBTC = this.depositWETHAndBorrowWBTC.bind(this);
        this.depositAVAXAndBorrowUSDT = this.depositAVAXAndBorrowUSDT.bind(this);
        this.calculateHealthFactor = this.calculateHealthFactor.bind(this);

        this.state = {
            inputEthDeposit: 0,
            inputBtcBorrow: 0,
            currencySelectModal: false,
            modal: false,
            modalToken: '',
            modalAction: '',
            modalCall: () => { },
            modalInputValue: 0,
            modalValue: 0,
            modalOnChange: () => { },
            modalOnCall: () => { },
        };
    }

    componentWillUnmount() {
        this.props.dispatch(changeInputEthDeposit(0));
        this.props.dispatch(changeInputBtcDebt(0));
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
        })
    }

    toggleModal = () => {
        this.setState({ currencySelectModal: !this.state.currencySelectModal });
    }

    handleClose = () => {
        this.setState({ currencySelectModal: false });
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

    calculateHealthFactor(depositAmouont, priceOfdeposit, LTV, debtAmount, priceOfDebt) {
        if (debtAmount === undefined || debtAmount === null || debtAmount === 0) return "-"
        return ((depositAmouont * priceOfdeposit / 100) * LTV / (debtAmount * priceOfDebt / 100)).toFixed(2)
    }

    depositWETHAndBorrowWBTC() {
        if (this.props.myETHContract) {
            let newHealthFactor =
                this.calculateHealthFactor(
                    parseFloat(this.props.userDepositBalanceEth) + parseFloat(this.state.inputEthDeposit),
                    this.props.priceOfEth,
                    this.props.LTV["ETHBTC"],
                    parseFloat(this.props.userDebtBalanceBtc) + parseFloat(this.state.inputBtcBorrow),
                    this.props.priceOfBtc);

            var modalTitle = '';
            var modalMessage = '';
            if (this.state.inputEthDeposit <= 0 || isNaN(this.state.inputEthDeposit)) {
                modalTitle = 'Unable to borrow BTC using ETH as collateral';
                modalMessage = 'Please enter the amount that you want to deposit.';
            } else if (this.state.inputBtcBorrow <= 0 || isNaN(this.state.inputBtcBorrow)) {
                modalTitle = 'Unable to borrow BTC using ETH as collateral';
                modalMessage = 'Please enter the amount that you want to borrow.';
            } else if (newHealthFactor <= 1) {
                modalTitle = 'Unable to borrow BTC using ETH as collateral';
                modalMessage = 'You are unable to deposit <span class="fw-bold">' +
                    this.state.inputEthDeposit + ' ETH ' +
                    ' (~$' +
                    Number(this.state.inputEthDeposit * this.props.priceOfEth / 100).toFixed(2) +
                    ')</span>. ' +  
                    ' and borrow <span class="fw-bold">' +
                    this.state.inputBtcBorrow + ' BTC ' +
                    ' (~$' +
                    Number(this.state.inputBtcBorrow * this.props.priceOfBtc / 100).toFixed(2) +
                    ')</span>. <br/>The new health factor will be <span class="fw-bold" style="color: #ff7d47">' + newHealthFactor + '</span> which is below 1.';
            } else {
                modalTitle = 'Confirm to borrow BTC using ETH as collateral?';
                modalMessage = 'You are depositing <span class="fw-bold">' +
                    this.state.inputEthDeposit + ' ETH ' +
                    ' (~$' +
                    Number(this.state.inputEthDeposit * this.props.priceOfEth / 100).toFixed(2) +
                    ')</span>. <br/>Your new health factor will be <span class="fw-bold" style="color: #68ca66">' + newHealthFactor + '</span>.';
                modalMessage = 'You are depositing <span class="fw-bold">' +
                    this.state.inputEthDeposit + ' ETH ' +
                    ' (~$' +
                    Number(this.state.inputEthDeposit * this.props.priceOfEth / 100).toFixed(2) +
                    ')</span> ' +  
                    ' and borrowing <span class="fw-bold">' +
                    this.state.inputBtcBorrow + ' BTC ' +
                    ' (~$' +
                    Number(this.state.inputBtcBorrow * this.props.priceOfBtc / 100).toFixed(2) +
                    ')</span>. <br/>Your new health factor will be <span class="fw-bold" style="color: #68ca66">' + newHealthFactor + '</span>.';
            }

            this.setState({
                modal: !this.state.modal,
                modalTitle: modalTitle,
                modalMessage: modalMessage,
                modalToken: "",
                modalAction: "",
                modalInputValue: 0,
                modalCall: () => {
                    let approveArgs = [
                        this.props.myFujiVaultETHBTC.options.address,
                        window.web3.utils.toBN(window.web3.utils.toWei(this.state.inputEthDeposit, 'ether')).toString()
                    ]
                    let finalInputBtcBorrow = (this.state.inputBtcBorrow / 10).toString() + "";

                    let args = [
                        window.web3.utils.toBN(window.web3.utils.toWei(this.state.inputEthDeposit, 'ether')).toString(),
                        window.web3.utils.toBN(window.web3.utils.toWei(finalInputBtcBorrow, 'shannon')).toString()
                    ]

                    this.toggle();
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
            })
        }
    }

    depositAVAXAndBorrowUSDT() {
        if (this.props.myETHContract) {
            let args = [
                window.web3.utils.toBN(window.web3.utils.toWei(this.state.inputEthDeposit, 'ether')).toString(),
                window.web3.utils.toBN(window.web3.utils.toWei(this.state.inputBtcBorrow, 'picoether')).toString()
            ]

            this.calltoggleLoading();

            this.props.myFujiVaultAVAXUSDT.methods
                .depositAndBorrow(...args)
                .send({ from: this.props.myAccount, value: window.web3.utils.toBN(window.web3.utils.toWei(this.state.inputEthDeposit, 'ether')).toString() })
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
        }
    }

    render() {
        var borrowPower =
            this.props.inputEthDeposit
            * (this.props.selectedPair === "ETHBTC" ? this.props.priceOfEth : this.props.priceOfAvax)
            * this.props.LTV[this.props.selectedPair]
            * this.props.liquidationPrice[this.props.selectedPair]
            / (this.props.selectedPair === "ETHBTC" ? this.props.priceOfBtc : this.props.priceOfUsdt)
            ;

        return (
            <>
                <SearchModal
                    isOpen={this.state.currencySelectModal}
                    handleClose={this.handleClose}
                    type={"searchToken"}
                >
                </SearchModal>

                <Row style={{ marginBottom: 9, marginTop: 1 }}>
                    <Col lg={12}>
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "column",
                        }}>
                            Collateral:
                            <InputGroup>
                                <Dropdown className="currency-dropdown">
                                    <Dropdown.Toggle variant="success" id="dropdown-basic" bsPrefix="p-0"
                                        className="currency-dropdown__label-blue"
                                    >
                                        {this.props.selectedPair === "ETHBTC" ?
                                            <img style={{ padding: '5px' }} className="icon" src="/assets/icon/eth-logo.svg" alt="x"></img> :
                                            <img style={{ padding: '5px' }} className="icon" src="/assets/icon/avax-logo.svg" alt="x"></img>} {' '}
                                        {this.props.selectedPair === "ETHBTC" ? "ETH" : "AVAX"} &#x25bc;
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {ownAssetType.map((asset) => {
                                            return (
                                                <div key={asset.name}>
                                                    <Dropdown.Item
                                                        as={"span"}
                                                        value={asset.symbol} name={asset.name}
                                                        className="currency-dropdown__option"
                                                        onClick={(e) => {
                                                            if (asset.symbol === "ETH") {
                                                                this.props.dispatch(changeSelectedPair("ETHBTC"));
                                                            }
                                                            if (asset.symbol === "AVAX") {
                                                                this.props.dispatch(changeSelectedPair("AVAXUSDT"));
                                                            }
                                                        }}
                                                    >{asset.symbol}</Dropdown.Item>
                                                </div>
                                            )
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Input
                                    title="Input"
                                    style={{ backgroundColor: 'transparent', color: '#ffffff' }}
                                    placeholder="Enter deposit amount..."
                                    value={this.state.inputEthDeposit}
                                    onChange={this.setInputEthDeposit}
                                />
                                <Button style={{ borderRadius: "0px 10px 10px 0px", color: '#000000' }} color="light" onClick={() => {
                                    this.setState({ inputEthDeposit: this.props.selectedPair === "ETHBTC" ? this.props.myETHAmount : this.props.selectedPair === "AVAXUSDT" ? this.props.myAVAXAmount : 0 });
                                    this.props.dispatch(changeInputEthDeposit(this.props.selectedPair === "ETHBTC" ? this.props.myETHAmount : this.props.selectedPair === "AVAXUSDT" ? this.props.myAVAXAmount : 0));
                                }}>Max</Button>

                            </InputGroup>
                            <BalanceAmount
                                amount={this.props.selectedPair === "ETHBTC" ? this.props.myETHAmount : this.props.selectedPair === "AVAXUSDT" ? this.props.myAVAXAmount : 0}
                                displayPrefixText={"Your balance: "}
                            ></BalanceAmount>
                            <p style={{ alignSelf: "left" }}>
                                ↓
                            </p>

                            <span>Borrow:</span>
                            <InputGroup style={{ width: "100%" }}  >
                                <Dropdown className="currency-dropdown">
                                    <Dropdown.Toggle variant="success" id="dropdown-basic" bsPrefix="p-0" className="currency-dropdown__label-yellow">
                                        {this.props.selectedPair === "ETHBTC" ?
                                            <img style={{ padding: '5px' }} className="icon" src="/assets/icon/btc-logo.svg" alt="x"></img> :
                                            <img style={{ padding: '5px' }} className="icon" src="/assets/icon/usdt-logo.svg" alt="x"></img>} {' '}
                                        {this.props.selectedPair === "ETHBTC" ? "BTC" : "USDT"}
                                    </Dropdown.Toggle>
                                </Dropdown>
                                <Input
                                    title="Input"
                                    style={{ backgroundColor: 'transparent', color: '#ffffff' }}
                                    placeholder="Enter borrow amount..."
                                    value={this.state.inputBtcBorrow}
                                    onChange={this.setInputBtcBorrow}
                                />
                            </InputGroup>
                            <BalanceAmount
                                amount={this.props.selectedPair === "ETHBTC" ? this.props.myBTCAmount : this.props.selectedPair === "AVAXUSDT" ? this.props.myUSDTAmount : 0}
                                displayPrefixText={"Your balance: "}
                            ></BalanceAmount>

                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg={3} md={12}>
                        Borrowing Capacity:
                    </Col>
                    <Col lg={9} md={12}>
                        <Row className="justify-content-end borrow-power">
                            <Col xs={"auto"} className={"borrow-power__option"}>
                                <Button className="borrow-power-button"
                                    onClick={() => {
                                        this.setState({ inputBtcBorrow: isNaN(borrowPower) === true ? 0 : (borrowPower * 0.25).toFixed(8) });
                                        this.props.dispatch(changeInputBtcDebt((borrowPower * 0.25).toFixed(8)));
                                    }}>25%</Button>
                            </Col>
                            <Col xs={"auto"} className={"borrow-power__option"}>
                                <Button className="borrow-power-button"
                                    onClick={() => {
                                        this.setState({ inputBtcBorrow: isNaN(borrowPower) === true ? 0 : (borrowPower * 0.5).toFixed(8) });
                                        this.props.dispatch(changeInputBtcDebt((borrowPower * 0.5).toFixed(8)));
                                    }}>50%</Button>
                            </Col>
                            <Col xs={"auto"} className={"borrow-power__option"}>
                                <Button className="borrow-power-button"
                                    onClick={() => {
                                        this.setState({ inputBtcBorrow: isNaN(borrowPower) === true ? 0 : (borrowPower * 0.75).toFixed(8) });
                                        this.props.dispatch(changeInputBtcDebt((borrowPower * 0.75).toFixed(8)));
                                    }}>75%</Button>
                            </Col>
                            <Col xs={"auto"} className={"borrow-power__option"}>
                                <Button className="borrow-power-button"
                                    onClick={() => {
                                        this.setState({ inputBtcBorrow: isNaN(borrowPower) === true ? 0 : (borrowPower * 0.9).toFixed(8) });
                                        this.props.dispatch(changeInputBtcDebt((borrowPower * 0.9).toFixed(8)));
                                    }}>90%</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{ marginBottom: 9, marginTop: 20 }}>
                    <Col lg={12} className={s.root}>
                        <Button disabled={!this.props.myFujiVaultETHBTC || !(this.state.inputEthDeposit > 0)} block className={'manage-button'}
                            onClick={this.props.selectedPair === "ETHBTC" ? this.depositWETHAndBorrowWBTC : this.props.selectedPair === "AVAXUSDT" ? this.depositAVAXAndBorrowUSDT : null} >
                            {
                                this.props.selectedPair === "ETHBTC" ? 'Borrow BTC using ETH as collateral' :
                                    this.props.selectedPair === "AVAXUSDT" ? 'Borrow USDT using AVAX as collateral' : ''
                            }
                        </Button>
                    </Col>
                </Row>

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
                                <div className="content" dangerouslySetInnerHTML={{ __html: this.state.modalMessage }}></div>
                            </Col>
                            <Col style={{ display: 'none' }} sm={12}>
                                <Input disabled className={`amount-text`}
                                    style={{ backgroundColor: 'transparent', color: '#ffffff' }}
                                    value={Number(this.state.modalInputValue)}>
                                </Input> {this.state.modalToken}
                            </Col>
                            <Col style={{ paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px' }} sm={12}>
                                <Button block color={'light'} style={{ padding: '5px', color: '#000000' }}
                                    onClick={this.state.modalCall ? this.state.modalCall : this.toggle}>
                                    {this.state.modalCall ? 'Confirm' : 'Close'}
                                </Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
            </>
        )
    }
};



function mapStateToProps(store) {
    return {
        myAccount: store.loanshark.myAccount,
        selectedPair: store.loanshark.selectedPair,
        numberOfEth: store.loanshark.numberOfEth,
        numberOfAvax: store.loanshark.numberOfAvax,
        userDepositBalanceEth: store.loanshark.userDepositBalanceEth,
        userDepositBalanceAvax: store.loanshark.userDepositBalanceAvax,
        userDebtBalanceBtc: store.loanshark.userDebtBalanceBtc,
        userDebtBalanceUsdt: store.loanshark.userDebtBalanceUsdt,
        myFujiVaultETHBTC: store.loanshark.myFujiVaultETHBTC,
        myFujiVaultAVAXUSDT: store.loanshark.myFujiVaultAVAXUSDT,
        myFliquidatorAVAX: store.loanshark.myFliquidatorAVAX,
        myFujiController: store.loanshark.myFujiController,
        myFujiOracle: store.loanshark.myFujiOracle,
        myETHContract: store.loanshark.myETHContract,
        myBTCContract: store.loanshark.myBTCContract,
        myUSDTContract: store.loanshark.myUSDTContract,
        inputBtcDept: store.loanshark.inputBtcDept,
        inputEthDeposit: store.loanshark.inputEthDeposit,
        priceOfEth: store.loanshark.priceOfEth,
        priceOfBtc: store.loanshark.priceOfBtc,
        priceOfAvax: store.loanshark.priceOfAvax,
        priceOfUsdt: store.loanshark.priceOfUsdt,
        myETHAmount: store.loanshark.myETHAmount,
        myBTCAmount: store.loanshark.myBTCAmount,
        myAVAXAmount: store.loanshark.myAVAXAmount,
        myUSDTAmount: store.loanshark.myUSDTAmount,
        LTV: store.loanshark.LTV,
        liquidationPrice: store.loanshark.liquidationPrice,
        
        myBtcLpAmount: store.backd.myBtcLpAmount,
        totalBtcLpAmount: store.backd.totalBtcLpAmount,
        topupAction: store.backd.topupAction,
        btcLpExchangeRate: store.backd.btcLpExchangeRate
    };
}

export default connect(mapStateToProps)(Trade);