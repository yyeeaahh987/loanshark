import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Translation, withTranslation } from 'react-i18next';
import {
    Navbar, Button, Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from "reactstrap";

  

class Test extends React.Component {
    static propTypes = {
    };

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div>
                <div>
                    <Translation>
                        {t => {
                            return (
                                <>
                                    <p>{t("object1.object1name1")}</p>
                                </>
                            )
                        }}
                    </Translation>
                </div>
                <Button color={"outline-light"}
                    onClick={() => {
                        this.props.i18n.changeLanguage("zh")
                    }}
                >ZH</Button>
                &nbsp;
                <Button color={"outline-light"}
                    onClick={() => {
                        this.props.i18n.changeLanguage("en")
                    }}
                >EN</Button>
            </div>
        );
    }
}

function mapStateToProps(store) {
    return {
        // sidebarOpened: store.navigation.sidebarOpened,
        // sidebarStatic: store.navigation.sidebarStatic,
        // myAccount: store.loanshark.myAccount,
        // numberOfEth: store.loanshark.userDebtBalance,
        // userDepositBalance: store.loanshark.userDepositBalance,
        // userDebtBalance: store.loanshark.userDebtBalance,
        // myFujiVaultETHBTC: store.loanshark.myFujiVaultETHBTC,
        // myFliquidatorAVAX: store.loanshark.myFliquidatorAVAX,
        // myFujiController: store.loanshark.myFujiController,
        // myFujiOracle: store.loanshark.myFujiOracle,
        // mySmartVault: store.loanshark.mySmartVault,
        // myETHContract: store.loanshark.myETHContract,
        // myBTCContract: store.loanshark.myBTCContract,
        // myUSDTContract: store.loanshark.myUSDTContract,
        // priceOfEth: store.loanshark.priceOfEth,
        // priceOfBtc: store.loanshark.priceOfBtc,
        // providerAAVEAVAX: store.loanshark.providerAAVEAVAX,
        // smartVaultBtc: store.loanshark.smartVaultBtc,
    };
}

export default withRouter(connect(mapStateToProps)(withTranslation()(Test)));
