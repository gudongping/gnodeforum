import React, {Component} from "react"
import PropTypes from "prop-types"
import marked from 'marked'
import { Helmet } from 'react-helmet';
import { inject, observer } from "mobx-react";
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/Progress/CircularProgress'
import Container from '../layout/container'
import {topicDetailStyle} from './styles'
import Reply from './reply'

@inject(stores=>({
  topicStore: stores.topicStore
}))
@observer
export class TopicDetail extends Component{
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

  render() {
    const {classes} = this.props
    const id = this.getTopicId();
    const topic = this.props.topicStore.detailMap[id]
    if(!topic) {
      return (
        <Container>
          <section className={classes.loadingContainer}>
            <CircularProgress color="primary" />
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
          <Paper elevation={4} className={classes.replies}>
            <header className={classes.replyHeader}>
              <span>{`${topic.reply_count}回复`}</span>
              <span>{`最新回复 ${topic.last_reply_at}`}</span>
            </header>
            <section>
              {
                topic.replies.map(rp=><Reply reply={rp} key={rp.id}/>)
              }
            </section>
          </Paper>
        </Container>
      </div>
    )
  }
}

export default withStyles(topicDetailStyle)(TopicDetail)