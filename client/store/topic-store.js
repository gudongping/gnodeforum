import {observable, computed, action, extendObservable} from 'mobx'
import { topicSchema } from './../util/variable-define';
import { get } from '../util/http'

const createTopic = (topic)=>{
  return Object.assign({}, topicSchema, topic)
}

class Topic {
  constructor(data) {
    extendObservable(this, data);
  }
  @observable sync = false
}

export default class TopicStore {
  @observable topics
  @observable details
  @observable sync

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
        if(resp.success) {
          resp.data.forEach(topic => {
            this.addTopic(topic)
          });
          resolve()
        } else {
          reject()
        }
        this.sync = false
      }). catch(err=>{
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
}