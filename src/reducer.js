import { fromJS } from 'immutable';


export default function Addresses(state, action) {
  switch (action.type) {
    case 'GET_COUNTRIES_SUCCESS': {
      return state.merge({ countries: fromJS(action.countries) });
    }
    case 'GET_STATES_SUCCESS': {
      return state.merge({ states: fromJS(action.states) });
    }
    default:
      return state;
  }
}
