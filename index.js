/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { enableFreeze, enableScreens } from 'react-native-screens';
import App from './app/Entrypoint';
import { name as appName } from './app.json';

enableScreens();
enableFreeze();
AppRegistry.registerComponent(appName, () => App);
