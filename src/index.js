import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reducer from "./reducers"
import { createStore, applyMiddleware } from "redux";
import locale from '../node_modules/element-react/src/locale/lang/en'

//Wrap App in provider to provide store to all components
import {Provider} from 'react-redux'

//add midleware to actions to dispatch async actions
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';


import { i18n } from 'element-react'
i18n.use(locale);

const logger = createLogger();

const store = createStore(reducer,
  applyMiddleware(
    thunkMiddleware,
    logger
  ))
  ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root')
);
