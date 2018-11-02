import React from "react";
import {Provider} from 'react-redux'
import {StaticRouter, matchPath} from 'react-router-dom'

import App from "./client/App";
import  generatorStore  from './client/store';
import {getTop} from './api';

const store = generatorStore();


module.exports = async (context) => {

  if (context.currURL === '/') {
    let data = await getTop();
    await store.dispatch({
      type: 'ADD_TOP_MOVIES',
      value: data && data.subjects
    });

    context.state = store.getState();
  }

  return (
    <Provider store={store}>
    <StaticRouter location={context.srcUrl} context={context}>
      <App />
    </StaticRouter>
    </Provider>
  );
}
