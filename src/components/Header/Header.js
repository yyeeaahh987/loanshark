import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import WalletConnectProvider from "@walletconnect/web3-provider";
//  Enable session (triggers QR Code modal)
import s from "./Header.module.scss";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faRotateRight, faArrowLeftLong, faLightbulb } from "@fortawesome/free-solid-svg-icons"
import { Grid } from '@mui/material';
import {
	Navbar, Button, Input,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "reactstrap";

import RoundShapeButton from '../Button/RoundShapeButton/RoundShapeButton'
import {
	toggleLoading,
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
	changeGasBank,

	changeLpPoolEth,
	changeLpTokenEth,
	changeVaultEth,
} from "../../actions/backd";

import {
	changeTheme
} from "../../actions/layout"

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
import gasBankAbi from '../../abi/backd/gasBank.json';

import API from '../../utils/API'

import Web3 from 'web3';
import arrowUnactive from '../../images/Arrow 6.svg'
import arrowActive from '../../images/Arrow 5.svg'

//
const CHIAN_ID = 43113 //AVAX TESTNET
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
const GAS_BANK = process.env.REACT_APP_GAS_BANK;

const LP_POOL_ETH = process.env.REACT_APP_LP_POOL_ETH;
const LP_TOKEN_ETH = process.env.REACT_APP_LP_TOKEN_ETH;
const VAULT_ETH = process.env.REACT_APP_VAULT_ETH;

//Asset Contracts
const WBTC = process.env.REACT_APP_WBTC;
const WETH = process.env.REACT_APP_WETH;
const USDT = process.env.REACT_APP_USDT;

//metamask url
const METAMASK_INSTALL_URL = process.env.REACT_APP_METAMASK_INSTALL_URL;

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

		this.handleResize = this.handleResize.bind(this);
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
		this.ethDisabled = this.ethDisabled.bind(this);
		this.walletConnectEnabled = this.walletConnectEnabled.bind(this);
		this.trustWalletConnectEnabled = this.trustWalletConnectEnabled(this);
		this.disconnectWalletConnectEnabled = this.disconnectWalletConnectEnabled.bind(this);
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
		this.setAppThemeMode = this.setAppThemeMode.bind(this);

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
			myAccount: "",
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

	async componentDidMount() {
		if (localStorage.getItem("isWalletConnected") === "true") {
			//check metamask are connected before
			window.web3 = new Web3(window.web3.currentProvider);
			window.ethereum.enable();
			let validAccount = await window.ethereum.request({ method: "eth_accounts" });
			if (validAccount) {
				this.ethEnabled()
			}
		}

	}

	clearAccount() {
		console.log(`clear account`)
		this.setState({ myAccount: null })
		this.setMyFujiVaultETHBTC(null);
		this.setMyFujiVaultAVAXUSDT(null);
		this.setMyFliquidatorAVAX(null);
		this.setMyFujiController(null);
		this.setMyFujiOracle(null);
		this.setMyETHContract(null);
		this.setMyBTCContract(null);
		this.setMyUSDTContract(null);
		this.setMyAAVEAVAXContract(null);
		this.setMySmartVaultContractBtc(null);
		this.setMySmartVaultContractUsdt(null);

		this.props.dispatch(changeMyAccount(null));
		this.props.dispatch(changeLpPoolBtc(null));
		this.props.dispatch(changeLpTokenBtc(null));
		this.props.dispatch(changeVaultBtc(null));
		this.props.dispatch(changeTopupAction(null));
		this.props.dispatch(changeGasBank(null));

		this.props.dispatch(changeSelectedPair('ETHBTC'));
		this.getNeededCollateralFor("CLEAR")
		localStorage.setItem("isWalletConnected", false)
	}

	handleResize() {
		this.props.dispatch(toggleSidebar());
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

	setAppThemeMode(mode) {
		this.props.dispatch(changeTheme(mode));
	}

	getNeededCollateralFor(action) {
		API(this.props, action);
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
		if (window.web3 === undefined) {
			window.open(METAMASK_INSTALL_URL);
		}
		else if (window.web3) {
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
										this.setMySmartVaultContractBtc(new window.web3.eth.Contract(SmartVault, SMART_VAULT_BTC));
										this.setMySmartVaultContractUsdt(new window.web3.eth.Contract(SmartVault, SMART_VAULT_USDT));

										this.props.dispatch(changeLpPoolBtc(new window.web3.eth.Contract(lpPoolAbi, LP_POOL_BTC)));
										this.props.dispatch(changeLpTokenBtc(new window.web3.eth.Contract(lpTokenAbi, LP_TOKEN_BTC)));
										this.props.dispatch(changeVaultBtc(new window.web3.eth.Contract(vaultBtcAbi, VAULT_BTC)));
										this.props.dispatch(changeTopupAction(new window.web3.eth.Contract(topupActionAbi, TOPUP_ACTION)));
										this.props.dispatch(changeGasBank(new window.web3.eth.Contract(gasBankAbi, GAS_BANK)));

										this.props.dispatch(changeLpPoolEth(new window.web3.eth.Contract(lpPoolAbi, LP_POOL_ETH)));
										this.props.dispatch(changeLpTokenEth(new window.web3.eth.Contract(lpTokenAbi, LP_TOKEN_ETH)));
										this.props.dispatch(changeVaultEth(new window.web3.eth.Contract(vaultBtcAbi, VAULT_ETH)));

										this.props.dispatch(changeSelectedPair('AVAXUSDT'));

										this.getNeededCollateralFor("GET_NEW")
									});
								}
							})
							.then(() => {
								const dataHong = require('../../abi/Hong.json');
								localStorage.setItem("isWalletConnected", true)
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
								this.props.dispatch(changeGasBank(new window.web3.eth.Contract(gasBankAbi, GAS_BANK)));

								this.props.dispatch(changeLpPoolEth(new window.web3.eth.Contract(lpPoolAbi, LP_POOL_ETH)));
								this.props.dispatch(changeLpTokenEth(new window.web3.eth.Contract(lpTokenAbi, LP_TOKEN_ETH)));
								this.props.dispatch(changeVaultEth(new window.web3.eth.Contract(vaultBtcAbi, VAULT_ETH)));

								this.props.dispatch(changeSelectedPair('ETHBTC'));

								this.getNeededCollateralFor("GET_NEW")
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

	ethDisabled() {
		window.location.reload();
	}

	async walletConnectEnabled() {
		const provider = new WalletConnectProvider({
			rpc: {
				43113: "https://api.avax-test.network/ext/bc/C/rpc",
			},
			// infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
		});

		await provider.enable();
		window.web3 = new Web3(provider);
		const accounts = await window.web3.eth.getAccounts();
		console.log(`accounts`, accounts)
		this.setState({ myAccount: accounts[0] });
		this.setMyAccount(accounts[0]);
		// //  Get Chain Id
		const chainId = await window.web3.eth.getChainId();
		if (parseInt(chainId) === CHIAN_ID) {
			window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: window.web3.utils.toHex(CHIAN_ID) }]
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
							this.setMySmartVaultContractBtc(new window.web3.eth.Contract(SmartVault, SMART_VAULT_BTC));
							this.setMySmartVaultContractUsdt(new window.web3.eth.Contract(SmartVault, SMART_VAULT_USDT));

							this.props.dispatch(changeLpPoolBtc(new window.web3.eth.Contract(lpPoolAbi, LP_POOL_BTC)));
							this.props.dispatch(changeLpTokenBtc(new window.web3.eth.Contract(lpTokenAbi, LP_TOKEN_BTC)));
							this.props.dispatch(changeVaultBtc(new window.web3.eth.Contract(vaultBtcAbi, VAULT_BTC)));
							this.props.dispatch(changeTopupAction(new window.web3.eth.Contract(topupActionAbi, TOPUP_ACTION)));
							this.props.dispatch(changeGasBank(new window.web3.eth.Contract(gasBankAbi, GAS_BANK)));

							this.props.dispatch(changeLpPoolEth(new window.web3.eth.Contract(lpPoolAbi, LP_POOL_ETH)));
							this.props.dispatch(changeLpTokenEth(new window.web3.eth.Contract(lpTokenAbi, LP_TOKEN_ETH)));
							this.props.dispatch(changeVaultEth(new window.web3.eth.Contract(vaultBtcAbi, VAULT_ETH)));

							this.props.dispatch(changeSelectedPair('AVAXUSDT'));

							this.getNeededCollateralFor("GET_NEW")
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
					this.props.dispatch(changeGasBank(new window.web3.eth.Contract(gasBankAbi, GAS_BANK)));

					this.props.dispatch(changeLpPoolEth(new window.web3.eth.Contract(lpPoolAbi, LP_POOL_ETH)));
					this.props.dispatch(changeLpTokenEth(new window.web3.eth.Contract(lpTokenAbi, LP_TOKEN_ETH)));
					this.props.dispatch(changeVaultEth(new window.web3.eth.Contract(vaultBtcAbi, VAULT_ETH)));

					this.props.dispatch(changeSelectedPair('ETHBTC'));

					this.getNeededCollateralFor("GET_NEW")
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
		}
	}

	trustWalletConnectEnabled() {
	}
	async disconnectWalletConnectEnabled() {
		const INFURA_ID = "27e484dcd9e3efcfd25a83a78777cdf1"
		//  Create WalletConnect Provider
		const provider = new WalletConnectProvider({
			infuraId: INFURA_ID,
		});
		await provider.disconnect()
	}




	render() {
		return (
			<div>
				<Navbar>

					<Grid container>
						<Grid item xs={12} md={12}>
							<Grid container style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
								{this.props.location.pathname === '/app/main/borrow' ||
									this.props.location.pathname === '/app/main/dashboard' ||
									this.props.location.pathname === '/app/main/smartVault1' ? null : <>
									<Grid item>
										<Button size={"sm"} color={"text"} onClick={() => this.props.history.goBack()}
											style={{ color: `${this.props.theme === "light" ? "black" : "white"}` }}
											icon={faArrowLeftLong}
										><FontAwesomeIcon icon={faArrowLeftLong} /> <span>Back</span>
										</Button>
									</Grid>
								</>
								}
								<Grid item></Grid>
								<Grid item style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
									<div>
										{
											!this.state.myAccount ?
												<RoundShapeButton
													label={"Connect Wallet"}
													onClick={(e) => {
														this.setState({
															modal: !this.state.modal,
															modalTitle: "Please choose wallet type to connect",
															modalAction: "connect_wallet",
														})
													}}
												></RoundShapeButton>
												:
												<div style={{ marginLeft: "auto" }}>
													<Input
														className={s.addressClass} id={"sidebar-drawer"} disabled={true} valid value={this.state.myAccount}></Input>
												</div>
										}
									</div>

									<div>
										{
											((this?.state?.myAccount ?? "") !== "") ?
												<RoundShapeButton
													label={"Disconnect"} size={"sm"}
													onClick={(e) => {
														// window.web3.setProvider({})
														localStorage.setItem("isWalletConnected", false)
														this.clearAccount()
														// window.location.reload();
													}}
												></RoundShapeButton>
												: null
										}
									</div>
									<div>
										<FontAwesomeIcon style={{ cursor: "pointer" }} onClick={() => {
											this.getNeededCollateralFor("GET_NEW");
										}}
											icon={faRotateRight} />
									</div>
									<div>
										<FontAwesomeIcon style={{ cursor: "pointer" }} onClick={() => {
											this.handleResize();
										}}
											icon={faBars} />
									</div>
									<div>
										<FontAwesomeIcon style={{ cursor: "pointer" }} onClick={() => {
											if (this.props.theme === "light") {
												this.setAppThemeMode("dark")
												localStorage.setItem("theme", "dark");
											}
											else {
												this.setAppThemeMode("light")
												localStorage.setItem("theme", "light");
											}
										}}
											icon={faLightbulb} />
									</div>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Navbar>
				<Modal isOpen={this.state.modal} toggle={this.toggle}>
					{this.state.modalAction === "connect_wallet" &&
						<>
							<ModalBody
								// style={{ width: "500px", color: '#ffffff', backgroundColor: '#000000', border: 'solid', borderRadius: '5px', borderColor: '#ffffff' }}
								className={[s.connectWallet, (this.props.theme === "light" ? s.connectWalletLight : s.connectWalletDark)]}
							// className={s.addressClass}
							>
								<h4 className={"fw-bold"}>{this.state.modalTitle}</h4>
								<a>
									<div className={`manage-button__${this.props.theme === "light" ? "light" : "dark"}`}
										onClick={() => {
											this.ethEnabled()
											this.toggle()
										}}>
										<div style={{ padding: "10px" }}>
											<Grid container spacing={1} alignContent={"center"} textAlign={"center"} justifyContent={"space-between"}>
												<Grid item>
													{`${(window.web3 === undefined) ? "Install " : ""}MetaMask`}
												</Grid>
												<Grid item>
													<img style={{ width: "15px", height: "15px" }} src="/assets/icon/metamask.png" alt=""></img>
												</Grid>
											</Grid>
										</div>
									</div>
								</a>
								<br></br>
								<a>
									<div className={`manage-button__${this.props.theme === "light" ? "light" : "dark"}`}
										onClick={() => {
											this.walletConnectEnabled()
											this.toggle()
										}}>
										<div style={{ padding: "10px" }}>
											<Grid container spacing={1} alignContent={"center"} textAlign={"center"} justifyContent={"space-between"}>
												<Grid item>
													WalletConnect
												</Grid>
												<Grid item>
													<img style={{ width: "15px", height: "15px" }} src="/assets/icon/walletConnectIcon.svg" alt=""></img>
												</Grid>
											</Grid>
										</div>
									</div>
								</a>
								<br></br>
								<a>
									<div className={`manage-button__${this.props.theme === "light" ? "light" : "dark"}`}
										onClick={() => {
											this.walletConnectEnabled()
											this.toggle()
										}}>
										<div style={{ padding: "10px" }}>
											<Grid container spacing={1} alignContent={"center"} textAlign={"center"} justifyContent={"space-between"}>
												<Grid item>
													Trust Wallet
												</Grid>
												<Grid item>
													<img style={{ width: "15px", height: "15px" }} src="/assets/icon/trustWalletIcon.svg" alt=""></img>
												</Grid>
											</Grid>
										</div>
									</div>
								</a>

							</ModalBody>
						</>
					}
					{this.state.modalAction !== "connect_wallet" &&
						<>
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
						</>
					}
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
		changeAaveBtcBorrowRate: store.loanshark.aaveBtcBorrowRate,
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
		gasBank: store.backd.gasBank,
		totalBtcLpAmount: store.backd.totalBtcLpAmount,
		myGasBankBalance: store.backd.myGasBankBalance,

		lpPoolEth: store.backd.lpPoolEth,
		lpTokenEth: store.backd.lpTokenEth,
		vaultEth: store.backd.vaultEth,
		totalEthLpAmount: store.backd.totalEthLpAmount,

		theme: store.layout.theme,
	};
}

export default withRouter(connect(mapStateToProps)(Header));