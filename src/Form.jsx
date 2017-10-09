import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form/immutable';
import { AutoComplete as MUIAutoComplete } from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import {
  AutoComplete,
  SelectField,
  TextField
} from 'redux-form-material-ui';
import { getCountries, getStates, getPhoneCodes, retrieveUsCityState } from './creator';
import { isEqual } from 'lodash';
import validator from 'validator';
import { parse, format, isValidNumber } from 'libphonenumber-js';

class Form extends Component {

  componentWillMount() {
    this.props.getCountries();
  };

  componentWillReceiveProps(nextProps) {
    // The first time countries gets updated, we need to grab all the phone
    // country codes.
    if (this.props.countries.length === 0 && nextProps.countries.length !== 0) {
      this.props.getPhoneCodes(nextProps.countries);
    }

    // Everytime we are about to re-render the page, trigger this change so
    // that validation will occur.
    this.props.change('dummy', !this.props.dummy);

    // If the states passed down to prop changes, we need to reinitialize the
    // state maps and also run a validation to make sure that the selected
    // state (if any) is correct.
    if (this.props.states && !isEqual(this.props.states, nextProps.states)) {
      if (this.props.selectedStateName && !(this.props.selectedStateCode in nextProps.stateCodeToName)) {
	// TODO: potentially remove this since we are always triggering a
	// change above?
        this.props.change('dummy', !this.props.dummy);
      }
    }

    // If the country code changes we need to re-query the server for the
    // appropriate states.
    if (this.props.selectedCountryCode !== nextProps.selectedCountryCode) {
      this.props.getStates(nextProps.selectedCountryCode);
      this.props.change('dummy', !this.props.dummy);
    }

    // Right after we are entering a valid postal code, we need to retrieve the
    // city and state if the country is 'US'.
    if (nextProps.isValidUsPostalCode && !this.props.isValidUsPostalCode) {
      const context = this;
      retrieveUsCityState(nextProps.selectedPostalCode)
      .then(function(data) {
        let state = '';
        if (data.state in nextProps.stateCodeToName) {
          state = nextProps.stateCodeToName[data.state];
          context.props.change('stateCode', data.state);
        }
        context.props.change('stateName', state);
        context.props.change('cityName', data.city);
      });
    }
  }

  parseCountry = (value, name) => {
    if (value in this.props.countryNameToCode) {
      this.props.blur('countryName');
      this.props.change('countryCode', this.props.countryNameToCode[value]);
    }
    return value;
  }

  parseState = (value, name) => {
    this.props.blur('stateName');
    if (value in this.props.stateNameToCode) {
      this.props.change('stateCode', this.props.stateNameToCode[value]);
    }
    return value;
  }

  onNewCountryRequest = value => {
    this.props.blur('countryName');
    if (value in this.props.countryNameToCode) {
      const countryCode = this.props.countryNameToCode[value]
      this.props.change('countryCode', countryCode);
    }
  }

  onNewStateRequest = value => {
    this.props.blur('stateName');
    if (value in this.props.stateNameToCode) {
      const stateCode = this.props.stateNameToCode[value]
      this.props.change('stateCode', stateCode);
    }
  }

  isValidCountry = (value, allValues, props) => {
    if (value && !(value in this.props.countryNameToCode)) {
      return 'Invalid Country';
    }
    return undefined;
  }

  isValidState = (value, allValues, props) => {
    if (value && this.props.statesList.length > 0 && !(value in this.props.stateNameToCode)) {
      return 'Invalid State';
    }
    return undefined;
  }

  isValidPostalCode = (value) => {
    if (!value) {
      return undefined;
    }
    try {
      var isValid = validator.isPostalCode(value, this.props.selectedCountryCode);
    } catch (e) {
      return undefined;
    }
    if (isValid) {
      return undefined;
    }
    return 'Invalid Postal Code';
  }

  parsePhoneNumber = (value) => {
    const parsed = parse(value, { country: { default: this.props.selectedPhoneNumberCountryCode } });
    if (Object.keys(parsed).length === 0 && parsed.constructor === Object) {
      return value;
    }
    this.props.change('phoneNumberCountryCode', parsed.country);
    return parsed.phone;
  }

  formatPhoneNumber = (value) => {
    if (isValidNumber(value, this.props.selectedPhoneNumberCountryCode)) {
      return format(value, this.props.selectedPhoneNumberCountryCode, 'National');
    }
    return value;
  }

  isValidPhoneNumberCountryCode = (value, allValues, props) => {
    if (allValues.get("phoneNumber") && !allValues.get("phoneNumberCountryCode")) {
      props.touch('phoneNumberCountryCode');
      return 'Required';
    }
    return undefined;
  }

  isValidPhoneNumber = (value, allValues, props) => {
    if (allValues.get("phoneNumberCountryCode") && allValues.get("phoneNumber")) {
      if (isValidNumber(allValues.get("phoneNumber"), allValues.get("phoneNumberCountryCode"))) {
        props.touch('phoneNumber');
        return undefined;
      }
    }
    return 'Invalid Phone Number';
  }

  render() {
    let phoneCodeChildren = [
      <MenuItem value={''} primaryText={''} key="-1" />
    ];
    for (var i = 0; i < this.props.phoneCodes.length; i++) {
      const phoneCode = this.props.phoneCodes[i];
      phoneCodeChildren.push(
        <MenuItem value={phoneCode.value} primaryText={phoneCode.text} key={i} />,
      )
    };

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
        <div className="modal-item" style={{ display: 'none' }}>
          <Field
            name="dummy"
            component={TextField}
            floatingLabelText="Dummy"
            floatingLabelFixed
            type="text"
          />
        </div>

        <div className="modal-item">
          <Field
            name="countryName"
            component={AutoComplete}
            floatingLabelText="Country"
            floatingLabelFixed
            openOnFocus
            filter={MUIAutoComplete.fuzzyFilter}
            parse={this.parseCountry}
            onNewRequest={this.onNewCountryRequest}
            dataSource={this.props.countriesList}
            validate={this.isValidCountry}
          />
        </div>
        <div className="modal-item">
          <Field
            name="postalCode"
            component={TextField}
            floatingLabelText="Postal Code"
            floatingLabelFixed
            type="text"
            validate={this.isValidPostalCode}
          />
        </div>
        <div className="modal-item">
          <Field
            name="stateName"
            component={AutoComplete}
            floatingLabelText="State"
            floatingLabelFixed
            openOnFocus
            filter={MUIAutoComplete.fuzzyFilter}
            parse={this.parseState}
            onNewRequest={this.onNewStateRequest}
            dataSource={this.props.statesList}
            validate={this.isValidState}
          />
        </div>
        <div className="modal-item">
          <Field
            name="cityName"
            component={TextField}
            floatingLabelText="City Name"
            floatingLabelFixed
            type="text"
          />
        </div>
        <div className="modal-item">
          <Field
            name="phoneNumberCountryCode"
            component={SelectField}
            floatingLabelText="Phone Number Country Code"
            floatingLabelFixed
            children={phoneCodeChildren}
            validate={this.isValidPhoneNumberCountryCode}
          >
          </Field>
        </div>

        <div className="modal-item">
          <Field
            name="phoneNumber"
            component={TextField}
            floatingLabelText="Phone Number"
            floatingLabelFixed
            parse={this.parsePhoneNumber}
            format={this.formatPhoneNumber}
            validate={this.isValidPhoneNumber}
            onChange={this.onUpdatePhoneNumber}
            type="text"
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

  const states = state.getIn(['Addresses', 'states']).toJS();
  const statesList = [];
  const stateNameToCode = {};
  const stateCodeToName = {};
  for (const state of states) {
    const text = state.text;
    const value = state.value;
    statesList.push(text);
    stateNameToCode[text] = value;
    stateCodeToName[value] = text;
  }

  const selectedCountryCode = state.getIn(['form', 'user', 'values', 'countryCode']);
  const selectedPostalCode = state.getIn(['form', 'user', 'values', 'postalCode']);
  const syncErrors = state.getIn(['form', 'user', 'syncErrors']);
  let isValidUsPostalCode = false;
  if (selectedCountryCode === 'US') {
    if (selectedPostalCode && !(syncErrors && ('postalCode' in syncErrors))) {
      isValidUsPostalCode = true;
    }
  }

  return {
    countries,
    countriesList,
    countryNameToCode,
    countryCodeToName,
    states,
    statesList,
    stateNameToCode,
    stateCodeToName,
    phoneCodes: state.getIn(['Addresses', 'phoneCodes']).toJS(),
    selectedCountryCode,
    isValidUsPostalCode,
    selectedPostalCode,
    selectedPhoneNumberCountryCode: state.getIn(['form', 'user', 'values', 'phoneNumberCountryCode']),
    selectedStateCode: state.getIn(['form', 'user', 'values', 'stateCode']),
    selectedStateName: state.getIn(['form', 'user', 'values', 'stateName']),
    dummy: state.getIn(['form', 'user', 'values', 'dummy']),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators({
      getCountries,
      getStates,
      getPhoneCodes,
    }, dispatch),
    dispatch
  };
};

Form = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form);

export default reduxForm({
  form: 'user',
  initialValues: {
    name: '',
    countryName: '',
    countryCode: '',
    stateName: '',
    stateCode: '',
    cityName: '',
    phoneNumberCountryCode: '',
    phoneNumber: '',
    dummy: '',
  },
})(Form);
