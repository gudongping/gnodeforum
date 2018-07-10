import {observable, computed, action, extendObservable, toJS} from 'mobx'
import { topicSchema, replySchema } from './../util/variable-define';
import { get, post } from '../util/http'

const createTopic = (topic)=>{
  return Object.assign({}, topicSchema, topic)
}

const createReply = (reply) => {
  return Object.assign({}, replySchema, reply);
}

class Topic {
  constructor(data) {
    extendObservable(this, data);
  }

  @observable sync = false
  @observable createdReplies = []

  @action doReply(content) {
    return new Promise((resolve, reject)=> {
      post(`/topic/${this.id}/replies`, {
        needAccessToken: true
      }, {content}).then(resp=>{
        if(resp.success) {
          this.createdReplies.push(createReply({
            id: resp.reply_id,
            content,
            create_at: Date.now()
          }))
          resolve()
        } else {
          reject(resp)
        }
      }).catch(reject)
    })
  }
}

export default class TopicStore {
  @observable topics
  @observable details
  @observable sync
  @observable createdTopics = [];

  constructor({sync = false,topics=[], details=[]} = {}) {
    this.sync = sync;
    this.topics = topics.map(topic=>new Topic(createTopic(topic)));
    this.details = details.map(topic=>new Topic(createTopic(topic)));
  }

  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)))
    // console.log('push ...');
  }

  @computed get detailMap() {
    return this.details.reduce((result, detail)=> {
      result[detail.id] = detail;
      return result
    },{});
  }

  @action fetchTopics(tab) {
    return new Promise((resolve, reject)=>{
      this.sync = true;
      this.topics = [];
      get('/topics', {
        mdrender: false,
        tab: tab
      }).then(resp=>{
        console.log('**********************************************************************');
        console.log(resp.data);
        if(resp.success) {
          this.topics = resp.data.map(topic => {
            return new Topic(createTopic(topic))
          });
          resolve()
        } else {
          reject()
        }
        this.sync = false
      }). catch(err=>{
        console.log('......................................err',err)
        reject(err);
        this.sync = false;
      })
    });
  }

  @action getTopicDetail(id) {
    return new Promise((resolve, reject)=> {
      if(this.detailMap[id]) {
        resolve(this.detailMap[id]);
      } else {
        get(`/topic/${id}`, {
          mdrender: false
        }).then(resp=> {
          if(resp.success) {
            const topic = new Topic(createTopic(resp.data));
            this.details.push(topic)
            resolve(topic)
          } else {
            reject();
          }
        }).catch(reject)
      }
    });
  }

  @action createTopic(title, tab, content) {
    return new Promise((resolve,reject)=>{
      post('/topics', {
        needAccessToken: true
      }, {
        title,tab,content
      }).then(resp=>{
        if(resp.success) {
          const topic = {
            title,
            tab,
            content,
            id: resp.topic_id,
            create_at: Date.now()
          }
          this.createdTopics.push(new Topic(createTopic(topic)));
          resolve()
        } else {
          reject();
        }
      }).then(reject)
    })
  }

  toJson() {
    return {
      topics: toJS(this.topics),
      sync: this.sync,
      details: toJS(this.details)
    }
  }
}