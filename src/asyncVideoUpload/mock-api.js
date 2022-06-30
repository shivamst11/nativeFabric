import AsyncStorage from '@react-native-async-storage/async-storage';
import UploadStore from './UploadStore';

// export const getItem = async uuid => {
//   const data = await AsyncStorage.getItem(uuid);
//   if (data) return JSON.parse(data);
//   return {};
// };

export const getList = async () => {
  const localVideoList = await AsyncStorage.getItem('localVideoList');
  if (localVideoList) {
    return JSON.parse(localVideoList);
  } else {
    return [];
  }
};

export const post = async data => {
  const entry = {
    ...data,
    uuid: Math.random().toString(36).substring(7),
  };
  try {
    let newLocalVideoList = [];
    const localVideoList = await AsyncStorage.getItem('localVideoList');
    if (localVideoList) {
      newLocalVideoList = [...JSON.parse(localVideoList), entry];
    } else {
      newLocalVideoList = [entry];
    }
    UploadStore.setVideoList(entry);
    await AsyncStorage.setItem(
      'localVideoList',
      JSON.stringify(newLocalVideoList),
    );
  } catch (e) {
    alert('upload failed try again letter');
    await AsyncStorage.setItem('localVideoList', JSON.stringify([]));
  }
  return entry;
};

export const reset = async () => {
  await AsyncStorage.setItem('localVideoList', JSON.stringify([]));
  return {success: true};
};

export const removeItem = async uuid => {
  const localVideoList = await AsyncStorage.getItem('localVideoList');
  if (localVideoList) {
    let newLocalVideoList = JSON.parse(localVideoList).filter(
      x => x.uuid !== uuid,
    );
    await AsyncStorage.setItem(
      'localVideoList',
      JSON.stringify(newLocalVideoList),
    );
    return {success: true};
  }
};
