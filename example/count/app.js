//app.js
import { Provider, regeneratorRuntime } from 'wenaox';
import store from './models/store';

const appConfig = {
  //some config
};
App(Provider(store)(appConfig));
