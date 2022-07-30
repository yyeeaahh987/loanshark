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
import TableRow from '../../components/TableRow/TableRow'



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
      modalCall: () => { },
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
    this.setState({ modalInputValue: event.target.value });
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
            .send({ from: this.props.myAccount })
            .on("error", (error, receipt) => {
              this.calltoggleLoading();
            })
            .then((receipt) => {
              this.props.myFujiVaultETHBTC.methods
                .deposit(...args)
                .send({ from: this.props.myAccount })
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
            .send({ from: this.props.myAccount, value: a })
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
            .send({ from: this.props.myAccount })
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
            .send({ from: this.props.myAccount })
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
            .send({ from: this.props.myAccount })
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
            .send({ from: this.props.myAccount })
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
            .send({ from: this.props.myAccount })
            .on("error", (error, receipt) => {
              this.calltoggleLoading();
            })
            .then((receipt) => {
              this.props.myFujiVaultETHBTC.methods
                .payback(...args)
                .send({ from: this.props.myAccount })
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
            .send({ from: this.props.myAccount })
            .on("error", (error, receipt) => {
              this.calltoggleLoading();
            })
            .then((receipt) => {
              this.props.myFujiVaultAVAXUSDT.methods
                .payback(...args)
                .send({ from: this.props.myAccount })
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
            .send({ from: this.props.myAccount })
            .on("error", (error, receipt) => {
              this.calltoggleLoading();
            })
            .then((receipt) => {
              this.props.mySmartVaultBtc.methods
                .stakeTokens(...args)
                .send({ from: this.props.myAccount })
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
            .send({ from: this.props.myAccount })
            .on("error", (error, receipt) => {
              this.calltoggleLoading();
            })
            .then((receipt) => {
              this.props.mySmartVaultUsdt.methods
                .stakeTokens(...args)
                .send({ from: this.props.myAccount })
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
            .send({ from: this.props.myAccount })
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
            .send({ from: this.props.myAccount })
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
          .send({ from: this.props.myAccount })
          .on("error", (error, receipt) => {
            this.calltoggleLoading();
          })
          .then((receipt) => {

            myDebtContract.methods
              .approve(...approveArgs)
              .send({ from: this.props.myAccount })
              .on("error", (error, receipt) => {
                this.calltoggleLoading();
              })
              .then((receipt) => {
                myFujiVaultContract.methods
                  .payback(...argsForFujiVault)
                  .send({ from: this.props.myAccount })
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
          .send({ from: this.props.myAccount })
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
        {/* <TableRow>

        </TableRow> */}


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
              fontSize: "1em",
            }}>My Borrowing Position</span>
          </Grid>

          <Grid item xs={12}>
            <Table className={"mb-0"} borderless responsive style={{borderCollapse:"separate", borderSpacing:"0"}}>
              <thead>
                <tr>
                  <th key={0} scope="col" className={"pl-0"}>
                    Asset
                  </th>
                  <th key={1} scope="col" className={"pl-0"}>
                    Collateral
                  </th>
                  <th key={2} scope="col" className={"pl-0"}>
                    Debt
                  </th>
                  <th key={3} scope="col" className={"pl-0"}>
                    APY
                  </th>
                  <th key={4} scope="col" className={"pl-0"}>
                    Health Factor
                  </th>
                  <th key={5} scope="col" className={"pl-0"}>
                    Smart Value
                  </th>
                  <th key={6} scope="col" className={"pl-0"}>
                    Provider
                  </th>
                  <th key={7} scope="col" className={"pl-0"}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="">
                <tr key={0}>
                  <td className="fw-thin pl-0 fw-thin">
                    ETH/BTC
                  </td>
                  <td className="fw-thin pl-0 fw-thin">
                    <p>$34.192.9</p>
                    <p>30.4ETH</p>
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    <p>$41,340.1</p>
                    <p>1.87ETH</p>
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    20.4%
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    20
                  </td>
                  <td className="fw-thin pl-0 fw-thin">
                    $19,294
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    AAVE
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    <Button color={"danger"} >Manage</Button>
                  </td>
                </tr>
                <tr key={1}>
                  <td className="fw-thin pl-0 fw-thin">
                    ONE/USDT
                  </td>
                  <td className="fw-thin pl-0 fw-thin">
                    <p>$34.192.9</p>
                    <p>30.4ETH</p>
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    <p>$41,340.1</p>
                    <p>1.87ETH</p>
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    20
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    20.4%
                  </td>
                  <td className="fw-thin pl-0 fw-thin">
                    $19,294
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    AAVE
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    <Button color={"danger"} >Manage</Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Grid>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            + Borrow
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <span style={{
              fontWeight: "800",
              fontSize: "1em",
            }}>My Smart Value Position</span>
          </Grid>

          <Grid item xs={12}>
            <Table className={"mb-0"} borderless responsive>
              <thead>
                <tr>
                  <th key={0} scope="col" className={"pl-0"}>
                    Debt
                  </th>
                  <th key={1} scope="col" className={"pl-0"}>
                    Amount
                  </th>
                  <th key={2} scope="col" className={"pl-0"}>
                    APY
                  </th>
                  <th key={3} scope="col" className={"pl-0"}>
                    Health Factor
                  </th>
                  <th key={4} scope="col" className={"pl-0"}>
                    Liquidation
                  </th>
                  <th key={5} scope="col" className={"pl-0"}>
                    Single Top-up
                  </th>
                  <th key={6} scope="col" className={"pl-0"}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="">
                <tr key={0}>
                  <td className="fw-thin pl-0 fw-thin">
                    BTC
                  </td>
                  <td className="fw-thin pl-0 fw-thin">
                    <p>$41,340.1</p>
                    <p>18.7ETH</p>
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    20.4%
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    20
                  </td>
                  <td className="fw-thin pl-0 fw-thin">
                    1.1
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    0.4392
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Button color={"danger"}>Payback</Button>
                      </Grid>
                      <Grid item>
                        <Button color={"danger"}>Leave Smart Valut</Button>
                      </Grid>
                    </Grid>
                  </td>
                </tr>
                <tr key={1}>
                  <td className="fw-thin pl-0 fw-thin">
                    BTC
                  </td>
                  <td className="fw-thin pl-0 fw-thin">
                    <p>$41,340.1</p>
                    <p>18.7ETH</p>
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    20.4%
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    20
                  </td>
                  <td className="fw-thin pl-0 fw-thin">
                    1.1
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    0.4392
                  </td>
                  <td className={"pl-0 fw-thin"}>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Button color={"danger"}>Payback</Button>
                      </Grid>
                      <Grid item>
                        <Button color={"danger"}>Leave Smart Valut</Button>
                      </Grid>
                    </Grid>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Grid>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            + Smart Vault
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
    numberOfEth: store.loanshark.numberOfEth,
    userDepositBalanceEth: store.loanshark.userDepositBalanceEth,
    userDepositBalanceAvax: store.loanshark.userDepositBalanceAvax,
    userDebtBalanceBtc: store.loanshark.userDebtBalanceBtc,
    userDebtBalanceUsdt: store.loanshark.userDebtBalanceUsdt,
    myFujiVaultETHBTC: store.loanshark.myFujiVaultETHBTC,
    myFujiVaultAVAXUSDT: store.loanshark.myFujiVaultAVAXUSDT,
    myFliquidatorAVAX: store.loanshark.myFliquidatorAVAX,
    myFujiController: store.loanshark.myFujiController,
    myFujiOracle: store.loanshark.myFujiOracle,
    mySmartVaultBtc: store.loanshark.mySmartVaultBtc,
    mySmartVaultUsdt: store.loanshark.mySmartVaultUsdt,
    myETHContract: store.loanshark.myETHContract,
    myBTCContract: store.loanshark.myBTCContract,
    myUSDTContract: store.loanshark.myUSDTContract,
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


