import React, {Component} from "react"
import {observer, inject} from "mobx-react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import Button from "material-ui/Button"

@inject('appState')
@observer
export default class TopicList extends Component{
  constructor() {
    super();
    this.changeName = this.changeName.bind(this);
  }

  static propTypes = {
    appState: PropTypes.object.isRequired
  }

  asyncBootstrap() {
    return new Promise(resolve=>{
      setTimeout(()=>{
        this.props.appState.count = 3
        resolve(true)
      });
    })
  }

  changeName(e) {
    this.props.appState.changeName(e.target.value)
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>This is topic list</title>
          <meta name="list" content="this is list" />
        </Helmet>
        <Button raised='true' color='primary'>This is a button</Button>
        <input type="text" onChange={this.changeName}/>
        <span>{this.props.appState.msg}</span>
      </div>
    );
  }
}