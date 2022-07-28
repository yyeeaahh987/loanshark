import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faDiscord } from "@fortawesome/free-brands-svg-icons"
// import { faFacebook } from "@fortawesome/free-regular-svg-icons"

// import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro'

// import { faGithub } from '@fortawesome/free-solid-svg-icons'
// npm i --save @fortawesome/free-solid-svg-icons
// npm i --save @fortawesome/free-regular-svg-icons

import { dismissAlert } from "../../actions/alerts";
import s from "./Sidebar.module.scss";
import LinksGroup from "./LinksGroup/LinksGroup";
import {
  changeActiveSidebarItem
} from "../../actions/navigation";

import logo from "../../images/logo.png";

class Sidebar extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    activeItem: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string
    }).isRequired
  };

  static defaultProps = {
    sidebarStatic: true,
    sidebarOpened: true,
    activeItem: ""
  };

  dismissAlert(id) {
    this.props.dispatch(dismissAlert(id));
  }

  render() {
    return (
      <div className={`${(!this.props.sidebarOpened && !this.props.sidebarStatic) ? s.sidebarClose : ''} ${s.sidebarWrapper}`} id={"sidebar-drawer"}>
        <nav className={s.root} >
          <header className={s.logo} style={{paddingTop: '40px'}}>
            <img src={logo} alt="LoanShark" width="161px" className={s.logoStyle} />
          </header>
          <ul className={s.nav}>
            <LinksGroup
              onActiveSidebarItemChange={activeItem =>
                this.props.dispatch(changeActiveSidebarItem(activeItem))
              }
              activeItem={this.props.activeItem}
              header="Borrow"
              isHeader
              link="/app/main/borrow"
              index="main"
            >
            </LinksGroup>
            <LinksGroup
              onActiveSidebarItemChange={activeItem =>
                this.props.dispatch(changeActiveSidebarItem(activeItem))
              }
              activeItem={this.props.activeItem}
              header="Dashboard"
              isHeader
              link="/app/main/dashboard"
              index="main"
            >
            </LinksGroup>
            <LinksGroup
              // onActiveSidebarItemChange={activeItem =>
              //     this.props.dispatch(changeActiveSidebarItem(activeItem))
              // }
              // activeItem={this.props.activeItem}
              header="Smart Vault"
              isHeader
              link="/app/main/smartVault1"
              index="main"
            >
            </LinksGroup>
          </ul>
          <ul className={s.footer}>
            <LinksGroup
              onActiveSidebarItemChange={activeItem =>
                this.props.dispatch(changeActiveSidebarItem(activeItem))
              }
              header="Introduction"
              link="/introduction"
              target="_blank"
              isHeader
            >
            </LinksGroup>
            <LinksGroup
              onActiveSidebarItemChange={activeItem =>
                this.props.dispatch(changeActiveSidebarItem(activeItem))
              }
              header="Documentation"
              link="/documentation"
              target="_blank"
              isHeader
            >
            </LinksGroup>

            <div style={{ paddingLeft: "35px" }}>
              <Container>
                <Row>
                  <Col style={{ padding: "0px" }}>
                    <NavLink
                    className={s.footer__icon}
                    to={"/github"}
                    >
                    <FontAwesomeIcon icon={faGithub} />
                    </NavLink>
                  </Col>
                  <Col style={{ padding: "0px" }}>
                    <NavLink
                    className={s.footer__icon}
                    to={"/twitter"}
                    >
                    <FontAwesomeIcon icon={faTwitter} />
                    </NavLink>
                  </Col>
                  <Col style={{ padding: "0px" }}>
                    <NavLink
                    className={s.footer__icon}
                    to={"/discord"}
                    >
                    <FontAwesomeIcon icon={faDiscord} />
                    </NavLink>
                  </Col>
                </Row>
              </Container>
            </div>
          </ul>
        </nav>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    alertsList: store.alerts.alertsList,
    activeItem: store.navigation.activeItem,
    navbarType: store.navigation.navbarType,
  };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
