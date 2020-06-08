import React from 'react';
import PropTypes from 'prop-types';
import * as usersActions from '@redux/actions/usersActions';
import { useSelector, useDispatch } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import './AutocompleteInput.scss';
import { Avatar } from '@material-ui/core';

const AutocompleteInput = props => {
  const { setUserSelected } = props;
  const [value, setValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const dispatch = useDispatch();
  const userReducer = useSelector(state => state.usersReducer);

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = suggestion => suggestion.firstname;

  // Use your imagination to render suggestions.
  const renderSuggestion = suggestion => (
    <div
      onClick={() => setUserSelectedClickHandler(suggestion)}
      tabIndex='0'
      style={{ display: 'flex', alignItems: 'center' }}>
      <Avatar
        style={{ marginRight: '1rem' }}
        src={suggestion.avatar}
        name={suggestion.firstname}
        size={200}
        round='50px'
      />
      <span style={{ marginRight: '.5rem' }}>{suggestion.firstname}</span>
      <span>{suggestion.lastname}</span>
    </div>
  );

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const filteredUsers = userReducer.usersToSelectFrom.filter(user => user.id !== userReducer.user.id);

    return inputLength === 0
      ? []
      : filteredUsers.filter(user => user.firstname.toLowerCase().slice(0, inputLength) === inputValue);
  };

  const setUserSelectedClickHandler = selectedUser => {
    setUserSelected(selectedUser);
  };

  /*eslint-disable */
  React.useEffect(() => {
    dispatch(usersActions.getUsersToSelectFrom(value));
  }, [value]);
  /*eslint-enable */

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }) => {
    console.log('getSuggestions(value):', getSuggestions(value));
    setSuggestions(getSuggestions(value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: 'Select a user',
    value,
    onChange: onChange
  };

  // Finally, render it!
  return (
    <div className='autocomplete-wrapper'>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    </div>
  );
};

AutocompleteInput.propTypes = {
  setUserSelected: PropTypes.func
};

export default AutocompleteInput;
