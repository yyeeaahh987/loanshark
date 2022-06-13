import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import '../styles/theme.scss';
import LayoutComponent from '../components/Layout';

const PrivateRoute = ({dispatch, component, ...rest }) => {
    return ( // eslint-disable-line
        <Route {...rest} render={props => (React.createElement(component, props))}/>
    );
};

const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close notifications-close"/>

class App extends React.PureComponent {
  
  render() {
    return (
        <div>
            <ToastContainer
                autoClose={5000}
                hideProgressBar
                closeButton={<CloseButton/>}
            />
            <HashRouter>
                <Switch>
                    <Route path="/" exact render={() => <Redirect to="/app/main"/>}/>
                    <Route path="/app" exact render={() => <Redirect to="/app/main"/>}/>
                    <Route path="/twitter" exact component={() => { 
                        window.location.href = 'https://twitter.com/loansharktech'; 
                        return null;
                    }}/>
                    <Route path="/documentation" exact component={() => { 
                        window.location.href = 'https://docs.loanshark.tech/'; 
                        return null;
                    }}/>
                    <Route path="/introduction" exact component={() => { 
                        window.location.href = 'https://loanshark.tech/'; 
                        return null;
                    }}/>
                    <Route path="/github" exact component={() => { 
                        window.location.href = 'https://github.com/loansharktech?tab=repositories'; 
                        return null;
                    }}/>
                    <Route path="/discord" exact component={() => { 
                        window.location.href = 'https://discord.gg/4BjV9UyQ'; 
                        return null;
                    }}/>
                    <PrivateRoute path="/app" dispatch={this.props.dispatch} component={LayoutComponent}/>
                </Switch>
            </HashRouter>
        </div>

    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: true
});

export default connect(mapStateToProps)(App);
