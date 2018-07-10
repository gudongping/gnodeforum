import React, {Component} from "react"
import {observer, inject} from "mobx-react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import Button from "material-ui/Button"
import Tabs, {Tab} from "material-ui/Tabs"
import List from "material-ui/List"
import CircularProgress from 'material-ui/Progress/CircularProgress'
import queryString from 'query-string'
import Contaier from '../layout/container'
import TopicListItem from "./list-item"
import {tabs} from '../../util/variable-define'

@inject(stores=>{
  return {
    appState: stores.appState,
    topicStore: stores.topicStore
  }
})
@observer
export default class TopicList extends Component{
  static contextTypes = {
    router: PropTypes.object
  }

  constructor() {
    super();
    this.changeTab = this.changeTab.bind(this);
    this.listItemClick = this.listItemClick.bind(this);
  }

  static propTypes = {
    appState: PropTypes.object.isRequired,
    topicStore: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  componentDidMount() {
    const tab = this.getTab();
    console.log('******************************>tab', tab);
    this.props.topicStore.fetchTopics(tab);
  }

  componentWillReceiveProps(nextProps) {
    // console.log('oldSearch',this.props.location.search);
    // console.log('newSearch',nextProps.location.search);
    console.log(nextProps, this.props);
    if(nextProps.location.search !== this.props.location.search) {
      this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search))
    }
  }

  asyncBootstrap() {
    const query = queryString.parse(this.props.location.search)
    const tab = query.tab || 'all'
    return new Promise(resolve=>{
      this.props.topicStore.fetchTopics(tab)
      resolve(true)
    })
  }

  getTab(search) {
    search = search || this.props.location.search
    const query = queryString.parse(search)
    return query.tab || 'all'
  }

  changeTab(e, value) {
    this.context.router.history.push({
      pathname: '/index',
      search: `?tab=${value}`
    })
  }

  listItemClick(topic) {
    this.context.router.history.push(`/detail/${topic.id}`)
  }

  render() {
    const { topicStore, appState } = this.props
    const {createdTopics} = topicStore
    const topicList = topicStore.topics
    const syncTopics = topicStore.sync
    const tab = this.getTab();

    return (
      <Contaier>
        <Helmet>
          <title>This is topic list</title>
          <meta name="list" content="this is list" />
        </Helmet>
        <Tabs value={tab} onChange={this.changeTab}>
          {
            Object.keys(tabs).map((_tab)=>(
              <Tab label={tabs[_tab]} value={_tab} key={_tab}/>
            ))
          }
        </Tabs>
        {
          createdTopics.length > 0 ?
          (<List style={{backgroundColor: '#dfdfdf'}}>
            {
              createdTopics.map(topic=>{
                topic = Object.assign({}, topic, {
                  author: appState.user.info
                })
                return (
                  <TopicListItem
                    onClick={()=>this.listItemClick(topic)}
                    topic={topic}
                    key={topic.id}
                  />
              )})
            }
          </List>): null
        }
        <List>
          {
            topicList.map((topic)=>{
              return <TopicListItem
              onClick={()=>this.listItemClick(topic)}
              topic={topic}
              key={topic.id}/>
            })
          }
        </List>
        {
          syncTopics ?
          <div style={{
            display:'flex',
            justifyContent:'space-around',
            padding: '40px 0'
          }}>
            <CircularProgress color='primary' size={100}/>
          </div>
          : null
        }
      </Contaier>
    );
  }
}