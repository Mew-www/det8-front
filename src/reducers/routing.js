import axios from 'axios'

export const TOGGLE_PLANNING = 'routing/TOGGLE_PLANNING';
export const UPDATE_QUERY = 'routing/UPDATE_QUERY';
export const UPDATE_MODE = 'routing/UPDATE_MODE';
export const UPDATE_RESULTS = 'routing/EXECUTE_QUERY';

const initial_state = {
  planning_is_minimized: false,
  query: {
    from_place: '',
    to_place: '',
    modes: {
      'TRAM': true,
      'BUS': true,
      'SUBWAY': true,
      'RAIL': true
    },
    date: '',
    time: '',
    arrive_by: null,
    error: ''
  },
  results: null
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case TOGGLE_PLANNING:
      return {
        ...state,
        planning_is_minimized: !state.planning_is_minimized
      };
    case UPDATE_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          ...action.data  // Use destructuring to override using keys present in action.data
        }
      };
    case UPDATE_MODE:
      return {
        ...state,
        query: {
          ...state.query,
          modes: {
            ...state.query.modes,
            ...action.data  // As with UPDATE_QUERY but on another level
          }
        }
      };
    case UPDATE_RESULTS:
      return {
        ...state,
        planning_is_minimized: true,
        query: {
          ...state.query,
          error: ''
        },
        results: action.data
      };
    default:
      return state;
  }
}

export function togglePlanning() {
  return dispatch => {
    dispatch({type: TOGGLE_PLANNING})
  }
};

export function updateQuery(partial_query_object) {
  return dispatch => {
    dispatch({type: UPDATE_QUERY, data: partial_query_object})
  }
};

export function updateMode(mode_name, mode_checked) {
  return dispatch => {
    let partial_mode_obj = {};
    partial_mode_obj[mode_name] = mode_checked;
    dispatch({type: UPDATE_MODE, data: partial_mode_obj})
  }
};

export function executeQuery(full_query_object) {
  if (full_query_object.from_place.trim() === '') {
    return dispatch => {
      dispatch({type: UPDATE_QUERY, data: {error: 'Missing or invalid FROM_PLACE'}})
    }
  }
  if (full_query_object.to_place.trim() === '') {
    return dispatch => {
      dispatch({type: UPDATE_QUERY, data: {error: 'Missing or invalid TO_PLACE'}})
    }
  }
  if (!full_query_object.date
    || full_query_object.date.trim() === ''
    || full_query_object.date.split('-').length !== 3
  ) {
    return dispatch => {
      dispatch({type: UPDATE_QUERY, data: {error: 'Missing or invalid DATE'}})
    }
  }
  if (!full_query_object.time
    || full_query_object.time.trim() === ''
    || full_query_object.time.split(':').length !== 2
  ) {
    return dispatch => {
      dispatch({type: UPDATE_QUERY, data: {error: 'Missing or invalid TIME'}})
    }
  }
  if (full_query_object.arrive_by === null) {
    return dispatch => {
      dispatch({type: UPDATE_QUERY, data: {error: 'Must choose whether date+time is leaving/arriving'}})
    }
  }
  return dispatch => {
    axios.get(`https://api.digitransit.fi/geocoding/v1/search`+
      `?text=${full_query_object.from_place}`+
      `&size=1`
    )
    .then(response => {
      let from_coords = response.data.features[0].geometry.coordinates;
        axios.get(`https://api.digitransit.fi/geocoding/v1/search`+
          `?text=${full_query_object.to_place}`+
          `&size=1`
        )
          .then(response => {
            let to_coords = response.data.features[0].geometry.coordinates;
            axios.get(`http://142.93.228.154:8080/otp/routers/default/plan`+
              `?fromPlace=${from_coords[1]},${from_coords[0]}`+
              `&toPlace=${to_coords[1]},${to_coords[0]}`+
              `&date=${full_query_object.date}`+
              `&time=${full_query_object.time}`+
              `&mode=${['WALK'].concat(
                Object.keys(full_query_object.modes).filter(mode_name => {
                  return full_query_object.modes[mode_name]
                })
              ).join(',')}`+
              `&arriveBy=${full_query_object.arrive_by.toString()}`+
              `&maxWalkDistance=2000`,
              {headers: {'Content-Type': "application/json"}}
            )
              .then(response => {
                dispatch({type: UPDATE_RESULTS, data: response.data})
              })
              .catch(error => {
                dispatch({type: UPDATE_QUERY, data: {error: error.response.data}})
              })
          })
          .catch(error => {
            dispatch({type: UPDATE_QUERY, data: error.response.data})
          })
      })
      .catch(error => {
        dispatch({type: UPDATE_QUERY, data: error.response.data})
      })
  };
}