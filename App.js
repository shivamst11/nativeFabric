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

const TaskSchema = {
  name: 'Task',
  properties: {
    _id: 'int',
    name: 'string',
    status: 'string?',
  },
  primaryKey: '_id',
};

const App = () => {
  const realm = useRef();
  const task1 = useRef();
  const allDataRef = useRef();

  useEffect(() => {
    (async () => {
      realm.current = await Realm.open({
        path: 'myrealm',
        schema: [TaskSchema],
      });

      allDataRef.current = realm.current.objects('Task');
      allDataRef.current.addListener(listener);
    })();
  }, []);

  const listener = (tasks, changes) => {
    changes.deletions.forEach(index => {
      // Deleted objects cannot be accessed directly,
      // but we can update a UI list, etc. knowing the index.
      console.log(`A task was deleted at the ${index} index`);
    });

    changes.insertions.forEach(index => {
      let insertedTasks = tasks[index];
      console.log(`insertedTasks: ${JSON.stringify(insertedTasks, null, 2)}`);
      // ...
    });

    changes.newModifications.forEach(index => {
      let modifiedTask = tasks[index];
      console.log(`modifiedTask: ${JSON.stringify(modifiedTask, null, 2)}`);
      // ...
    });
  };

  const createDb = async () => {
    realm.current.write(() => {
      task1.current = realm.current.create('Task', {
        _id: 7,
        name: 'go grocery shopping',
        status: 'Open',
      });
    });
  };

  const readDb = () => {
    const allData = realm.current.objects('Task');
    console.log('allData', allData);
  };

  const filteredData = () => {
    const allData = realm.current.objects('Task');
    console.log('allData', allData.filtered('status = "Closed"'));
  };

  const sortedData = () => {
    const allData = realm.current.objects('Task');
    console.log('allData', allData.sorted('name'));
  };

  const modifyDb = () => {
    const allData = realm.current.objects('Task');
    realm.current.write(() => {
      allData[0].status = 'Closed';
    });

    // or
    //  task1.current.status = 'Closed';
  };

  const deleteDb = () => {
    const allData = realm.current.objects('Task');
    realm.current.write(() => {
      realm.current.delete(allData[3]);
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Button title="createDb" onPress={createDb} />
      <Button title="readDb" onPress={readDb} />
      <Button title="filteredData" onPress={filteredData} />
      <Button title="sortedData" onPress={sortedData} />
      <Button title="modifyDb" onPress={modifyDb} />
      <Button title="deleteDb" onPress={deleteDb} />
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
