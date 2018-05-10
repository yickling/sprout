import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';

import './index.css';
import { injectGlobal } from 'styled-components'
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import Saga from './sagas';
import reducer from './reducers';

// create middlewares
const history = createHistory();
const sagaMiddleware = createSagaMiddleware();

const middleware = applyMiddleware(
  routerMiddleware(history),
  sagaMiddleware
);

// create store
const store = createStore(reducer, middleware);

// run saga middleware
sagaMiddleware.run(Saga);

injectGlobal`
  * { box-sizing: border-box; }
  body { margin: 0; }
`

ReactDOM.render( <Provider store={store}>
    <App history={history} />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
