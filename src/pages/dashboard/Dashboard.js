import React from "react";
import { connect } from "react-redux";

import usersImg from "../../images/usersImg.svg";
import smileImg from "../../images/smileImg.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { Grid } from '@mui/material';
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
import './Dashboard.scss'

import API from '../../utils/API'
import DisplayBox from '../../components/DisplayBox/DisplayBox'
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

  componentDidMount() {
    window.addEventListener("resize", this.forceUpdate.bind(this))
  }

  forceUpdate() {
    return this.setState({})
  }

  render() {
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xl={3} lg={3} md={4}>

            <Widget
               title={<p style={{ fontWeight: 700 }}>$100,423.39</p>}
               customDropDown={false}
             >
               <Row className={`justify-content-between mt-3`} noGutters>
                 <Col sm={8} className={"d-flex align-items-center"}>
                  <p className={"fw-semi-bold mb-0"}>
                    Available Balance
                  </p>
                 </Col>
               </Row>
             </Widget>
          </Grid>

          <Grid item xl={3} lg={3} md={4}>

<Widget
   title={<p style={{ fontWeight: 700 }}>$48902.3</p>}
   customDropDown={false}
 >
   <Row className={`justify-content-between mt-3`} noGutters>
     <Col sm={8} className={"d-flex align-items-center"}>
      <p className={"fw-semi-bold mb-0"}>
        Total Deposited
      </p>
     </Col>
   </Row>
 </Widget>
</Grid>

<Grid item xl={3} lg={3} md={4}>

<Widget
   title={<p style={{ fontWeight: 700 }}>$56,729.00</p>}
   customDropDown={false}
 >
   <Row className={`justify-content-between mt-3`} noGutters>
     <Col sm={8} className={"d-flex align-items-center"}>
      <p className={"fw-semi-bold mb-0"}>
        Total Borrowed
      </p>
     </Col>
   </Row>
 </Widget>
</Grid>

          <Grid item xl={3} lg={3} md={4}>

          <Widget
            title={
              <span>
            <FontAwesomeIcon onClick={() => {
            }}
              icon={faCaretDown} />
              <span style={{ fontWeight: 700 }}>$6730.3</span>
            </span>
            }
            customDropDown={false}
          >
            <Row className={`justify-content-between mt-3`} noGutters>
              <Col sm={8} className={"d-flex align-items-center"}>
                <span>
                <span className={"fw-semi-bold mb-0"}>
                  7 Days Changes
                </span>
            <FontAwesomeIcon onClick={() => {
            }}
              icon={faCaretDown} />
            </span>


              </Col>
            </Row>
          </Widget>
          </Grid>
        </Grid>

        <br></br>
        <br></br>
        <Grid container>
            <Grid item xs={12}>
                    <span style={{
                          fontWeight: "800",
                          fontSize: "1em" ,
                    }}>My Borrowing Position</span>
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    <Grid>
                      
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <Grid container>
            <Grid item xs={12}>
                    <span style={{
                          fontWeight: "800",
                          fontSize: "1em" ,
                    }}>My Smart Value Position</span>
            </Grid>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    myAccount: store.loanshark.myAccount,
    selectedPair: store.loanshark.selectedPair,
    numberOfEth:  store.loanshark.numberOfEth,
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
  };
}

export default connect(mapStateToProps)(Dashboard);












// import React from "react";
// import { connect } from "react-redux";

// import usersImg from "../../images/usersImg.svg";
// import smileImg from "../../images/smileImg.svg";

// import {
//   Row, Col, Table, 
//   Input,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from 'reactstrap';

// import {
//   toggleLoading,
// } from "../../actions/navigation";

// import API from '../../utils/API'
// import Widget from "../../components/Widget";

// class Dashboard extends React.Component {
//   constructor() {
//     super();
//     this.forceUpdate = this.forceUpdate.bind(this);
//     this.toggle = this.toggle.bind(this);
//     this.toggleDeposit = this.toggleDeposit.bind(this);
//     this.toggleBorrow = this.toggleBorrow.bind(this);
//     this.togglePayback = this.togglePayback.bind(this);
//     this.toggleWithdrawn = this.toggleWithdrawn.bind(this);
//     this.calltoggleLoading = this.calltoggleLoading.bind(this);
//     this.setInput = this.setInput.bind(this);
//     this.state = {
//       modal: false,
//       modalTitle: '',
//       modalToken: '',
//       modalAction: '',
//       modalCall: () => {},
//       modalInputValue: 0,
//       loadingActive: false
//     };
  
//   }

//   toggle() {
//     this.setState({
//       modal: !this.state.modal,
//     })
//   }

//   calltoggleLoading() {
//     this.props.dispatch(toggleLoading());
//   }

//   setInput(event) {
//     this.setState({modalInputValue: event.target.value});
//   }

//   toggleDeposit(inputModalToken, inputModalAction, pair) {
//     this.setState({
//       modal: !this.state.modal,
//       modalTitle: inputModalAction + " " + inputModalToken,
//       modalToken: inputModalToken,
//       modalAction: inputModalAction,
//       modalCall: () => {
//         let approveArgs = [
//           (pair === "ETHBTC" ? this.props.myFujiVaultETHBTC.options.address : pair === "AVAXUSDT" ? this.props.myFujiVaultAVAXUSDT.options.address : ""),
//           window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString()
//         ]

//         let args = [
//           window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString(),
//         ];

//         if (pair === "ETHBTC") {
//           this.toggle();
//           this.calltoggleLoading();
  
//           this.props.myETHContract.methods
//           .approve(...approveArgs)
//           .send({from: this.props.myAccount})
//           .on("error", (error, receipt) => {
//             this.calltoggleLoading();
//           })
//           .then((receipt) => {
//             this.props.myFujiVaultETHBTC.methods
//             .deposit(...args)
//             .send({from: this.props.myAccount})
//             .on("error", (error, receipt) => {
//               this.calltoggleLoading();
//             })
//             .then((receipt) => {
//               this.calltoggleLoading();
//               API(this.props);
//             })
//           });
//         }

//         if (pair === "AVAXUSDT") {
//           this.toggle();
//           this.calltoggleLoading();
  
//           let a = window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString();
//           this.props.myFujiVaultAVAXUSDT.methods
//           .deposit(...args)
//           .send({from: this.props.myAccount, value: a})
//           .on("error", (error, receipt) => {
//             this.calltoggleLoading();
//           })
//           .then((receipt) => {
//             this.calltoggleLoading();
//             API(this.props);
//           })
//         }

//       }
//     });
//   }

//   toggleWithdrawn(inputModalToken, inputModalAction, pair) {
//     this.setState({
//       modal: !this.state.modal,
//       modalTitle: inputModalAction + " " + inputModalToken,
//       modalToken: inputModalToken,
//       modalAction: inputModalAction,
//       modalCall: () => {
//         let args = [
//           window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'ether')).toString(),
//         ];

//         if (pair === "ETHBTC") {
//           this.toggle();
//           this.calltoggleLoading();

//           this.props.myFujiVaultETHBTC.methods
//             .withdraw(...args)
//             .send({from: this.props.myAccount})
//             .on("error", (error, receipt) => {
//               this.calltoggleLoading();
//             })
//             .then((receipt) => {
//               this.calltoggleLoading();
//               API(this.props);
//             });
//         }

//         if (pair === "AVAXUSDT") {
//           this.toggle();
//           this.calltoggleLoading();

//           this.props.myFujiVaultAVAXUSDT.methods
//             .withdraw(...args)
//             .send({from: this.props.myAccount})
//             .on("error", (error, receipt) => {
//               this.calltoggleLoading();
//             })
//             .then((receipt) => {
//               this.calltoggleLoading();
//               API(this.props);
//             });
//         }
//       }
//     });
//   }

//   toggleBorrow(inputModalToken, inputModalAction, pair) {
//     this.setState({
//       modal: !this.state.modal,
//       modalTitle: inputModalAction + " " + inputModalToken,
//       modalToken: inputModalToken,
//       modalAction: inputModalAction,
//       modalCall: () => {
//         var finalModalInputValue;
//         if (pair === "ETHBTC") {
//           finalModalInputValue = Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);
//         }
//         if (pair === "AVAXUSDT") {
//           finalModalInputValue = Number.parseFloat(this.state.modalInputValue * 1000000).toFixed(0);
//         }

//         let args = [
//           finalModalInputValue
//         ];

//         this.toggle();
//         this.calltoggleLoading();

//         if (pair === "ETHBTC") {
//           this.props.myFujiVaultETHBTC.methods
//             .borrow(...args)
//             .send({from: this.props.myAccount})
//             .on("error", (error, receipt) => {
//               this.calltoggleLoading();
//             })
//             .then((receipt) => {
//               this.calltoggleLoading();
//               API(this.props);
//             });
//         }

//         if (pair === "AVAXUSDT") {
//           this.props.myFujiVaultAVAXUSDT.methods
//             .borrow(...args)
//             .send({from: this.props.myAccount})
//             .on("error", (error, receipt) => {
//               this.calltoggleLoading();
//             })
//             .then((receipt) => {
//               this.calltoggleLoading();
//               API(this.props);
//             });
//         }
//       }
//     });
//   }

//   togglePayback(inputModalToken, inputModalAction, pair) {
//     this.setState({
//       modal: !this.state.modal,
//       modalTitle: inputModalAction + " " + inputModalToken,
//       modalToken: inputModalToken,
//       modalAction: inputModalAction,
//       modalCall: () => {
        
//         var finalModalInputValue;
//         if (pair === "ETHBTC") {
//           finalModalInputValue = this.state.modalInputValue < 0 ? Number.parseFloat(1000000000000).toFixed(0) : Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);  
//         }
//         if (pair === "AVAXUSDT") {
//           finalModalInputValue = this.state.modalInputValue < 0 ? Number.parseFloat(1000000000000).toFixed(0) : window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'picoether')).toString();
//         }

//         let approveArgs = [
//           (pair === "ETHBTC" ? this.props.myFujiVaultETHBTC.options.address : pair === "AVAXUSDT" ? this.props.myFujiVaultAVAXUSDT.options.address : ""),
//           window.web3.utils.toBN(finalModalInputValue).toString()
//         ]

//         let args = [
//           this.state.modalInputValue < 0 ? "-1" : window.web3.utils.toBN(finalModalInputValue).toString(),
//         ];

//         if (pair === "ETHBTC") {
//           this.toggle();
//           this.calltoggleLoading();

//           this.props.myBTCContract.methods
//           .approve(...approveArgs)
//           .send({from: this.props.myAccount})
//           .on("error", (error, receipt) => {
//             this.calltoggleLoading();
//           })
//           .then((receipt) => {
//             this.props.myFujiVaultETHBTC.methods
//             .payback(...args)
//             .send({from: this.props.myAccount})
//             .on("error", (error, receipt) => {
//               this.calltoggleLoading();
//             })
//             .then((receipt) => {
//               this.calltoggleLoading();
//               API(this.props);
//             })
//           });
//         }

//         if (pair === "AVAXUSDT") {
//           this.toggle();
//           this.calltoggleLoading();
  
//           this.props.myUSDTContract.methods
//           .approve(...approveArgs)
//           .send({from: this.props.myAccount})
//           .on("error", (error, receipt) => {
//             this.calltoggleLoading();
//           })
//           .then((receipt) => {
//             this.props.myFujiVaultAVAXUSDT.methods
//             .payback(...args)
//             .send({from: this.props.myAccount})
//             .on("error", (error, receipt) => {
//               this.calltoggleLoading();
//             })
//             .then((receipt) => {
//               this.calltoggleLoading();
//               API(this.props);
//             })
//           });
//         }
//       }
//     });
//   }

//   toggleEnterSmartVault(inputModalToken, inputModalAction, pair) {
//     this.setState({
//       modal: !this.state.modal,
//       modalTitle: inputModalAction + " " + inputModalToken,
//       modalToken: inputModalToken,
//       modalAction: inputModalAction,
//       modalCall: () => {
//         var finalModalInputValue;
//         if (pair === "ETHBTC") {
//           finalModalInputValue = this.state.modalInputValue < 0 ? Number.parseFloat(1000000000000).toFixed(0) : Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);  
//         }
//         if (pair === "AVAXUSDT") {
//           finalModalInputValue = this.state.modalInputValue < 0 ? window.web3.utils.toBN(window.web3.utils.toWei(1000000000000, 'picoether')).toString() : window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'picoether')).toString();
//         }

//         let approveArgs = [
//           (pair === "ETHBTC" ? this.props.mySmartVaultBtc.options.address : pair === "AVAXUSDT" ? this.props.mySmartVaultUsdt.options.address : ""),
//           window.web3.utils.toBN(finalModalInputValue).toString()
//         ]

//         let args = [
//           (pair === "ETHBTC" ? this.props.myBTCContract.options.address : pair === "AVAXUSDT" ? this.props.myUSDTContract.options.address : ""),
//           window.web3.utils.toBN(finalModalInputValue).toString(),
//         ];

//         this.toggle();
//         this.calltoggleLoading();

//         if (pair === "ETHBTC") {
//           this.props.myBTCContract.methods
//           .approve(...approveArgs)
//           .send({from: this.props.myAccount})
//           .on("error", (error, receipt) => {
//             this.calltoggleLoading();
//           })
//           .then((receipt) => {
//             this.props.mySmartVaultBtc.methods
//               .stakeTokens(...args)
//               .send({from: this.props.myAccount})
//               .on("error", (error, receipt) => {
//                 this.calltoggleLoading();
//               })
//               .then((receipt) => {
//                 this.calltoggleLoading();
//                 API(this.props);
//               });
//           });
//         }
//         if (pair === "AVAXUSDT") {
//           this.props.myUSDTContract.methods
//           .approve(...approveArgs)
//           .send({from: this.props.myAccount})
//           .on("error", (error, receipt) => {
//             this.calltoggleLoading();
//           })
//           .then((receipt) => {
//             this.props.mySmartVaultUsdt.methods
//               .stakeTokens(...args)
//               .send({from: this.props.myAccount})
//               .on("error", (error, receipt) => {
//                 this.calltoggleLoading();
//               })
//               .then((receipt) => {
//                 this.calltoggleLoading();
//                 API(this.props);
//               });
//           });
//         }
//       }
//     });
//   }

//   toggleLeaveSmartVault(inputModalToken, inputModalAction, pair) {
//     this.setState({
//       modal: !this.state.modal,
//       modalTitle: inputModalAction + " " + inputModalToken,
//       modalToken: inputModalToken,
//       modalAction: inputModalAction,
//       modalCall: () => {
//         var finalModalInputValue;
//         if (pair === "ETHBTC") {
//           finalModalInputValue = this.state.modalInputValue < 0 ? Number.parseFloat(1000000000000).toFixed(0) : Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);  
//         }
//         if (pair === "AVAXUSDT") {
//           finalModalInputValue = this.state.modalInputValue < 0 ? window.web3.utils.toBN(window.web3.utils.toWei(1000000000000, 'picoether')).toString() : window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'picoether')).toString();
//         }

//         let args = [
//           (pair === "ETHBTC" ? this.props.myBTCContract.options.address : pair === "AVAXUSDT" ? this.props.myUSDTContract.options.address : ""),
//           window.web3.utils.toBN(finalModalInputValue).toString(),
//         ];

//         if (pair === "ETHBTC") {
//           this.toggle();
//           this.calltoggleLoading();
//           this.props.mySmartVaultBtc.methods
//             .unstakeTokens(...args)
//             .send({from: this.props.myAccount})
//             .on("error", (error, receipt) => {
//               this.calltoggleLoading();
//             })
//             .then((receipt) => {
//               this.calltoggleLoading();
//               API(this.props);
//             });
//         }

//         if (pair === "AVAXUSDT") {
//           this.toggle();
//           this.calltoggleLoading();
//           this.props.mySmartVaultUsdt.methods
//             .unstakeTokens(...args)
//             .send({from: this.props.myAccount})
//             .on("error", (error, receipt) => {
//               this.calltoggleLoading();
//             })
//             .then((receipt) => {
//               this.calltoggleLoading();
//               API(this.props);
//             });
//         }
//       }
//     });
//   }

//   toggleManualPaybackSmartVault(inputModalToken, inputModalAction, pair) {
//     this.setState({
//       modal: !this.state.modal,
//       modalTitle: inputModalAction + " " + inputModalToken,
//       modalToken: inputModalToken,
//       modalAction: inputModalAction,
//       modalCall: () => {
//         var finalModalInputValue;
//         var args;
//         var approveArgs;
//         var argsForFujiVault;
//         var mySmartVaultContract;
//         var myDebtContract;
//         var myFujiVaultContract;
//         if (pair === "ETHBTC") {
//           mySmartVaultContract = this.props.mySmartVaultBtc;
//           myDebtContract = this.props.myBTCContract;
//           myFujiVaultContract = this.props.myFujiVaultETHBTC;
//           finalModalInputValue = this.state.modalInputValue < 0 ? Number.parseFloat(1000000000000).toFixed(0) : Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);  
//           args = [
//             this.props.myBTCContract.options.address,
//             window.web3.utils.toBN(finalModalInputValue).toString(),
//           ];
//           approveArgs = [
//             this.props.myFujiVaultETHBTC.options.address,
//             window.web3.utils.toBN(finalModalInputValue).toString()
//           ]
//           argsForFujiVault = [
//             this.state.modalInputValue < 0 ? "-1" : window.web3.utils.toBN(finalModalInputValue).toString(),
//           ];
//         }
//         if (pair === "AVAXUSDT") {
//           mySmartVaultContract = this.props.mySmartVaultUsdt;
//           myDebtContract = this.props.myUSDTContract;
//           myFujiVaultContract = this.props.myFujiVaultAVAXUSDT;
//           finalModalInputValue = this.state.modalInputValue < 0 ? window.web3.utils.toBN(window.web3.utils.toWei(1000000000000, 'picoether')).toString() : window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'picoether')).toString();
//           args = [
//             this.props.myUSDTContract.options.address,
//             window.web3.utils.toBN(finalModalInputValue).toString(),
//           ];
//           approveArgs = [
//             this.props.myFujiVaultAVAXUSDT.options.address,
//             window.web3.utils.toBN(finalModalInputValue).toString()
//           ]
//           argsForFujiVault = [
//             this.state.modalInputValue < 0 ? "-1" : window.web3.utils.toBN(finalModalInputValue).toString(),
//           ];
//         }

//         this.toggle();
//         this.calltoggleLoading();
//         mySmartVaultContract.methods
//           .unstakeTokens(...args)
//           .send({from: this.props.myAccount})
//           .on("error", (error, receipt) => {
//             this.calltoggleLoading();
//           })
//           .then((receipt) => {
            
//             myDebtContract.methods
//             .approve(...approveArgs)
//             .send({from: this.props.myAccount})
//             .on("error", (error, receipt) => {
//               this.calltoggleLoading();
//             })
//             .then((receipt) => {
//               myFujiVaultContract.methods
//               .payback(...argsForFujiVault)
//               .send({from: this.props.myAccount})
//               .on("error", (error, receipt) => {
//                 this.calltoggleLoading();
//               })
//               .then((receipt) => {
//                 this.calltoggleLoading();
//                 API(this.props);
//               })
//             });

//           });
//       }
//     });
//   }

//   toggleFlashclose(inputModalToken, inputModalAction, pair) {
//     this.setState({
//       modal: !this.state.modal,
//       modalTitle: inputModalAction + " " + inputModalToken,
//       modalToken: inputModalToken,
//       modalAction: inputModalAction,
//       modalCall: () => {
//         var finalModalInputValue;
//         var myFujiVaultContract;
//         if (pair === "ETHBTC") {
//           finalModalInputValue = this.state.modalInputValue < 0 ? -1 : Number.parseFloat(this.state.modalInputValue * 100000000).toFixed(0);  
//           myFujiVaultContract = this.props.myFujiVaultETHBTC;
//          }
//         if (pair === "AVAXUSDT") {
//           finalModalInputValue = this.state.modalInputValue < 0 ? -1 : window.web3.utils.toBN(window.web3.utils.toWei(this.state.modalInputValue, 'picoether')).toString();
//           myFujiVaultContract = this.props.myFujiVaultAVAXUSDT;
//         }

//         let args = [
//           window.web3.utils.toBN(finalModalInputValue).toString(),
//           myFujiVaultContract.options.address,
//           0
//         ]

//         this.toggle();
//         this.calltoggleLoading();

//         this.props.myFliquidatorAVAX.methods
//           .flashClose(...args)
//           .send({from: this.props.myAccount})
//           .on("error", (error, receipt) => {
//             this.calltoggleLoading();
//           })
//           .then((receipt) => {
//             this.calltoggleLoading();
//             API(this.props);
//           });;
//       }
//     });
//   }

//   componentDidMount() {
//     window.addEventListener("resize", this.forceUpdate.bind(this))
//   }

//   forceUpdate() {
//     return this.setState({})
//   }

//   render() {
//     return (
//       <div>
//         <Row>
//           <Col xl={4}>
//             <Widget
//               title={<p style={{ fontWeight: 700 }}>Account Value</p>}
//               customDropDown
//             >
//               <Row className={`justify-content-between mt-3`} noGutters>
//                 <Col sm={8} className={"d-flex align-items-center"}>
//                   <h3 className={"fw-semi-bold mb-0"}>${
//                     (
//                       (
//                         (this.props.userDepositBalanceEth) * this.props.priceOfEth / 100) - (this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100
//                       ) +
//                       (
//                         (this.props.userDepositBalanceAvax) * this.props.priceOfAvax / 100) - (this.props.userDebtBalanceUsdt * this.props.priceOfUsdt / 100
//                       )
//                     ).toFixed(2) }</h3>
//                 </Col>
//                 <Col
//                   sm={4}
//                   className={"d-flex align-items-center justify-content-end"}
//                 >
//                 </Col>
//               </Row>
//               <Row style={{ marginBottom: 45}}>
//                 <Col sm={12}>
//                 </Col>
//               </Row>
//             </Widget>
//           </Col>
//           <Col xl={4}>
//             <Widget
//               title={<p style={{ fontWeight: 700 }}>Health Factor</p>}
//               customDropDown
//             >
//               <Row className={`justify-content-between mt-3`} noGutters>
//                 <Col sm={8} className={"d-flex align-items-center"}>
//                   <h3 className={"fw-semi-bold mb-0"}>{
//                   (
//                       (
//                         ( Number(this.props.userDepositBalanceEth) * this.props.priceOfEth / 100 * this.props.LTV["ETHBTC"] 
//                         + Number(this.props.userDepositBalanceAvax * this.props.priceOfAvax / 100 * this.props.LTV["AVAXUSDT"]))
//                       ) 
//                     / 
//                     (
//                       (
//                         (Number(this.props.userDebtBalanceBtc) * this.props.priceOfBtc / 100
//                         + Number(this.props.userDebtBalanceUsdt) * this.props.priceOfUsdt / 100
//                         ) 
//                       )
//                     )
//                  ).toFixed(2)
//                   }</h3>
//                 </Col>
//                 <Col
//                   sm={4}
//                   className={"d-flex align-items-center justify-content-end"}
//                 >
//                 </Col>
//               </Row>
//               <Row style={{ marginBottom: 45}}>
//                 <Col sm={12}>
//                 </Col>
//               </Row>
//             </Widget>
//           </Col>
//           <Col xl={window.innerWidth > 1280 ? 2 : 4} sm={6}>
//             <Widget>
//               <Row
//                 className={`justify-content-center align-items-center`}
//               >
//                 <Col
//                   sm={12}
//                   className={
//                     "d-flex justify-content-center align-items-center mb-2"
//                   }
//                 >
//                   <img src={usersImg} alt="" style={{ paddingTop: 30 }} />
//                 </Col>
//                 <Col
//                   sm={12}
//                   className={"d-flex justify-content-center align-items-center"}
//                 >
//                   <h3 className={"fw-semi-bold pt-1 mb-0"}> ${
//                     ((this.props.userDepositBalanceEth * this.props.priceOfEth / 100) + (this.props.userDepositBalanceAvax * this.props.priceOfAvax / 100)).toFixed(2)
//                   }</h3>
//                 </Col>
//                 <Col
//                   sm={12}
//                   className={"d-flex justify-content-center align-items-center"}
//                 >
//                   <h5 className={"fw-thin pt-1 mb-0"}>Deposited</h5>
//                 </Col>
//                 <Col
//                   sm={12}
//                   className={
//                     "d-flex justify-content-center align-items-center pt-1"
//                   }
//                 >
//                 </Col>
//               </Row>
//             </Widget>
//           </Col>
//           <Col xl={2} sm={6}>
//             <Widget>
//               <Row
//                 className={`justify-content-center align-items-center`}
//               >
//                 <Col
//                   sm={12}
//                   className={
//                     "d-flex justify-content-center align-items-center mb-2"
//                   }
//                 >
//                   <img src={smileImg} alt="" style={{ paddingTop: 30 }} />
//                 </Col>
//                 <Col
//                   sm={12}
//                   className={"d-flex justify-content-center align-items-center"}
//                 >
//                   <h3 className={"fw-semi-bold pt-1 mb-0"}> ${
//                     ((this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100) + (this.props.userDebtBalanceUsdt * this.props.priceOfUsdt / 100)).toFixed(2)
//                   }</h3>
//                 </Col>
//                 <Col
//                   sm={12}
//                   className={"d-flex justify-content-center align-items-center"}
//                 >
//                   <h5 className={"fw-thin pt-1 mb-0"}>Borrowed</h5>
//                 </Col>
//                 <Col
//                   sm={12}
//                   className={
//                     "d-flex justify-content-center align-items-center pt-1"
//                   }
//                 >
//                 </Col>
//               </Row>
//             </Widget>
//           </Col>
//         </Row>

//         <Row>
//           <Col sm={12}>
//             <Widget
//                 customDropDown
//                 title={<p className={"fw-bold"}>My Borrowing Position</p>}
//             >
//               <Table className={"mb-0"} borderless responsive>
//                 <thead>
//                 <tr>
//                   <th key={0} scope="col" className={"pl-0"}>
//                     Collateral
//                   </th>
//                   <th key={1} scope="col" className={"pl-0"}>
//                     Amount
//                   </th>
//                   <th key={2} scope="col" className={"pl-0"}>
                  
//                   </th>
//                   <th key={3} scope="col" className={"pl-0"}>
//                     Debt
//                   </th>
//                   <th key={4} scope="col" className={"pl-0"}>
//                     Amount
//                   </th>
//                   <th key={5} scope="col" className={"pl-0"}>
                    
//                   </th>
//                   <th key={6} scope="col" className={"pl-0"}>
//                     Health Factor
//                   </th>
//                   <th key={7} scope="col" className={"pl-0"}>
//                     Action
//                   </th>
//                   <th key={8} scope="col" className={"pl-0"}>
//                     Provider
//                   </th>
//                 </tr>
//                 </thead>
//                 <tbody className="">
//                 <tr key={0}>
//                   <td className="fw-thin pl-0 fw-thin">
//                     ETH
//                   </td>
//                   <td className={"pl-0 fw-thin"}>
//                     ${this.props.userDepositBalanceEth * this.props.priceOfEth / 100}<br/>
//                     {this.props.userDepositBalanceEth} ETH
//                   </td>
//                   <td className={"pl-0 fw-thin"}>
//                     <Button color={"info"} disabled={!this.props.myFujiVaultETHBTC} onClick={() => this.toggleDeposit('ETH', 'Deposit', 'ETHBTC')}>
//                       Deposit
//                     </Button>&nbsp;
//                     <Button color={"warning"} disabled={!this.props.myFujiVaultETHBTC || this.props.userDepositBalanceEth <=0} onClick={() => this.toggleWithdrawn('ETH', 'Withdraw', 'ETHBTC')}>
//                       Withdraw
//                     </Button>
//                   </td>
//                   <td className="fw-thin pl-0 fw-thin">
//                     BTC
//                   </td>
//                   <td className={"pl-0 fw-thin"}>
//                     ${this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100}<br/>
//                     {this.props.userDebtBalanceBtc} BTC
//                   </td>
//                   <td className={"pl-0 fw-thin"}>
//                     <Button color={"info"} disabled={!this.props.myFujiVaultETHBTC || this.props.userDepositBalanceEth <=0} onClick={() => this.toggleBorrow('BTC', 'Borrow', 'ETHBTC')}>
//                       Borrow
//                     </Button>&nbsp;
//                     <Button color={"warning"} disabled={!this.props.myFujiVaultETHBTC || this.props.userDebtBalanceBtc <=0} onClick={() => this.togglePayback('BTC', 'Payback', 'ETHBTC')}>
//                       Payback
//                     </Button>
//                   </td>
//                   <td className={"pl-0 fw-normal"}>
//                   {((this.props.userDepositBalanceEth * this.props.priceOfEth / 100) * this.props.LTV["ETHBTC"] / (this.props.userDebtBalanceBtc * this.props.priceOfBtc / 100)).toFixed(2) }
//                   </td>
//                   <td className={"pl-0 fw-normal"}>
//                     <Button color={"info"} disabled={!this.props.myFujiVaultETHBTC} onClick={() => this.toggleEnterSmartVault('BTC', 'Enter Smart Vault', 'ETHBTC')}>
//                       Enter Smart Vault
//                     </Button>&nbsp;
//                     <Button color={"warning"} disabled={!this.props.myFujiVaultETHBTC || this.props.userDebtBalanceBtc <=0} onClick={() => this.toggleFlashclose('BTC', 'Flash Close', 'ETHBTC')}>
//                       Flash Close
//                     </Button>
//                   </td>
//                   <td>
//                     AAVE
//                   </td>
//                 </tr>

//                 <tr key={1}>
//                   <td className="fw-thin pl-0 fw-thin">
//                     ONE
//                   </td>
//                   <td className={"pl-0 fw-thin"}>
//                     ${this.props.userDepositBalanceAvax * this.props.priceOfAvax / 100}<br/>
//                     {this.props.userDepositBalanceAvax} ONE
//                   </td>
//                   <td className={"pl-0 fw-thin"}>
//                     <Button color={"info"} disabled={!this.props.myFujiVaultAVAXUSDT} onClick={() => this.toggleDeposit('ONE', 'Deposit', 'AVAXUSDT')}>
//                       Deposit
//                     </Button>&nbsp;
//                     <Button color={"warning"} disabled={!this.props.myFujiVaultAVAXUSDT || this.props.userDepositBalanceAvax <=0} onClick={() => this.toggleWithdrawn('ONE', 'Withdraw', 'AVAXUSDT')}>
//                       Withdraw
//                     </Button>
//                   </td>
//                   <td className="fw-thin pl-0 fw-thin">
//                     USDT
//                   </td>
//                   <td className={"pl-0 fw-thin"}>
//                     ${this.props.userDebtBalanceUsdt * this.props.priceOfUsdt / 100}<br/>
//                     {this.props.userDebtBalanceUsdt} USDT
//                   </td>
//                   <td className={"pl-0 fw-thin"}>
//                     <Button color={"info"} disabled={!this.props.myFujiVaultAVAXUSDT || this.props.userDepositBalanceAvax <=0} onClick={() => this.toggleBorrow('USDT', 'Borrow', 'AVAXUSDT')}>
//                       Borrow
//                     </Button>&nbsp;
//                     <Button color={"warning"} disabled={!this.props.myFujiVaultAVAXUSDT || this.props.userDebtBalanceUsdt <=0} onClick={() => this.togglePayback('USDT', 'Payback', 'AVAXUSDT')}>
//                       Payback
//                     </Button>
//                   </td>
//                   <td className={"pl-0 fw-normal"}>
//                   {((this.props.userDepositBalanceAvax * this.props.priceOfAvax / 100) * this.props.LTV["AVAXUSDT"] / (this.props.userDebtBalanceUsdt * this.props.priceOfUsdt / 100)).toFixed(2) }
//                   </td>
//                   <td className={"pl-0 fw-normal"}>
//                     <Button color={"info"} disabled={!this.props.myFujiVaultAVAXUSDT} onClick={() => this.toggleEnterSmartVault('USDT', 'Enter Smart Vault', 'AVAXUSDT')}>
//                       Enter Smart Vault
//                     </Button>&nbsp;
//                     <Button color={"warning"} disabled={!this.props.myFujiVaultAVAXUSDT || this.props.userDepositBalanceAvax <=0} onClick={() => this.toggleFlashclose('USDT', 'Flash Close', 'AVAXUSDT')}>
//                       Flash Close
//                     </Button>
//                   </td>
//                   <td>
//                     AAVE
//                   </td>
//                 </tr>


//                 </tbody>
//               </Table>
//             </Widget>
//             <Row>
//               <Col sm={12}>
//                <Widget
//                     customDropDown
//                     title={<p className={"fw-bold"}>My Smart Vault Position</p>}
//                 >
//                   <Table className={"mb-0"} borderless responsive>
//                     <thead>
//                     <tr>
//                       <th key={0} scope="col" className={"pl-0"}>
//                         Asset
//                       </th>
//                       <th key={1} scope="col" className={"pl-0"}>
//                         Amount
//                       </th>
//                       <th key={2} scope="col" className={"pl-0"}>
//                         Action
//                       </th>
//                       <th key={3} scope="col" className={"pl-0"}>
//                         Trigger Health Factor
//                       </th>
//                       <th key={4} scope="col" className={"pl-0"}>
//                         APY
//                       </th>
//                     </tr>
//                     </thead>
//                     <tbody className="">
//                     <tr key={0}>
//                       <td className="fw-thin pl-0 fw-thin">
//                         BTC
//                       </td>
//                       <td className={"pl-0 fw-thin"}>
//                         ${this.props.smartVaultBtc * this.props.priceOfBtc / 100}<br/>
//                         {this.props.smartVaultBtc} BTC
//                       </td>
//                       <td className={"pl-0 fw-thin"}>
//                         <Button color={"info"} disabled={!this.props.myFujiVaultETHBTC || this.props.smartVaultBtc <=0} onClick={() => this.toggleManualPaybackSmartVault('BTC', 'Payback', 'ETHBTC')}>
//                           Manual Payback Debt
//                         </Button>&nbsp;
//                         <Button color={"warning"} disabled={!this.props.myFujiVaultETHBTC || this.props.smartVaultBtc <=0} onClick={() => this.toggleLeaveSmartVault('BTC', 'Leave Smart Vault', 'ETHBTC')}>
//                           Leave Smart Vault
//                         </Button>&nbsp;
//                       </td>
//                       <td className="fw-thin pl-0 fw-thin">
//                         1.1
//                       </td>
//                       <td className={"pl-0 fw-thin"}>
//                         10%
//                       </td>
//                     </tr>
//                     <tr key={1}>
//                       <td className="fw-thin pl-0 fw-thin">
//                         USDT
//                       </td>
//                       <td className={"pl-0 fw-thin"}>
//                         ${this.props.smartVaultUsdt * this.props.priceOfUsdt / 100}<br/>
//                         {this.props.smartVaultUsdt} USDT
//                       </td>
//                       <td className={"pl-0 fw-thin"}>
//                         <Button color={"info"} disabled={!this.props.myFujiVaultAVAXUSDT || this.props.smartVaultUsdt <=0} onClick={() => this.toggleManualPaybackSmartVault('USDT', 'Payback', 'AVAXUSDT')}>
//                           Manual Payback Debt
//                         </Button>&nbsp;
//                         <Button color={"warning"} disabled={!this.props.myFujiVaultAVAXUSDT || this.props.smartVaultUsdt <=0} onClick={() => this.toggleLeaveSmartVault('USDT', 'Leave Smart Vault', 'AVAXUSDT')}>
//                           Leave Smart Vault
//                         </Button>&nbsp;
//                       </td>
//                       <td className="fw-thin pl-0 fw-thin">
//                         1.1
//                       </td>
//                       <td className={"pl-0 fw-thin"}>
//                         10%
//                       </td>
//                     </tr>
//                     </tbody>
//                   </Table>
//                 </Widget>
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//         <Modal isOpen={this.state.modal} toggle={this.toggle} style={{color: '#000000'}}>
//           <ModalHeader toggle={this.toggle}>{this.state.modalTitle}
//           </ModalHeader>
//           <ModalBody>
//           {this.state.modalAction} {this.state.modalToken} : 
//             <Input
//               value={this.state.modalInputValue}
//               onChange={this.setInput}>
//             </Input>
//           </ModalBody>
//           <ModalFooter>
//             <Button color="primary" onClick={this.state.modalCall}>Confirm</Button>{' '}
//             <Button color="secondary" onClick={this.toggle}>Cancel</Button>
//           </ModalFooter>
//         </Modal>
//       </div>
//     );
//   }
// }

// function mapStateToProps(store) {
//   return {
//     myAccount: store.loanshark.myAccount,
//     selectedPair: store.loanshark.selectedPair,
//     numberOfEth:  store.loanshark.userDebtBalance,
//     userDepositBalanceEth: store.loanshark.userDepositBalanceEth,
//     userDepositBalanceAvax: store.loanshark.userDepositBalanceAvax,
//     userDebtBalanceBtc:  store.loanshark.userDebtBalanceBtc,
//     userDebtBalanceUsdt:  store.loanshark.userDebtBalanceUsdt,
//     myFujiVaultETHBTC: store.loanshark.myFujiVaultETHBTC,
//     myFujiVaultAVAXUSDT: store.loanshark.myFujiVaultAVAXUSDT,
//     myFliquidatorAVAX: store.loanshark.myFliquidatorAVAX,
//     myFujiController: store.loanshark.myFujiController,
//     myFujiOracle: store.loanshark.myFujiOracle,
//     mySmartVaultBtc: store.loanshark.mySmartVaultBtc,
//     mySmartVaultUsdt: store.loanshark.mySmartVaultUsdt,
//     myETHContract: store.loanshark.myETHContract,
//     myBTCContract:  store.loanshark.myBTCContract,
//     myUSDTContract:  store.loanshark.myUSDTContract,
//     priceOfEth: store.loanshark.priceOfEth,
//     priceOfBtc: store.loanshark.priceOfBtc,
//     priceOfAvax: store.loanshark.priceOfAvax,
//     priceOfUsdt: store.loanshark.priceOfUsdt,
//     providerAAVEAVAX: store.loanshark.providerAAVEAVAX,
//     smartVaultBtc: store.loanshark.smartVaultBtc,
//     smartVaultUsdt: store.loanshark.smartVaultUsdt,
//     myETHAmount: store.loanshark.myETHAmount,
//     myBTCAmount: store.loanshark.myBTCAmount,
//     LTV: store.loanshark.LTV,
//   };
// }

// export default connect(mapStateToProps)(Dashboard);