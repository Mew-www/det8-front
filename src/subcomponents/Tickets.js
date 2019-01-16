import React from 'react'
import { push } from 'connected-react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const Tickets = props => (
  <div>
    <h1>Tickets</h1>
    <p>todo</p>

    <button onClick={() => props.gotoSearch()}>Go to Travelling</button>
  </div>
)

const mapDispatchToProps = dispatch => bindActionCreators({
  gotoSearch: () => push('/')
}, dispatch);

export default connect(null, mapDispatchToProps)(Tickets)
