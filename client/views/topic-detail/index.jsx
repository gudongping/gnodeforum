import React, {Component} from "react"
import { Helmet } from 'react-helmet';
import { inject, observer } from "mobx-react";

@inject('appState')
@observer
export default class TopicDetail extends Component{
  render() {
    return (
      <div>
        <Helmet>
          <title>This is detail list</title>
          <meta name="detail" content="this is detail" />
        </Helmet>
        This is topic detal
      </div>
    );
  }
}