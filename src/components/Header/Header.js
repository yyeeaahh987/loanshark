import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from "@fortawesome/free-solid-svg-icons"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { Container, Row, Col } from 'react-bootstrap';
import { Grid } from '@mui/material';
import {
  Navbar, Button, Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  // Container,
} from "reactstrap";

import RoundShapeButton from '../Button/RoundShapeButton/RoundShapeButton'
import {
  toggleLoading,
} from "../../actions/navigation";

import {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  changeActiveSidebarItem,
} from "../../actions/navigation";

import {
  changeMyAccount,
  changeSelectedPair,
  changeMyFujiVaultETHBTC,
  changeMyFujiVaultAVAXUSDT,
  changeMyFliquidatorAvax,
  changeMyFujiController,
  changeMyFujiOracle,
  changeMyEthContract,
  changeMyBtcContract,
  changeMyUsdtContract,
  changeProviderAAVEAVAX,
  changeMySmartVaultBtc,
  changeMySmartVaultUsdt
} from "../../actions/loanshark";

import {
  changeLpPoolBtc,
  changeLpTokenBtc,
  changeVaultBtc,
  changeTopupAction,
} from "../../actions/backd";

import Controller from '../../abi/fujidao/Controller.json';
import FujiVaultAVAX from '../../abi/fujidao/FujiVaultAVAX.json';
import FliquidatorAVAX from '../../abi/fujidao/FliquidatorAVAX.json';
import FujiOracle from '../../abi/fujidao/FujiOracle.json';
import ProviderAAVEAVAX from '../../abi/fujidao/ProviderAAVEAVAX.json';
import SmartVault from '../../abi/fujidao/SmartVault.json';

import lpPoolAbi from '../../abi/backd/lpPool.json';
import lpTokenAbi from '../../abi/backd/lpToken.json';
import topupActionAbi from '../../abi/backd/topupAction.json';
import vaultBtcAbi from '../../abi/backd/vaultBtc.json';

import API from '../../utils/API'

import Web3 from 'web3';
import arrowUnactive from '../../images/Arrow 6.svg'
import arrowActive from '../../images/Arrow 5.svg'

import s from "./Header.module.scss"; // eslint-disable-line css-modules/no-unused-class
import { TabContainer } from "react-bootstrap";

//Fujidao Contracts
const MY_FujiVaultETHBTC = process.env.REACT_APP_MY_FujiVaultETHBTC;
const MY_FujiVaultAVAXUSDT = process.env.REACT_APP_MY_FujiVaultAVAXUSDT;
const MY_FliquidatorAVAX = process.env.REACT_APP_MY_FliquidatorAVAX;
const MY_FujiController = process.env.REACT_APP_MY_FujiController;
const MY_FujiOracle = process.env.REACT_APP_MY_FujiOracle;
const AAVEAVAX = process.env.REACT_APP_ProviderAAVEAVAX;

//Backd Contracts
const LP_POOL_BTC = process.env.REACT_APP_LP_POOL_BTC;
const LP_TOKEN_BTC = process.env.REACT_APP_LP_TOKEN_BTC;
const VAULT_BTC = process.env.REACT_APP_VAULT_BTC;
const TOPUP_ACTION = process.env.REACT_APP_TOPUP_ACTION;
const SMART_VAULT_BTC = process.env.REACT_APP_SMART_VAULT_BTC;
const SMART_VAULT_USDT = process.env.REACT_APP_SMART_VAULT_USDT;

//Asset Contracts
const WBTC = process.env.REACT_APP_WBTC;
const WETH = process.env.REACT_APP_WETH;
const USDT = process.env.REACT_APP_USDT;

class Header extends React.Component {
  static propTypes = {
    sidebarOpened: PropTypes.bool.isRequired,
    sidebarStatic: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleMintETH = this.toggleMintETH.bind(this);
    this.setInput = this.setInput.bind(this);
    this.toggle = this.toggle.bind(this);
    this.switchSidebar = this.switchSidebar.bind(this);
    this.toggleNotifications = this.toggleNotifications.bind(this);
    this.toggleMessages = this.toggleMessages.bind(this);
    this.toggleAccount = this.toggleAccount.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.changeArrowImg = this.changeArrowImg.bind(this);
    this.changeArrowImgOut = this.changeArrowImgOut.bind(this);
    this.ethEnabled = this.ethEnabled.bind(this);
    this.getNeededCollateralFor = this.getNeededCollateralFor.bind(this);

    this.setMyFujiVaultETHBTC = this.setMyFujiVaultETHBTC.bind(this);
    this.setMyFujiVaultAVAXUSDT = this.setMyFujiVaultAVAXUSDT.bind(this);
    this.setMyFliquidatorAVAX = this.setMyFliquidatorAVAX.bind(this);
    this.setMyFujiController = this.setMyFujiController.bind(this);
    this.setMyFujiOracle = this.setMyFujiOracle.bind(this);
    this.setMyETHContract = this.setMyETHContract.bind(this);
    this.setMyBTCContract = this.setMyBTCContract.bind(this);
    this.setMyUSDTContract = this.setMyUSDTContract.bind(this);
    this.setMyAAVEAVAXContract = this.setMyAAVEAVAXContract.bind(this);
    this.setMySmartVaultContractBtc = this.setMySmartVaultContractBtc.bind(this);
    this.setMySmartVaultContractUsdt = this.setMySmartVaultContractUsdt.bind(this);

    this.state = {
      menuOpen: false,
      notificationsOpen: false,
      messagesOpen: false,
      accountOpen: false,
      notificationsTabSelected: 1,
      focus: false,
      showNewMessage: false,
      hideMessage: true,
      run: true,
      arrowImg: arrowActive,
      myAccount: false,
      ethNeededCollateral: 0,
      myFliquidatorAVAX: '',
      myFujiController: '',
      myFujiOracle: '',
      myETHContract: '',
      myBTCContract: '',
      myUSDTContract: '',
      modal: false,
      modalTitle: '',
      modalToken: '',
      modalAction: '',
      modalCall: () => { },
      modalInputValue: 0
    };
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    })
  }

  toggleFocus = () => {
    this.setState({ focus: !this.state.focus });
  };

  calltoggleLoading() {
    this.props.dispatch(toggleLoading());
  }

  toggleNotifications() {
    this.setState({
      notificationsOpen: !this.state.notificationsOpen,
    });
  }

  setInput(event) {
    this.setState({ modalInputValue: event.target.value });
  }

  toggleMessages() {
    this.setState({
      messagesOpen: !this.state.messagesOpen,
    });
  }

  toggleAccount() {
    this.setState({
      accountOpen: !this.state.accountOpen,
    });
  }

  changeArrowImg() {
    this.setState({
      arrowImg: arrowUnactive
    })
  }

  changeArrowImgOut() {
    this.setState({
      arrowImg: arrowActive
    })
  }

  // collapse/uncolappse
  switchSidebar() {
    if (this.props.sidebarOpened) {
      this.props.dispatch(closeSidebar());
      this.props.dispatch(changeActiveSidebarItem(null));
    } else {
      const paths = this.props.location.pathname.split("/");
      paths.pop();
      this.props.dispatch(openSidebar());
      this.props.dispatch(changeActiveSidebarItem(paths.join("/")));
    }
  }

  // tables/non-tables
  toggleSidebar() {
    this.props.dispatch(toggleSidebar());
    if (this.props.sidebarStatic) {
      localStorage.setItem("staticSidebar", "false");
      this.props.dispatch(changeActiveSidebarItem(null));
    } else {
      localStorage.setItem("staticSidebar", "true");
      const paths = this.props.location.pathname.split("/");
      paths.pop();
      this.props.dispatch(changeActiveSidebarItem(paths.join("/")));
    }
  }

  toggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  }

  setMyAccount(val) {
    this.setState({
      myAccount: val,
    });
    this.props.dispatch(changeMyAccount(val));
  }

  setMyFujiVaultETHBTC(val) {
    this.props.dispatch(changeMyFujiVaultETHBTC(val));
  }

  setMyFujiVaultAVAXUSDT(val) {
    this.props.dispatch(changeMyFujiVaultAVAXUSDT(val));
  }

  setMyFliquidatorAVAX(val) {
    this.setState({
      myFliquidatorAVAX: val,
    });
    this.props.dispatch(changeMyFliquidatorAvax(val));
  }

  setMyFujiController(val) {
    this.setState({
      myFujiController: val,
    });
    this.props.dispatch(changeMyFujiController(val));
  }

  setMyFujiOracle(val) {
    this.setState({
      myFujiOracle: val,
    });
    this.props.dispatch(changeMyFujiOracle(val));
  }

  setMySmartVaultContractBtc(val) {
    this.props.dispatch(changeMySmartVaultBtc(val));
  }

  setMySmartVaultContractUsdt(val) {
    this.props.dispatch(changeMySmartVaultUsdt(val));
  }

  setMyETHContract(val) {
    this.setState({
      myETHContract: val,
    });
    this.props.dispatch(changeMyEthContract(val));
  }

  setMyBTCContract(val) {
    this.setState({
      myBTCContract: val,
    });
    this.props.dispatch(changeMyBtcContract(val));
  }

  setMyUSDTContract(val) {
    this.setState({
      myUSDTContract: val,
    });
    this.props.dispatch(changeMyUsdtContract(val));
  }

  setMyAAVEAVAXContract(val) {
    this.props.dispatch(changeProviderAAVEAVAX(val));
  }

  getNeededCollateralFor() {
    API(this.props);
  }

  toggleMintETH(inputModalToken, inputModalAction) {
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

        this.props.myETHContract.methods
          .mint(...args)
          .send({ from: this.props.myAccount })
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

  toggleMintBTC(inputModalToken, inputModalAction) {
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

        this.props.myBTCContract.methods
          .mint(...args)
          .send({ from: this.props.myAccount })
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

  ethEnabled() {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();
      const web3js = window.web3;
      web3js.eth.getAccounts((err, result) => {
        console.log("account error:", err);
        console.log("accounts:", result);

        this.setState({ myAccount: result[0] });
        this.setMyAccount(result[0]);
        const chainId = 43113 // Avax Testnet

        if (window.ethereum.networkVersion !== chainId) {
          try {
            window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: window.web3.utils.toHex(chainId) }]
            })
              .catch((error) => {
                console.log(error);
                // This error code indicates that the chain has not been added to MetaMask
                if (error.code === 4902) {
                  window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainName: 'Avalanche Fuji Testnet',
                        chainId: window.web3.utils.toHex(chainId),
                        nativeCurrency: { name: 'AVAX', decimals: 18, symbol: 'AVAX' },
                        rpcUrls: ['https://speedy-nodes-nyc.moralis.io/2b572311b72eca56f1517c91/avalanche/testnet']
                      }
                    ]
                  }).then(() => {
                    const dataHong = require('../../abi/Hong.json');
                    this.setMyFujiVaultETHBTC(new window.web3.eth.Contract(FujiVaultAVAX.abi, MY_FujiVaultETHBTC));
                    this.setMyFujiVaultAVAXUSDT(new window.web3.eth.Contract(FujiVaultAVAX.abi, MY_FujiVaultAVAXUSDT));
                    this.setMyFliquidatorAVAX(new window.web3.eth.Contract(FliquidatorAVAX.abi, MY_FliquidatorAVAX));
                    this.setMyFujiController(new window.web3.eth.Contract(Controller.abi, MY_FujiController));
                    this.setMyFujiOracle(new window.web3.eth.Contract(FujiOracle.abi, MY_FujiOracle));
                    this.setMyETHContract(new window.web3.eth.Contract(dataHong, WETH));
                    this.setMyBTCContract(new window.web3.eth.Contract(dataHong, WBTC));
                    this.setMyUSDTContract(new window.web3.eth.Contract(dataHong, USDT));
                    this.setMyAAVEAVAXContract(new window.web3.eth.Contract(ProviderAAVEAVAX.abi, ProviderAAVEAVAX));
                    this.setMySmartVaultContract(new window.web3.eth.Contract(SmartVault, SMART_VAULT_BTC));
                    this.setMySmartVaultContract(new window.web3.eth.Contract(SmartVault, SMART_VAULT_USDT));

                    this.props.dispatch(changeLpPoolBtc(new window.web3.eth.Contract(lpPoolAbi, LP_POOL_BTC)));
                    this.props.dispatch(changeLpTokenBtc(new window.web3.eth.Contract(lpTokenAbi, LP_TOKEN_BTC)));
                    this.props.dispatch(changeVaultBtc(new window.web3.eth.Contract(vaultBtcAbi, VAULT_BTC)));
                    this.props.dispatch(changeTopupAction(new window.web3.eth.Contract(topupActionAbi, TOPUP_ACTION)));

                    this.props.dispatch(changeSelectedPair('AVAXUSDT'));

                    this.getNeededCollateralFor()
                  });
                }
              })
              .then(() => {
                const dataHong = require('../../abi/Hong.json');
                this.setMyFujiVaultETHBTC(new window.web3.eth.Contract(FujiVaultAVAX.abi, MY_FujiVaultETHBTC));
                this.setMyFujiVaultAVAXUSDT(new window.web3.eth.Contract(FujiVaultAVAX.abi, MY_FujiVaultAVAXUSDT));
                this.setMyFliquidatorAVAX(new window.web3.eth.Contract(FliquidatorAVAX.abi, MY_FliquidatorAVAX));
                this.setMyFujiController(new window.web3.eth.Contract(Controller.abi, MY_FujiController));
                this.setMyFujiOracle(new window.web3.eth.Contract(FujiOracle.abi, MY_FujiOracle));
                this.setMyETHContract(new window.web3.eth.Contract(dataHong, WETH));
                this.setMyBTCContract(new window.web3.eth.Contract(dataHong, WBTC));
                this.setMyUSDTContract(new window.web3.eth.Contract(dataHong, USDT));
                this.setMyAAVEAVAXContract(new window.web3.eth.Contract(ProviderAAVEAVAX.abi, AAVEAVAX));
                this.setMySmartVaultContractBtc(new window.web3.eth.Contract(SmartVault, SMART_VAULT_BTC));
                this.setMySmartVaultContractUsdt(new window.web3.eth.Contract(SmartVault, SMART_VAULT_USDT));

                this.props.dispatch(changeLpPoolBtc(new window.web3.eth.Contract(lpPoolAbi, LP_POOL_BTC)));
                this.props.dispatch(changeLpTokenBtc(new window.web3.eth.Contract(lpTokenAbi, LP_TOKEN_BTC)));
                this.props.dispatch(changeVaultBtc(new window.web3.eth.Contract(vaultBtcAbi, VAULT_BTC)));
                this.props.dispatch(changeTopupAction(new window.web3.eth.Contract(topupActionAbi, TOPUP_ACTION)));

                this.props.dispatch(changeSelectedPair('ETHBTC'));

                this.getNeededCollateralFor()
              })
              .catch((error) => {
                console.log(error);
              });
          } catch (err) {
          }
        }
      })
    }
  }

  render() {
    return (
      <div>
        <Navbar>

          <Grid container>
            {/* <Grid item xs={6} md={6}>
              <Grid container spacing={2}>
                <Grid item>
                  <div>
                    <FontAwesomeIcon onClick={() => {
                      console.log(`on click back`)
                    }}
                      icon={faArrowLeftLong} />
                  </div>
                </Grid>
                <Grid item>
                  <div>
                    <span>Back</span>
                  </div>
                </Grid>
              </Grid>
            </Grid> */}
            <Grid item xs={12} md={12}>
              <Grid container spacing={2} justifyContent="flex-end" alignItems={"center"}>
                <Grid item>
                  <div>
                    {
                      !this.state.myAccount ?
                        <RoundShapeButton
                          label={"Connect Wallet"}
                          onClick={(e) => { this.ethEnabled() }}
                        ></RoundShapeButton>
                        :
                        <div style={{ marginLeft: "auto" }}><Input disabled={true} valid style={{ width: '450px' }} value={this.state.myAccount}></Input></div>
                    }

                  </div>
                </Grid>
                <Grid item>
                  <div>
                    <FontAwesomeIcon style={{cursor: "pointer" }}onClick={() => {
                      this.getNeededCollateralFor();
                    }}
                      icon={faRotateRight} />
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Navbar>






        <Modal isOpen={this.state.modal} toggle={this.toggle} style={{ color: '#000000' }}>
          <ModalHeader toggle={this.toggle}>{this.state.modalTitle}</ModalHeader>
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
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    myAccount: store.loanshark.myAccount,
    selectedPair: store.loanshark.selectedPair,
    numberOfEth: store.loanshark.userDebtBalance,
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
    providerAAVEAVAX: store.loanshark.providerAAVEAVAX,
    smartVaultBtc: store.loanshark.smartVaultBtc,
    smartVaultUsdt: store.loanshark.smartVaultUsdt,
    LTV: store.loanshark.LTV,
    liquidationPrice: store.loanshark.liquidationPrice,

    lpPoolBtc: store.backd.lpPoolBtc,
    lpTokenBtc: store.backd.lpTokenBtc,
    vaultBtc: store.backd.vaultBtc,
    topupAction: store.backd.topupAction,
    totalBtcLpAmount: store.backd.totalBtcLpAmount
  };
}

export default withRouter(connect(mapStateToProps)(Header));














{/* <Navbar
className={`${s.root} d-print-none`}
style={{ zIndex: 0, backgroundColor: '#000000', display: "flex" }}
>
{!this.state.myAccount ?
  <Button style={{ marginLeft: "auto" }} color={"outline-light"} className={`${s.btnShadow}`} onClick={this.ethEnabled}>
    Connect Wallet
  </Button>
  : <div style={{ marginLeft: "auto" }}><Input disabled={true} valid style={{ width: '450px' }} value={this.state.myAccount}></Input></div>
}
&nbsp;
<Button color={"outline-light"} disabled={!this.props.myAccount} onClick={this.getNeededCollateralFor}>Refresh</Button>
&nbsp;
<Button color={"outline-light"} disabled={!this.props.myETHContract} onClick={() => this.toggleMintETH('ETH', 'Mint')}>Mint ETH</Button>
&nbsp;
<Button color={"outline-light"} disabled={!this.props.myBTCContract} onClick={() => this.toggleMintBTC('BTC', 'Mint')}>Mint BTC</Button>
</Navbar>



 */}


















// <div>
// <Navbar
//   className={`${s.root} d-print-none`}
//   style={{ zIndex: 0, backgroundColor: '#000000', display: "flex" }}
// >
//   {!this.state.myAccount ?
//     <Button style={{ marginLeft: "auto" }} color={"outline-light"} className={`${s.btnShadow}`} onClick={this.ethEnabled}>
//       Connect Wallet
//     </Button>
//     : <div style={{ marginLeft: "auto" }}><Input disabled={true} valid style={{ width: '450px' }} value={this.state.myAccount}></Input></div>
//   }
//   &nbsp;
//   <Button color={"outline-light"} disabled={!this.props.myAccount} onClick={this.getNeededCollateralFor}>Refresh</Button>
//   &nbsp;
//   <Button color={"outline-light"} disabled={!this.props.myETHContract}  onClick={() => this.toggleMintETH('ETH', 'Mint')}>Mint ETH</Button>
//   &nbsp;
//   <Button color={"outline-light"} disabled={!this.props.myBTCContract} onClick={() => this.toggleMintBTC('BTC', 'Mint')}>Mint BTC</Button>
// </Navbar>
// <Modal isOpen={this.state.modal} toggle={this.toggle} style={{ color: '#000000' }}>
//   <ModalHeader toggle={this.toggle}>{this.state.modalTitle}</ModalHeader>
//   <ModalBody>
//     {this.state.modalAction} {this.state.modalToken} :
//     <Input
//       value={this.state.modalInputValue}
//       onChange={this.setInput}>
//     </Input>
//   </ModalBody>
//   <ModalFooter>
//     <Button color="primary" onClick={this.state.modalCall}>Confirm</Button>{' '}
//     <Button color="secondary" onClick={this.toggle}>Cancel</Button>
//   </ModalFooter>
// </Modal>
// </div>

















{/* <Row>
<Col xs={6}>
  <Row>
    <Col>
      <div>
        <FontAwesomeIcon onClick={() => {
          console.log(`on click back`)
        }}
          icon={faArrowLeftLong} />
      </div>
    </Col>
    <Col>
      <div>
        <span>Back</span>
      </div>
    </Col>
  </Row>
</Col>
<Col xs={6}>
  <Row>
    <Col xs={9}>
      <div>
        <RoundShapeButton
          label={"Connect Wallet"}
          onClick={(e) => { console.log(e) }}
        ></RoundShapeButton>
      </div>
    </Col>
    <Col>
      <div>
        <FontAwesomeIcon icon={faRotateRight}
          onClick={() => {
            console.log(`on click refresh`)
          }}
        />
      </div>
    </Col>
  </Row>
</Col>
<Col xs={6}>

</Col>
<Col xs={1}>

</Col>
</Row> */}