import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function ButtonAppBar(props) {
  const { classes } = props;
  let inputProps = {
    style: {color: "white"},
    onKeyPress: props.onKeyPress,
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <TextField className={classes.textField} label="Custom IDs" aria-label="input"
          inputProps={inputProps}>
          </TextField>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Computer Science Material Visualization
          </Typography>
          <Button id="btn-All" color="inherit" onClick={props.onClick}>All Assignments</Button>
          <Button id="btn-Peachy" color="inherit" onClick={props.onClick}>Peachy</Button>
          <Button id="btn-3145" color="inherit" onClick={props.onClick}>ITCS 3145</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);