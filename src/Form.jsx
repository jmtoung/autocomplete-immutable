import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import { AutoComplete as MUIAutoComplete } from 'material-ui';
import {
  AutoComplete,
  TextField,
} from 'redux-form-material-ui';

class Form extends Component {

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
            dataSourceConfig={{ value: 'value', text: 'text' }}
            dataSource={[
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
            ]}
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
