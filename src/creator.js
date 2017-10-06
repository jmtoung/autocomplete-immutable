
function retrieveCountries() {
  const countries = [
      {value: 'AF', text: 'Afghanistan'},
      {value: 'AR', text: 'Argentina'},
      {value: 'BE', text: 'Belgium'},
      {value: 'BR', text: 'Brazil'},
      {value: 'CA', text: 'Canada'},
      {value: 'CN', text: 'China'},
      {value: 'DK', text: 'Denmark'},
      {value: 'EG', text: 'Egypt'},
      {value: 'FI', text: 'Finland'},
      {value: 'FR', text: 'France'},
      {value: 'US', text: 'United States'},
  ];

  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve(countries);
    }, 500)
  });
}

export function getCountriesSuccess(countries) {
  return {
    type: 'GET_COUNTRIES_SUCCESS',
    countries
  }
}

export function getCountries() {
  return async (dispatch) => {
    const response = await retrieveCountries();
    dispatch(getCountriesSuccess(response));
  };
}

function retrieveCities(country) {
  const cities = {
    'AF': [
      {value: 'KA', text: 'Kabul'},
      {value: 'HE', text: 'Herat'},
      {value: 'GH', text: 'Ghazni'},
    ],
    'AR': [
      {value: 'BA', text: 'Buenos Aires'},
      {value: 'MP', text: 'Mar del Plata'},
    ],
    'BE': [
      {value: 'BU', text: 'Bruges'},
      {value: 'GH', text: 'Ghent'},
    ],
    'BR': [
      {value: 'RI', text: 'Rio de Janeiro'},
      {value: 'SP', text: 'Sao Paulo'},
    ],
    'CA': [
      {value: 'TO', text: 'Toronto'},
      {value: 'OT', text: 'Ottawa'},
      {value: 'MT', text: 'Montreal'},
      {value: 'VC', text: 'Vancouver'},
    ],
    'CN': [
      {value: 'BJ', text: 'Beijing'},
      {value: 'SH', text: 'Shanghai'},
      {value: 'SZ', text: 'Shenzhen'},
    ],
    'DK': [
      {value: 'CP', text: 'Copenhagen'},
      {value: 'AA', text: 'Aarhus'},
    ],
    'EG': [
      {value: 'CO', text: 'Cairo'},
      {value: 'AX', text: 'Alexandria'},
      {value: 'GZ', text: 'Giza'},
    ],
    'FI': [
      {value: 'HS', text: 'Helsinki'},
      {value: 'TP', text: 'Tampere'},
    ],
    'FR': [
      {value: 'PS', text: 'Paris'},
      {value: 'MS', text: 'Marseille'},
      {value: 'BX', text: 'Bordeaux'},
    ],
    'US': [
      {value: 'NY', text: 'New York'},
      {value: 'SF', text: 'San Francisco'},
      {value: 'MP', text: 'Menlo Park'},
    ],
  };

  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve(cities[country]);
    }, 500)
  });
}

export function getCitiesSuccess(cities) {
  return {
    type: 'GET_CITIES_SUCCESS',
    cities
  }
}

export function getCities(country) {
  return async (dispatch) => {
    const response = await retrieveCities(country);
    dispatch(getCitiesSuccess(response));
  };
}
