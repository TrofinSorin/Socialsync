import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import './CreateAccount.scss';
import ButtonComponent from '@shared/ButtonComponent';
import InputAdornment from '@material-ui/core/InputAdornment';
import Img from '@shared/Images/Images';
import userIcon from '@assets/icons/user.svg';
import passwordIcon from '@assets/icons/lock.svg';
import * as usersActions from '@redux/actions/usersActions';
import { useHistory } from 'react-router-dom';
import formSerialize from 'form-serialize';
import banner from '@assets/images/logo.png';

const CreateAccount = props => {
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  let history = useHistory();

  const handleCreateAccountSubmit = event => {
    event.preventDefault();

    setSubmitButtonDisabled(true);

    console.log('formSerialize(event.target):', formSerialize(event.target, { hash: true }));
    dispatch(usersActions.createUser(formSerialize(event.target)))
      .then(response => {
        history.push('/security/login');
        setSubmitButtonDisabled(false);
      })
      .catch(err => {
        setSubmitButtonDisabled(false);
      });
  };

  return (
    <Grid container className='full-height'>
      <div className='security-page create-account-bk text-center'>
        <img with={300} height={300} src={banner} alt='banner' />
        <div className='content-block white-overlay'>
          <h1>Create account</h1>

          <form onSubmit={event => handleCreateAccountSubmit(event)} className='general-form'>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='username'
              placeholder='Username or username address'
              name='username'
              autoComplete='username'
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Img src={userIcon} alt='User login icon' />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='password'
              placeholder='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Img src={passwordIcon} alt='Password login icon' />
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
              placeholder='Confirm Password'
              name='confirmpassword'
              autoComplete='confirmpassword'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Img src={passwordIcon} alt='Password login icon' />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='first-name'
              placeholder='First name'
              name='firstname'
              autoComplete='firstname'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Img src={userIcon} alt='User login icon' />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='lastname'
              placeholder='Last Name'
              name='lastname'
              autoComplete='lastname'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Img src={userIcon} alt='User login icon' />
                  </InputAdornment>
                )
              }}
            />
            <ButtonComponent disabled={submitButtonDisabled} buttonType='submit' type='btn-primary'>
              Create account
            </ButtonComponent>

            <Grid container className='bottom-section'>
              <Grid item xs>
                <span>Already a member? </span>
                <Link to={props.type !== 'guest' ? '/security/login' : '/account/login'}>Sign in</Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>

      <Box mt={8}></Box>
    </Grid>
  );
};

export default CreateAccount;
