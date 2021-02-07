import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import Modal from './components/Modal/Modal';
import Backdrop from './components/Backdrop/Backdrop';
import LaunchProgramsPage from './pages/LaunchPrograms/LaunchPrograms';

class App extends Component {
  state = {
    isAuth: true,
    authMode: 'login',
    error: null,
    success: null
  };

  logoutHandler = () => {
    this.setState({ isAuth: false });
  };

  authHandler = (event, authData) => {
    event.preventDefault();
    if (authData.email.trim() === '' || authData.password.trim() === '') {
      return;
    }
    let request;
    if (this.state.authMode === 'login') {
      request = axios.post('http://localhost:3100/login', authData);
    } else {
      request = axios.post('http://localhost:3100/signup', authData);
    }
    request
      .then(authResponse => {
        if (authResponse.status === 201 || authResponse.status === 200) {
          const token = authResponse.data.token;
          console.log(token);
          // Theoretically, you would now store the token in localstorage + app state
          // and use it for subsequent requests to protected backend resources
          this.setState({ isAuth: true });
        }
      })
      .catch(err => {
        this.errorHandler(err.response.data.message);
        console.log(err);
        this.setState({ isAuth: false });
      });
  };

  authModeChangedHandler = () => {
    this.setState(prevState => {
      return {
        authMode: prevState.authMode === 'login' ? 'signup' : 'login'
      };
    });
  };

  errorHandler = message => {
    this.setState({
      error: message
    });
  };

  successHandler = message => {
    this.setState({
      success: message
    });
  }

  render() {
    let routes = (
      <Switch>
        <Redirect from="/" to="/launchprograms" exact />
        <Route
          path="/launchprograms"
          render={props => (
            <LaunchProgramsPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="launchprograms/:launch_year/:launch_success/:launch_landing"
          render={props => (
            <LaunchProgramsPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="launchprograms&:launch_year&:launch_success&:launch_landing"
          render={props => (
            <LaunchProgramsPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
      </Switch>
    );

    return (
      <div className="App">
        <Modal
          open={!!this.state.error}
          title="An Error Occurred"
          onClose={() => this.errorHandler(null)}
        >
          <p>{this.state.error}</p>
        </Modal>
        <Modal
          open={!!this.state.success}
          title="Attempt Successful"
          onClose={() => this.successHandler(null)}
        >
          <p>{this.state.success}</p>
        </Modal>
        <Backdrop show={!!this.state.error || !!this.state.success} />
        {routes}
      </div>
    );
  }
}

export default App;