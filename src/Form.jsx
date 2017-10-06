import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form/immutable';
import { AutoComplete as MUIAutoComplete } from 'material-ui';
import {
  AutoComplete,
  TextField,
} from 'redux-form-material-ui';
import { getCountries, getCities } from './creator';

class Form extends Component {

  componentWillMount() {
    this.props.getCountries();
  };

  componentWillReceiveProps(nextProps) {
    // If the cities passed down to prop changes, we need to
    // reinitialize the city maps and also run a validation
    // to make sure that the selected city (if any) is correct.
    if (this.props.cities !== nextProps.cities) {
      if (this.props.selectedCityCode && !(this.props.selectedCityCode in nextProps.cityCodeToName)) {
        // Need to call this change in order to trigger validation.
        this.props.change('dummy', !this.props.dummy);
      }
    }
    // If the country code changes we need to re-query the server
    // for the appropriate cities.
    if (this.props.selectedCountryCode !== nextProps.selectedCountryCode) {
      this.props.getCities(nextProps.selectedCountryCode);
    }
  }

  parseCountry = (value, name) => {
    if (value in this.props.countryNameToCode) {
      this.props.blur('country_name');
      this.props.change('country_code', this.props.countryNameToCode[value]);
    }
    return value;
  }

  parseCity = (value, name) => {
    if (value in this.props.cityNameToCode) {
      this.props.change('city_code', this.props.cityNameToCode[value]);
    }
    return value;
  }

  onNewCountryRequest = value => {
    this.props.blur('country_name');
    if (value in this.props.countryNameToCode) {
      const countryCode = this.props.countryNameToCode[value]
      this.props.change('country_code', countryCode);
      // TODO: Ask, was it good to move the following line
      // to "componentWillReceiveProps()"?
      //this.props.getCities(countryCode);
    }
  }

  onNewCityRequest = value => {
    this.props.blur('city_name');
    if (value in this.props.cityNameToCode) {
      const cityCode = this.props.cityNameToCode[value]
      this.props.change('city_code', cityCode);
    }
  }

  isValidCountry = (value, allValues, props) => {
    if (value && !(value in this.props.countryNameToCode)) {
      return 'Invalid Country';
    }
    return undefined;
  }

  isValidCity = (value, allValues, props) => {
    if (value && !(value in this.props.cityNameToCode)) {
      return 'Invalid City';
    }
    return undefined;
  }

  render() {
    return (
      <div className="modal-container">
        <div className="modal-item">
          <Field
            name="name"
            component={TextField}
            floatingLabelText="Name"
            floatingLabelFixed
            type="text"
          />
        </div>
        <div className="modal-container">
          <div className="modal-item">
            <Field
              name="dummy"
              component={TextField}
              floatingLabelText="Dummy"
              floatingLabelFixed
              type="text"
            />
          </div>
        </div>

        <div className="modal-item">
          <Field
            name="country_name"
            component={AutoComplete}
            floatingLabelText="Country"
            floatingLabelFixed
            openOnFocus
            filter={MUIAutoComplete.fuzzyFilter}
            parse={this.parseCountry}
            onNewRequest={this.onNewCountryRequest}
            //dataSourceConfig={{text: 'text', value: 'value'}}
            dataSource={this.props.countriesList}
            validate={this.isValidCountry}
          />
        </div>
        <div className="modal-item">
          <Field
            name="city_name"
            component={AutoComplete}
            floatingLabelText="City"
            floatingLabelFixed
            openOnFocus
            filter={MUIAutoComplete.fuzzyFilter}
            parse={this.parseCity}
            onNewRequest={this.onNewCityRequest}
            //dataSourceConfig={{text: 'text', value: 'value'}}
            dataSource={this.props.citiesList}
            validate={this.isValidCity}
          />
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => {
  const countries = state.getIn(['Addresses', 'countries']).toJS();
  const countriesList = [];
  const countryNameToCode = {};
  const countryCodeToName = {};
  for (const country of countries) {
    const text = country.text;
    const value = country.value;
    countriesList.push(text);
    countryNameToCode[text] = value;
    countryCodeToName[value] = text;
  }

  const cities = state.getIn(['Addresses', 'cities']).toJS();
  const citiesList = [];
  const cityNameToCode = {};
  const cityCodeToName = {};
  for (const city of cities) {
    const text = city.text;
    const value = city.value;
    citiesList.push(text);
    cityNameToCode[text] = value;
    cityCodeToName[value] = text;
  }

  return {
    countries,
    countriesList,
    countryNameToCode,
    countryCodeToName,
    cities,
    citiesList,
    cityNameToCode,
    cityCodeToName,
    selectedCountryCode: state.getIn(['form', 'user', 'values', 'country_code']),
    selectedCityCode: state.getIn(['form', 'user', 'values', 'city_code']),
    dummy: state.getIn(['form', 'user', 'values', 'dummy']),
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  getCountries, getCities }, dispatch);

Form = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form);

export default reduxForm({
  form: 'user',
  initialValues: {
    name: '',
    country_name: '',
    country_code: '',
    city_name: '',
    city_code: '',
    dummy: '',
  },
})(Form);
