import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { Link, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import './Login.scss';
import ButtonComponent from '@shared/ButtonComponent';
import InputAdornment from '@material-ui/core/InputAdornment';
import Img from '@shared/Images/Images';
import userIcon from '@assets/icons/user.svg';
import passwordIcon from '@assets/icons/lock.svg';
import * as usersActions from '@redux/actions/usersActions';
import Auth from '@services/Auth';
import formSerialize from 'form-serialize';
import banner from '@assets/images/logo.png';

const Login = props => {
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    if (Auth.getUser().accessToken) {
      history.push('/home');
    }
  }, [history]);

  const handleLoginSubmit = async event => {
    event.preventDefault();

    setSubmitButtonDisabled(true);

    dispatch(usersActions.login(formSerialize(event.target)))
      .then(result => {
        if (result && Auth.isAuthenticated) {
          history.push('/home');
        }

        return result;
      })
      .catch(err => {
        setSubmitButtonDisabled(false);
      });
  };

  return (
    <Grid container className='full-height'>
      <div className='security-page sign-in-bk text-center'>
        <img with={300} height={300} src={banner} alt='banner' />
        <div className='content-block white-overlay'>
          <h1>Sign in</h1>

          <form onSubmit={event => handleLoginSubmit(event)} className='general-form'>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='username'
              placeholder='Username or email address'
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

            <Grid container className='mt-1'>
              <Grid container item xs justify='flex-start' className='text-left'>
                <Link to={'/security/forgot-password'}>Forgot username or password?</Link>
              </Grid>
            </Grid>

            <ButtonComponent disabled={submitButtonDisabled} buttonType='submit' type='btn-primary'>
              Sign in
            </ButtonComponent>
          </form>

          <Grid container className='bottom-section'>
            <Grid item xs>
              <span>Don't have an account? </span>
              <Link to={'/security/create'}>Create account</Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </Grid>
  );
};

export default Login;
