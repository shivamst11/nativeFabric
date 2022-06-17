import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Text, Button} from 'react-native';
const App = () => {
  return (
    <View style={styles.container}>
      <Text>App</Text>
      <Button />
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
