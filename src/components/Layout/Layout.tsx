import React, { useEffect } from "react";
// import Wave from 'react-wavify'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useRoutes, HashRouter, BrowserRouter, Routes, Route,Outlet } from 'react-router-dom';
import { redirect as Redirect, Router } from 'react-router';
// import { Switch, Route, withRouter, Redirect } from "react-router";
// import { TransitionGroup, CSSTransition } from "react-transition-group";

// import LoadingOverlay from 'react-loading-overlay'
// import CircleLoader from 'react-spinners/CircleLoader'

import Dashboard from '../../pages/dashboard/Dashboard'
// import Dashboardv2 from "../../pages/dashboard/Dashboardv2";

// import SmartVault1 from "../../pages/smartvault/SmartVault1";
// import SmartVault2 from "../../pages/smartvault/SmartVault2";
// import SmartVault3 from "../../pages/smartvault/SmartVault3";
// import SmartVault4 from "../../pages/smartvault/SmartVault4";
// import SmartVault4ETH from "../../pages/smartvault/SmartVault4ETH";
// import Header from "../Header";
// import Sidebar from "../Sidebar";
// import s from "./Layout.module.scss";

// // pages
// import Tables from "../../pages/tables";
// import Manage from "../../pages/manage/Manage";


function Layout() {

	useEffect(() => {
		console.log(`layout`)
	}, [])
	return (
		<>
			this is layout
			<Outlet />
			{/* <Routes>
				<Route path="/app/main/dashboard" element={<Dashboard></Dashboard>} />

			</Routes> */}
		</>
	)
}

				{/* <Route path="/app/main/manage" element={<LoanSharkTwitter></LoanSharkTwitter>} />
				<Route path="/app/main/manage" element={<LoanSharkTwitter></LoanSharkTwitter>} />
				<Route path="/app/main/borrow" element={<LoanSharkTwitter></LoanSharkTwitter>} />
				<Route path="/app/main/smartVault1" element={<LoanSharkTwitter></LoanSharkTwitter>} />
				<Route path="/app/main/smartVault2" element={<LoanSharkTwitter></LoanSharkTwitter>} />
				<Route path="/app/main/smartVault3" element={<LoanSharkTwitter></LoanSharkTwitter>} />
				<Route path="/app/main/smartVault4" element={<LoanSharkTwitter></LoanSharkTwitter>} />
				<Route path="/app/main/smartVault4ETH" element={<LoanSharkTwitter></LoanSharkTwitter>} /> */}


// function mapStateToProps(store) {
// 	return {
// 		sidebarOpened: store.navigation.sidebarOpened,
// 		sidebarStatic: store.navigation.sidebarStatic,
// 		loadingActive: store.navigation.loadingActive,

// 		theme: store.layout.theme,
// 	};
// }

export default Layout;























// import React from "react";
// import Wave from 'react-wavify'
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { Switch, Route, withRouter, Redirect } from "react-router";
// import { TransitionGroup, CSSTransition } from "react-transition-group";

// import LoadingOverlay from 'react-loading-overlay'
// import CircleLoader from 'react-spinners/CircleLoader'

// import Dashboard from "../../pages/dashboard/Dashboard";
// import Dashboardv2 from "../../pages/dashboard/Dashboardv2";

// import SmartVault1 from "../../pages/smartvault/SmartVault1";
// import SmartVault2 from "../../pages/smartvault/SmartVault2";
// import SmartVault3 from "../../pages/smartvault/SmartVault3";
// import SmartVault4 from "../../pages/smartvault/SmartVault4";
// import SmartVault4ETH from "../../pages/smartvault/SmartVault4ETH";
// import Header from "../Header";
// import Sidebar from "../Sidebar";
// import s from "./Layout.module.scss";

// // pages
// import Tables from "../../pages/tables";
// import Manage from "../../pages/manage/Manage";

// class Layout extends React.Component {
// 	static propTypes = {
// 		sidebarStatic: PropTypes.bool,
// 		sidebarOpened: PropTypes.bool,
// 		dispatch: PropTypes.func.isRequired,
// 	};

// 	static defaultProps = {
// 		sidebarStatic: true,
// 		sidebarOpened: true,
// 	};

// 	render() {
// 		return (
// 			<LoadingOverlay
// 				active={this.props.loadingActive}
// 				spinner={<CircleLoader color={"#444444"} size={100} />}
// 			>
// 				<div style={{ position: "fixed", bottom: "0", width: "100vw", zIndex: "1", pointerEvents: "none" }}>
// 					<Wave
// 						style={{ position: "fixed", bottom: "0", height: "400px" }}
// 						fill="#777777"
// 						paused={true}
// 						opacity="0.1"
// 						options={{
// 							height: 10,
// 							amplitude: 500,
// 							speed: 0.2,
// 							points: 4,
// 						}}
// 					/>

// 					<Wave
// 						style={{ position: "fixed", bottom: "0", height: "300px" }}
// 						fill="#888888"
// 						paused={true}
// 						opacity="0.2"
// 						options={{
// 							height: 10,
// 							amplitude: 200,
// 							speed: 0.2,
// 							points: 7,
// 						}}
// 					/>
// 					<Wave
// 						style={{ position: "fixed", bottom: "0", height: "100px" }}
// 						fill="#999999"
// 						paused={true}
// 						opacity="0.2"
// 						options={{
// 							height: 20,
// 							amplitude: 50,
// 							speed: 0.2,
// 							points: 11,
// 						}}
// 					/>
// 				</div>
// 				<div
// 					className={[
// 						s.root,
// 						(this.props.theme==="light"?s.rootLight:s.rootDark),
// 						!this.props.sidebarOpened ? s.sidebarClose : "",
// 						"flatlogic-one",
// 						"dashboard-black",
// 					].join(" ")}
// 				>
// 					<Sidebar />
// 					<div className={s.wrap}>
// 						<Header></Header>
// 						<main className={s.content}>
// 							<TransitionGroup>
// 								<CSSTransition
// 									key={this.props.location.key}
// 									classNames="fade"
// 									timeout={200}
// 								>
// 									<Switch>
// 										<Route
// 											path="/app/main"
// 											exact
// 											render={() => <Redirect to="/app/main/dashboard" />}
// 										/>
// 										<Route
// 											path="/app/main/dashboard"
// 											// component={Dashboard}
// 											component={Dashboardv2}
// 										/>
// 										<Route
// 											path="/app/main/manage"
// 											component={Manage}
// 										/>
// 										<Route
// 											path="/app/main/borrow"
// 											exact
// 											component={Tables}
// 										/>
// 										<Route
// 											path="/app/main/smartVault1"
// 											exact
// 											component={SmartVault1}
// 										/>
// 										<Route
// 											path="/app/main/smartVault2"
// 											exact
// 											component={SmartVault2}
// 										/>
// 										<Route
// 											path="/app/main/smartVault3"
// 											exact
// 											component={SmartVault3}
// 										/>
// 										<Route
// 											path="/app/main/smartVault4"
// 											exact
// 											component={SmartVault4}
// 										/>
// 										<Route
// 											path="/app/main/smartVault4ETH"
// 											exact
// 											component={SmartVault4ETH}
// 										/>
// 									</Switch>
// 								</CSSTransition>
// 							</TransitionGroup>
// 						</main>
// 					</div>
// 				</div>
// 			</LoadingOverlay>
// 		);
// 	}
// }

// function mapStateToProps(store) {
// 	return {
// 		sidebarOpened: store.navigation.sidebarOpened,
// 		sidebarStatic: store.navigation.sidebarStatic,
// 		loadingActive: store.navigation.loadingActive,

// 		theme: store.layout.theme,
// 	};
// }

// export default withRouter(connect(mapStateToProps)(Layout));
