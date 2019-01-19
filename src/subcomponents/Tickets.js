import React from 'react'
import { push } from 'connected-react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const Tickets = props => (
  <div>
    <p>
      <button onClick={() => props.gotoSearch()}>Go to Travelling</button>
    </p>
    <h1>Tickets</h1>
    <p>todo</p>
  </div>
);

const mapDispatchToProps = dispatch => bindActionCreators({
  gotoSearch: () => push('/')
}, dispatch);

export default connect(null, mapDispatchToProps)(Tickets)
