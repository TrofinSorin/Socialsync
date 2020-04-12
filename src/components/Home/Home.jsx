import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { useDispatch } from 'react-redux';
import './Home.scss';

const Home = props => {
  const dispatch = useDispatch();

  useEffect(() => {}, [dispatch]);

  return (
    <React.Fragment>
      <div className='HomeWrapper'>
        <Grid container className='home-header top-bar'>
          <Grid item xs={12} className='layout-row justify-content-center'>
            <h1>Chat App</h1>
          </Grid>
        </Grid>

        <Grid>
          <Grid container>
            <Grid item xs={12} className='greeting-block layout-row align-item-center'>
              <h2>Chat Home</h2>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default Home;
