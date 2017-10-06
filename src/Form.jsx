import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form/immutable';
import { AutoComplete as MUIAutoComplete } from 'material-ui';
import {
  AutoComplete,
  TextField,
} from 'redux-form-material-ui';
import { getCountries } from './creator';

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countries: [],
      countriesList: [],
      countryNameToCode: {},
      countryCodeToName: {},
    };
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
    this.setState(Object.assign({}, this.state, {
      countries: countries.toJS(),
      countriesList: countriesList,
      countryNameToCode: countryNameToCode,
      countryCodeToName: countryCodeToName,
    }));
    console.log(countriesList);
  }

  componentWillMount() {
    this.props.getCountries();
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.countries.size === 0 && nextProps.countries.size > 0) {
      this.initializeCountryValues(nextProps.countries);
    }
  }

  formatCountry = (value, name) => {
    return this.state.countryCodeToName[value] || value;
  }

  parseCountry = (value, name) => {
    return this.state.countryNameToCode[value] || value;
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

        <div className="modal-item">
          <Field
            name="country"
            component={AutoComplete}
            floatingLabelText="Country"
            floatingLabelFixed
            openOnFocus
            filter={MUIAutoComplete.fuzzyFilter}
            //parse={this.parseCountry}
            //format={this.formatCountry}
            dataSourceConfig={{text: 'text', value: 'value'}}
            dataSource={this.state.countries}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  countries: state.getIn(['Addresses', 'countries']),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getCountries }, dispatch);

Form = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form);

export default reduxForm({
  form: 'user',
  initialValues: {
    name: '',
    country: '',
  },
})(Form);
