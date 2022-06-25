import React from "react";
import { connect } from "react-redux";
import 'chart.js/auto';
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Badge,
} from "reactstrap";
import { MDBContainer } from "mdbreact";
import { Doughnut } from "react-chartjs-2";

import Widget from "../../components/Widget";
import Trade from "../../components/Trade";
import s from "./Tables.modules.scss";

class Tables extends React.Component {

  state = {
    initEchartsOptions: {
      renderer: 'canvas'
    }
  }

  parseDate(date) {
    this.dateSet = date.toDateString().split(" ");

    return `${date.toLocaleString("en-us", { month: "long" })} ${
      this.dateSet[2]
    }, ${this.dateSet[3]}`;
  }

  checkAll(ev, checkbox) {
    const checkboxArr = new Array(this.state[checkbox].length).fill(
      ev.target.checked
    );
    this.setState({
      [checkbox]: checkboxArr
    });
  }

  changeCheck(ev, checkbox, id) {
    //eslint-disable-next-line
    this.state[checkbox][id] = ev.target.checked;
    if (!ev.target.checked) {
      //eslint-disable-next-line
      this.state[checkbox][0] = false;
    }
    this.setState({
      [checkbox]: this.state[checkbox]
    });
  }

  render() {
    return (
      <div className={s.root}>
        <Row>
          <Col lg={6}>
            <Widget
              title={
                <p style={{ fontWeight: 700 }}>
                  Deposit {this.props.selectedPair === "ETHBTC"? " ETH" : this.props.selectedPair === "AVAXUSDT"? " AVAX" : ""} and 
                  Borrow {this.props.selectedPair === "ETHBTC"? " BTC" : this.props.selectedPair === "AVAXUSDT"? " USDT" : ""}<br/>
                    <span style={{color: "#0000000", fontSize: "16px"}}>
                      {this.props.selectedPair === "ETHBTC" ? this.props.numberOfEth.toFixed(2) : this.props.selectedPair === "AVAXUSDT" ? this.props.numberOfAvax.toFixed(2) : ""}  
                      {this.props.selectedPair === "ETHBTC"? " ETH" : this.props.selectedPair === "AVAXUSDT"? " AVAX" : ""} as collateral to borrow 1 
                      {this.props.selectedPair === "ETHBTC"? " BTC" : this.props.selectedPair === "AVAXUSDT"? " USDT" : ""}</span>
                </p>
              }
              customDropDown
            >
              <Trade/>
            </Widget>
            <ListGroup>
              <h6 style={{color: '#ffffff'}}>Borrowing APY of BTC</h6><br/>
              <ListGroupItem active className="justify-content-between">
                AAVE{' '}
                <Badge  color="warning" pill>
                  1.4%
                </Badge>
                <span style={{paddingLeft: "15px"}}>{' '}Current Loan Provider</span>
              </ListGroupItem>
              <ListGroupItem active className="justify-content-between">
                BenQi{' '}
                <Badge pill>
                  2.0%
                </Badge>
              </ListGroupItem>
              <ListGroupItem active className="justify-content-between">
                TraderJoe{' '}
                <Badge pill>
                  3.1%
                </Badge>
              </ListGroupItem>
            </ListGroup>
          </Col>
          
          <Col lg={6}>
            <Widget
              title={<p style={{ fontWeight: 700 }}>Deposited, Borrowed and Health Factor</p>
              }
              customDropDown
            >
              <MDBContainer>
                <Doughnut data={{
                    labels: ["ETH $", "BTC $"],
                    datasets: [
                      {
                        data: [
                          (Number(this.props.userDepositBalance) + Number(this.props.inputEthDeposit)) 
                          * (this.props.selectedPair === "ETHBTC"? this.props.priceOfEth : this.props.selectedPair === "AVAXUSDT"? this.props.priceOfAvax : 0) / 100, 
                          (Number(this.props.userDebtBalance) + Number(this.props.inputBtcDept)) 
                          * (this.props.selectedPair === "ETHBTC"? this.props.priceOfBtc : this.props.selectedPair === "AVAXUSDT"? this.props.priceOfUsdt : 0) / 100
                        ],
                        backgroundColor: [
                          "#25859B",
                          "#FFBF69",
                        ],
                        hoverBackgroundColor: [
                          "#25859B",
                          "#FFBF69",
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
                         var text = (!(Number(this.props.userDebtBalance) + Number(this.props.inputBtcDept)) > 0? "" : 
                         (
                            ((Number(this.props.userDepositBalance) + Number(this.props.inputEthDeposit)) 
                            * (this.props.selectedPair === "ETHBTC"? this.props.priceOfEth : this.props.selectedPair === "AVAXUSDT"? this.props.priceOfAvax : 0) / 100) 
                            / 
                            ((Number(this.props.userDebtBalance) + Number(this.props.inputBtcDept)) 
                            * (this.props.selectedPair === "ETHBTC"? this.props.priceOfBtc : this.props.selectedPair === "AVAXUSDT"? this.props.priceOfUsdt : 0) / 100)
                         ).toFixed(2)),
                         textX = Math.round((width - ctx.measureText(text).width) / 2),
                         textY = height / 2;
                         ctx.fillText(text, textX, textY);
                         ctx.save();
                    } 
                  }]}
                  options={{ responsive: true }} />
              </MDBContainer>
            </Widget>
          </Col>
        </Row>
      </div>
    );
  }
}


function mapStateToProps(store) {
  return {
    selectedPair: store.loanshark.selectedPair,
    numberOfEth: store.loanshark.numberOfEth,
    numberOfAvax: store.loanshark.numberOfAvax,
    userDepositBalance: store.loanshark.userDepositBalance,
    userDebtBalance: store.loanshark.userDebtBalance,
    priceOfEth: store.loanshark.priceOfEth,
    priceOfBtc: store.loanshark.priceOfBtc,
    priceOfUsdt: store.loanshark.priceOfUsdt,
    priceOfAvax: store.loanshark.priceOfAvax,
    inputBtcDept: store.loanshark.inputBtcDept,
    inputEthDeposit: store.loanshark.inputEthDeposit,
  };
}

export default connect(mapStateToProps)(Tables);
