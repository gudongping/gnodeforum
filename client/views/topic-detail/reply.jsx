import React from 'react'
import Avatar from 'material-ui/Avatar'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import dateFormat from 'dateformat'
import {replyStyle} from './styles'
import marked from 'marked'

const Reply = ({reply, classes}) => {
  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <Avatar src={reply.author.avatar_url} />
      </div>
      <div className={classes.right}>
        <span>{`${reply.author.loginname}  ${dateFormat(reply.create_at,'yyyy-mm-dd hh:MM:ss')}`}</span>
        <p dangerouslySetInnerHTML={{__html:marked(reply.content)}}></p>
      </div>
    </div>
  )
}

Reply.propTypes = {
  reply: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(replyStyle)(Reply)