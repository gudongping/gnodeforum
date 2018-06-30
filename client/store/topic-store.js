import {observable, toJs, computed, action, extendObservable} from 'mobx'
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
  @observable sync

  constructor({sync,topics}={sync:false, topics:[]}) {
    this.sync = sync;
    this.topics = topics.map(topic=>new Topic(createTopic(topic)));
  }

  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)))
  }

  @action fetchTopics() {
    return new Promise((resolve, reject)=>{
      this.sync = true
      get('/topics', {
        mdrender: false
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
}