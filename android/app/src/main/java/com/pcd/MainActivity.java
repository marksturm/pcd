package com.pcd;
import android.os.Bundle;
import com.facebook.react.ReactActivity;

import android.content.Intent;

import android.util.Log;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "pcd";
  }




  // Add from here down to the end of your MainActivity
  public boolean isOnNewIntent = false;

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    isOnNewIntent = true;
    ForegroundEmitter(intent);
  }

  @Override
  protected void onStart() {
    super.onStart();
    if(isOnNewIntent == true){}else {
      ForegroundEmitter(getIntent());
    }
  }


  public void ForegroundEmitter(Intent intent){
    // this method is to send back data from java to javascript so one can easily 
    // know which button from notification or from the notification btn is clicked

    String main = intent.getStringExtra("mainOnPress");
    String btn = intent.getStringExtra("buttonOnPress");
    WritableMap map = Arguments.createMap();

    if (main != null) {
       Log.d("SuperLog A", main);
      map.putString("main", main);
    }

    if (btn != null) {
       Log.d("SuperLog B", btn);
      map.putString("button", btn);
    }

    try {
      getReactInstanceManager().getCurrentReactContext()
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
              .emit("notificationClickHandle", map);

    } catch (Exception e) {
      Log.e("SuperLog", "Caught Exception: " + e.getMessage());
    }
  }
  
}
