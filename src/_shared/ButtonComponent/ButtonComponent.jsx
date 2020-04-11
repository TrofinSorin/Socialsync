import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const BootstrapButton = withStyles({
  root: {
    textTransform: 'none',
    fontSize: 18,
    padding: '.8rem 6.5rem',
    border: '1px solid',
    backgroundColor: '#2794E4',
    borderColor: 'transparent',
    boxShadow: '0px 0px 9px 0 rgba(0,0,0,0.3)',
    fontFamily: ['"MontserratSemibold"', '-apple-system', 'BlinkMacSystemFont'].join(','),

    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: 'transparent',
      boxShadow: 'none'
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#transparent'
    },
    '&:focus': {
      backgroundColor: '#0062cc',
      borderColor: '#transparent'
    }
  }
})(Button);

const ButtonComponent = props => {
  return (
    <React.Fragment>
      <BootstrapButton
        type={props.buttonType === 'submit' ? 'submit' : 'button'}
        onClick={props.onClick ? () => props.onClick() : null}
        className={props.type === 'btn-primary' ? 'btn-primary ' : 'btn-secondary ' + props.className}
        variant='contained'
        color='primary'
        disableRipple
        disabled={props.disabled}>
        {props.children}
      </BootstrapButton>
    </React.Fragment>
  );
};

export default ButtonComponent;
