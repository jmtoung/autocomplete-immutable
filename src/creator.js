
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
  ];

  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve(countries);
    }, 2000)
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
