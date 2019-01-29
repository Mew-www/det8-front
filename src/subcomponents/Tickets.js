import React from 'react'
import { push } from 'connected-react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import axios from 'axios';
import jwt_decode from 'jwt-decode'

class Tickets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      ticket_jwts: []
    };
  }
  componentDidMount() {
    axios.all(
      this.props.user.tickets.map(ticket => {
        return axios.post(
          'http://localhost:3030/getHSL',
          {ticket_id: ticket.uid, phone_num: ticket.secret},
          {withCredentials: true}
        )
      })
    )
      .then(axios.spread((...responses) => {
        let jwts = [];
        for (let i=0; i<responses.length; i++) {
          jwts.push(responses[i].data.ticketData);
          this.setState({ticket_jwts: jwts, loaded: true});
        }
      }))
      .catch(errors => {
        console.log(errors);
      });
  }
  render() {
    return (
      <div>
        <p>
          <button onClick={() => this.props.gotoSearch()}>Go to Travelling</button>
        </p>
        <h1>Tickets</h1>
        {!this.state.loaded ?
          "Loading . . ."
          :
          this.state.ticket_jwts.map(jwt => (
            <div style={{display: "inline-block"}} key={jwt} dangerouslySetInnerHTML={{__html: jwt_decode(jwt).ticket}} />
          ))
        }
      </div>
    );
  }
};
// "validFrom":"2019-01-28T14:52:37Z","validTo":"2019-01-28T16:13:37Z","ticketTypeId":"single","customerTypeId":"adult","regionId":"regional","iat":1548690901}

const mapStateToProps = ({ auth }) => ({
  user: auth.user
});

const mapDispatchToProps = dispatch => bindActionCreators({
  gotoSearch: () => push('/')
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Tickets)
