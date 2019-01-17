import React from 'react'
import { togglePlanning, updateQuery, executeQuery } from '../reducers/routing'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

const Travel = props => (
  <div>
    {JSON.stringify(props.query)}
    {!props.planning_is_minimized ?
      <div className="Plan">
        <p className="Plan__title">
          <span>Traveling</span>
          {props.results ? <span onClick={(event) => props.togglePlanning()}>^</span> : ''}
        </p>
        <div className="Plan__controls">
          <input type="text"
                 placeholder="Place from"
                 onChange={(event) => {props.updateQuery({from_place: event.target.value});}}
          />
          <input type="text"
                 placeholder="Place to"
                 onChange={(event) => {props.updateQuery({to_place: event.target.value});}}
          />
          <div className="Plan__time-control">
            <div>
              <button disabled={props.query.arrive_by === false}
                      onClick={(event) => {props.updateQuery({arrive_by: false})}}
              >
                Leaving at
              </button>
              <button disabled={props.query.arrive_by === true}
                      onClick={(event) => {props.updateQuery({arrive_by: true})}}
              >
                Arriving at
              </button>
            </div>
            <input type="text"
                   placeholder="MM-DD-YYYY hh:mm"
                   onChange={(event) => {
                     props.updateQuery({
                       date: event.target.value.split(' ')[0],
                       time: event.target.value.split(' ')[1]});
                   }}
            />
          </div>
          <button onClick={(event) => {props.executeQuery(props.query);}}>Search</button>
        </div>
      </div>
      :
      <button className="PlanToggler" onClick={(event) => {props.togglePlanning();}}>
        ... \/
      </button>
    }
    {!props.results ?
      !props.history ?
        <div className="History">
          <span>Common routes</span>
        </div>
        :
        <p>No known history (previously searched routes) :[</p>
      :
      <div className="Recommendation">
        <span>Optimal routes</span>
        <p>
          <span>From lat{props.results.plan.from.lat} lon{props.results.plan.from.lon}</span>
          <span>To lat{props.results.plan.from.lat} lon{props.results.plan.from.lon}</span>
        </p>
        <pre>{JSON.stringify(props.results.plan.itineraries)}</pre>
      </div>
    }
    <button onClick={() => props.gotoTickets()}>Go to ticketing</button>
  </div>
);

const mapStateToProps = ({ routing }) => ({
  planning_is_minimized: routing.planning_is_minimized,
  query: routing.query,
  results: routing.results
});

const mapDispatchToProps = (dispatch) => {
  return {
    togglePlanning: () => dispatch(togglePlanning()),
    updateQuery: (partial_query_obj) => dispatch(updateQuery(partial_query_obj)),
    executeQuery: (full_query_obj) => dispatch(executeQuery(full_query_obj)),
    gotoTickets: () => dispatch(push('/tickets'))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Travel)
