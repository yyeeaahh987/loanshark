import React from "react";
import { connect } from "react-redux";
import 'chart.js/auto';
import {
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
} from 'react-bootstrap';
import {
  Row,
  Col,
  Button,
  Input,
  // Dropdown,
  DropdownToggle,
  ButtonDropdown,
  // InputGroup,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
  Badge,
} from "reactstrap";
import { MDBContainer } from "mdbreact";
import { Doughnut } from "react-chartjs-2";

import Widget from "../../components/Widget";
import Trade from "../../components/Trade";
import TradeInfo from "../../components/TradeInfo";
import s from "./Tables.modules.scss";

class Tables extends React.Component {

  state = {
    initEchartsOptions: {
      renderer: 'canvas'
    }
  }

  parseDate(date) {
    this.dateSet = date.toDateString().split(" ");

    return `${date.toLocaleString("en-us", { month: "long" })} ${this.dateSet[2]
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
      <div 
      className={s.root}
      >
        <Row>
          <Col xl={7} lg={7}>
            <Widget
              title={
                <p style={{ fontWeight: 700 }}>
                  Deposit {this.props.selectedPair === "ETHBTC"? " ETH" : this.props.selectedPair === "AVAXUSDT"? " AVAX" : ""} and 
                  Borrow {this.props.selectedPair === "ETHBTC"? " BTC" : this.props.selectedPair === "AVAXUSDT"? " USDT" : ""}<br/>
                    <span style={{color: "#0000000", fontSize: "16px"}}>
                      {this.props.selectedPair === "ETHBTC" ? this.props.numberOfEth : this.props.selectedPair === "AVAXUSDT" ? this.props.numberOfAvax : ""}  
                      {this.props.selectedPair === "ETHBTC"? " ETH" : this.props.selectedPair === "AVAXUSDT"? " AVAX" : ""} as collateral to borrow 1 
                      {this.props.selectedPair === "ETHBTC"? " BTC" : this.props.selectedPair === "AVAXUSDT"? " USDT" : ""}</span>
                </p>
              }
              customDropDown
            >
              <Trade />
            </Widget>
          </Col>

          <Col xl={5} lg={5}>
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
            <Widget title={' '}>
              <TradeInfo />
            </Widget>
            <Widget title={<p style={{ fontWeight: 700 }}>Borrowing APY of {this.props.selectedPair === "ETHBTC"? "BTC":"USDT"}</p>}>
                <Row>
                  <Col>
                    <span style={{ color: "#00ff00" }}>AAVE</span>
                  </Col>
                  <Col lg={6} style={{ textAlign: 'right' }} >
                    <span style={{ color: "#00ff00" }}>1.4%</span>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Tranquil
                  </Col>
                  <Col lg={6} style={{ textAlign: 'right' }} >
                    2.0%
                  </Col>
                </Row>
            </Widget>
          </Col>
          <Col xl={0} lg={0}></Col>
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

export default connect(mapStateToProps)(Tables);
