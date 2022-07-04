import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
const CompB = () => {
  const data = [...Array(50).keys()];
  return (
    <View style={styles.container}>
      <ScrollView>
        {data.map((item, index) => (
          <Text style={{fontSize: 15, marginTop: 10, borderWidth: 1}}>
            {item}
          </Text>
        ))}
      </ScrollView>
      <Text>CompB</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
export default CompB;
