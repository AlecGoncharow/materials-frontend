import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import classNames from 'classnames';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import PersistentDrawer from "./PersistentDrawer";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

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
          <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <TextField className={classes.textField} label="Custom IDs" aria-label="input"
          inputProps={inputProps}>
          </TextField>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Computer Science Material Visualization
          </Typography>
          <Button id="btn-All" color="inherit" onClick={props.onClick}>All Assignments</Button>
          <Button id="btn-Nifty" color="inherit" onClick={props.onClick}>Nifty</Button>
          <Button id="btn-Peachy" color="inherit" onClick={props.onClick}>Peachy</Button>
          <Button id="btn-3145" color="inherit" onClick={props.onClick}>ITCS 3145</Button>
        </Toolbar>
      </AppBar>
      <PersistentDrawer/>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);