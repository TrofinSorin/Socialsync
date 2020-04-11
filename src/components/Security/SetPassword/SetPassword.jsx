import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { Link, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import ButtonComponent from '@shared/ButtonComponent';
import InputAdornment from '@material-ui/core/InputAdornment';
import Img from '@shared/Images/Images';
import logo from '@assets/images/jybe-logo.png';
import passwordIcon from '@assets/icons/lock.svg';
import * as usersActions from '@redux/actions/usersActions';
import formSerialize from 'form-serialize';

const SetPassword = props => {
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  let history = useHistory();
  const id = props.match.params.id;
  const timestamp = props.match.params.timestamp;
  const token = props.match.params.token;

  const onSubmitSetPasswordHandler = event => {
    event.preventDefault();
    setSubmitButtonDisabled(true);

    const setPasswordPayload = {
      id: id,
      token: token,
      timestamp: timestamp,
      ...formSerialize(event.target, { hash: true })
    };

    console.log('setPasswordPayload:', setPasswordPayload);

    dispatch(usersActions.setPassword(setPasswordPayload))
      .then(response => {
        setSubmitButtonDisabled(false);
        history.push('/security/login');
      })
      .catch(err => {
        setSubmitButtonDisabled(false);
      });
  };

  return (
    <Grid container className='full-height'>
      <Link to='/' className='full-width text-center mt-1 mb-3'>
        <Img src={logo} alt='logo' />
      </Link>

      <div className='security-page forgot-pass-bk text-center'>
        <div className='content-block white-overlay'>
          <h1>Set Password</h1>

          <form onSubmit={event => onSubmitSetPasswordHandler(event)} className='general-form'>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='password'
              type='password'
              placeholder='Enter a password'
              name='password'
              autoComplete='password'
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Img src={passwordIcon} alt='User login icon' />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='confirm-password'
              type='password'
              placeholder='Enter Confirm Password'
              name='confirmPassword'
              autoComplete='confirmPassword'
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Img src={passwordIcon} alt='User login icon' />
                  </InputAdornment>
                )
              }}
            />
            <div className='mt-2 display-flex justify-content-center'>
              <ButtonComponent disabled={submitButtonDisabled} buttonType='submit' type='btn-primary'>
                Set Password
              </ButtonComponent>
            </div>
          </form>
        </div>
      </div>
    </Grid>
  );
};
SetPassword.propTypes = {
  // bla: PropTypes.string,
};

SetPassword.defaultProps = {
  // bla: 'test',
};

export default SetPassword;
