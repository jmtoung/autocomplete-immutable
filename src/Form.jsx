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
  constructor(props) {
    super(props);

    // this.state = {
    //   countries: [],
    //   countriesList: [],
    //   countryNameToCode: {},
    //   countryCodeToName: {},
    //   cities: [],
    //   citiesList: [],
    //   cityNameToCode: {},
    //   cityCodeToName: {},
    // };
    this.countries = [];
    this.countriesList = [];
    this.countryNameToCode = {};
    this.countryCodeToName = {};
    this.cities = [];
    this.citiesList = [];
    this.cityNameToCode = {};
    this.cityCodeToName = {};
  }

  initializeCountryValues = (countries) => {
    const countriesList = [];
    const countryNameToCode = {};
    const countryCodeToName = {};
    for (const country of countries) {
      const text = country.get("text");
      const value = country.get("value");
      countriesList.push(text);
      countryNameToCode[text] = value;
      countryCodeToName[value] = text;
    }
    this.countriesList = countriesList;
    this.countryNameToCode = countryNameToCode;
    this.countryCodeToName = countryCodeToName;
    // this.setState(Object.assign({}, this.state, {
    //   countries: countries.toJS(),
    //   countriesList,
    //   countryNameToCode,
    //   countryCodeToName,
    // }));
  }

  initializeCityValues = (cities) => {
    const citiesList = [];
    const cityNameToCode = {};
    const cityCodeToName = {};
    for (const city of cities) {
      const text = city.get("text");
      const value = city.get("value");
      citiesList.push(text);
      cityNameToCode[text] = value;
      cityCodeToName[value] = text;
    }
    this.citiesList = citiesList;
    this.cityNameToCode = cityNameToCode;
    this.cityCodeToName = cityCodeToName;
    // this.setState(Object.assign({}, this.state, {
    //   cities: cities.toJS(),
    //   citiesList,
    //   cityNameToCode,
    //   cityCodeToName,
    // }))
  }

  componentWillMount() {
    this.props.getCountries();
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.countries.size === 0 && nextProps.countries.size > 0) {
      this.initializeCountryValues(nextProps.countries);
    }
    if (this.props.cities !== nextProps.cities) {
      console.log('initializing city values');
      this.initializeCityValues(nextProps.cities);
      console.log('this.props.selectedCityCode: ' + this.props.selectedCityCode);
      console.log('this.citiesList: ');
      console.log(this.citiesList);

      if (this.props.selectedCityCode && !(this.props.selectedCityCode in this.cityCodeToName)) {
        console.log('invalid city code');
        this.props.change('dummy', 'blah');
      }
    }
    // console.log('current country code: ' + this.props.selectedCountryCode);
    // console.log('next country code: ' + nextProps.selectedCountryCode);
    if (this.props.selectedCountryCode !== nextProps.selectedCountryCode && nextProps.selectedCountryCode !== '') {
      console.log('changing country code from ' + this.props.selectedCountryCode + ' to ' + nextProps.selectedCountryCode);
      this.props.getCities(nextProps.selectedCountryCode);
    }
  }

  parseCountry = (value, name) => {
    if (value in this.countryNameToCode) {
      this.props.blur('country_name');
      this.props.change('country_code', this.countryNameToCode[value]);
    }
    return value;
  }

  parseCity = (value, name) => {
    if (value in this.cityNameToCode) {
      this.props.change('city_code', this.cityNameToCode[value]);
    }
    return value;
  }

  onNewCountryRequest = value => {
    this.props.blur('country_name');
    if (value in this.countryNameToCode) {
      const countryCode = this.countryNameToCode[value]
      this.props.change('country_code', countryCode);
      //this.props.getCities(countryCode);
    }
  }

  onNewCityRequest = value => {
    this.props.blur('city_name');
    if (value in this.cityNameToCode) {
      const cityCode = this.cityNameToCode[value]
      this.props.change('city_code', cityCode);
    }
  }

  isValidCountry = (value, allValues, props) => {
    if (value && !(value in this.countryNameToCode)) {
      return 'Invalid Country';
    }
    return undefined;
  }

  isValidCity = (value, allValues, props) => {
    if (value && !(value in this.cityNameToCode)) {
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
            dataSource={this.countriesList}
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
            dataSource={this.citiesList}
            validate={this.isValidCity}
          />
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  countries: state.getIn(['Addresses', 'countries']),
  cities: state.getIn(['Addresses', 'cities']),
  selectedCountryCode: state.getIn(['form', 'user', 'values', 'country_code']),
  selectedCityCode: state.getIn(['form', 'user', 'values', 'city_code']),
});

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
