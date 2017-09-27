This project demonstrates an issue encountered when using the 'AutoComplete'
component from 'redux-form-material-ui':
After selection of an item in the AutoComplete menu, the TextField is "fixed" -
further modification is not permitted.

In the LiveDemo for 'redux-form-material-ui'
(http://erikras.github.io/redux-form-material-ui/), this behavior is not
observed. The notable difference is that the LiveDemo imports 'Field' and
'reduxForm' from 'redux-form', whereas in my example I import them from
'redux-form/immutable'.

However, I must use 'redux-form/immutable' because I have other objects in my
state that contain Immutable.js objects. (see
https://redux-form.com/7.0.4/examples/immutable/).

