import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
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
        <div className={`${(!this.props.sidebarOpened && !this.props.sidebarStatic ) ? s.sidebarClose : ''} ${s.sidebarWrapper}`} id={"sidebar-drawer"}>
        <nav className={s.root}>
          <header className={s.logo}>
            <img src={logo} alt="LoanShark" width="180px" className={s.logoStyle} />
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
          </ul>

          <ul>
            <hr />
            <LinksGroup
              onActiveSidebarItemChange={activeItem =>
                this.props.dispatch(changeActiveSidebarItem(activeItem))
              }
              header="Twitter"
              isHeader
              index="main"
            >
            </LinksGroup>
            <LinksGroup
              onActiveSidebarItemChange={activeItem =>
                this.props.dispatch(changeActiveSidebarItem(activeItem))
              }
              header="Telegram"
              isHeader
            >
            </LinksGroup>
            <LinksGroup
                onActiveSidebarItemChange={activeItem =>
                    this.props.dispatch(changeActiveSidebarItem(activeItem))
                }
                header="Discord"
                isHeader
            >
            </LinksGroup>
            <LinksGroup
                onActiveSidebarItemChange={activeItem =>
                    this.props.dispatch(changeActiveSidebarItem(activeItem))
                }
                header="Medium"
                isHeader
            >
            </LinksGroup>
            <LinksGroup
                onActiveSidebarItemChange={activeItem =>
                    this.props.dispatch(changeActiveSidebarItem(activeItem))
                }
                header="Github"
                isHeader
            >
            </LinksGroup>
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
