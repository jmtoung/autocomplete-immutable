import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import { AutoComplete as MUIAutoComplete } from 'material-ui';
import {
  AutoComplete,
  TextField,
} from 'redux-form-material-ui';

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

class Form extends Component {

  componentWillMount() {
      this.createMaps();
  };

  createMaps = () => {
      this.countries = [];
      this.countryNameToCode = {};
      this.countryCodeToName = {};
      for (const country of countries) {
          this.countries.push(country.text)
          this.countryNameToCode[country.text] = country.value;
          this.countryCodeToName[country.value] = country.text;
      }
  };

  formatCountry = (value, name) => {
      return this.countryCodeToName[value] || value;
  };

  parseCountry = (value, name) => {
      return this.countryNameToCode[value] || value;
  };

  render() {
    return (
      <div className="modal-container">
        <div className="modal-item">
          <Field
            name="name"
            component={TextField}
            floatingLabelText="Name (Works fine)"
            floatingLabelFixed
            type="text"
          />
        </div>

        <div className="modal-item">
          <Field
            name="country"
            component={AutoComplete}
            floatingLabelText="Country (Does not allow edit after selection)"
            floatingLabelFixed
            openOnFocus
            filter={MUIAutoComplete.fuzzyFilter}
            format={this.formatCountry}
            parse={this.parseCountry}
            dataSource={this.countries}
          />
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'user',
  initialValues: {
    name: '',
    country: '',
  },
})(Form);
