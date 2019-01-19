import React from 'react'
import PropTypes from 'prop-types'
import { login } from '../reducers/auth'
import { connect } from 'react-redux'
import './Login.scss'

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
      <form className="Login"
            onSubmit={
              (event) => {
                this.props.login(this.state.email, this.state.password);
                event.preventDefault();
              }
      }>
        <h1>Login</h1>
        {this.props.error ? <p>{this.props.error}</p> : ""}
        <div className="Login__fields-group">
          <input className="Login__field"
                 type="text"
                 placeholder="Email"
                 onChange={(event) => {this.setState({email: event.target.value});}}
          />
          <input className="Login__field"
                 type="password"
                 placeholder="Password"
                 onChange={(event) => {this.setState({password: event.target.value});}}
          />
        </div>
        <input className="Login__submit"
               type="submit"
               value="Sign in" />
      </form>
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
