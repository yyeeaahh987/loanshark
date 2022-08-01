import React from "react";
import { connect } from "react-redux";
import {
    Row,
    Col
} from "reactstrap";
import "./trade.less";
import "./trade.scss"

class TradeInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var borrowPower = (
            this.props.inputEthDeposit
            * (this.props.selectedPair === "ETHBTC" ? this.props.priceOfEth : this.props.priceOfAvax)
            * this.props.LTV[this.props.selectedPair]
            * this.props.liquidationPrice[this.props.selectedPair]
            / (this.props.selectedPair === "ETHBTC" ? this.props.priceOfBtc : this.props.priceOfUsdt)
        ).toFixed(2);

        return (
            <>
                <Row style={{ marginBottom: 0, marginTop: 0 }}>
                    <Col lg={6}>
                        Current Price of {this.props.selectedPair === "ETHBTC" ? "ETH" : "AVAX"}:
                    </Col>
                    <Col lg={6} style={{ textAlign: 'right' }} >
                        {(this.props.selectedPair === "ETHBTC" ? this.props.priceOfEth : this.props.priceOfAvax) / 100}
                    </Col>
                </Row>
                <Row style={{ marginBottom: 0, marginTop: 0 }}>
                    <Col lg={6}>
                        Current Price of {this.props.selectedPair === "ETHBTC" ? "BTC" : "USDT"}:
                    </Col>
                    <Col lg={6} style={{ textAlign: 'right' }} >
                        {(this.props.selectedPair === "ETHBTC" ? this.props.priceOfBtc : this.props.priceOfUsdt) / 100}
                    </Col>
                </Row>
                <Row style={{ marginBottom: 9, marginTop: 20 }}>

                </Row>
                <Row style={{ marginBottom: 0, marginTop: 0 }}>
                    <Col lg={6}>
                        LTV:
                    </Col>
                    <Col lg={6} style={{ textAlign: 'right' }} >
                        {(this.props.LTV[this.props.selectedPair] * this.props.liquidationPrice[this.props.selectedPair] * 100).toFixed(2)} %
                    </Col>
                </Row>
                <Row style={{ marginBottom: 0, marginTop: 0 }}>
                    <Col lg={6}>
                        Max Borrow Power:
                    </Col>
                    <Col lg={6} style={{ textAlign: 'right' }} >
                        {isNaN(borrowPower) == true ? 0 : borrowPower} {this.props.selectedPair === "ETHBTC" ? "BTC" : "USDT"}
                    </Col>
                </Row>

                <Row style={{ marginBottom: 0, marginTop: 0 }}>
                    <Col lg={6}>
                        Liquidity Threshold:
                    </Col>
                    <Col lg={6} style={{ textAlign: 'right' }} >
                        {(this.props.LTV[this.props.selectedPair] * 100).toFixed(2)} %
                    </Col>
                </Row>
                <Row style={{ marginBottom: 0, marginTop: 0 }}>
                    <Col lg={8}>
                        Liquidation Price of {this.props.selectedPair === "ETHBTC" ? "ETH" : "AVAX"}:
                    </Col>
                    <Col lg={4} style={{ textAlign: 'right' }}>
                        {
                            (isNaN((this.props.inputBtcDept * (this.props.selectedPair === "ETHBTC" ? this.props.priceOfBtc : this.props.priceOfUsdt) / 100)
                                / this.props.inputEthDeposit
                                / this.props.LTV[this.props.selectedPair]) == true ? 0 : (this.props.inputBtcDept * (this.props.selectedPair === "ETHBTC" ? this.props.priceOfBtc : this.props.priceOfUsdt) / 100)
                                / this.props.inputEthDeposit
                            / this.props.LTV[this.props.selectedPair]).toFixed(2)
                        }
                    </Col>
                </Row>
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
        userDepositBalance: store.loanshark.userDepositBalance,
        userDebtBalance: store.loanshark.userDebtBalance,
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
        liquidationPrice: store.loanshark.liquidationPrice
    };
}

export default connect(mapStateToProps)(TradeInfo);