//app.js
import { Provider } from 'wenaox';
import store from './models/store';

const appConfig = {
  //some config
};
App(Provider(store)(appConfig));
