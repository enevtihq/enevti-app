package com.enevti.app;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;
import android.content.res.Configuration;

public class MainActivity extends ReactActivity {

  // SplashActivity
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    switch (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) {
        case Configuration.UI_MODE_NIGHT_YES:
            setTheme(R.style.DarkTheme);
            SplashScreen.show(this, R.style.DarkTheme, false);
            break;
        case Configuration.UI_MODE_NIGHT_NO:
            setTheme(R.style.LightTheme);
            SplashScreen.show(this, R.style.LightTheme, false);
            break;
        default:
            setTheme(R.style.LightTheme);
            SplashScreen.show(this, R.style.LightTheme, false);
    }

    super.onCreate(savedInstanceState);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Enevti";
  }
}
