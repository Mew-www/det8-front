import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import Login from './subcomponents/Login'
import Travel from './subcomponents/Travel/Travel'
import Tickets from './subcomponents/Tickets'
import PropTypes from 'prop-types'
import { getUser } from './reducers/auth'
import { connect } from 'react-redux'

class App extends React.Component {
  componentDidMount() {
    this.props.getUser();
  }
  render() {
    return (
      <div>
        {!this.props.has_initially_loaded ?
          "Loading..."
          :
          <div>
            {!this.props.user ?
              ""
              :
              <header>
                <p>Welcome {this.props.user.name}</p>
              </header>
            }
            <main>
              {!this.props.user ?
                <Switch>
                  <Route exact path="/" component={Login} />
                  <Redirect to="/" />
                </Switch>
                :
                <div>
                  <Route exact path="/" component={Travel} />
                  <Route exact path="/tickets" component={Tickets} />
                </div>
              }
            </main>
          </div>
        }
      </div>
    );
  }
}

App.propTypes = {
  has_initially_loaded: PropTypes.bool.isRequired,
  user: PropTypes.object
};

const mapStateToProps = ({ auth }) => ({
  has_initially_loaded: auth.has_initially_loaded,
  user: auth.user
});

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: () => dispatch(getUser())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App)