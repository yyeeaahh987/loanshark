import React from "react";
import { connect } from "react-redux";

import usersImg from "../../images/usersImg.svg";
import smileImg from "../../images/smileImg.svg";

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
import Widget from "../../components/Widget";

class Dashboard extends React.Component {
  constructor() {
    super();
    this.forceUpdate = this.forceUpdate.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleDeposit = this.toggleDeposit.bind(this);
    this.toggleBorrow = this.toggleBorrow.bind(this);
    this.togglePayback = this.togglePayback.bind(this);
    this.toggleWithdrawn = this.toggleWithdrawn.bind(this);
    this.calltoggleLoading = this.calltoggleLoading.bind(this);
    this.setInput = this.setInput.bind(this);
    this.state = {
      modal: false,
      modalTitle: '',
      modalToken: '',
      modalAction: '',
      modalCall: () => {},
      modalInputValue: 0,
      loadingActive: false
    };
  
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    })
  }

  calltoggleLoading() {
    this.props.dispatch(toggleLoading());
  }

  setInput(event) {
    this.setState({modalInputValue: event.target.value});
  }

  toggleDeposit(inputModalToken, inputModalAction) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        let approveArgs = [
          this.props.myFujiVaultETHBTC.options.address,
          window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString()
        ]

        let args = [
          window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString(),
        ];

        this.toggle();
        this.calltoggleLoading();

        this.props.myETHContract.methods
        .approve(...approveArgs)
        .send({from: this.props.myAccount})
        .on("error", (error, receipt) => {
          this.calltoggleLoading();
        })
        .then((receipt) => {
          this.props.myFujiVaultETHBTC.methods
          .deposit(...args)
          .send({from: this.props.myAccount})
          .on("error", (error, receipt) => {
            this.calltoggleLoading();
          })
          .then((receipt) => {
            this.calltoggleLoading();
            API(this.props);
          })
        });
      }
    });
  }

  toggleWithdrawn(inputModalToken, inputModalAction) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        let args = [
          window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString(),
        ];

        this.toggle();
        this.calltoggleLoading();

        this.props.myFujiVaultETHBTC.methods
          .withdraw(...args)
          .send({from: this.props.myAccount})
          .on("error", (error, receipt) => {
            this.calltoggleLoading();
          })
          .then((receipt) => {
            this.calltoggleLoading();
            API(this.props);
          });
      }
    });
  }

  toggleBorrow(inputModalToken, inputModalAction) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        let finalModalInputValue = Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);

        let args = [
          window.web3.utils.toBN(finalModalInputValue).toString(),
        ];

        this.toggle();
        this.calltoggleLoading();

        this.props.myFujiVaultETHBTC.methods
          .borrow(...args)
          .send({from: this.props.myAccount})
          .on("error", (error, receipt) => {
            this.calltoggleLoading();
          })
          .then((receipt) => {
            this.calltoggleLoading();
            API(this.props);
          });
      }
    });
  }

  togglePayback(inputModalToken, inputModalAction) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        
        let finalModalInputValue = this.state.modalInputValue < 0 ? Number.parseFloat(1000000000000).toFixed(0) : Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);

        let approveArgs = [
          this.props.myFujiVaultETHBTC.options.address,
          window.web3.utils.toBN(finalModalInputValue).toString()
        ]

        let args = [
          this.state.modalInputValue < 0 ? "-1" : window.web3.utils.toBN(finalModalInputValue).toString(),
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
          this.props.myFujiVaultETHBTC.methods
          .payback(...args)
          .send({from: this.props.myAccount})
          .on("error", (error, receipt) => {
            this.calltoggleLoading();
          })
          .then((receipt) => {
            this.calltoggleLoading();
            API(this.props);
          })
        });
      }
    });
  }

  toggleEnterSmartVault(inputModalToken, inputModalAction) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        let finalModalInputValue = Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);

        let approveArgs = [
          this.props.mySmartVault.options.address,
          window.web3.utils.toBN(finalModalInputValue).toString()
        ]

        let args = [
          this.props.myBTCContract.options.address,
          window.web3.utils.toBN(finalModalInputValue).toString(),
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
          this.props.mySmartVault.methods
            .stakeTokens(...args)
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
    });
  }

  toggleLeaveSmartVault(inputModalToken, inputModalAction) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        let finalModalInputValue = Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);

        let args = [
          this.props.myBTCContract.options.address,
          window.web3.utils.toBN(finalModalInputValue).toString(),
        ];

        this.toggle();
        this.calltoggleLoading();

        this.props.mySmartVault.methods
          .unstakeTokens(...args)
          .send({from: this.props.myAccount})
          .on("error", (error, receipt) => {
            this.calltoggleLoading();
          })
          .then((receipt) => {
            this.calltoggleLoading();
            API(this.props);
          });
      }
    });
  }

  toggleManualPaybackSmartVault(inputModalToken, inputModalAction) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        let finalModalInputValue = Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);

        this.toggle();
        this.calltoggleLoading();

        let args = [
          this.props.myBTCContract.options.address,
          window.web3.utils.toBN(finalModalInputValue).toString(),
        ];

        let approveArgs = [
          this.props.myFujiVaultETHBTC.options.address,
          window.web3.utils.toBN(finalModalInputValue).toString()
        ]

        let argsForFujiVault = [
          this.state.modalInputValue < 0 ? "-1" : window.web3.utils.toBN(finalModalInputValue).toString(),
        ];

        this.props.mySmartVault.methods
          .unstakeTokens(...args)
          .send({from: this.props.myAccount})
          .on("error", (error, receipt) => {
            this.calltoggleLoading();
          })
          .then((receipt) => {
            
            this.props.myBTCContract.methods
            .approve(...approveArgs)
            .send({from: this.props.myAccount})
            .on("error", (error, receipt) => {
              this.calltoggleLoading();
            })
            .then((receipt) => {
              this.props.myFujiVaultETHBTC.methods
              .payback(...argsForFujiVault)
              .send({from: this.props.myAccount})
              .on("error", (error, receipt) => {
                this.calltoggleLoading();
              })
              .then((receipt) => {
                this.calltoggleLoading();
                API(this.props);
              })
            });

          });
      }
    });
  }

  toggleFlashclose(inputModalToken, inputModalAction) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        let finalModalInputValue = Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);
        let args = [
          window.web3.utils.toBN(finalModalInputValue).toString(),
          this.props.myFujiVaultETHBTC.options.address,
          0
        ]

        this.toggle();
        this.calltoggleLoading();

        this.props.myFliquidatorAVAX.methods
          .flashClose(...args)
          .send({from: this.props.myAccount})
          .on("error", (error, receipt) => {
            this.calltoggleLoading();
          })
          .then((receipt) => {
            this.calltoggleLoading();
            API(this.props);
          });;
      }
    });
  }

  componentDidMount() {
    window.addEventListener("resize", this.forceUpdate.bind(this))
  }

  forceUpdate() {
    return this.setState({})
  }

  render() {
    return (
      <div>
        <Row>
          <Col xl={4}>
            <Widget
              title={<p style={{ fontWeight: 700 }}>Account Value</p>}
              customDropDown
            >
              <Row className={`justify-content-between mt-3`} noGutters>
                <Col sm={8} className={"d-flex align-items-center"}>
                  <h3 className={"fw-semi-bold mb-0"}>${(((this.props.userDepositBalance) * this.props.priceOfEth / 100) - (this.props.userDebtBalance * this.props.priceOfBtc / 100)).toFixed(2) }</h3>
                </Col>
                <Col
                  sm={4}
                  className={"d-flex align-items-center justify-content-end"}
                >
                </Col>
              </Row>
              <Row style={{ marginBottom: 45}}>
                <Col sm={12}>
                </Col>
              </Row>
            </Widget>
          </Col>
          <Col xl={4}>
            <Widget
              title={<p style={{ fontWeight: 700 }}>Health Factor</p>}
              customDropDown
            >
              <Row className={`justify-content-between mt-3`} noGutters>
                <Col sm={8} className={"d-flex align-items-center"}>
                  <h3 className={"fw-semi-bold mb-0"}>{((this.props.userDepositBalance * this.props.priceOfEth / 100) / (this.props.userDebtBalance * this.props.priceOfBtc / 100)).toFixed(2) }</h3>
                </Col>
                <Col
                  sm={4}
                  className={"d-flex align-items-center justify-content-end"}
                >
                </Col>
              </Row>
              <Row style={{ marginBottom: 45}}>
                <Col sm={12}>
                </Col>
              </Row>
            </Widget>
          </Col>
          <Col xl={window.innerWidth > 1280 ? 2 : 4} sm={6}>
            <Widget>
              <Row
                className={`justify-content-center align-items-center`}
              >
                <Col
                  sm={12}
                  className={
                    "d-flex justify-content-center align-items-center mb-2"
                  }
                >
                  <img src={usersImg} alt="" style={{ paddingTop: 30 }} />
                </Col>
                <Col
                  sm={12}
                  className={"d-flex justify-content-center align-items-center"}
                >
                  <h3 className={"fw-semi-bold pt-1 mb-0"}> ${(this.props.userDepositBalance * this.props.priceOfEth / 100).toFixed(2)}</h3>
                </Col>
                <Col
                  sm={12}
                  className={"d-flex justify-content-center align-items-center"}
                >
                  <h5 className={"fw-thin pt-1 mb-0"}>Deposited</h5>
                </Col>
                <Col
                  sm={12}
                  className={
                    "d-flex justify-content-center align-items-center pt-1"
                  }
                >
                </Col>
              </Row>
            </Widget>
          </Col>
          <Col xl={2} sm={6}>
            <Widget>
              <Row
                className={`justify-content-center align-items-center`}
              >
                <Col
                  sm={12}
                  className={
                    "d-flex justify-content-center align-items-center mb-2"
                  }
                >
                  <img src={smileImg} alt="" style={{ paddingTop: 30 }} />
                </Col>
                <Col
                  sm={12}
                  className={"d-flex justify-content-center align-items-center"}
                >
                  <h3 className={"fw-semi-bold pt-1 mb-0"}> ${(this.props.userDebtBalance * this.props.priceOfBtc / 100).toFixed(2)}</h3>
                </Col>
                <Col
                  sm={12}
                  className={"d-flex justify-content-center align-items-center"}
                >
                  <h5 className={"fw-thin pt-1 mb-0"}>Borrowed</h5>
                </Col>
                <Col
                  sm={12}
                  className={
                    "d-flex justify-content-center align-items-center pt-1"
                  }
                >
                </Col>
              </Row>
            </Widget>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <Widget
                customDropDown
                title={<p className={"fw-bold"}>My Borrowing Position</p>}
            >
              <Table className={"mb-0"} borderless responsive>
                <thead>
                <tr>
                  <th key={0} scope="col" className={"pl-0"}>
                    Collateral
                  </th>
                  <th key={1} scope="col" className={"pl-0"}>
                    Amount
                  </th>
                  <th key={2} scope="col" className={"pl-0"}>
                  
                  </th>
                  <th key={3} scope="col" className={"pl-0"}>
                    Debt
                  </th>
                  <th key={4} scope="col" className={"pl-0"}>
                    Amount
                  </th>
                  <th key={5} scope="col" className={"pl-0"}>
                    
                  </th>
                  <th key={6} scope="col" className={"pl-0"}>
                    Health Factor
                  </th>
                  <th key={7} scope="col" className={"pl-0"}>
                    Action
                  </th>
                  <th key={8} scope="col" className={"pl-0"}>
                    Provider
                  </th>
                </tr>
                </thead>
                <tbody className="">
                <tr key={0}>
                  <td className="fw-thin pl-0 fw-thin">
                    ETH
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    ${this.props.userDepositBalance * this.props.priceOfEth / 100}<br/>
                    {this.props.userDepositBalance} ETH
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    <Button color={"info"} disabled={!this.props.myFujiVaultETHBTC} onClick={() => this.toggleDeposit('ETH', 'Deposit')}>
                      Deposit
                    </Button>&nbsp;
                    <Button color={"warning"} disabled={!this.props.myFujiVaultETHBTC || this.props.userDepositBalance <=0} onClick={() => this.toggleWithdrawn('ETH', 'Withdraw')}>
                      Withdraw
                    </Button>
                  </td>
                  <td className="fw-thin pl-0 fw-thin">
                    BTC
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    ${this.props.userDebtBalance * this.props.priceOfBtc / 100}<br/>
                    {this.props.userDebtBalance} BTC
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    <Button color={"info"} disabled={!this.props.myFujiVaultETHBTC || this.props.userDepositBalance <=0} onClick={() => this.toggleBorrow('BTC', 'Borrow')}>
                      Borrow
                    </Button>&nbsp;
                    <Button color={"warning"} disabled={!this.props.myFujiVaultETHBTC || this.props.userDebtBalance <=0} onClick={() => this.togglePayback('BTC', 'Payback')}>
                      Payback
                    </Button>
                  </td>
                  <td className={"pl-0 fw-normal"}>
                  {((this.props.userDepositBalance * this.props.priceOfEth / 100) / (this.props.userDebtBalance * this.props.priceOfBtc / 100)).toFixed(2) }
                  </td>
                  <td className={"pl-0 fw-normal"}>
                    <Button color={"info"} disabled={!this.props.myFujiVaultETHBTC} onClick={() => this.toggleEnterSmartVault('BTC', 'Enter Smart Vault')}>
                      Enter Smart Vault
                    </Button>&nbsp;
                    <Button color={"warning"} disabled={!this.props.myFujiVaultETHBTC || this.props.userDepositBalance <=0} onClick={() => this.toggleFlashclose('BTC', 'Flash Close')}>
                      Flash Close
                    </Button>
                  </td>
                  <td>
                    AAVE
                  </td>
                </tr>
                </tbody>
              </Table>
            </Widget>
            <Row>
              <Col sm={12}>
               <Widget
                    customDropDown
                    title={<p className={"fw-bold"}>My Smart Vault Position</p>}
                >
                  <Table className={"mb-0"} borderless responsive>
                    <thead>
                    <tr>
                      <th key={0} scope="col" className={"pl-0"}>
                        Asset
                      </th>
                      <th key={1} scope="col" className={"pl-0"}>
                        Amount
                      </th>
                      <th key={2} scope="col" className={"pl-0"}>
                        Action
                      </th>
                      <th key={3} scope="col" className={"pl-0"}>
                        Trigger Health Factor
                      </th>
                      <th key={4} scope="col" className={"pl-0"}>
                        APY
                      </th>
                    </tr>
                    </thead>
                    <tbody className="">
                    <tr key={0}>
                      <td className="fw-thin pl-0 fw-thin">
                        BTC
                      </td>
                      <td className={"pl-0 fw-thin"}>
                        ${this.props.smartVaultBtc * this.props.priceOfBtc / 100}<br/>
                        {this.props.smartVaultBtc} BTC
                      </td>
                      <td className={"pl-0 fw-thin"}>
                        <Button color={"info"} disabled={!this.props.myFujiVaultETHBTC || this.props.smartVaultBtc <=0} onClick={() => this.toggleManualPaybackSmartVault('BTC', 'Payback')}>
                          Manual Payback Debt
                        </Button>&nbsp;
                        <Button color={"warning"} disabled={!this.props.myFujiVaultETHBTC || this.props.smartVaultBtc <=0} onClick={() => this.toggleLeaveSmartVault('BTC', 'Leave Smart Vault')}>
                          Leave Smart Vault
                        </Button>&nbsp;
                      </td>
                      <td className="fw-thin pl-0 fw-thin">
                        1.1
                      </td>
                      <td className={"pl-0 fw-thin"}>
                        10%
                      </td>
                    </tr>
                    </tbody>
                  </Table>
                </Widget>
              </Col>
            </Row>
          </Col>
        </Row>
        <Modal isOpen={this.state.modal} toggle={this.toggle} style={{color: '#000000'}}>
          <ModalHeader toggle={this.toggle}>{this.state.modalTitle}
          </ModalHeader>
          <ModalBody>
          {this.state.modalAction} {this.state.modalToken} : 
            <Input
              value={this.state.modalInputValue}
              onChange={this.setInput}>
            </Input>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.state.modalCall}>Confirm</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

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
    mySmartVault: store.loanshark.mySmartVault,
    myETHContract: store.loanshark.myETHContract,
    myBTCContract:  store.loanshark.myBTCContract,
    myUSDTContract:  store.loanshark.myUSDTContract,
    priceOfEth: store.loanshark.priceOfEth,
    priceOfBtc: store.loanshark.priceOfBtc,
    providerAAVEAVAX: store.loanshark.providerAAVEAVAX,
    smartVaultBtc: store.loanshark.smartVaultBtc,
    myETHAmount: store.loanshark.myETHAmount,
    myBTCAmount: store.loanshark.myBTCAmount
  };
}

export default connect(mapStateToProps)(Dashboard);
