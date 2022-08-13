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

class OldDashboard extends React.Component {
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

  toggleDeposit(inputModalToken, inputModalAction, pair) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        let approveArgs = [
          (pair === "ETHBTC" ? this.props.myFujiVaultETHBTC.options.address : pair === "AVAXUSDT" ? this.props.myFujiVaultAVAXUSDT.options.address : ""),
          window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString()
        ]

        let args = [
          window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString(),
        ];

        if (pair === "ETHBTC") {
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

        if (pair === "AVAXUSDT") {
          this.toggle();
          this.calltoggleLoading();
  
          let a = window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString();
          this.props.myFujiVaultAVAXUSDT.methods
          .deposit(...args)
          .send({from: this.props.myAccount, value: a})
          .on("error", (error, receipt) => {
            this.calltoggleLoading();
          })
          .then((receipt) => {
            this.calltoggleLoading();
            API(this.props);
          })
        }

      }
    });
  }

  toggleWithdrawn(inputModalToken, inputModalAction, pair) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        let args = [
          window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString(),
        ];

        if (pair === "ETHBTC") {
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

        if (pair === "AVAXUSDT") {
          this.toggle();
          this.calltoggleLoading();

          this.props.myFujiVaultAVAXUSDT.methods
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
      }
    });
  }

  toggleBorrow(inputModalToken, inputModalAction, pair) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        var finalModalInputValue;
        if (pair === "ETHBTC") {
          finalModalInputValue = Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);
        }
        if (pair === "AVAXUSDT") {
          finalModalInputValue = Number.parseFloat(this.state.modalInputValue * 1000000).toFixed(0);
        }

        let args = [
          finalModalInputValue
        ];

        this.toggle();
        this.calltoggleLoading();

        if (pair === "ETHBTC") {
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

        if (pair === "AVAXUSDT") {
          this.props.myFujiVaultAVAXUSDT.methods
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
      }
    });
  }

  togglePayback(inputModalToken, inputModalAction, pair) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        
        var finalModalInputValue;
        if (pair === "ETHBTC") {
          finalModalInputValue = this.state.modalInputValue < 0 ? Number.parseFloat(1000000000000).toFixed(0) : Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);  
        }
        if (pair === "AVAXUSDT") {
          finalModalInputValue = this.state.modalInputValue < 0 ? Number.parseFloat(1000000000000).toFixed(0) : window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'picoether')).toString();
        }

        let approveArgs = [
          (pair === "ETHBTC" ? this.props.myFujiVaultETHBTC.options.address : pair === "AVAXUSDT" ? this.props.myFujiVaultAVAXUSDT.options.address : ""),
          window.web3.utils.toBN(finalModalInputValue).toString()
        ]

        let args = [
          this.state.modalInputValue < 0 ? "-1" : window.web3.utils.toBN(finalModalInputValue).toString(),
        ];

        if (pair === "ETHBTC") {
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

        if (pair === "AVAXUSDT") {
          this.toggle();
          this.calltoggleLoading();
  
          this.props.myUSDTContract.methods
          .approve(...approveArgs)
          .send({from: this.props.myAccount})
          .on("error", (error, receipt) => {
            this.calltoggleLoading();
          })
          .then((receipt) => {
            this.props.myFujiVaultAVAXUSDT.methods
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
      }
    });
  }

  toggleEnterSmartVault(inputModalToken, inputModalAction, pair) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        var finalModalInputValue;
        if (pair === "ETHBTC") {
          finalModalInputValue = this.state.modalInputValue < 0 ? Number.parseFloat(1000000000000).toFixed(0) : Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);  
        }
        if (pair === "AVAXUSDT") {
          finalModalInputValue = this.state.modalInputValue < 0 ? window.web3.utils.toBN(window.web3.utils.toWei(1000000000000, 'picoether')).toString() : window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'picoether')).toString();
        }

        let approveArgs = [
          (pair === "ETHBTC" ? this.props.mySmartVaultBtc.options.address : pair === "AVAXUSDT" ? this.props.mySmartVaultUsdt.options.address : ""),
          window.web3.utils.toBN(finalModalInputValue).toString()
        ]

        let args = [
          (pair === "ETHBTC" ? this.props.myBTCContract.options.address : pair === "AVAXUSDT" ? this.props.myUSDTContract.options.address : ""),
          window.web3.utils.toBN(finalModalInputValue).toString(),
        ];

        this.toggle();
        this.calltoggleLoading();

        if (pair === "ETHBTC") {
          this.props.myBTCContract.methods
          .approve(...approveArgs)
          .send({from: this.props.myAccount})
          .on("error", (error, receipt) => {
            this.calltoggleLoading();
          })
          .then((receipt) => {
            this.props.mySmartVaultBtc.methods
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
        if (pair === "AVAXUSDT") {
          this.props.myUSDTContract.methods
          .approve(...approveArgs)
          .send({from: this.props.myAccount})
          .on("error", (error, receipt) => {
            this.calltoggleLoading();
          })
          .then((receipt) => {
            this.props.mySmartVaultUsdt.methods
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
      }
    });
  }

  toggleLeaveSmartVault(inputModalToken, inputModalAction, pair) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        var finalModalInputValue;
        if (pair === "ETHBTC") {
          finalModalInputValue = this.state.modalInputValue < 0 ? Number.parseFloat(1000000000000).toFixed(0) : Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);  
        }
        if (pair === "AVAXUSDT") {
          finalModalInputValue = this.state.modalInputValue < 0 ? window.web3.utils.toBN(window.web3.utils.toWei(1000000000000, 'picoether')).toString() : window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'picoether')).toString();
        }

        let args = [
          (pair === "ETHBTC" ? this.props.myBTCContract.options.address : pair === "AVAXUSDT" ? this.props.myUSDTContract.options.address : ""),
          window.web3.utils.toBN(finalModalInputValue).toString(),
        ];

        if (pair === "ETHBTC") {
          this.toggle();
          this.calltoggleLoading();
          this.props.mySmartVaultBtc.methods
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

        if (pair === "AVAXUSDT") {
          this.toggle();
          this.calltoggleLoading();
          this.props.mySmartVaultUsdt.methods
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
      }
    });
  }

  toggleManualPaybackSmartVault(inputModalToken, inputModalAction, pair) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        var finalModalInputValue;
        var args;
        var approveArgs;
        var argsForFujiVault;
        var mySmartVaultContract;
        var myDebtContract;
        var myFujiVaultContract;
        if (pair === "ETHBTC") {
          mySmartVaultContract = this.props.mySmartVaultBtc;
          myDebtContract = this.props.myBTCContract;
          myFujiVaultContract = this.props.myFujiVaultETHBTC;
          finalModalInputValue = this.state.modalInputValue < 0 ? Number.parseFloat(1000000000000).toFixed(0) : Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);  
          args = [
            this.props.myBTCContract.options.address,
            window.web3.utils.toBN(finalModalInputValue).toString(),
          ];
          approveArgs = [
            this.props.myFujiVaultETHBTC.options.address,
            window.web3.utils.toBN(finalModalInputValue).toString()
          ]
          argsForFujiVault = [
            this.state.modalInputValue < 0 ? "-1" : window.web3.utils.toBN(finalModalInputValue).toString(),
          ];
        }
        if (pair === "AVAXUSDT") {
          mySmartVaultContract = this.props.mySmartVaultUsdt;
          myDebtContract = this.props.myUSDTContract;
          myFujiVaultContract = this.props.myFujiVaultAVAXUSDT;
          finalModalInputValue = this.state.modalInputValue < 0 ? window.web3.utils.toBN(window.web3.utils.toWei(1000000000000, 'picoether')).toString() : window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'picoether')).toString();
          args = [
            this.props.myUSDTContract.options.address,
            window.web3.utils.toBN(finalModalInputValue).toString(),
          ];
          approveArgs = [
            this.props.myFujiVaultAVAXUSDT.options.address,
            window.web3.utils.toBN(finalModalInputValue).toString()
          ]
          argsForFujiVault = [
            this.state.modalInputValue < 0 ? "-1" : window.web3.utils.toBN(finalModalInputValue).toString(),
          ];
        }

        this.toggle();
        this.calltoggleLoading();
        mySmartVaultContract.methods
          .unstakeTokens(...args)
          .send({from: this.props.myAccount})
          .on("error", (error, receipt) => {
            this.calltoggleLoading();
          })
          .then((receipt) => {
            
            myDebtContract.methods
            .approve(...approveArgs)
            .send({from: this.props.myAccount})
            .on("error", (error, receipt) => {
              this.calltoggleLoading();
            })
            .then((receipt) => {
              myFujiVaultContract.methods
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

  toggleFlashclose(inputModalToken, inputModalAction, pair) {
    this.setState({
      modal: !this.state.modal,
      modalTitle: inputModalAction + " " + inputModalToken,
      modalToken: inputModalToken,
      modalAction: inputModalAction,
      modalCall: () => {
        var finalModalInputValue;
        var myFujiVaultContract;
        if (pair === "ETHBTC") {
          finalModalInputValue = this.state.modalInputValue < 0 ? -1 : Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);  
          myFujiVaultContract = this.props.myFujiVaultETHBTC;
         }
        if (pair === "AVAXUSDT") {
          finalModalInputValue = this.state.modalInputValue < 0 ? -1 : window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'picoether')).toString();
          myFujiVaultContract = this.props.myFujiVaultAVAXUSDT;
        }

        let args = [
          window.web3.utils.toBN(finalModalInputValue).toString(),
          myFujiVaultContract.options.address,
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

  leaveVault() {
    let argsRegister = [
      this.props.myAccount + "000000000000000000000000",
      "0x66756a6964616f00000000000000000000000000000000000000000000000000",
      1
    ];

    let args = [
      window.web3.utils.toBN((this.props.myBtcLpAmount * 100000000).toFixed(0)).toString(),
    ];

    this.calltoggleLoading();
    
    // this.props.topupAction.methods
    // .resetPosition(...argsRegister)
    // .send({from: this.props.myAccount})
    // .on("error", (error, receipt) => {
    //   this.calltoggleLoading();
    // })
    // .then((receipt) => {
      this.props.lpPoolBtc.methods
          .redeem(...args)
          .send({from: this.props.myAccount})
          .on("error", (error, receipt) => {
            this.calltoggleLoading();
          })
          .then((receipt) => {
            this.calltoggleLoading();
            API(this.props);
          })
    // })
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
          <Col xl={3} sm={6}>
            <Widget>
              <Row className={`justify-content-between mt-3`} noGutters>
                <Col sm={12} className={"d-flex"}>
                  <h3 className={"fw-semi-bold mb-0"}>${
                    (
                      (
                        (this.props.userDepositBalanceEth) * this.props.priceOfEth / 100) + (this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100
                      ) +
                      (
                        (this.props.userDepositBalanceAvax) * this.props.priceOfAvax / 100) + (this.props.userDebtBalanceUsdt * this.props.priceOfUsdt / 100
                      )
                    ).toFixed(2) }</h3>
                </Col>
                <Col
                  sm={12}
                  className={"d-flex"}
                >
                  <h5 className={"fw-thin pt-1 mb-0"}>Account Value</h5>
                </Col>
              </Row>
            </Widget>
          </Col>
          <Col xl={3} sm={6}>
            <Widget>
              <Row className={`justify-content-between mt-3`} noGutters>
                <Col sm={12} className={"d-flex"}>
                  <h3 className={"fw-semi-bold mb-0"}>{
                  (
                      (
                        ( Number(this.props.userDepositBalanceEth) * this.props.priceOfEth / 100 * this.props.LTV["ETHBTC"] 
                        + Number(this.props.userDepositBalanceAvax * this.props.priceOfAvax / 100 * this.props.LTV["AVAXUSDT"]))
                      ) 
                    / 
                    (
                      (
                        (Number(this.props.userDebtBalanceBtc) * this.props.priceOfBtc / 100
                        + Number(this.props.userDebtBalanceUsdt) * this.props.priceOfUsdt / 100
                        ) 
                      )
                    )
                 ).toFixed(2)
                  }</h3>
                </Col>
                <Col
                  sm={12}
                  className={"d-flex"}
                >
                  <h5 className={"fw-thin pt-1 mb-0"}>Health Factor</h5>
                </Col>
              </Row>
            </Widget>
          </Col>
          <Col xl={3} sm={6}>
            <Widget>
              <Row className={`justify-content-between mt-3`} noGutters>
                <Col
                  sm={12}
                  className={"d-flex"}
                >
                  <h3 className={"fw-semi-bold pt-1 mb-0"}> ${
                    ((this.props.userDepositBalanceEth * this.props.priceOfEth / 100) + (this.props.userDepositBalanceAvax * this.props.priceOfAvax / 100)).toFixed(2)
                  }</h3>
                </Col>
                <Col
                  sm={12}
                  className={"d-flex"}
                >
                  <h5 className={"fw-thin pt-1 mb-0"}>Deposited</h5>
                </Col>
              </Row>
            </Widget>
          </Col>
          <Col xl={3} sm={6}>
            <Widget>
              <Row className={`justify-content-between mt-3`} noGutters>
                <Col
                  sm={12}
                  className={"d-flex"}
                >
                  <h3 className={"fw-semi-bold pt-1 mb-0"}> ${
                    ((this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100) + (this.props.userDebtBalanceUsdt * this.props.priceOfUsdt / 100)).toFixed(2)
                  }</h3>
                </Col>
                <Col
                  sm={12}
                  className={"d-flex"}
                >
                  <h5 className={"fw-thin pt-1 mb-0"}>Borrowed</h5>
                </Col>
              </Row>
            </Widget>
          </Col>
        </Row>

        <h5 className={"pt-1 mb-0 fw-bold"}>My Borrowing Position</h5>
        <Row>
          <Col sm={12}>
                <Row
                  style={{
                    padding: '15px',
                    borderRadius: '10px',
                    marginLeft: '1px',
                }}>
                  <Col lg={2} key={0} scope="col" className={"pl-0"}>
                    Asset
                  </Col>
                  <Col lg={2} key={1} scope="col" className={"pl-0"}>
                    Collateral
                  </Col>
                  <Col lg={2} key={4} scope="col" className={"pl-0"}>
                    Debt
                  </Col>
                  <Col lg={2} key={6} scope="col" className={"pl-0"}>
                    Health Factor
                  </Col>
                  <Col lg={4} key={7} scope="col" className={"pl-0"}>
                    Manage
                  </Col>
                </Row>
                <Row
                  style={{
                    padding: '15px',
                    marginTop: '10px',
                    marginLeft: '1px',
                    border: 'solid',
                    borderWidth: '1px',
                    borderColor: '#ffffff',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                  <Col lg={2} className="fw-thin pl-0 fw-thin">
                    <img style={{padding: '5px'}} className="icon" src="/assets/icon/eth-logo.svg" alt="x"></img> / <img style={{padding: '5px'}} className="icon" src="/assets/icon/btc-logo.svg" alt="x"></img> ETH/BTC
                  </Col>
                  <Col lg={2} className={"pl-0 fw-thin"}>
                    ${parseFloat((this.props.userDepositBalanceEth * this.props.priceOfEth / 100).toFixed(6))}<br/>
                    {parseFloat(Number(this.props.userDepositBalanceEth).toFixed(6))} ETH
                  </Col>
                  <Col lg={2} className={"pl-0 fw-thin"}>
                    ${parseFloat((this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100).toFixed(6))}<br/>
                    {parseFloat(Number(this.props.userDebtBalanceBtc).toFixed(6))} BTC
                  </Col>
                  <Col lg={2} className={"pl-0 fw-normal"}>
                  {((this.props.userDepositBalanceEth * this.props.priceOfEth / 100) * this.props.LTV["ETHBTC"] / (this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100)).toFixed(2) }
                  </Col>
                  <Col lg={4} className={"pl-0 fw-thin"}>
                    <Button style={{color: '#000000'}} color={"light"} disabled={!this.props.myFujiVaultETHBTC} onClick={() => this.toggleDeposit('ETH', 'Deposit', 'ETHBTC')}>
                      Deposit
                    </Button>&nbsp;
                    <Button style={{color: '#000000'}} color={"light"}  disabled={!this.props.myFujiVaultETHBTC || this.props.userDepositBalanceEth <=0} onClick={() => this.toggleWithdrawn('ETH', 'Withdraw', 'ETHBTC')}>
                      Withdraw
                    </Button>&nbsp;
                    <Button style={{color: '#000000'}} color={"light"} disabled={!this.props.myFujiVaultETHBTC || this.props.userDepositBalanceEth <=0} onClick={() => this.toggleBorrow('BTC', 'Borrow', 'ETHBTC')}>
                      Borrow
                    </Button>&nbsp;
                    <Button style={{color: '#000000'}} color={"light"} disabled={!this.props.myFujiVaultETHBTC || this.props.userDebtBalanceBtc <=0} onClick={() => this.togglePayback('BTC', 'Payback', 'ETHBTC')}>
                      Payback
                    </Button>
                  </Col>
                </Row>

                <Row
                  style={{
                    padding: '15px',
                    marginTop: '10px',
                    marginLeft: '1px',
                    border: 'solid',
                    borderWidth: '1px',
                    borderColor: '#ffffff',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                  <Col lg={2}  className="fw-thin pl-0 fw-thin">
                    <img style={{padding: '5px'}} className="icon" src="/assets/icon/avalanche-avax-logo.svg" alt="x"></img> / <img style={{padding: '5px'}} className="icon" src="/assets/icon/usdt-logo.svg" alt="x"></img> AVAX/USDT
                  </Col>
                  <Col lg={2} className={"pl-0 fw-thin"}>
                    ${parseFloat((this.props.userDepositBalanceAvax * this.props.priceOfAvax / 100).toFixed(6))}<br/>
                    {parseFloat(Number(this.props.userDepositBalanceAvax).toFixed(6))} AVAX
                  </Col>
                  <Col lg={2} className={"pl-0 fw-thin"}>
                    ${parseFloat((this.props.userDebtBalanceUsdt * this.props.priceOfUsdt / 100).toFixed(6))}<br/>
                    {parseFloat(Number(this.props.userDebtBalanceUsdt).toFixed(6))} USDT
                  </Col>
                  <Col lg={2} className={"pl-0 fw-normal"}>
                  {((this.props.userDepositBalanceAvax * this.props.priceOfAvax / 100) * this.props.LTV["AVAXUSDT"] / (this.props.userDebtBalanceUsdt * this.props.priceOfUsdt / 100)).toFixed(2) }
                  </Col>
                  <Col lg={4} className={"pl-0 fw-thin"}>
                    <Button style={{color: '#000000'}} color={"light"} disabled={!this.props.myFujiVaultAVAXUSDT} onClick={() => this.toggleDeposit('AVAX', 'Deposit', 'AVAXUSDT')}>
                      Deposit
                    </Button>&nbsp;
                    <Button style={{color: '#000000'}} color={"light"} disabled={!this.props.myFujiVaultAVAXUSDT || this.props.userDepositBalanceAvax <=0} onClick={() => this.toggleWithdrawn('AVAX', 'Withdraw', 'AVAXUSDT')}>
                      Withdraw
                    </Button>&nbsp;
                    <Button style={{color: '#000000'}} color={"light"} disabled={!this.props.myFujiVaultAVAXUSDT || this.props.userDepositBalanceAvax <=0} onClick={() => this.toggleBorrow('USDT', 'Borrow', 'AVAXUSDT')}>
                      Borrow
                    </Button>&nbsp;
                    <Button style={{color: '#000000'}} color={"light"} disabled={!this.props.myFujiVaultAVAXUSDT || this.props.userDebtBalanceUsdt <=0} onClick={() => this.togglePayback('USDT', 'Payback', 'AVAXUSDT')}>
                      Payback
                    </Button>
                  </Col>
                </Row>

            </Col>
        </Row>

        <Row style={{marginTop: '20px'}}></Row>

        <h5 className={"pt-1 mb-0 fw-bold"}>My Smart Vault Position</h5>

        <Row>
          <Col sm={12}>
            <Row
                  style={{
                    padding: '15px',
                    borderWith: '1px',
                    borderRadius: '10px',
                    marginLeft: '1px',
                }}>
                  <Col lg={2} key={0} scope="col" className={"pl-0"}>
                    Asset
                  </Col>
                  <Col lg={2} key={1} scope="col" className={"pl-0"}>
                    Staking Amount
                  </Col>
                  <Col lg={2} key={4} scope="col" className={"pl-0"}>
                    APY
                  </Col>
                  <Col lg={2} key={6} scope="col" className={"pl-0"}>
                    TVL
                  </Col>
                  <Col lg={4} key={7} scope="col" className={"pl-0"}>
                    Manage
                  </Col>
            </Row>
            <Row
                  style={{
                    padding: '15px',
                    marginTop: '10px',
                    marginLeft: '1px',
                    border: 'solid',
                    borderColor: '#ffffff',
                    borderRadius: '10px',
                    borderWidth: '1px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                  <Col lg={2} className="fw-thin pl-0 fw-thin">
                    <img style={{padding: '5px'}} className="icon" src="/assets/icon/btc-logo.svg" alt="x"></img> BTC
                  </Col>
                  <Col lg={2} className={"pl-0 fw-thin"}>
                    ${parseFloat((this.props.myBtcLpAmount * this.props.priceOfBtc / 100).toFixed(6))}<br/>
                    {parseFloat(Number(this.props.myBtcLpAmount).toFixed(6))} BTC
                  </Col>
                  <Col lg={2} className={"pl-0 fw-thin"}>
                    5.4%
                  </Col>
                  <Col lg={2} className={"pl-0 fw-normal"}>
                    ${parseFloat((this.props.totalBtcLpAmount * this.props.priceOfBtc / 100).toFixed(6))}
                  </Col>
                  <Col lg={4} className={"pl-0 fw-thin"}>
                    <Button style={{color: '#000000'}} color={"light"} disabled={!this.props.myBtcLpAmount} onClick={() => this.leaveVault()}>
                      Leave Smart Vault
                    </Button>
                  </Col>
            </Row>
          </Col>
        </Row>

        <Modal centered isOpen={this.state.modal} toggle={this.toggle} style={{color: '#000000'}}>
          <ModalBody style={{color: '#ffffff', backgroundColor:'#000000', border: 'solid', borderRadius: '5px', borderColor: '#ffffff'}}>
              <Row>
                <Col style={{paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px'}} sm={11}>
                  <h4 className={"fw-bold"}>{this.state.modalTitle}</h4>
                </Col>
                <Col sm={1}>
                  <Button close color="secondary" onClick={this.toggle}></Button>
                </Col>
                <Col style={{paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px'}} sm={12}>
                  {this.state.modalAction} {this.state.modalToken} : 
                  <Input
                    style={{backgroundColor: 'transparent', color: '#ffffff'}} 
                    value={this.state.modalInputValue}
                    onChange={this.setInput}>
                  </Input>
                </Col>
                <Col style={{paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px'}} sm={12}>
                  <Button block color={'light'} style={{padding: '5px', color: '#000000'}} onClick={this.state.modalCall}>Confirm</Button>
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
    selectedPair: store.loanshark.selectedPair,
    numberOfEth:  store.loanshark.userDebtBalance,
    userDepositBalanceEth: store.loanshark.userDepositBalanceEth,
    userDepositBalanceAvax: store.loanshark.userDepositBalanceAvax,
    userDebtBalanceBtc:  store.loanshark.userDebtBalanceBtc,
    userDebtBalanceUsdt:  store.loanshark.userDebtBalanceUsdt,
    myFujiVaultETHBTC: store.loanshark.myFujiVaultETHBTC,
    myFujiVaultAVAXUSDT: store.loanshark.myFujiVaultAVAXUSDT,
    myFliquidatorAVAX: store.loanshark.myFliquidatorAVAX,
    myFujiController: store.loanshark.myFujiController,
    myFujiOracle: store.loanshark.myFujiOracle,
    mySmartVaultBtc: store.loanshark.mySmartVaultBtc,
    mySmartVaultUsdt: store.loanshark.mySmartVaultUsdt,
    myETHContract: store.loanshark.myETHContract,
    myBTCContract:  store.loanshark.myBTCContract,
    myUSDTContract:  store.loanshark.myUSDTContract,
    priceOfEth: store.loanshark.priceOfEth,
    priceOfBtc: store.loanshark.priceOfBtc,
    priceOfAvax: store.loanshark.priceOfAvax,
    priceOfUsdt: store.loanshark.priceOfUsdt,
    providerAAVEAVAX: store.loanshark.providerAAVEAVAX,
    smartVaultBtc: store.loanshark.smartVaultBtc,
    smartVaultUsdt: store.loanshark.smartVaultUsdt,
    myETHAmount: store.loanshark.myETHAmount,
    myBTCAmount: store.loanshark.myBTCAmount,
    LTV: store.loanshark.LTV,

    lpPoolBtc: store.backd.lpPoolBtc,
    lpTokenBtc: store.backd.lpTokenBtc,
    myBtcLpAmount: store.backd.myBtcLpAmount,
    totalBtcLpAmount: store.backd.totalBtcLpAmount,
    topupAction: store.backd.topupAction,
  };
}

export default connect(mapStateToProps)(OldDashboard);