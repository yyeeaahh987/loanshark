import React from "react";
import { connect } from "react-redux";

import { Row, Col, Button, Input, DropdownToggle, ButtonDropdown, InputGroup, DropdownMenu, DropdownItem } from "reactstrap";
import "./trade.less";
import s from "../../pages/tables/Tables.modules.scss";

import {
    toggleLoading,
  } from "../../actions/navigation";
  
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
            inputBtcBorrow: 0
        };
    }

    calltoggleLoading() {
        this.props.dispatch(toggleLoading());
    }
    
    setInputEthDeposit(event) {
        this.setState({inputEthDeposit: event.target.value});
    }

    setInputBtcBorrow(event) {
        this.setState({inputBtcBorrow: event.target.value});
    }

    depositAndBorrow () {
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
                .send({from: this.props.myAccount})
                .on("error", (error, receipt) => {
                    this.calltoggleLoading();
                })
                .then((receipt) => {
                    this.props.myFujiVaultETHBTC.methods
                    .depositAndBorrow(...args)
                    .send({from: this.props.myAccount})
                    .on("error", (error, receipt) => {
                        this.calltoggleLoading();
                    })
                    .then((receipt) => {
                        this.calltoggleLoading();
                        API(this.props);
                    });
                });
        }
    }

    render () {
        return (
            <>
                <Row style={{ marginBottom: 9, marginTop: 1 }}>
                    <Col lg={12}>
                    <div  style={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "column",
                            alignItems: "center"
                        }}>
                                <InputGroup >
                                    <ButtonDropdown
                                        toggle={function noRefCheck(){}}
                                    >
                                        <DropdownToggle outlines color="info">
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
                                </InputGroup>

                            <Button outline  className="primary">
                                ⇅
                            </Button>

                                <InputGroup style={{width: "100%"}}  >
                                    <ButtonDropdown
                                        toggle={function noRefCheck(){}}
                                    >
                                        <DropdownToggle outlines color="warning">
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
                                </InputGroup>

                        </div>
                    </Col>
                </Row>

                <Row style={{ marginBottom: 9, marginTop:20 }}>
                    <Col lg={12} className={s.root}>
                        <Button color="success" style={{width: "100%"}} onClick={this.depositAndBorrow} >
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
      numberOfEth:  store.loanshark.userDebtBalance,
      userDepositBalance: store.loanshark.userDepositBalance,
      userDebtBalance:  store.loanshark.userDebtBalance,
      myFujiVaultETHBTC: store.loanshark.myFujiVaultETHBTC,
      myFliquidatorAVAX: store.loanshark.myFliquidatorAVAX,
      myFujiController: store.loanshark.myFujiController,
      myFujiOracle: store.loanshark.myFujiOracle,
      myETHContract: store.loanshark.myETHContract,
      myBTCContract:  store.loanshark.myBTCContract
    };
  }

export default connect(mapStateToProps)(Trade);
