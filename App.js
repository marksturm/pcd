/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
//import type {Node} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  PermissionsAndroid,
  DeviceEventEmitter,
  Button,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { TestWatcher } from '@jest/core';
import { blockStatement } from '@babel/types';



const App= () => {
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [currentLatitude, setCurrentLatitude] = useState(0);

  const eventEmitter = () => {
        // device event emitter used to
        let subscription = DeviceEventEmitter.addListener(
          'notificationClickHandle',
          function (e)  {
            if(e.button==='stop') {
              onStop();
            }

          },
        );
        return function cleanup() {
          subscription.remove();
        };
  }

  useEffect(() => {
    checkPermissions();
    eventEmitter();
  }, []);


  const checkPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'App',
          message: 'App access to your location',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        
        //START GEO SERVICE!!!
        onStart();

      } else {
        // setLocationGranted(false);
        alert("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getOneTimeLocation = () => {

    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        console.log(position.coords);
        //Setting Longitude state
        //Setting Longitude state
        /* cause a stats error when the app was closed and opend again r*/
        
        setCurrentLongitude(position.coords.longitude);
        setCurrentLatitude(position.coords.latitude);
      

      },
      error => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
      },
    );  };


  
  const onStart = () => {
    
    // Checking if the task i am going to create already exist and running, which means that the foreground is also running.
    if (ReactNativeForegroundService.is_task_running('pcd')) return;
    // Creating a task.
    ReactNativeForegroundService.add_task(
      () => getOneTimeLocation(),
      {
        delay: 30000,
        onLoop: true,
        taskId: 'taskid',
        onError: (e) => console.log(`Error logging:`, e),
      },
    );
  

    // starting  foreground service.
    return ReactNativeForegroundService.start({
      id: 144,
      title: 'SERVICE',
      message: 'TASK IS RUNNING!!!',
      importance: 'max',
      number: String(1),
      button: true,
      buttonText: 'STOP',
      buttonOnPress : 'stop',
      mainOnPress : 'show',
    });
  };

  const onStop = () => {
    // Make always sure to remove the task before stoping the service. and instead of re-adding the task you can always update the task.
    if (ReactNativeForegroundService.is_task_running('pcd')) {
      ReactNativeForegroundService.remove_task('pcd');
    }
    // Stoping Foreground service.
    return ReactNativeForegroundService.stop();
  };
  

  return (
    <>
    <StatusBar barStyle="dark-content" />
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>{currentLatitude}-{currentLongitude}</Text>
      <Button title={'Start'} onPress={onStart} />
      <Button title={'Stop'} onPress={onStop} />
    </SafeAreaView>
    </>
  );
};


export default App;
