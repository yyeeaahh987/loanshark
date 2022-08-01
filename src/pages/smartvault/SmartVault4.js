import React from "react";
import { connect } from "react-redux";

import {
  Row, Col, Table, 
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

import {
  toggleLoading,
} from "../../actions/navigation";

import API from '../../utils/API'
import Widget from "../../components/Widget/Widget";
import { Radio } from "../../components/Radio/Radio";

class SmartVault4 extends React.Component {
  constructor() {
    super();
    this.setSelected = this.setSelected.bind(this);
    this.stakeToVault = this.stakeToVault.bind(this);
    this.calltoggleLoading = this.calltoggleLoading.bind(this);
    this.setStakeAmount = this.setStakeAmount.bind(this);
    this.setTriggerHealthFactor = this.setTriggerHealthFactor.bind(this);
    this.setSingleTopupAmount = this.setSingleTopupAmount.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      selected: 'repay',
      stakeAmount: 1,
      triggerHealthFactor: 1.2,
      singleTopupAmount: 0.01,
      modal: false
    }
  }
  
  toggle() {
    this.setState({
      modal: !this.state.modal,
    })
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

  setTriggerHealthFactor(event) {
    this.setState({ triggerHealthFactor: event.target.value });
  }

  setSingleTopupAmount(event) {
    this.setState({ singleTopupAmount: event.target.value });
  }

  stakeToVault() {
    if(!this.props.lpPoolBtc) {
      return;
    }

    this.setState({
      modal: !this.state.modal,
      modalCall: () => {

        let approveArgs = [
          this.props.lpPoolBtc.options.address,
          window.web3.utils.toBN((this.state.stakeAmount * 100000000).toFixed(0)).toString()
        ]
    
        let args = [
          window.web3.utils.toBN((this.state.stakeAmount * 100000000).toFixed(0)).toString(),
        ];

        let argsRegister = [
          this.props.myAccount + "000000000000000000000000",
          "0x66756a6964616f00000000000000000000000000000000000000000000000000",
          window.web3.utils.toBN((this.state.stakeAmount * 10000000).toFixed(0)).toString(),  
          [
            window.web3.utils.toBN(window.web3.utils.toWei((this.state.triggerHealthFactor).toString(), 'ether')).toString(),  
            "0",
            window.web3.utils.toBN((this.state.stakeAmount * 100000000).toFixed(0)).toString(),  
            "0x9c1dcacb57ada1e9e2d3a8280b7cfc7eb936186f",
            "0x9f2b4eeb926d8de19289e93cbf524b6522397b05",
            window.web3.utils.toBN((this.state.singleTopupAmount * 100000000).toFixed(0)).toString(),  
            window.web3.utils.toBN((this.state.stakeAmount * 100000000).toFixed(0)).toString(),  
            window.web3.utils.toBN((this.state.stakeAmount * 100000000).toFixed(0)).toString(),  
            "0x0000000000000000000000000000000000000000000000000000000000000001"
            ]
        ];
    
        this.toggle();
        this.calltoggleLoading();
        
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
          // .then((receipt) => {
          //   this.props.topupAction.methods
          //   .register(...argsRegister)
          //   .send({from: this.props.myAccount, value: 1000000000000000000})
          //   .on("error", (error, receipt) => {
          //     this.calltoggleLoading();
          //   })
            .then((receipt) => {
              this.calltoggleLoading();
              API(this.props);
            })
          // })
        });
      }
    })
  }

  render() {
    return (
      <div>
        <h3 className={"fw-bold"}>Protection Setup</h3>
        <Row>
          <Col lg={8} md={12}>
             <Table className={"mb-5"} responsive borderless>
                <thead>
                <tr>
                  <th key={0} scope="col" className={"pl-4"}>
                    
                  </th>
                  <th key={1} scope="col" className={"pl-0"}>
                    Collateral
                  </th>
                  <th key={3} scope="col" className={"pl-0"}>
                    Debt
                  </th>
                  <th key={4} scope="col" className={"pl-0"}>
                    Health Factor
                  </th>
                </tr>
                </thead>
                <tbody className="">
                <tr key={0} className={'table-light'} style={{color: '#000000'}}>
                  <td className="fw-thin pl-4">
                    <img style={{padding: '5px'}} className="icon" src="/assets/icon/eth-logo.svg" alt="x"></img> ETH / <img style={{padding: '5px'}} className="icon" src="/assets/icon/btc-logo.svg" alt="x"></img> BTC
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    ${parseFloat((this.props.userDepositBalanceEth * this.props.priceOfEth / 100).toFixed(6))}<br/>
                    {parseFloat(Number(this.props.userDepositBalanceEth).toFixed(6))} ETH
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    ${parseFloat((this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100).toFixed(6))}<br/>
                    {parseFloat(Number(this.props.userDebtBalanceBtc).toFixed(6))} BTC
                  </td>
                  <td className={"pl-0 fw-normal"}>
                  {((this.props.userDepositBalanceEth * this.props.priceOfEth / 100) * this.props.LTV["ETHBTC"] / (this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100)).toFixed(2) }
                  </td>
                </tr>
                </tbody>
              </Table>
                  <p className={"fw-bold"}>How much would you like to stake to smart vault?</p>
                  <Input style={{backgroundColor: 'transparent', color: '#ffffff'}} value={this.state.stakeAmount} onChange={this.setStakeAmount}></Input>
                  <br/>
                  <p className={"fw-bold"}>At which health factor would you like to use smart vault?</p>
                  <Input style={{backgroundColor: 'transparent', color: '#ffffff'}} value={this.state.triggerHealthFactor} onChange={this.setTriggerHealthFactor}></Input>
                  <br/>
                  <p className={"fw-bold"}>How much would you like to top-up / repay each time?</p>
                  <Input style={{backgroundColor: 'transparent', color: '#ffffff'}} value={this.state.singleTopupAmount} onChange={this.setSingleTopupAmount}></Input>
                  <br/>
            </Col>

            <Col lg={4} md={12}>
                <Widget style={{paddingTop: '20px'}} >
                  <p className={"fw-bold"}>Selected Smart Vault</p>
                  <p className={"fw-bold"}><img style={{padding: '5px'}} className="icon" src="/assets/icon/btc-logo.svg" alt="x"></img> BTC</p>
                  
                  <Row style={{paddingTop: '20px'}} >
                    <Col lg={4} md={12}>Your Balance:</Col>
                    <Col style={{textAlign: 'right'}} lg={8} md={12}>
                      ${this.props.myBtcLpAmount * this.props.priceOfBtc / 100}<br/>
                    </Col>
                  </Row>
                  <Row style={{paddingTop: '20px'}} >
                    <Col lg={4} md={12}>APY:</Col>
                    <Col style={{textAlign: 'right'}} lg={8} md={12}>5.4%</Col>
                  </Row>
                  <Row style={{paddingTop: '20px'}} >
                    <Col lg={4} md={12}>TVL:</Col>
                    <Col style={{textAlign: 'right'}} lg={8} md={12}> ${this.props.totalBtcLpAmount * this.props.priceOfBtc / 100}</Col>
                  </Row>
                </Widget>
              </Col>
            <Col md={12}>
              <Button block color={'light'} style={{padding: '20px', color: '#000000'}} onClick={ () => {
                    this.stakeToVault();
                  }}>Confirm</Button>
            </Col>
          </Row>
          <Modal centered isOpen={this.state.modal} toggle={this.toggle}> 
            <ModalBody style={{color: '#ffffff', backgroundColor:'#000000', border: 'solid', borderRadius: '5px', borderColor: '#ffffff'}}>
              <Row>
                <Col style={{paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px'}} sm={11}>
                  <h4 className={"fw-bold"}>Confirm to add Smart Vault?</h4>
                </Col>
                <Col sm={1}>
                  <Button close color="secondary" onClick={this.toggle}></Button>
                </Col>
                <Col style={{paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px'}} sm={12}>
                  When the health factor drops below <span style={{color: '#00ff00'}}>{this.state.triggerHealthFactor}</span>, 
                  it will be topped up with <span className={'fw-bold'}>{this.state.singleTopupAmount} BTC (~${this.state.singleTopupAmount * this.props.priceOfBtc})</span>.
                  This will be repeated each time the health factor drops below <span style={{color: '#00ff00'}}>{this.state.triggerHealthFactor}</span>,
                  until a total of <span className={'fw-bold'}>{this.state.stakeAmount} BTC (~${this.state.stakeAmount * this.props.priceOfBtc})</span> is topped up. 1 AVAX will be given for gas fee.
                </Col>
                <Col style={{paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px'}} sm={12}>
                  <Button block color={'light'} style={{padding: '20px', color: '#000000'}} onClick={this.state.modalCall}>Confirm</Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
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
    topupAction: store.backd.topupAction,

    userDepositBalanceEth: store.loanshark.userDepositBalanceEth,
    userDebtBalanceBtc:  store.loanshark.userDebtBalanceBtc,
    priceOfEth: store.loanshark.priceOfEth,
    priceOfBtc: store.loanshark.priceOfBtc,
    LTV: store.loanshark.LTV,
    myBtcLpAmount: store.backd.myBtcLpAmount,
    totalBtcLpAmount: store.backd.totalBtcLpAmount,
  };
}

export default connect(mapStateToProps)(SmartVault4);
