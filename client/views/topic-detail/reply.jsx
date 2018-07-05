import Avatar from 'material-ui/Avatar'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {replyStyle} from './styles'
import marked from 'marked'

const Reply = ({reply, classes}) => {
  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <Avatar src={reply.author.avatar_url} />
      </div>
      <div className={classes.right}>
        <span>{`${reply.author.loginname}  ${reply.create_at}`}</span>
        <p dangeroulySetInnerHTML={{__html:marked(reply.content)}}></p>
      </div>
    </div>
  )
}

Reply.protoTypes = {
  reply: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(replyStyle)(Reply)