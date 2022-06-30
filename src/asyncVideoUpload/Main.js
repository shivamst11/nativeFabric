import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  View,
  Text,
  ImageBackground,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Button,
  ScrollView,
} from 'react-native';
import Video from 'react-native-video';
import {getList, post, reset} from './mock-api';
import UploadStore from './UploadStore';
import * as ImagePicker from 'react-native-image-picker';
import {toJS} from 'mobx';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
]);

function Main() {
  const [playFile, setPlayFile] = useState(null);

  useEffect(() => {
    firstFetch();
  }, []);

  const firstFetch = async () => {
    await UploadStore.getUploadList();
    UploadStore.uploadNext(true);
  };

  const getdata = async () => {
    try {
      await reset();
      UploadStore.reducerInitialState = {
        queue: [],
        current: null,
      };
    } catch (e) {
      console.log('error', e);
    }
  };

  const postData = async () => {
    try {
      console.log('list', await getList());
    } catch (e) {
      console.log('error', e);
    }
  };

  const onPressFile = item => {
    setPlayFile(item);
  };

  const imageCard = item => {
    const isUploading = (UploadStore.reducerInitialState.queue || []).find(
      x => x.uuid === item.uuid,
    );
    return (
      <TouchableOpacity key={item.uuid} onPress={() => onPressFile(item)}>
        <ImageBackground
          source={{
            uri: item.local_path,
          }}
          style={styles.imageStyle}>
          {isUploading ? (
            <View style={{borderWidth: 1, backgroundColor: 'white'}}>
              <ActivityIndicator size="large" color="black" />
              <Text>Video Uploading</Text>
            </View>
          ) : null}
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  const insert = async () => {
    try {
      post({name: 'shvam'});
    } catch (e) {
      console.log('error', e);
    }
  };

  const pickVideo = () => {
    const options = {
      mediaType: 'all',
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response?.didCancel) {
        alert('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const path = response.assets[0].uri;
        UploadStore.fileUpload({
          local_path: path,
          type: response?.assets[0].type.split('/')[0],
        });
      }
    });
  };

  return (
    <ScrollView style={{flexGrow: 1}}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={{backgroundColor: 'blue', height: 40, width: 40}}>
          <Button onPress={pickVideo} title="Upload" />
        </View>
      </SafeAreaView>
      <TouchableOpacity
        style={{backgroundColor: 'red', height: 30, width: 30, margin: 40}}
        onPress={() => insert()}>
        <Text>{'insert data in local storage'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{backgroundColor: 'red', height: 30, width: 30, margin: 40}}
        onPress={() => postData()}>
        <Text>{'get local storage'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{backgroundColor: 'pink', height: 30, width: 30}}
        onPress={() => getdata()}>
        <Text>reset local storage</Text>
      </TouchableOpacity>
      <View style={{flexGrow: 1}}>
        {toJS(UploadStore.videoList).map(item => imageCard(item))}
      </View>
      {playFile ? (
        <Modal visible onDismiss={() => setPlayFile(null)} transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {playFile.type === 'video' ? (
                <Video
                  source={{
                    uri: playFile.local_path,
                  }}
                  style={styles.videoStyle}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={{uri: playFile.local_path}}
                  style={styles.videoStyle}
                  resizeMode="cover"
                />
              )}
              <TouchableOpacity onPress={() => setPlayFile(null)}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  itemContainer: {
    marginVertical: 10,
    display: 'flex',
    alignItems: 'center',
    borderWidth: 1,
  },
  imageStyle: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  videoStyle: {
    width: 300,
    height: 300,
  },
});

export default observer(Main);
