import React from 'react'
import { Multipath, Modepath, Walkpath, Startpath, Endpath } from './Path'
import { togglePlanning, updateQuery, updateMode, executeQuery } from '../../reducers/routing'
import { getUser } from '../../reducers/auth'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import './Travel.scss'

class Travel extends React.Component {
  componentDidMount () {
    this.props.getUser();
  }
  render() {
    return (
      <div>
        <p>
          <button onClick={() => this.props.gotoTickets()}>Go to ticketing</button>
        </p>
        {this.props.query.error ? <p>{this.props.query.error}</p> : ''}
        {!this.props.planning_is_minimized ?
          <div className="Plan">
            <p className="Plan__header">
              <span className="Plan__title">Traveling</span>
              {this.props.results ? <span>&nbsp;<button onClick={(event) => this.props.togglePlanning()}>Hide planner</button></span> : ''}
            </p>
            <div className="Plan__controls">
              <div className="Plan__modes">
                {Object.keys(this.props.query.modes).map(mode_name => (
                  <label key={mode_name}>
                    <input type="checkbox"
                           name="mode"
                           value={mode_name}
                           checked={this.props.query.modes[mode_name]}
                           onChange={(event) => {
                             this.props.updateMode(mode_name, event.target.checked);
                           }}
                    />
                    &nbsp;
                    <span>{mode_name}</span>
                  </label>
                ))}
              </div>
              <input type="text"
                     placeholder="Place from"
                     value={this.props.query.from_place}
                     onChange={(event) => {this.props.updateQuery({from_place: event.target.value});}}
              />
              <input type="text"
                     placeholder="Place to"
                     value={this.props.query.to_place}
                     onChange={(event) => {this.props.updateQuery({to_place: event.target.value});}}
              />
              <div className="Plan__time-control">
                <div>
                  <button disabled={this.props.query.arrive_by === false}
                          onClick={(event) => {this.props.updateQuery({arrive_by: false})}}
                  >
                    Leaving at
                  </button>
                  <button disabled={this.props.query.arrive_by === true}
                          onClick={(event) => {this.props.updateQuery({arrive_by: true})}}
                  >
                    Arriving at
                  </button>
                </div>
                <input type="text"
                       placeholder="MM-DD-YYYY hh:mm"
                       defaultValue={this.props.query.date && this.props.query.time ?
                         this.props.query.date+' '+this.props.query.time
                         :
                         ''
                       }
                       onChange={(event) => {
                         this.props.updateQuery({
                           date: event.target.value.split(' ')[0],
                           time: event.target.value.split(' ')[1]});
                       }}
                />
              </div>
              <button onClick={(event) => {this.props.executeQuery(this.props.query);}}>Search</button>
            </div>
          </div>
          :
          <button className="PlanToggler" onClick={(event) => {this.props.togglePlanning();}}>
            <span>From {this.props.query.from_place}</span>
            &nbsp;
            <span>To {this.props.query.to_place}</span>
            &nbsp;
            <span>{!this.props.query.arrive_by ? 'leaving' : 'arriving'} {this.props.query.date} {this.props.query.time}</span>
            &nbsp;
            <span>using {Object.keys(this.props.query.modes).filter(mode_name => this.props.query.modes[mode_name]).join(',')}</span>
            &nbsp;
            <span>[Show planner]</span>
          </button>
        }
        {!this.props.results ?
          this.props.user.history && this.props.user.history.length ?
            <div className="History">
              <span>Common routes</span>
              {this.props.user.history.map(history => (
                <div>{JSON.stringify(history)}</div>
              ))}
            </div>
            :
            <p>No known history (previously searched routes) :[</p>
          :
          <div className="Recommendation">
            <span className="Recommendation__title">Optimal routes</span>
            <p>
              <span>From lat{this.props.results.plan.from.lat} lon{this.props.results.plan.from.lon}</span>
              <span>To lat{this.props.results.plan.from.lat} lon{this.props.results.plan.from.lon}</span>
            </p>
            {this.props.results.plan.itineraries.map(itinerary => (
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
  }
}

const mapStateToProps = ({ auth, routing }) => ({
  planning_is_minimized: routing.planning_is_minimized,
  query: routing.query,
  results: routing.results,
  user: auth.user
});

const mapDispatchToProps = (dispatch) => {
  return {
    togglePlanning: () => dispatch(togglePlanning()),
    updateQuery: (partial_query_obj) => dispatch(updateQuery(partial_query_obj)),
    updateMode: (mode_name, mode_checked) => dispatch(updateMode(mode_name, mode_checked)),
    executeQuery: (full_query_obj) => dispatch(executeQuery(full_query_obj)),
    gotoTickets: () => dispatch(push('/tickets')),
    getUser: () => dispatch(getUser())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Travel)
