import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    padding: '5rem'
  }
}));

const Loader = props => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div style={{ padding: props.padding }} className={classes.root}>
        <CircularProgress
          style={{ width: props.width ? props.width : '4rem', height: props.height ? props.height : '4rem' }}
        />
      </div>
    </React.Fragment>
  );
};

export default Loader;
