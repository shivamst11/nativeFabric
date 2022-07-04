import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
const CompA = () => {
  const data = [...Array(100).keys()];
  return (
    <View style={styles.container}>
      <ScrollView>
        {data.map((item, index) => (
          <Text style={{fontSize: 15, marginTop: 10, borderWidth: 1}}>
            {item}
          </Text>
        ))}
      </ScrollView>
      <Text>CompA</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
export default CompA;
