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

  componentWillMount() {
    this.props.getCountries();
  };

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
            dataSourceConfig={{text: 'text', value: 'value'}}
            dataSource={this.props.countries.toJS()}
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
