import React from 'react'
import { Modepath, Walkpath, Startpath, Endpath } from './Path'
import { togglePlanning, updateQuery, updateMode, executeQuery } from '../../reducers/routing'
import { getUser, buyTicket } from '../../reducers/auth'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import './Travel.scss'
import tickettypes from '../../TicketConst'

function findValidTickettypes(paths) {
  // null => No ticket required
  // false => No configured ticket found for these paths
  // otherwise returns an array of class Ticket instances
  let zones_crossed = paths.reduce((accumulator, path) => {
    return accumulator
      .concat(
        path.from.zoneId !== undefined &&
        path.from.zoneId.toString().trim() &&
        path.to.zoneId !== undefined &&
        path.to.zoneId.toString().trim() &&
        accumulator.indexOf([path.from.zoneId, path.to.zoneId].sort().join('')) === -1 ?
          [[path.from.zoneId, path.to.zoneId].sort().join('')]
          :
          []
      )
  }, []);
  if (!zones_crossed.length) {
    return null;
  }
  let viable_tickets = tickettypes.filter(ticket => {
    return zones_crossed.every(zone => ticket.zones.indexOf(zone) !== -1);
  });
  if (!viable_tickets.length) {
    return false;
  }
  return viable_tickets;
}

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
              <p>
                <span>Common routes</span>
              </p>
              {this.props.user.history.map(history => (
                <div key={JSON.stringify(history)}>
                  <button onClick={(event) => {this.props.updateQuery(history);}}>
                    <span>From {history.from_place}</span>
                    &nbsp;
                    <span>To {history.to_place}</span>
                    &nbsp;
                    <span>{!history.arrive_by ? 'leaving' : 'arriving'} {history.date} {history.time}</span>
                    &nbsp;
                    <span>using {Object.keys(history.modes).filter(mode_name => history.modes[mode_name]).join(',')}</span>
                  </button>
                </div>
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
              <div className="Itinerary" key={`${itinerary.startTime}-${itinerary.endTime}-${itinerary.walkDistance}`}>
                <div className="Itinerary__route">
                  {itinerary.legs.map((path, i, arr) => (
                    i === 0 ?
                      <Startpath
                        key="startpath"
                        start_loc={`${path.from.lon},${path.from.lat}`}
                        start_time={`${('0'+(new Date(path.from.departure).getHours())).slice(-2)}:${('0'+(new Date(path.from.departure).getMinutes())).slice(-2)}`}
                        walk_distance_km={Math.round(path.distance/100)/10}
                      />
                      :
                      i < arr.length-1 ?
                        path.mode === 'WALK' && path.distance > 100?
                          <Walkpath
                            key={`${path.from.lon},${path.from.lat}-${path.to.lon},${path.to.lat}`}
                            walk_distance_km={Math.round(path.distance/100)/10}
                          />
                          :
                          <Modepath
                            key={`${path.from.lon},${path.from.lat}-${path.to.lon},${path.to.lat}`}
                            path_mode={path.mode}
                          />
                        :
                        <Endpath
                          key="endpath"
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
                    <span>Tickets required:</span>
                    &nbsp;
                    <span>
                      {function(valid_tickets, existing_tickets, phone_num, buy_ticket_fn) {
                        return valid_tickets === null ?
                          <span>No ticket required</span>
                          :
                          valid_tickets === false ?
                            <span>{'Error: None of known ticket types is valid for this travel'.toUpperCase()}</span>
                            :
                            existing_tickets.some(owned_ticket => {
                              return owned_ticket.valid_until > itinerary.endTime/1000 &&
                                valid_tickets.map(t => t.agency).indexOf(owned_ticket.agency) !== -1 &&
                                valid_tickets.map(t => t.name_fi).indexOf(owned_ticket.name) !== -1
                            }) ?
                              function(existing_valid_ticket) {
                                return (
                                  <span>No additional ticket required (currently owned {`${existing_valid_ticket.name}`} is valid for the trip</span>
                                )
                              }(existing_tickets.filter(owned_ticket => {
                                return owned_ticket.valid_until > itinerary.endTime/1000 &&
                                  valid_tickets.map(t => t.agency).indexOf(owned_ticket.agency) !== -1 &&
                                  valid_tickets.map(t => t.name_fi).indexOf(owned_ticket.name) !== -1
                              })[0])
                              :
                              valid_tickets.sort((a,b) => {return a.price_eur - b.price_eur}).map(ticket => (
                                <span key={ticket.name_fi} style={{margin: "4px"}}>
                                  <span>{`${ticket.name_fi} (${ticket.price_eur}€)`}</span>
                                  &nbsp;
                                  <button onClick={() => {buy_ticket_fn(ticket.agency, ticket.options(phone_num, new Date(itinerary.startTime).toISOString()))}}>[buy]</button>
                                </span>
                              ))
                      }(findValidTickettypes(itinerary.legs), this.props.user.tickets, this.props.user.phone, this.props.buyTicket)}
                    </span>
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
    getUser: () => dispatch(getUser()),
    buyTicket: (agency, options) => dispatch(buyTicket(agency, options))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Travel)
