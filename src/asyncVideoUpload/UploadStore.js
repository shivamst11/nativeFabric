import {makeAutoObservable, configure, toJS} from 'mobx';
import {post, getList, removeItem} from './mock-api';
import {Image, Video} from 'react-native-compressor';

configure({enforceActions: 'never'});

class UploadStore {
  accessToken = '';
  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  videoList = [];

  reducerInitialState = {
    queue: [],
    current: null,
  };

  setVideoList = entry => {
    this.videoList = [...this.videoList, entry];
  };

  setCurrentUpload = data => {
    this.reducerInitialState = {...this.reducerInitialState, current: data};
  };

  addToQueue = data => {
    this.reducerInitialState = {
      ...this.reducerInitialState,
      queue: [...this.reducerInitialState.queue, data],
    };
  };

  removeFromQueue = data => {
    this.reducerInitialState = {
      ...this.reducerInitialState,
      queue: [...this.reducerInitialState.queue].filter(
        x => x.uuid !== data.uuid,
      ),
    };
    removeItem(data.uuid);
    this.reducerInitialState = {...this.reducerInitialState, current: null};
  };

  compressVideo = async data => {
    if (data.type === 'image') {
      const result = await Image.compress(data.local_path, {
        compressionMethod: 'auto',
      });
      return result;
    } else if (data.type === 'video') {
      const result = await Video.compress(data.local_path, {
        compressionMethod: 'auto',
      });
      return result;
    }
  };

  handleSubmission = async path => {
    const formData = new FormData();
    formData.append('file', {
      name: 'dummy',
      uri: path.local_path,
      type: 'video/type',
    });
    formData.append('index', 4);
    console.log('formData', formData);
    const res = await fetch('https://app.getpola.com/api/file', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiIzNjVkIiwiZGF0YSI6InF1bWFpbHJlc2hpaUBnbWFpbC5jb20iLCJpYXQiOjE2NDI1ODg2MTl9.W2ms_6hUfcCiwgYD1fK5qhu59YddqWxW5jK9poBRB7A',
      },
    });

    return res;
  };

  uploadVideo = async (compressedFile, data) => {
    const res = await this.handleSubmission(compressedFile);
    console.log('res', res);
    if (res) {
      alert('profile file uploaded');
      this.call_api_to_update_list();
    }
    return res;
  };

  uploadNext = async unlock => {
    const queue = this.reducerInitialState.queue;
    const current = this.reducerInitialState.current;
    if (queue.length === 0 || (current && !unlock)) return;
    const next = current && unlock ? current : queue[0];
    this.setCurrentUpload(next);
    const file = await this.compressVideo(next);
    await this.uploadVideo(file, next);
    this.removeFromQueue(next);
    this.uploadNext();
  };

  fileUpload = async data => {
    const resp = await post(data);
    this.addToQueue({...resp});
    this.uploadNext();
  };

  getUploadList = async () => {
    const list = await getList();
    this.reducerInitialState = {...this.reducerInitialState, queue: list};
  };

  call_api_to_update_list = async () => {};
}

export default new UploadStore();
