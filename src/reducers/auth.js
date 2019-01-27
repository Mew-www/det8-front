import axios from 'axios'

export const GET_USER = 'auth/GET_USER';
export const LOG_IN = 'auth/LOG_IN';

const initial_state = {
  has_initially_loaded: false,
  error: null,
  user: null
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        has_initially_loaded: true,
        user: action.data.user,
      };
    case LOG_IN:
      return {
        ...state,
        error: action.data.error,
        user: action.data.user
      };
    default:
      return state;
  }
}

export function getUser() {
  return dispatch => {
    axios.get('http://localhost:3030/auth', {withCredentials: true})
      .then(response1 => {
        axios.get('http://localhost:3030/history', {withCredentials: true})
          .then(response2 => {
            axios.get('http://localhost:3030/tickets', {withCredentials: true})
              .then(response3 => {
                dispatch({type: GET_USER, data: {user: {
                  ...response1.data,
                  history: response2.data,
                  tickets: response3.data
                }}})
              })
              .catch(error => {
                dispatch({type: GET_USER, data: {user: null}})
              })
          })
          .catch(error => {
            dispatch({type: GET_USER, data: {user: null}})
          })
      })
      .catch(error => {
        dispatch({type: GET_USER, data: {user: null}})
      })
  }
};

export function login(username, password) {
  return dispatch => {
    axios.post('http://localhost:3030/auth', {'email': username, 'password': password}, {withCredentials: true})
      .then(response => {
        dispatch({type: LOG_IN, data: {error: null, user: response.data}})
      })
      .catch(error => {
        dispatch({type: LOG_IN, data: {error: error.response.data, user: null}})
      })
  }
};

export function buyTicket(name, agency, ticket_options) {
  return dispatch => {
    switch(agency) {
      case 'HSL': {
        axios.post('http://localhost:3030/buyHSL', ticket_options, {withCredentials: true})
          .then(response => {
            const ticket = {
              valid_until: Math.round((new Date(response.data.validFrom)).getTime()/1000)+60*80,
              agency: agency,
              name: name,
              uid: response.data.ticketId,
              secret: response.data.phoneNumber
            };
            console.log(ticket);
            axios.post('http://localhost:3030/tickets', ticket, {withCredentials: true})
              .then(response0 => {
                axios.get('http://localhost:3030/auth', {withCredentials: true})
                  .then(response1 => {
                    axios.get('http://localhost:3030/history', {withCredentials: true})
                      .then(response2 => {
                        axios.get('http://localhost:3030/tickets', {withCredentials: true})
                          .then(response3 => {
                            dispatch({type: GET_USER, data: {user: {
                              ...response1.data,
                              history: response2.data,
                              tickets: response3.data
                            }}})
                          })
                          .catch(error => {
                            dispatch({type: GET_USER, data: {user: null}})
                          })
                      })
                      .catch(error => {
                        dispatch({type: GET_USER, data: {user: null}})
                      })
                  })
                  .catch(error => {
                    dispatch({type: GET_USER, data: {user: null}})
                  })
              })
              .catch(error => {
                dispatch({type: GET_USER, data: {user: null}})
              })
          })
          .catch(error => {
            dispatch({type: GET_USER, data: {user: null}})
          });
        break;
      }
      default: {
        break;
      }
    }
  }
};