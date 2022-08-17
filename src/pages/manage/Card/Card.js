import React from "react";
import { connect } from "react-redux";
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import {
    Input,
    Button,
    ButtonGroup
} from 'reactstrap';

import './Card.scss'
import Widget from '../../../components/Widget';

class Card extends React.Component {
    static propTypes = {
        widgetSize: PropTypes.oneOf(["full", "left", "right"]),
        title: PropTypes.string,
        extraHtmlContent: PropTypes.string,
        leftSelectButton: PropTypes.string,
        rightSelectButton: PropTypes.string,
        currency: PropTypes.string,
        currencyIconPath: PropTypes.string,
        openBorrowingPower: PropTypes.bool,
        bottomButtonTitle: PropTypes.string,
        onClickDeposit: PropTypes.func,
        onClickWithdraw: PropTypes.func,
        action: PropTypes.string,
        onClickSelect: PropTypes.func,
        onChangeInput: PropTypes.func,
        amount: PropTypes.number,
        maxBalance: PropTypes.number,
        onClickMax: PropTypes.func,
        onClickBorrowingPowerChange: PropTypes.func,
        onClickDepositChange: PropTypes.func,
        onClickBorrow: PropTypes.func,
        onClickPayback: PropTypes.func,
    };

    static defaultProps = {
        widgetSize: "full",
        title: "",
        extraHtmlContent: "",
        leftSelectButton: "",
        rightSelectButton: "",
        currency: "",
        currencyIconPath: "",
        openBorrowingPower: false,
        bottomButtonTitle: "",
        onClickDeposit: () => { },
        onClickWithdraw: () => { },
        action: "",
        onClickSelect: () => { },
        onChangeInput: () => { },
        amount: 0,
        maxBalance: 0,
        onClickMax: () => { },
        onClickBorrowingPowerChange: () => { },
        onClickDepositChange: () => { },
        onClickBorrow: () => { },
        onClickPayback: () => { },
    };

    constructor(props) {
        super(props);
        this.state = {
            leftSelect: true,
            rightSelect: false,
            title: "Collateral",
            leftSelectTitle: "Collateral",
            rightSelectTitle: "",
            amount: 0.00,
            balanceAmount: 30.00,
            openBorrowingPower: false,
            bottomButtonTitle: "Deposit",
            iconPath: `/assets/icon/${this.props.currency}-logo.svg`,
            smartVaultView: (this.props.title === "Current Smart Vault Balance"? true: false)
        };
    }

    switchPairButton(param) {
        switch (param) {
            case "Debt":
            case "Collateral":
                return (
                    <>
                        <Grid item xs={6}>
                            <div>
                                <Button
                                    className={`customButton${this.props.action === this.props.leftSelectButton ? `__select` : ``} pairButton__left`}
                                    style={{ textTransform: "capitalize" }}
                                    name={this.props.leftSelectButton}
                                    onClick={this.props.onClickSelect}
                                >{this.props.leftSelectButton}</Button>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div>
                                <Button
                                    className={`customButton${this.props.action === this.props.rightSelectButton ? `__select` : ``} pairButton__right`}
                                    style={{ textTransform: "capitalize" }}
                                    name={this.props.rightSelectButton}
                                    onClick={this.props.onClickSelect}
                                >{this.props.rightSelectButton}</Button>
                            </div>
                        </Grid>
                    </>
                )
            case "Current Smart Vault Balance":
                return (
                    <>
                        <br></br>
                        <br></br>
                        <br></br>
                    </>)
            default:
                return (<></>)
        }
    }

    switchBottomButton(param, action) {
        switch (param) {
            case "Collateral":
                return (<>
                    <Grid item xs={12}>
                        <Grid container spacing={1} style={{ paddingTop: "5%" }}>
                            <Grid item>
                                <span style={{fontSize: '12px'}}>{action === "deposit" ? "Deposit By Percentage" : "Withdraw By Percentage"}: </span>
                                <ButtonGroup aria-label="Borrowing Power" size="xs">
                                    <Button className={"borrow-power-button"} size="xs"
                                        name={25}
                                        onClick={this.props.onClickDepositChange}
                                    >25%</Button>
                                    <Button className={"borrow-power-button"} size="xs"
                                        name={50}
                                        onClick={this.props.onClickDepositChange}
                                    >50%</Button>
                                    <Button className={"borrow-power-button"} size="xs"
                                        name={75}
                                        onClick={this.props.onClickDepositChange}
                                    >75%</Button>
                                    <Button className={"borrow-power-button"} size="xs"
                                    name={90}
                                    onClick={this.props.onClickDepositChange}
                                    >90%</Button>
                                    <Button className={"borrow-power-button"} size="xs"
                                    name={100}
                                    onClick={this.props.onClickDepositChange}
                                    >Max</Button>
                                 </ButtonGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Grid item xs={12}>
                        <Button style={{textTransform: 'capitalize'}} className={"deposit-button"}
                            onClick={() => {
                                switch (action) {
                                    case "deposit":
                                        this.props.onClickDeposit()
                                        break;
                                    case "withdraw":
                                        this.props.onClickWithdraw()
                                        break;
                                    default:
                                }
                            }}
                        >{action}</Button>
                    </Grid>
                </>)
            case "Debt":
                return (<>
                    <Grid item xs={12}>
                        <Grid container spacing={1} style={{ paddingTop: "5%" }}>
                            <Grid item>
                                <span style={{fontSize: '12px'}}>{action === "borrow" ? "Borrowing Power" : "Payback By Percentage"}: </span>
                                <ButtonGroup aria-label="Borrowing Power" size="xs">
                                    <Button className={"borrow-power-button"} size="xs"
                                        name={25}
                                        onClick={this.props.onClickBorrowingPowerChange}
                                    >25%</Button>
                                    <Button className={"borrow-power-button"} size="xs"
                                        name={50}
                                        onClick={this.props.onClickBorrowingPowerChange}
                                    >50%</Button>
                                    <Button className={"borrow-power-button"} size="xs"
                                        name={75}
                                        onClick={this.props.onClickBorrowingPowerChange}
                                    >75%</Button>
                                    <Button className={"borrow-power-button"} size="xs"
                                    name={90}
                                    onClick={this.props.onClickBorrowingPowerChange}
                                    >90%</Button>
                                    <Button className={"borrow-power-button"} size="xs"
                                    name={ this.props.action === "borrow" ? 95 : 100 }
                                    onClick={this.props.onClickBorrowingPowerChange}
                                    >{ this.props.action === "borrow" ? "95%" : "Max"}</Button>
                                 </ButtonGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Grid item xs={12}>
                        <Button style={{textTransform: 'capitalize'}} className={"deposit-button"} onClick={() => {
                            switch (action) {
                                case "borrow":
                                    this.props.onClickBorrow()
                                    break;
                                case "payback":
                                    this.props.onClickPayback()
                                    break;
                                default:
                            }
                        }}
                        >{action}</Button>
                    </Grid>
                </>)
            case "Current Smart Vault Balance":
                return (<>
                    <Grid item xs={12}>
                        <Button className={"delete-button"}
                         onClick={() => {
                           this.props.onClickWithdraw()
                        }}
                        >Withdraw All From Smart Vault</Button>
                    </Grid>
                </>)
            default:
                return (<></>)
        }
    }

    render() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Widget
                        title={<p style={{ fontWeight: 700 }}>{this.props.title}</p>}
                        customDropDown={false}
                        widgetSize={this.props.widgetSize}
                    >
                        <Grid container>
                            {this.switchPairButton(this.props.title)}
                            <br></br>
                            <br></br>
                            <br></br>
                            <Grid item xs={12}>
                                <div style={{
                                    // width:"100%",
                                    borderRadius: "10px 10px 10px 10px",
                                    border: "1px solid white",
                                }}
                                >
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <div style={{
                                                padding: "5px 12px",
                                            }}>
                                                <Grid container>
                                                    <Grid style={{display: "flex", flexDirection: "column", justifyContent: "center"}} item xs={7}>
                                                        <Input
                                                            className={`amount-text`}
                                                            title="Input"
                                                            disabled={this.state.smartVaultView}
                                                            // placeholder="Enter deposit amount..."
                                                            value={this.props.amount}
                                                            onChange={this.props.onChangeInput}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={12} style={{ textAlign: "end" }}>
                                                                <Grid container justifyContent={"end"} alignItems={"center"} spacing={1}>
                                                                    <Grid item>
                                                                        <label
                                                                            style={{
                                                                                border: "1px solid white",
                                                                                borderRadius: "10px",
                                                                                backgroundColor: "white",
                                                                                padding: "3px 10px"
                                                                            }}
                                                                        > 
                                                                            <img className="icon"
                                                                                src={this.props.currencyIconPath}
                                                                                // src={this.state.iconPath}
                                                                                alt="x"></img>
                                                                                {'    '}
                                                                            <span style={{ color: "black", fontSize: "14px", fontWeight: "bold", }}>{this.props.currency.toUpperCase()}</span>
                                                                        </label>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} style={{
                                                            textAlign: "end",
                                                            // padding: "5px",
                                                        }}>
                                                        <div  hidden={this.state.smartVaultView}>
                                                            <span style={{
                                                                fontSize: "14px",
                                                                fontWeight: "bold",
                                                            }}>{
                                                                this.props.action === "borrow" ? "Max borrow" : 
                                                                this.props.action === "payback" ? "Max Payback": 
                                                                this.props.action === "deposit" ? "Balance" : 
                                                                this.props.action === "withdraw" ? "Balance" : ""} : {`${this.props.maxBalance}`}</span>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className="content" dangerouslySetInnerHTML={{ __html: this.props.extraHtmlContent }}></div>
                            </Grid>
                            <br></br>
                            <br></br>
                            {this.switchBottomButton(this.props.title, this.props.action)}
                        </Grid>
                    </Widget>
                </Grid>
            </Grid>
        );
    }
}

function mapStateToProps(store) {
    return {
        myAccount: store.loanshark.myAccount,
        selectedPair: store.loanshark.selectedPair,
        numberOfEth: store.loanshark.numberOfEth,
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
        inputBtcDept: store.loanshark.inputBtcDept,
        inputEthDeposit: store.loanshark.inputEthDeposit,
        LTV: store.loanshark.LTV,
    };
}

export default connect(mapStateToProps)(Card);


