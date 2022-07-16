import React, {useEffect, useState} from 'react';
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

const appId = 'realm-0-gaioa';
const appConfig = {id: appId};

const TodoSchema = {
  name: 'Todo',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    text: 'string',
  },
};

const App = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('newName');
  const {RealmProvider, useRealm, useQuery} = createRealmContext({
    schema: [TodoSchema],
  });

  const login = async () => {
    const app = new Realm.App(appConfig);
    const credentials = Realm.Credentials.anonymous();
    const res = await app.logIn(credentials);
    setUser(res);
  };

  return (
    <View style={{flex: 1}}>
      {user ? (
        <RealmProvider
          schema={[TodoSchema]}
          sync={{user, partitionValue: userName}}>
          <SafeAreaView>
            <CreateTodo useRealm={useRealm} useQuery={useQuery} />
            <Button
              title="Logout"
              onPress={() => {
                setUser(null);
                setUserName('');
              }}
            />
          </SafeAreaView>
        </RealmProvider>
      ) : (
        <View style={{flex: 1}}>
          <SafeAreaView />
          <Button title="Login" onPress={login} />
        </View>
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
  const data = useQuery('Todo');

  console.log('todos', data);

  const createNewTodo = () => {
    realm.write(() => {
      realm.create('Todo', {
        _id: new Realm.BSON.ObjectID(),
        text: 'nwe task13 ',
      });
    });
  };

  return (
    <View>
      <Button title="Create Todo" onPress={createNewTodo} />
    </View>
  );
};
