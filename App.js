import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Button,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import 'react-native-get-random-values';
import Realm from 'realm';
import {createRealmContext} from '@realm/react';
import {ObjectId} from 'bson';

const schema = {
  name: 'Task',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    name: 'string',
    status: 'string',
  },
  primaryKey: '_id',
};

const App = () => {
  const [user, setUser] = useState(null);
  const realm = useRef();

  async function anonymousLogin() {
    try {
      const app = new Realm.App({id: 'application-1-bigkk'}); // pass in the appConfig variable that you created earlier
      const credentials = Realm.Credentials.anonymous(); // create an anonymous credential
      const res = await app.logIn(credentials);
      setUser(res);
    } catch (error) {
      throw `Error logging in anonymously: ${JSON.stringify(error, null, 2)}`;
    }
  }

  useEffect(() => {
    (async () => {
      await anonymousLogin();
    })();
  }, []);

  useEffect(() => {
    console.log('user:', user);

    if (user) openRealm();
  }, [user]);

  async function openRealm() {
    try {
      // ...
      const config = {
        schema: [schema],
        sync: {
          user: user,
          partitionValue: 'shivam',
        },
      };

      realm.current = await Realm.open(config);
      console.log('sdfdsf');
    } catch (error) {
      throw `Error opening realm: ${JSON.stringify(error, null, 2)}`;
    }
  }

  const createDb = () => {
    realm.current.write(() => {
      realm.current.create('Task', {
        _id: new Realm.BSON.ObjectID(),
        name: 'shivam tripathi',
        status: 'Close',
        _partition: 'shivam',
      });
    });
  };

  const realdDb = () => {
    const tasks = realm.current.objects('Task');
    console.log('tasks', tasks);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Button title="Login" onPress={anonymousLogin} />
      <Button title="createDb" onPress={createDb} />
      <Button title="realdDb" onPress={realdDb} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;
