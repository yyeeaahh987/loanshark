import React from "react";
import { connect } from "react-redux";
import 'chart.js/auto';
import { MDBContainer } from "mdbreact";
import { Doughnut } from "react-chartjs-2";

import Widget from "../../components/Widget";

class HealthFactorPieChart extends React.Component {
  render() {
    return (
      <Widget
          title={<p style={{ fontWeight: 700 }}>Deposited, Borrowed and Health Factor</p>
          }
          customDropDown
      >
          <div style={{marginLeft: "25%", marginRight: "25%"}}>
          <MDBContainer>
          <Doughnut width={10} data={{
              labels: [this.props.selectedPair === "ETHBTC"? "ETH $":"AVAX $", this.props.selectedPair === "ETHBTC"?"BTC $":"USDT $s"],
              datasets: [
                  {
                  data: [
                      (
                      (this.props.selectedPair === "ETHBTC"? Number(this.props.userDepositBalanceEth) :  Number(this.props.userDepositBalanceAvax))
                      + Number(this.props.inputEthDeposit)
                      ) 
                      * (this.props.selectedPair === "ETHBTC"? this.props.priceOfEth : this.props.selectedPair === "AVAXUSDT"? this.props.priceOfAvax : 0) / 100, 
                      (
                      (this.props.selectedPair === "ETHBTC"? Number(this.props.userDebtBalanceBtc) :  Number(this.props.userDebtBalanceUsdt))
                      + Number(this.props.inputBtcDept)
                      ) 
                      * (this.props.selectedPair === "ETHBTC"? this.props.priceOfBtc : this.props.selectedPair === "AVAXUSDT"? this.props.priceOfUsdt : 0) / 100
                  ],
                  backgroundColor: [
                      "#5CD68A",
                      "#5C83D6",
                  ],
                  hoverBackgroundColor: [
                      "#5CD68A",
                      "#5C83D6",
                  ]
                  }
              ]
              }} 
              plugins={[{
              beforeDraw: (chart) => {
                  var width = chart.width,
                      height = chart.height,
                      ctx = chart.ctx;
                      ctx.restore();
                      var fontSize = (height / 200).toFixed(2);
                      ctx.font = fontSize + "em sans-serif";
                      ctx.fillStyle = "#fff";
                      ctx.textBaseline = "top";
                      var text = (!(
                      (this.props.selectedPair === "ETHBTC"? Number(this.props.userDebtBalanceBtc) :  Number(this.props.userDebtBalanceUsdt))
                      + Number(this.props.inputBtcDept)
                      ) > 0? "" : 
                      (
                      (
                          (
                          (this.props.selectedPair === "ETHBTC"? Number(this.props.userDepositBalanceEth) :  Number(this.props.userDepositBalanceAvax))
                          + Number(this.props.inputEthDeposit)
                          ) 
                      * (this.props.selectedPair === "ETHBTC"? this.props.priceOfEth : this.props.selectedPair === "AVAXUSDT"? this.props.priceOfAvax : 0) / 100) 
                      * this.props.LTV[this.props.selectedPair]
                      / 
                      (
                          (
                          (this.props.selectedPair === "ETHBTC"? Number(this.props.userDebtBalanceBtc) :  Number(this.props.userDebtBalanceUsdt))
                          + Number(this.props.inputBtcDept)
                          ) 
                      * (this.props.selectedPair === "ETHBTC"? this.props.priceOfBtc : this.props.selectedPair === "AVAXUSDT"? this.props.priceOfUsdt : 0) / 100)
                      ).toFixed(2)),
                      textX = Math.round((width - ctx.measureText(text).width) / 2),
                      textY = height / 2 + 5;
                      ctx.fillText(text, textX, textY);
                      ctx.save();
              } 
              }]}
              options={{ responsive: true }} />
          </MDBContainer>
          </div>
      </Widget>
   ) 
  }
};

function mapStateToProps(store) {
  return {
    selectedPair: store.loanshark.selectedPair,
    numberOfEth: store.loanshark.numberOfEth,
    numberOfAvax: store.loanshark.numberOfAvax,
    userDepositBalanceEth: store.loanshark.userDepositBalanceEth,
    userDepositBalanceAvax: store.loanshark.userDepositBalanceAvax,
    userDebtBalanceBtc: store.loanshark.userDebtBalanceBtc,
    userDebtBalanceUsdt: store.loanshark.userDebtBalanceUsdt,
    priceOfEth: store.loanshark.priceOfEth,
    priceOfBtc: store.loanshark.priceOfBtc,
    priceOfUsdt: store.loanshark.priceOfUsdt,
    priceOfAvax: store.loanshark.priceOfAvax,
    inputBtcDept: store.loanshark.inputBtcDept,
    inputEthDeposit: store.loanshark.inputEthDeposit,
    LTV: store.loanshark.LTV,
  };
}

export default connect(mapStateToProps)(HealthFactorPieChart);
