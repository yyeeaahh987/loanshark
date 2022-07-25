import React from "react";
import { connect } from "react-redux";

import {
  Row, Col, 
  Input,
  Button,
} from 'reactstrap';

import {
  toggleLoading,
} from "../../actions/navigation";

import API from '../../utils/API'
import Widget from "../../components/Widget/Widget";
import { Radio } from "../../components/Radio/Radio";

class SmartVault3 extends React.Component {
  constructor() {
    super();
    this.setSelected = this.setSelected.bind(this);
    this.stakeToVault = this.stakeToVault.bind(this);
    this.calltoggleLoading = this.calltoggleLoading.bind(this);
    this.setStakeAmount = this.setStakeAmount.bind(this);
    this.state = {
      selected: 'repay',
      stakeAmount: 0
    }
  }
  
  calltoggleLoading() {
    this.props.dispatch(toggleLoading());
  }

  setSelected(value) {
    this.setState({selected: value});
  }

  setStakeAmount(event) {
    this.setState({ stakeAmount: event.target.value });
  }

  stakeToVault() {
    let approveArgs = [
      this.props.lpPoolBtc.options.address,
      window.web3.utils.toBN((this.state.stakeAmount * 100000000).toFixed(0)).toString()
    ]

    let args = [
      window.web3.utils.toBN((this.state.stakeAmount * 100000000).toFixed(0)).toString(),
    ];

    let argsRegister = [
      "0xe71fa402007fad17da769d1bbefa6d0790fce2c7000000000000000000000000",
      "0x66756a6964616f00000000000000000000000000000000000000000000000000",
      window.web3.utils.toBN((this.state.stakeAmount * 100000000).toFixed(0)).toString(),  
      [
        "1200000000000000000",
        "0",
        "10000000000",
        "0x9c1dcacb57ada1e9e2d3a8280b7cfc7eb936186f",
        "0x9f2b4eeb926d8de19289e93cbf524b6522397b05",
        "1",
        "1",
        "0",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
    ];

    this.props.myBTCContract.methods
    .approve(...approveArgs)
    .send({from: this.props.myAccount})
    .on("error", (error, receipt) => {
      this.calltoggleLoading();
    })
    .then((receipt) => {
      this.props.lpPoolBtc.methods
      .deposit(...args)
      .send({from: this.props.myAccount})
      .on("error", (error, receipt) => {
        this.calltoggleLoading();
      })
      .then((receipt) => {
        this.props.topupAction.methods
        .register(...argsRegister)
        .send({from: this.props.myAccount, value: 1000000000000000000})
        .on("error", (error, receipt) => {
          this.calltoggleLoading();
        })
        .then((receipt) => {
          this.calltoggleLoading();
          API(this.props);
          window.location = "/#/app/main/smartVault1";
        })
      })
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Col sm={12}>
              <Widget
                  customDropDown
                  title={<p className={"fw-bold"}>Protection Setup</p>}
              >
                <p className={"fw-bold"}>Do you want to top-up by ETH or repay by BTC?</p>
                <Radio
                  value="topup"
                  selected={this.state.selected}
                  text="Top-up"
                  disabled="disabled"
                  onChange={this.setSelected}
                />
                <Radio
                  value="repay"
                  selected={this.state.selected}
                  text="Repay"
                  disabled=""
                  onChange={this.setSelected}
                />
                <p className={"fw-bold"}>How much would you like to stake to smart vault?</p>
                <Input value={this.state.stakeAmount} onChange={this.setStakeAmount}></Input>
                <br/>
                <p className={"fw-bold"}>At which health factor would you like to use smart vault?</p>
                <Input disabled value="1.2"></Input>
                <br/>
                <p className={"fw-bold"}>How much would you like to top-up / repay each time?</p>
                <Input disabled value="1"></Input>
              </Widget>
          </Col>
          <Col sm={12}>
              <Button onClick={ () => {
                this.stakeToVault();
                }}>Confirm</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    myAccount: store.loanshark.myAccount,
    lpPoolBtc: store.backd.lpPoolBtc,
    priceOfBtc: store.loanshark.priceOfBtc,
    myBTCContract: store.loanshark.myBTCContract,
    topupAction: store.backd.topupAction
  };
}

export default connect(mapStateToProps)(SmartVault3);
