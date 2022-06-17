import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Text, Button} from 'react-native';
import Crashes from 'appcenter-crashes';
import Analytics from 'appcenter-analytics';
const App = () => {
  useEffect(() => {
    checkPreviouseSession();
  }, []);

  const checkPreviouseSession = async () => {
    const didCrash = await Crashes.hasCrashedInLastSession();
    console.log('didCrash', didCrash);

    if (didCrash) {
      const report = await Crashes.lastSessionCrashReport();
      alert('sory about crash, we are working on it ');
    }
  };

  const trackEvent = () => {
    Analytics.trackEvent('My custom event');
  };

  return (
    <View style={styles.container}>
      <Text>App</Text>
      <Button
        title="Crash"
        onPress={() => {
          Crashes.generateTestCrash();
        }}
      />
      <Button
        title="events"
        onPress={() => {
          trackEvent();
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default App;
