import React from 'react'
import { Multipath, Modepath, Walkpath, Startpath, Endpath } from './Path'
import { togglePlanning, updateQuery, updateMode, executeQuery } from '../../reducers/routing'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import './Travel.scss'

const Travel = props => (
  <div>
    <p>
      <button onClick={() => props.gotoTickets()}>Go to ticketing</button>
    </p>
    {props.query.error ? <p>{props.query.error}</p> : ''}
    {!props.planning_is_minimized ?
      <div className="Plan">
        <p className="Plan__header">
          <span className="Plan__title">Traveling</span>
          {props.results ? <span>&nbsp;<button onClick={(event) => props.togglePlanning()}>Hide planner</button></span> : ''}
        </p>
        <div className="Plan__controls">
          <div className="Plan__modes">
            {Object.keys(props.query.modes).map(mode_name => (
              <label>
                <input type="checkbox"
                       name="mode"
                       value={mode_name}
                       checked={props.query.modes[mode_name]}
                       onChange={(event) => {
                         props.updateMode(mode_name, event.target.checked);
                       }}
                />
                &nbsp;
                <span>{mode_name}</span>
              </label>
            ))}
          </div>
          <input type="text"
                 placeholder="Place from"
                 value={props.query.from_place}
                 onChange={(event) => {props.updateQuery({from_place: event.target.value});}}
          />
          <input type="text"
                 placeholder="Place to"
                 value={props.query.to_place}
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
                   defaultValue={props.query.date && props.query.time ?
                     props.query.date+' '+props.query.time
                     :
                     ''
                   }
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
        <span>From {props.query.from_place}</span>
        &nbsp;
        <span>To {props.query.to_place}</span>
        &nbsp;
        <span>{!props.query.arrive_by ? 'leaving' : 'arriving'} {props.query.date} {props.query.time}</span>
        &nbsp;
        <span>using {Object.keys(props.query.modes).filter(mode_name => props.query.modes[mode_name]).join(',')}</span>
        &nbsp;
        <span>[Show planner]</span>
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
        <span className="Recommendation__title">Optimal routes</span>
        <p>
          <span>From lat{props.results.plan.from.lat} lon{props.results.plan.from.lon}</span>
          <span>To lat{props.results.plan.from.lat} lon{props.results.plan.from.lon}</span>
        </p>
        {props.results.plan.itineraries.map(itinerary => (
          <div className="Itinerary">
            <div className="Itinerary__route">
              {itinerary.legs.map((path, i, arr) => (
                i === 0 ?
                  <Startpath
                    start_loc={`${path.from.lon},${path.from.lat}`}
                    start_time={`${('0'+(new Date(path.from.departure).getHours())).slice(-2)}:${('0'+(new Date(path.from.departure).getMinutes())).slice(-2)}`}
                    walk_distance_km={Math.round(path.distance/100)/10}
                  />
                  :
                  i < arr.length-1 ?
                    path.mode === 'WALK' && path.distance > 100?
                    <Walkpath
                      walk_distance_km={Math.round(path.distance/100)/10}
                    />
                    :
                    <Modepath
                      path_mode={path.mode}
                    />
                    :
                    <Endpath
                      end_loc={`${path.to.lon},${path.to.lat}`}
                      end_time={`${('0'+(new Date(path.to.arrival).getHours())).slice(-2)}:${('0'+(new Date(path.to.arrival).getMinutes())).slice(-2)}`}
                      walk_distance_km={Math.round(path.distance/100)/10}
                    />
              ))}
            </div>
            <div className="Itinerary__summary">
              <div>Walk: {Math.round(itinerary.walkDistance)}m</div>
              <div>Duration: {Math.round(itinerary.duration/60)}min</div>
              <div>
                <span>Fees (zones travelled):</span>
                &nbsp;
                <span>{itinerary.legs.reduce((accumulator, path) => {return accumulator
                    .concat(accumulator.indexOf(path.from.zoneId) === -1 ? [path.from.zoneId] : [])
                    .concat(accumulator.indexOf(path.to.zoneId) === -1 ? [path.to.zoneId] : [])
                }, [])
                  .filter(zone => zone !== undefined && zone.toString().trim())
                  .join(',')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    }
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
    updateMode: (mode_name, mode_checked) => dispatch(updateMode(mode_name, mode_checked)),
    executeQuery: (full_query_obj) => dispatch(executeQuery(full_query_obj)),
    gotoTickets: () => dispatch(push('/tickets'))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Travel)
