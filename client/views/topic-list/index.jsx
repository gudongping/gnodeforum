import React, {Component} from "react"
import {observer, inject} from "mobx-react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import Button from "material-ui/Button"
import Tabs, {Tab} from "material-ui/Tabs"
import List from "material-ui/List"
import CircularProgress from 'material-ui/Progress/CircularProgress'
import Contaier from '../layout/container'
import TopicListItem from "./list-item"

@inject(stores=>{
  return {
    appState: stores.appState,
    topicStore: stores.topicStore
  }
})
@observer
export default class TopicList extends Component{
  constructor() {
    super();
    this.state = {
      tabIndex:0
    }
    this.changeTab = this.changeTab.bind(this);
    this.listItemClick = this.listItemClick.bind(this);
  }

  static propTypes = {
    appState: PropTypes.object.isRequired,
    topicStore: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.props.topicStore.fetchTopics();
  }

  asyncBootstrap() {
    return new Promise(resolve=>{
      setTimeout(()=>{
        this.props.appState.count = 3
        resolve(true)
      });
    })
  }

  changeTab(e, index) {
    this.setState({
      tabIndex: index
    });
  }

  listItemClick() {

  }

  render() {
    const { tabIndex} = this.state;
    const { topicStore } = this.props;

    const topicList = topicStore.topics
    const syncTopics = topicStore.sync
    /* const topic = {
      tab: 'share',
      title: 'This is title',
      username:'gudp',
      reply_count: 20,
      visit_count:30,
      create_at:'2018-06-20'
    } */
    return (
      <Contaier>
        <Helmet>
          <title>This is topic list</title>
          <meta name="list" content="this is list" />
        </Helmet>
        <Tabs value={tabIndex} onChange={this.changeTab}>
          <Tab label="全部"></Tab>
          <Tab label="分享"></Tab>
          <Tab label="工作"></Tab>
          <Tab label="问答"></Tab>
          <Tab label="精品"></Tab>
          <Tab label="测试"></Tab>
        </Tabs>
        <List>
          {
            topicList.map((topic)=>{
              return <TopicListItem onClick={this.listItemClick} topic={topic} key={topic.id}/>
            })
          }
        </List>
        {
          syncTopics ? <CircularProgress color='primary' size={100}/> : null
        }
      </Contaier>
    );
  }
}