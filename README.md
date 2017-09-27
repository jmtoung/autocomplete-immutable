# Introduction
I am observing unexpected behavior when attempting to use the AutoComplete
component in conjunction with Immutable.js objects. Any advice would be 
*greatly* appreciated!

# Instructions for running
To run this example, please clone this repository and then run the command
`npm start`.

# Explanation of problem
This project demonstrates an issue encountered when using the 'AutoComplete'
component from 'redux-form-material-ui':

**After selection of an item in the AutoComplete menu, the TextField is "fixed" -
further modification is not permitted.**

# Expected behavior
In the LiveDemo for 'redux-form-material-ui'
(http://erikras.github.io/redux-form-material-ui/), this behavior is not
observed. The notable difference is that the LiveDemo imports 'Field' and
'reduxForm' from 'redux-form', whereas in my example I import them from
'redux-form/immutable'.

However, I must use 'redux-form/immutable' because I have other objects in my
state that contain Immutable.js objects. (see
https://redux-form.com/7.0.4/examples/immutable/).
