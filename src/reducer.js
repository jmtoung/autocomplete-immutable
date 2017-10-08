import { fromJS } from 'immutable';
import { getPhoneCode } from 'libphonenumber-js';

export default function Addresses(state, action) {
  switch (action.type) {
    case 'GET_COUNTRIES_SUCCESS': {
      return state.merge({ countries: fromJS(action.countries) });
    }
    case 'GET_STATES_SUCCESS': {
      return state.merge({ states: fromJS(action.states) });
    }
    case 'GET_US_CITY_STATE_SUCCESS': {
      return state
        .merge({ usCity: action.cityState.city })
        .merge({ usState: action.cityState.state });
    }
    case 'GET_PHONE_CODES': {
      const phoneCodes = [];
      for (let i = 0; i < action.countries.length; i += 1) {
        let phoneCode;
        try {
          phoneCode = getPhoneCode(action.countries[i].value);
        } catch (e) {
          phoneCode = '';
        }
        const phoneCodeObj = {
          value: action.countries[i].value,
          text: `+${phoneCode} (${action.countries[i].text})`,
        };
        phoneCodes.push(phoneCodeObj);
      }
      return state
        .merge({ phoneCodes });
    }
    default:
      return state;
  }
}
