/**
 * @format
 */
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Geolocation from 'react-native-geolocation-service';
AppRegistry.registerComponent(appName, () => App);

Platform.OS === 'android' ? ReactNativeForegroundService.register() : null;
AppRegistry.registerComponent(appName, () => App);
console.disableYellowBox = true;
