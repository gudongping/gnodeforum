import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import {withStyles} from "material-ui/styles"
import UserIcon from 'material-ui-icons/AccountCircle'
import Container from '../layout/container'
import userStyles from './styles/user-style'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'
import List, {ListItem, ListItemText} from "material-ui/List"
import Avatar from "material-ui/Avatar"
import Typography from 'material-ui/Typography'
import UserWrapper from './user'
import infoStyles from './styles/user-info-style'
import dateFormat from 'dateformat'

const TopicItem = ({topic, onClick}) => {
  return (
    <ListItem button onClick={onClick}>
      <Avatar src={topic.author.avatar_url} />
      <ListItemText
        primary={topic.title}
        secondary={`最新回复：${dateFormat(topic.last_reply_at,'yyyy-mm-dd hh:MM:ss')}`}
      />
    </ListItem>
  )
}
TopicItem.propTypes = {
  topic: PropTypes.object.isRequired
}

@inject(stores=>({
  user: stores.appState.user,
  appState: stores.appState
}))
@observer
class UserInfo extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  componentWillMount() {
    this.props.appState.getUserDetail()
    this.props.appState.getUserCollections()
  }

  goToTopic(id) {
    this.context.router.history.push(`/detail/${id}`);
  }

  render() {
    const {classes} = this.props
    const topics = this.props.user.detail.recentTopics
    const replies = this.props.user.detail.recentReplies
    const collections = this.props.user.collections.list
    return (
      <UserWrapper>
        <div className={classes.root}>
          <Grid container spacing={16} align="stretch">
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>最新发布的话题</span>
                </Typography>
                <List>
                  {
                    topics.length > 0 ?
                    topics.map(topic=>(
                      <TopicItem
                        topic={topic}
                        key={topic.id}
                        onClick={()=>this.goToTopic(topic.id)}
                      />)
                    ):
                    <Typography align="center">
                      最近没有发布的话题
                    </Typography>
                  }
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>新的回复</span>
                </Typography>
                <List>
                  {
                    replies.length > 0 ?
                    replies.map(topic=>(
                      <TopicItem
                        topic={topic}
                        key={topic.id}
                        onClick={()=>this.goToTopic(topic.id)}
                      />)
                    ):
                    <Typography align="center">
                      最近没有新的回复
                    </Typography>
                  }
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>收藏的话题</span>
                </Typography>
                <List>
                  {
                    collections.length > 0 ?
                    collections.map(topic=>(
                      <TopicItem
                        topic={topic}
                        key={topic.id}
                        onClick={()=>this.goToTopic(topic.id)}
                      />)
                    ):
                    <Typography align="center">
                      还么有收藏的话题哦
                    </Typography>
                  }
                </List>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </UserWrapper>
    )
  }
}
export default withStyles(infoStyles)(UserInfo)