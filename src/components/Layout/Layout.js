import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Hammer from "rc-hammerjs";

import LoadingOverlay from 'react-loading-overlay'
import CircleLoader from 'react-spinners/CircleLoader'

import Dashboard from "../../pages/dashboard";
import Header from "../Header";
import Sidebar from "../Sidebar";
import {
  openSidebar,
  closeSidebar,
  toggleSidebar,
} from "../../actions/navigation";
import s from "./Layout.module.scss";
import BreadcrumbHistory from "../BreadcrumbHistory";

// pages
import Tables from "../../pages/tables";

class Layout extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sidebarStatic: true,
    sidebarOpened: true,
  };

  constructor(props) {
    super(props);

    this.handleSwipe = this.handleSwipe.bind(this);
    this.handleCloseSidebar = this.handleCloseSidebar.bind(this);
  }

  componentDidMount() {

    this.handleResize();
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize.bind(this));
  }

  handleResize() {
    if (window.innerWidth <= 768) {
      this.props.dispatch(toggleSidebar());
    } else if (window.innerWidth >= 768) {
      this.props.dispatch(openSidebar());
    }
  }

  handleCloseSidebar(e) {
    if (e.target.closest("#sidebar-drawer") == null && this.props.sidebarOpened && window.innerWidth <= 768) {
      this.props.dispatch(toggleSidebar());
    }
  }

  handleSwipe(e) {
    if ("ontouchstart" in window) {
      if (e.direction === 4) {
        this.props.dispatch(openSidebar());
        return;
      }

      if (e.direction === 2 && this.props.sidebarOpened) {
        this.props.dispatch(closeSidebar());
        return;
      }
    }
  }

  render() {
    return (
      <LoadingOverlay
        active={this.props.loadingActive}
        spinner={<CircleLoader color={"#ffffff"} size={150} />}
      >
        <div
          className={[
            s.root,
            !this.props.sidebarOpened ? s.sidebarClose : "",
            "flatlogic-one",
            "dashboard-black",
          ].join(" ")}
          onClick={e => this.handleCloseSidebar(e)}
        >
          <Sidebar />
          <div className={s.wrap}>
            <Header></Header>

            <Hammer onSwipe={this.handleSwipe}>
              <main className={s.content}>
                <BreadcrumbHistory url={this.props.location.pathname} />
                <TransitionGroup>
                  <CSSTransition
                    key={this.props.location.key}
                    classNames="fade"
                    timeout={200}
                  >
                    <Switch>
                      <Route
                        path="/app/main"
                        exact
                        render={() => <Redirect to="/app/main/dashboard" />}
                      />
                      <Route
                        path="/app/main/dashboard"
                        exact
                        component={Dashboard}
                      />
                      <Route
                          path="/app/main/borrow"
                          exact
                          component={Tables}
                      />
                    </Switch>
                  </CSSTransition>
                </TransitionGroup>
              </main>
            </Hammer>
          </div>
        </div>
      </LoadingOverlay>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    loadingActive: store.navigation.loadingActive
  };
}

export default withRouter(connect(mapStateToProps)(Layout));
