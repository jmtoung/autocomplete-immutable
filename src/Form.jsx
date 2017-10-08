import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form/immutable';
import { AutoComplete as MUIAutoComplete } from 'material-ui';
import {
  AutoComplete,
  TextField,
} from 'redux-form-material-ui';
import { getCountries, getStates } from './creator';
import { isEqual } from 'lodash';

class Form extends Component {

  componentWillMount() {
    this.props.getCountries();
  };

  componentWillReceiveProps(nextProps) {
    // If the states passed down to prop changes, we need to
    // reinitialize the state maps and also run a validation
    // to make sure that the selected state (if any) is correct.
    if (this.props.states && !isEqual(this.props.states, nextProps.states)) {
      if (this.props.selectedStateName && !(this.props.selectedStateCode in nextProps.stateCodeToName)) {
        // Need to call this change in order to trigger validation.
        this.props.change('dummy', !this.props.dummy);
      }
    }
    // If the country code changes we need to re-query the server
    // for the appropriate states.
    if (this.props.selectedCountryCode !== nextProps.selectedCountryCode) {
      this.props.getStates(nextProps.selectedCountryCode);
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
      // TODO: Ask, was it good to move the following line
      // to "componentWillReceiveProps()"?
      //this.props.getStates(countryCode);
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

  return {
    countries,
    countriesList,
    countryNameToCode,
    countryCodeToName,
    states,
    statesList,
    stateNameToCode,
    stateCodeToName,
    selectedCountryCode: state.getIn(['form', 'user', 'values', 'countryCode']),
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
    dummy: '',
  },
})(Form);
