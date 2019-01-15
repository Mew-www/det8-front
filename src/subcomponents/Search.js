import React from 'react'
import { push } from 'connected-react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const Search = props => (
  <div>
    <h1>Search</h1>
    <p>todo</p>

    <button onClick={() => props.gotoTickets()}>Go to ticketing</button>
  </div>
)

const mapDispatchToProps = dispatch => bindActionCreators({
  gotoTickets: () => push('/tickets')
}, dispatch);

export default connect(null, mapDispatchToProps)(Search)
