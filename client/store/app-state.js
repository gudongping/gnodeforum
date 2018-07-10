import {observable, computed, toJS, action} from "mobx"

import {post, get} from '../util/http'

export default class AppState {
  @observable user = {
    isLogin: false,
    info: {},
    detail: {
      recentTopics: [],
      recentReplies: [],
      sync: false
    },
    collections: {
      sync: false,
      list: []
    }
  }

  @action login(accessToken) {
    return new Promise((resolve, reject)=>{
      post('/user/login', {}, {
        accessToken: accessToken
      }).then(resp=>{
        if(resp.success) {
          this.user.isLogin = true;
          this.user.info = resp.data;
          resolve();
        } else {
          reject()
        }
      }).catch(reject);
    })
  }

  @action getUserDetail() {
    this.user.detail.sync = true;
    return new Promise((resolve, reject)=>{
      get(`/user/${this.user.info.loginname}`)
        .then(resp=>{
          if(resp.success) {
            this.user.detail.recentReplies = resp.data.recent_replies
            this.user.detail.recentTopics = resp.data.recent_topics
            resolve();
          } else {
            reject();
          }
          this.user.detail.sync = false
        }).catch(err=>{
          this.user.detail.sync = false
          reject(err)
        })
    })
  }

  @action getUserCollections() {
    this.user.collections.sync = true;
    return new Promise((resolve, reject)=>{
      get(`/topic_collect/${this.user.info.loginname}`)
        .then(resp=>{
          if(resp.success) {
            this.user.collections.list = resp.data
            resolve();
          } else {
            reject();
          }
          this.user.collections.sync = false
        }).catch(err=>{
          this.user.collections.sync = false
          reject(err)
        })
    })
  }

  toJson() {
    return {
      user: toJS(this.user)
    }
  }
}