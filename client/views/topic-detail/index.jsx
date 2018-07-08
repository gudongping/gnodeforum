import React, {Component} from "react"
import PropTypes from "prop-types"
import marked from 'marked'
import { Helmet } from 'react-helmet';
import { inject, observer } from "mobx-react";
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import CircularProgress from 'material-ui/Progress/CircularProgress'
import Container from '../layout/container'
import {topicDetailStyle} from './styles'
import Reply from './reply'
import dateFormat from 'dateformat'
import SimpleMDE from 'react-simplemde-editor'
import IconReply from 'material-ui-icons/Reply'

@inject(stores=>({
  topicStore: stores.topicStore,
  user: stores.appState.user
}))
@observer
export class TopicDetail extends Component{
  constructor() {
    super();
    this.state = {
      newReply: ''
    }
    this.handleNewReplyChange = this.handleNewReplyChange.bind(this)
    this.goToLogin = this.goToLogin.bind(this)
    this.doReply = this.doReply.bind(this)
  }

  componentDidMount() {
    const id = this.getTopicId();
    this.props.topicStore.getTopicDetail(id);
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
  }

  getTopicId() {
    return this.props.match.params.id
  }

  goToLogin() {
    return this.props.history.push('/user/login')
  }

  doReply() {
    const id = this.getTopicId();
    const topic = this.props.topicStore.detailMap[id]
    topic.doReply(this.state.newReply)
      .then(()=>{
        this.setState({
          newReply: ''
        });
      }).catch(err=>{
        console.log(err);
      });
  }

  handleNewReplyChange(value) {
    this.setState({
      newReply: value
    })
  }

  render() {
    const {classes, user} = this.props
    const id = this.getTopicId();
    const topic = this.props.topicStore.detailMap[id]
    if(!topic) {
      return (
        <Container>
          <section className={classes.loadingContainer}>
            <CircularProgress color="primary" size={100} />
          </section>
        </Container>
      )
    }
    return (
      <div>
        <Container>
          <Helmet>
            <title>This is detail list</title>
          </Helmet>
          <header className={classes.header}>
            <h3>{topic.title}</h3>
          </header>
          <section className={classes.body}>
            <p dangerouslySetInnerHTML={{__html:marked(topic.content)}}></p>
          </section>
        </Container>
        {
          topic.createdReplies && topic.createdReplies.length > 0 ? (
            <Paper elevation={4} className={classes.replies}>
              <header className={classes.replyHeader}>
                <span>我的最新回复</span>
                <span>{`${topic.createdReplies.length}条`}</span>
              </header>
              {
                topic.createdReplies.map(reply=>(
                  <Reply reply={Object.assign({}, reply, {
                    author: {
                      avatar_url: user.info.avatar_url,
                      loginname: user.info.loginname
                    }
                  })} key={reply.id} />
                ))
              }
            </Paper>
          ) : null
        }
        <Paper elevation={4} className={classes.replies}>
          <header className={classes.replyHeader}>
            <span>{`${topic.reply_count} 回复`}</span>
            <span>{`最新回复 ${dateFormat(topic.last_reply_at,'yyyy-mm-dd hh:MM:ss')}`}</span>
          </header>
            {
              user.isLogin ?
              <section className={classes.replyEditor}>
                <SimpleMDE
                  onChange={this.handleNewReplyChange}
                  value={this.state.newReply}
                  options={{
                    toolbar: false,
                    autoFocus: false,
                    spellChecker: false,
                    placeholder: '添加您的精彩回复'
                  }}
                />
                <Button variant='fab' color="primary"
                  onClick={this.doReply}
                  className={classes.replyButton}
                >
                  <IconReply />
                </Button>
              </section>
              : null
            }
            {
              !user.isLogin ?
                <section className={classes.notLoginButton}>
                  <Button variant='raised' color="primary" onClick={this.goToLogin}>登录并回复</Button>
                </section>
              : null
            }
          <section>
            {
              topic.replies.map(rp=><Reply reply={rp} key={rp.id}/>)
            }
          </section>
        </Paper>
      </div>
    )
  }
}

export default withStyles(topicDetailStyle)(TopicDetail)