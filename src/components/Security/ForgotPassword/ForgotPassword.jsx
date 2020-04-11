import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import './ForgotPassword.scss';
import ButtonComponent from '@shared/ButtonComponent';
import InputAdornment from '@material-ui/core/InputAdornment';
import Img from '@shared/Images/Images';
import userIcon from '@assets/icons/user.svg';
import * as usersActions from '@redux/actions/usersActions';

const ForgotPassword = props => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const dispatch = useDispatch();

  const onSubmitForgotPasswordHandler = event => {
    event.preventDefault();

    const userPayload = {
      email: email
    };

    setSubmitButtonDisabled(true);

    dispatch(usersActions.forgotPassword(userPayload))
      .then(response => {
        setSuccessMessage(true);
        setSubmitButtonDisabled(false);
      })
      .catch(err => {
        setSubmitButtonDisabled(false);
      });
  };

  return (
    <Grid container className='full-height'>
      <div className='security-page forgot-pass-bk text-center'>
        <div className='content-block white-overlay'>
          <h1>Forgot password</h1>

          <form onSubmit={event => onSubmitForgotPasswordHandler(event)} className='general-form'>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              placeholder='Username or email address'
              name='email'
              autoComplete='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Img src={userIcon} alt='User login icon' />
                  </InputAdornment>
                )
              }}
            />

            <div className='mt-2'>
              <ButtonComponent disabled={submitButtonDisabled} buttonType='submit' type='btn-primary'>
                Send
              </ButtonComponent>
            </div>
          </form>
        </div>
        {successMessage ? (
          <div className='email-success-message content-block white-overlay'>
            <p>We have e-mailed your password reset link!</p>
          </div>
        ) : null}
      </div>
    </Grid>
  );
};

ForgotPassword.propTypes = {
  // bla: PropTypes.string,
};

ForgotPassword.defaultProps = {
  // bla: 'test',
};

export default ForgotPassword;
