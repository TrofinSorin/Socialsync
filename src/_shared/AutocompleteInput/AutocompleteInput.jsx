import React from 'react';
import PropTypes from 'prop-types';
import * as usersActions from '@redux/actions/usersActions';
import { useSelector, useDispatch } from 'react-redux';
import './AutocompleteInput.scss';
import { Avatar } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const AutocompleteInput = props => {
  const { setUserSelected } = props;
  const [value, setValue] = React.useState('');
  const dispatch = useDispatch();
  const userReducer = useSelector(state => state.usersReducer);

  const onChange = event => {
    setValue(event.target.value);
  };

  const setUserChangeHandler = (event, selectedUser) => {
    setUserSelected(selectedUser);
  };

  const setUserSelectedClickHandler = selectedUser => {
    setUserSelected(selectedUser);
  };

  /*eslint-disable */
  React.useEffect(() => {
    dispatch(usersActions.getUsersToSelectFrom(value));
  }, [value]);
  /*eslint-enable */

  // Finally, render it!
  return (
    <div className='autocomplete-wrapper'>
      <Autocomplete
        id='highlights-demo'
        style={{ width: 'auto' }}
        options={userReducer.usersToSelectFrom.filter(item => item.id !== userReducer.user.id)}
        getOptionLabel={option => `${option.firstname} ${option.lastname}`}
        onChange={(event, value) => setUserChangeHandler(event, value)}
        renderInput={params => (
          <TextField
            style={{ width: '80%' }}
            {...params}
            onChange={onChange}
            label='Select User'
            variant='outlined'
            margin='normal'
          />
        )}
        renderOption={option => {
          return (
            <div
              onClick={() => setUserSelectedClickHandler(option)}
              tabIndex='0'
              style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                style={{ marginRight: '1rem' }}
                src={option.avatar}
                name={option.firstname}
                size={200}
                round='50px'
              />
              <span style={{ marginRight: '.5rem' }}>{option.firstname}</span>
              <span>{option.lastname}</span>
            </div>
          );
        }}
      />
    </div>
  );
};

AutocompleteInput.propTypes = {
  setUserSelected: PropTypes.func
};

export default AutocompleteInput;
