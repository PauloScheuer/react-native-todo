/**
 * @format
 */

import { AppRegistry } from 'react-native';
import MainRoute from './src/routes/MainRoute';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => MainRoute);
