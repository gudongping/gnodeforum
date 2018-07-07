import React, {Component} from 'react'
import UserIcon from "material-ui-icons/AccountCircle"
import Container from '../layout/container'
import userStyles from './styles/user-style'
import Avatar from 'material-ui/Avatar'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'

@inject(stores=>({
  user: stores.appState.user
}))
@observer
class User extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired
  }

  componentDidMount() {

  }

  render() {
    const {classes} = this.props
    const {isLogin, info} = this.props.user
    return (
      <Container>
        <div className={classes.avatar}>
          <div className={classes.bg} />
          {
            info.avatar_url ?
            <Avatar className={classes.avatarImg} src={info.avatar_url} />:
            <Avatar className={classes.avatarImg}>
              <UserIcon />
            </Avatar>
          }
          <span className={classes.userName}>{info.loginname || '未登录'}</span>
        </div>
        {this.props.children}
      </Container>
    )
  }
}

export default withStyles(userStyles)(User);