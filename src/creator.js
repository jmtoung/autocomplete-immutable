function retrieveCountries() {
  const countries = [
    { value: 'FR', text: 'France' },
    { value: 'IT', text: 'Italy' }, // Country with no corresponding city
    { value: 'US', text: 'United States' },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(countries);
    }, 500);
  });
}

export function getCountriesSuccess(countries) {
  return {
    type: 'GET_COUNTRIES_SUCCESS',
    countries,
  };
}

export function getCountries() {
  return async (dispatch) => {
    const response = await retrieveCountries();
    dispatch(getCountriesSuccess(response));
  };
}

function retrieveStates(country) {
  const states = {
    FR: [
      { value: 'BF', text: 'Bourgogne-Franche-Comté' },
      { value: 'NM', text: 'Normandy' },
      { value: 'IL', text: 'Ile-de-France' },
      { value: 'OC', text: 'Occitaine' },
    ],
    US: [
      { value: 'CA', text: 'California' },
      { value: 'NY', text: 'New York' },
      { value: 'TX', text: 'Texas' },
    ],
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      let statesList = [];
      if (country in states) {
        statesList = states[country];
      }
      resolve(statesList);
    }, 500);
  });
}

export function getStatesSuccess(states) {
  return {
    type: 'GET_STATES_SUCCESS',
    states,
  };
}

export function getStates(country) {
  return async (dispatch) => {
    const response = await retrieveStates(country);
    dispatch(getStatesSuccess(response));
  };
}

export function retrieveUsCityState(zipCode) {
  const cityStates = {
    94306: { state: 'CA', city: 'Palo Alto' },
    '07960': { state: 'NJ', city: 'Morristown' },
    '00000': { state: 'ZZ', city: 'Fakeville' }, // A zipcode that doesn't match a proper state.
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      let cityState = {};
      if (zipCode in cityStates) {
        cityState = cityStates[zipCode];
      }
      resolve(cityState);
    }, 500);
  });
}

export function getUsCityStateSuccess(cityState) {
  return {
    type: 'GET_STATES_SUCCESS',
    cityState,
  };
}

export function getUsCityState(zipcode) {
  return async (dispatch) => {
    const response = await retrieveUsCityState(zipcode);
    dispatch(getUsCityStateSuccess(response));
  };
}

export function getPhoneCodes(countries) {
  return {
    type: 'GET_PHONE_CODES',
    countries,
  };
}
