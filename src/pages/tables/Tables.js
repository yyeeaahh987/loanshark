import React from "react";
import { connect } from "react-redux";
import 'chart.js/auto';
import {
  Row,
  Col,
} from "reactstrap";
import { MDBContainer } from "mdbreact";
import { Pie } from "react-chartjs-2";

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
          <Col lg={7}>
            <Widget
              title={<p style={{ fontWeight: 700 }}>Deposit ETH and Borrow BTC<br/>
                  <h6 style={{color: "#0000000"}}>{this.props.numberOfEth.toFixed(2)} ETH as collateral to borrow 1 BTC, including safety factors</h6></p>
              }
              customDropDown
            >
              <Trade/>
            </Widget>
          </Col>
          <Col lg={5}>
            <Widget
              title={<p style={{ fontWeight: 700 }}>Deposited and Borrowed</p>
              }
              customDropDown
            >
              <MDBContainer>
                <Pie data={{
                    labels: ["ETH $", "BTC $"],
                    datasets: [
                      {
                        data: [this.props.userDepositBalance * this.props.priceOfEth / 100, this.props.userDebtBalance * this.props.priceOfBtc / 100],
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
                  }} options={{ responsive: true }} />
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
    numberOfEth: store.loanshark.numberOfEth,
    userDepositBalance: store.loanshark.userDepositBalance,
    userDebtBalance: store.loanshark.userDebtBalance,
    priceOfEth: store.loanshark.priceOfEth,
    priceOfBtc: store.loanshark.priceOfBtc,
  };
}

export default connect(mapStateToProps)(Tables);
