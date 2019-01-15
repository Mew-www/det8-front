import React from 'react'
import PropTypes from 'prop-types'
import { login } from '../reducers/auth'
import { connect } from 'react-redux'

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: ''
    };
  }
  render() {
    return (
      <div>
        <h1>Login</h1>
        {this.props.error ? <p>{this.props.error}</p> : ""}
        <input type="text"
               placeholder="Email"
               onChange={(event) => {this.setState({email: event.target.value});}}
        />
        <input type="password"
               placeholder="Password"
               onChange={(event) => {this.setState({password: event.target.value});}}
        />
        <button onClick={
          (event) => {
            event.preventDefault();
            this.props.login(this.state.email, this.state.password);
          }
        }>Sign in</button>
      </div>
    )
  }
}

Login.propTypes = {
  error: PropTypes.string
};

const mapStateToProps = ({ auth }) => ({
  error: auth.error
});

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password) => dispatch(login(username, password))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
