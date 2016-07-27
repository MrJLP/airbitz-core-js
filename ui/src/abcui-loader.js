import abc from '../../src/abc-web.js'
import Constants from './abc-constants.js'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, hashHistory } from 'react-router'

// TODO: this needs to be passed in somehow
var context = abc.Context(window.parent.AIRBITZ_API_KEY);
var BootstrapButton = React.createClass({
  getInitialState() {
    return {'loading': false};
  },
  render(): any {
    if (this.state.loading) {
      return <button type="button" className="btn btn-primary" disabled="disabled">
                <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> 
              </button>;
    } else {
      return <button type="button" {...this.props} className="btn btn-primary">{this.props.children}</button>;
    }
  },
  setLoading(isLoading, callback) {
    this.setState({'loading': isLoading});
  }
});

var BootstrapInput = React.createClass({
  getInitialState() {
    return { error: null }
  },
  render(): any {
    var errorView = null;
    var classes = "form-group ";
    if (this.state.error) {
      errorView = (<span className="help-block">{this.state.error}</span>);
      classes += "has-error";
    }
    return (
      <div className="{classes}">
        <input ref="input" {...this.props} />
        {errorView}
      </div>);
  },
  value() {
    return this.refs.input.value;
  }
});

var AbcUserList = React.createClass({
  getInitialState() {
    return { showInput: false };
  },
  render() {
    var block = null;
    var that = this;
    var userList = context ? context.usernameList().sort() : [];
    var toggleInput = null;
    if (this.props.allowInput) {
      toggleInput = (
        <span className="input-group-btn">
          <button type="button" onClick={this.toggleInput}  className="btn btn-primary">X</button>
        </span>);
    }
    if (this.props.allowInput && (userList.length == 0 || this.state.showInput)) {
        block = (
            <div className="input-group">
              <input autoFocus ref="username" type="text" placeholder="username" className="form-control" />
              <span className="input-group-btn">
                <button type="button" onClick={this.toggleInput}  className="btn btn-primary">X</button>
              </span>
            </div>
        )
    } else {
        var selectElement = (
              <select ref="username"
                    className="form-control"
                    onChange={this.handleSelection}
                    defaultValue={this.props.username}>
                {userList.map(function(username) {
                    return (<option value={username} key={username}>{username}</option>);
                })}
              </select>
        );
        if (this.props.allowInput) {
            return (
              <div className="input-group">
                {selectElement}
                {toggleInput}
              </div>
            );
        } else {
            return selectElement;
        }
    }
    return (block);
  },
  toggleInput() {
    this.setState({'showInput': !this.state.showInput});
    if (this.state.showInput) {
        this.setState({username: ''});
        this.refs.username.focus();
    }
  },
  handleSelection() {
    this.props.onUserChange(this.refs.username.value);
  },
  getValue() {
    return this.refs.username.value;
  }
});

var AbcPasswordLoginForm = React.createClass({
  render() {
    return (
      <FormView ref="form">
        <div className="row">
          <div className="col-sm-12">
            <div className="form-group">
              <AbcUserList
                ref="username" 
                allowInput={true}
                username={this.props.username}
                onUserChange={this.props.onUserChange} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="form-group">
              <input ref="password" type="password" placeholder="Password" className="form-control" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 text-center">
            <div className="form-group">
              <BootstrapButton ref="signin" onClick={this.handleSubmit}>Sign In</BootstrapButton>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 text-center">
            <div className="form-group">
              <button type="button" className="btn">Forgot Password</button>
            </div>
          </div>
        </div>
      </FormView>
    );
  },
  handleSubmit() {
    var that = this;
    this.refs.signin.setLoading(true);
    context.passwordLogin(this.refs.username.getValue(), this.refs.password.value, function(err, result) {
      if (err) {
        that.refs.form.setState({'error': Constants.errorMap(err, 'Invalid Password')});
      } else {
        that.props.onSuccess(result);
      }
      that.refs.signin.setLoading(false);
    });
    return false;
  }
});

var FormView = React.createClass({
  getInitialState() {
    return { error: null }
  },
  render() {
    var errorView = null;
    if (this.state.error) {
      errorView = (
        <div className="form-group has-error text-center">
          <span className="help-block">{this.state.error}</span>
        </div>);
    }
    return (
      <form className="form">
        {errorView}
        {this.props.children}
      </form>
      );
  }
});

var AbcPinLoginForm = React.createClass({
  render() {
    return (
        <FormView ref="form">
          <div className="row">
            <div className="col-sm-12 text-center">
              <div className="form-group">
                <AbcUserList ref="username"
                    allowInput={false}
                    username={this.props.username}
                    onUserChange={this.props.onUserChange} />
              </div>
            </div>
            <div className="col-sm-12 text-center">
              <div className="form-group">
                  <input ref="pin" type="password" placeholder="PIN" className="form-control" maxLength="4" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 text-center">
              <div className="form-group">
                <BootstrapButton ref="signin" onClick={this.handleSubmit}>Sign In</BootstrapButton>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 text-center">
              <div className="form-group">
                <button type="button" onClick={this.handleExit} className="btn">Exit Pin Login</button>
              </div>
            </div>
          </div>
        </FormView>
    );
  },
  handleExit() {
    this.props.onExit();
    return false;
  },
  handleSubmit() {
    var that = this;
    this.refs.signin.setLoading(true);
    context.pinLogin(this.refs.username.getValue(), this.refs.pin.value, function(err, result) {
      if (err) {
        that.refs.form.setState({'error': Constants.errorMap(err, 'Failed to login with password')});
      } else {
        that.props.onSuccess(result);
      }
      that.refs.signin.setLoading(false);
    });
    return false;
  }
});

var LoginForm = React.createClass({
  getInitialState() {
    return {
      forcePasswordLogin: false,
    };
  },
  statics: {
    currentUser() {
        return localStorage.getItem('airbitz.current_user');
    },
    updateCurrentUser(username) {
        localStorage.setItem('airbitz.current_user', username);
    }
  },
  render() {
    var block = null;
    var currentUser = LoginForm.currentUser();
    var showPinLogin = context && currentUser && context.pinExists(currentUser);
    if (this.state.forcePasswordLogin) {
      showPinLogin = false;
    }
    if (showPinLogin) {
      block = (<AbcPinLoginForm ref="pinForm"
                username={currentUser}
                onSuccess={this.handleSuccess}
                onError={this.handleError}
                onUserChange={this.handleUserChange}
                onExit={this.handlePinExit} />);
    } else {
      block = (<AbcPasswordLoginForm ref="passwordForm"
                username={currentUser}
                onSuccess={this.handleSuccess}
                onError={this.handleError}
                onUserChange={this.handleUserChange} />);
    }
    return (
      <BootstrapModal
          ref="loginModal"
          key="loginModal"
          cancel="Cancel"
          title="Login">
        {block}
      </BootstrapModal>
    );
  },
  handlePinExit() {
    this.setState({'forcePasswordLogin': true});
  },
  handleUserChange(newUsername) {
    LoginForm.updateCurrentUser(newUsername);
    this.setState({'forcePasswordLogin': false});
  },
  handleSuccess(account) {
    this.setState({'forcePasswordLogin': false});
    LoginForm.updateCurrentUser(account.username);
    if (window.parent.loginCallback) {
      this.refs.loginModal.close();
      window.parent.loginCallback(null, account);
    }
  }
});

var RegistrationForm = React.createClass({
  render() {
    return (
      <BootstrapModal
          ref="regModal"
          key="regModal"
          cancel="Cancel"
          title="Register">
        <FormView ref="form">
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <BootstrapInput type="text" ref="username" placeholder="username" className="form-control" onBlur={this.blur} onFocus={this.focus} />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <div className="input-group">
                  <input type="password" ref="password" placeholder="password" className="form-control" />
                </div>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <div className="input-group">
                  <input type="password" ref="pin" placeholder="pin" className="form-control" />
                </div>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <span className="input-group-btn">
                  <BootstrapButton ref="register" onClick={this.handleSubmit}>Register</BootstrapButton>
                </span>
              </div>
            </div>
          </div>
        </FormView>
        </BootstrapModal>
    );
  },
  focus() {
    this.refs.username.setState({'error': null});
  },
  blur() {
    var that = this;
    var username = that.refs.username.value();
    console.log(username);
    if (username) {
      context.usernameAvailable(username, function(err) {
        if (err) {
          that.refs.username.setState({'error': 'Username already taken'});
        } else {
          that.refs.username.setState({'error': null});
        }
      });
    } else {
      that.refs.username.setState({'error': null});
    }
  },
  handleSubmit() {
    var that = this;
    this.refs.register.setLoading(true);
    var username = this.refs.username.value();
    context.accountCreate(username, this.refs.password.value, function(err, result) {
      if (err) {
        that.refs.form.setState({'error': Constants.errorMap(err, 'Unable to register at this time.')});
        that.refs.register.setLoading(false);
      } else {
        var account = result;
        LoginForm.updateCurrentUser(account.username);
        account.pinSetup(that.refs.pin.value, function(err, result) {
          if (window.parent.registrationCallback) {
              window.parent.registrationCallback(null, account);
          }
          that.refs.regModal.close();
          that.refs.register.setLoading(false);
        });
      }
    });
    return false;
  }
});

var ManageAccountView = React.createClass({
  render() {
    return (
      <BootstrapModal ref="modal" title="Manage Account">
        <h4>ACCOUNT: <span>{window.parent.account.username}</span></h4>
        <ul className="list-unstyled">
            <li><Link className="btn" to={`/account/changepassword`}>Change Password</Link></li>
            <li><Link className="btn" to={`/account/changepin`}>Change Pin</Link></li>
            <li><Link className="btn" to={`/account/setuprecovery`}>Setup/Change Recovery</Link></li>
        </ul>
        <h4>OPTIONS</h4>
        <ul className="list-unstyled">
            <li>
                <a className="btn" href="javascript://" onClick={this.togglePinEnabled}>Enable PIN Login</a>
                <input className="form-input pull-right" type="checkbox" ref="pinEnabled" id="pinEnabled" onChange={this.pinEnableChanged} />
            </li>
        </ul>
      </BootstrapModal>);
  },
  togglePinEnabled() {
    this.refs.pinEnabled.checked = !this.refs.pinEnabled.checked;
    this.pinEnableChanged();
  },
  pinEnableChanged() {
    alert(this.refs.pinEnabled.checked);
  }
});

var ChangePasswordView = React.createClass({
  render() {
    return (
    <BootstrapModal ref="modal" title="Change Password">
        <form>
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <input type="password" ref="username" placeholder="Current Password" className="form-control" />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <input type="password" ref="password" placeholder="New Password" className="form-control" />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                  <input type="password" ref="confirm_password" placeholder="Confirm Password" className="form-control" />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <span className="input-group-btn">
                  <BootstrapButton ref="changeButton" onClick={this.handleSubmit}>Save</BootstrapButton>
                </span>
              </div>
            </div>
          </div>
        </form>
    </BootstrapModal>);
  },
  handleSubmit() {
    var that = this;
    this.refs.changeButton.setLoading(true);
    window.account.passwordSetup(this.refs.password.value, function(err, result) {
      if (err) {
      } else {
      }

      that.refs.changeButton.setLoading(false);
    });
    this.refs.modal.close();
  }
});

var ChangePinView = React.createClass({
  render() {
    return (
    <BootstrapModal ref="modal" title="Change PIN">
        <form>
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <div className="input-group">
                    <input type="password" ref="username" placeholder="Current Password" className="form-control" />
                </div>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <div className="input-group">
                  <input type="password" ref="password" placeholder="New PIN" className="form-control" maxLength="4" />
                </div>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <span className="input-group-btn">
                  <BootstrapButton ref="register" onClick={this.handleSubmit}>Save</BootstrapButton>
                </span>
              </div>
            </div>
          </div>
        </form>
    </BootstrapModal>);
  },
  handleSubmit() {
    this.refs.modal.close();
  }
});

var SetupRecoveryView = React.createClass({
  render() {
    return (
    <BootstrapModal ref="modal" title="Change Recovery Information">
        <form>
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <label>Recovery Token information...</label>
                <input type="password" ref="username" placeholder="Recovery Token" className="form-control" />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <label for="question1">Question 1 Text</label>
                <input type="text" id="question1" ref="question1" placeholder="Question 1 Answer" className="form-control" />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <label for="question2">Question 2 Text</label>
                <input type="text" id="question2"  ref="question2" placeholder="Question 2 Answer" className="form-control" />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <span className="input-group-btn">
                  <BootstrapButton ref="register" onClick={this.handleSubmit}>Save</BootstrapButton>
                </span>
              </div>
            </div>
          </div>
        </form>
    </BootstrapModal>);
  },
  handleSubmit() {
    this.refs.modal.close();
  }
});

var MenuItem = React.createClass({
  render() {
    return (<li><a {...this.props} href="javascript:;" /></li>);
  }
});

var BootstrapModal = React.createClass({
  getInitialState() {
    return {'title': this.props.title}
  },
  componentDidMount() {
    $(this.refs.root).modal({backdrop: 'static', keyboard: false, show: true});
    $(this.refs.root).on('hidden.bs.modal', this.handleHidden);
  },
  componentWillUnmount() {
    $(this.refs.root).off('hidden.bs.modal', this.handleHidden);
  },
  close() {
    $(this.refs.root).modal('hide');
  },
  open() {
    $(this.refs.root).modal('show');
  },
  render() {
    return (
      <div className="modal fade" ref="root">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={this.handleCancel}>
                &times;
              </button>
              <h4>{this.state.title}</h4>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  },
  handleCancel() {
    if (window.parent.exitCallback) {
        this.close();
        window.parent.exitCallback();
    }
  },
  handleHidden() {
    if (this.props.onHidden) {
      this.props.onHidden();
    }
  }
});

const Index = React.createClass({
  render() {
    return <h1>ABC</h1>
  }
})

const App = React.createClass({
  render() {
    return (<div>{this.props.children}</div>);
  }
});

const NotFound = React.createClass({
  render() {
    return (<h1>Not Found</h1>);
  }
});

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Index} />
      <Route path="login" component={LoginForm} />
      <Route path="register" component={RegistrationForm} />
      <Route path="account" component={ManageAccountView} />
      <Route path="account/changepassword" component={ChangePasswordView} />
      <Route path="account/changepin" component={ChangePinView} />
      <Route path="account/setuprecovery" component={SetupRecoveryView} />
    </Route>
  </Router>
), document.getElementById('app'));
