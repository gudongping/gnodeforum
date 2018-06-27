import {observable, computed, autorun, action} from "mobx"

export default class AppState {
  @observable count
  @observable name

  constructor({count, name}={count:0,name:'Gudp'}) {
    this.count = count;
    this.name = name;
  }

  @computed get msg() {
    return `${this.name} says count is ${this.count}`
  }
  @action add() {
    this.count += 1
  }
  @action changeName(name) {
    this.name = name
  }
  toJson() {
    return {
      count: this.count,
      name: this.name
    }
  }
}

/* const appState = new AppState();

autorun(()=>{
  console.log(appState.msg);
})

setInterval(()=>{
  appState.count += 1
},1000);

export default appState */
