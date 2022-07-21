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

const Schema = {
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

  const {RealmProvider, useRealm, useQuery} = createRealmContext({
    schema: [Schema],
  });

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
    anonymousLogin();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      {user ? (
        <RealmProvider schema={[Schema]} sync={{user, partitionValue: 'karn2'}}>
          <View style={{flex: 1}}>
            <CreateTodo useRealm={useRealm} useQuery={useQuery} />
          </View>
        </RealmProvider>
      ) : (
        <View style={{backgroundColor: 'pink', flex: 1}} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;

const CreateTodo = ({useRealm, useQuery}) => {
  const realm = useRealm();
  const data = useQuery('Task');

  const createDb = () => {
    realm.write(() => {
      realm.create('Task', {
        _id: new Realm.BSON.ObjectID(),
        name: 'karn2',
        status: 'new',
        _partition: 'karn2',
      });
    });
  };
  console.log('todos', data);

  const readDb = () => {
    const allData = realm.objects('Task');
    console.log('allData', allData);
  };

  return (
    <View>
      <Button title="createDb" onPress={createDb} />
      <Button title="readDb" onPress={readDb} />
    </View>
  );
};
