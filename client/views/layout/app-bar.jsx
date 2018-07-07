import React, {Component} from 'react'
import PropTypes from 'prop-types'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import ToolBar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui-icons/Home'
import {inject, observer} from 'mobx-react'

const styles = theme => ({
  root: {
    width: '100%'
  },
  flex: {
    flex: 1
  }
})

@inject(stores=>({
  appState: stores.appState
}))
@observer
class MainAppBar extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor() {
    super();
    this.onHomeIconClick = this.onHomeIconClick.bind(this);
    this.createButtonClick = this.createButtonClick.bind(this);
    this.loginButtonClick = this.loginButtonClick.bind(this);
  }

  onHomeIconClick() {
    this.context.router.history.push('/index?tab=all');
  }

  createButtonClick() {

  }

  loginButtonClick() {
    if(this.props.appState.user.isLogin) {
      this.context.router.history.push('/user/info');
    } else {
      this.context.router.history.push('/user/login');
    }
  }

  render() {
    const {classes} = this.props
    const {user} = this.props.appState
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <ToolBar>
            <IconButton color="inherit" onClick={this.onHomeIconClick}>
              <HomeIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              GNode Forum
            </Typography>
            <Button variant='raised' color="primary" onClick={this.createButtonClick}>
              新建话题
            </Button>
            <Button color="inherit" onClick={this.loginButtonClick}>
              {user.isLogin ? `${user.info.loginname}` : '登录'}
            </Button>
          </ToolBar>
        </AppBar>
      </div>
    );
  }
}
MainAppBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MainAppBar);