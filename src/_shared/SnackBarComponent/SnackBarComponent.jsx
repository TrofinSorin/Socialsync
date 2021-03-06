import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const useStyles1 = makeStyles(theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.8rem'
  }
}));

const MySnackbarContentWrapper = props => {
  const classes = useStyles1();
  const { className, message, onClose, variant, ...other } = props;
  console.log('message:', message);
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby='client-snackbar'
      message={
        <span id='client-snackbar' className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key='close' aria-label='close' color='inherit' onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
};

const SnackBarComponent = props => {
  const [snackBarState, setSnackBarState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  });
  const { vertical, horizontal, open } = snackBarState;
  const snackbarReducer = useSelector(state => state.snackbarReducer);
  const snackbarMessage = snackbarReducer.message;

  const handleClose = () => {
    setSnackBarState({ ...snackBarState, open: false });
  };

  /*eslint-disable */
  useEffect(() => {
    console.log('snackbarReducer.message:', snackbarReducer.message);
    if (snackbarReducer.message && typeof snackbarReducer.message === 'string') {
      setSnackBarState({ ...snackBarState, open: true });
    }
  }, [snackbarReducer.message]);
  /*eslint-enable */

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        autoHideDuration={2000}>
        <MySnackbarContentWrapper
          onClose={handleClose}
          variant={snackbarReducer.type ? snackbarReducer.type : 'success'}
          message={snackbarMessage ? snackbarMessage : null}
        />
      </Snackbar>
    </React.Fragment>
  );
};

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['error', 'success']).isRequired
};

SnackBarComponent.propTypes = {
  // bla: PropTypes.string,
};

SnackBarComponent.defaultProps = {
  // bla: 'test',
};

export default SnackBarComponent;
