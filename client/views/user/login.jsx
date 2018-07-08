import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import TextField from 'material-ui/TextField'
import Button from "material-ui/Button"
import {withStyles} from 'material-ui/styles'
import UserWrapper from './user'
import loginStyles from './styles/login-style'
import {Redirect} from 'react-router-dom'
import queryString from 'query-string'

// 讲暴露的内容放到props中
@inject(stores=>({
  appState: stores.appState,
  user: stores.appState.user
}))
@observer
class UserLogin extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
    // appState: PropTypes.object.isRequired,
    // user: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object
  }

  constructor() {
    super();
    this.state = {
      accesstoken: '',
      helpText:''
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  getFrom(location) {
    location = location || this.props.location
    const query = queryString.parse(location.search)
    return query.from || '/user/info'
  }

  /* componentWillMount() {
    if(this.props.user.isLogin) {
      this.context.router.history.replace('/user/info');
    }
  } */

  handleInput(event) {
    this.setState({
      accesstoken: event.target.value.trim()
    })
  }

  handleLogin() {
    if(!this.state.accesstoken) {
      return this.setState({
        helpText: '必须填写'
      })
    }
    this.setState({
      helpText: ''
    })
    return this.props.appState.login(this.state.accesstoken)
      .then(()=>{
        // this.context.router.history.replace('/user/info');
      })
      .catch(error=>{
        console.log(error)
      })
  }

  render() {
    const {classes} = this.props
    const from = this.getFrom();
    const isLogin = this.props.user.isLogin
    if(isLogin) {
      return <Redirect to={from} />
    }
    return (
      <UserWrapper>
        <div className={classes.root}>
          <TextField
            label='请输入Cnode AccessToken'
            placeholder = '请输入Cnode AccessToken'
            required
            helperText={this.state.helpText}
            value={this.state.accesstoken}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button
            variant='raised'
            color="primary"
            onClick={this.handleLogin}
            className={classes.loginButton}
          >
            登录
          </Button>
        </div>
      </UserWrapper>
    )
  }
}

export default withStyles(loginStyles)(UserLogin)