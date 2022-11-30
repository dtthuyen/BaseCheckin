// @ts-ignore
import moment from 'moment';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {Platform} from 'react-native';
import {Fetch} from './fetch';
import {setLogs} from '../store/constant';
import {MOBILE_CLIENTS_URL, HISTORY_CHECKIN_URL} from './type';
import {syncAllClients} from '../store/clients';

export const newFormData = (payload: {[key: string]: any}) => {
  const _formData = new FormData();

  Object.keys(payload).forEach(key => {
    if (key.includes('photo')) {
      _formData.append(key, {
        uri: payload[key],
        type: 'image/jpg',
        name: 'checkin.jpg',
      });
    } else {
      _formData.append(key, payload[key]);
    }
  });

  return _formData;
};

export const format_HH_MM = date => {
  if (date)
    return moment(new Date(date * 1000))
      .format('HH:mm')
      .toString();
  return '';
};

export const format_DMY = date => {
  if (date)
    return moment(new Date(date * 1000))
      .format('YYYY-MM-DD')
      .toString();
  return '1970-01-01';
};

export const checkCamera = (setEnable, setDisable) => {
  Platform.OS === 'ios'
    ? check(PERMISSIONS.IOS.CAMERA)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
            case RESULTS.DENIED:
            case RESULTS.LIMITED:
            case RESULTS.BLOCKED:
              console.log('camera disable');
              setDisable();
              break;
            case RESULTS.GRANTED:
              console.log('The permission camera is granted');
              setEnable();
              break;
          }
        })
        .catch(error => {
          // …
        })
    : check(PERMISSIONS.ANDROID.CAMERA)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
            case RESULTS.DENIED:
            case RESULTS.LIMITED:
            case RESULTS.BLOCKED:
              console.log('camera disable');
              setDisable();
              break;
            case RESULTS.GRANTED:
              console.log('The permission camera is granted');
              setEnable();
              break;
          }
        })
        .catch(error => {
          // …
        });
};

export const checkLocation = (setEnable, setDisable, setPos) => {
  Platform.OS === 'ios'
    ? check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
            case RESULTS.DENIED:
            case RESULTS.LIMITED:
            case RESULTS.BLOCKED:
              console.log('location disable');
              setDisable();
              break;
            case RESULTS.GRANTED:
              console.log('The permission location is granted');
              Geolocation.getCurrentPosition(info => setPos(info));
              setEnable();
              break;
          }
        })
        .catch(error => {
          // …
        })
    : check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
            case RESULTS.DENIED:
            case RESULTS.LIMITED:
            case RESULTS.BLOCKED:
              console.log('location disable');
              setDisable();
              break;
            case RESULTS.GRANTED:
              console.log('The permission location is granted');
              Geolocation.getCurrentPosition(
                info => setPos(info),
                error => alert(error.message),
                {
                  enableHighAccuracy: false,
                  timeout: 5000,
                  maximumAge: 10000,
                },
              );
              setEnable();
              break;
          }
        })
        .catch(error => {
          // …
        });
};

export const handleGetClients = async user => {
  const form = newFormData({
    client_key: user.client_key,
    client_auth: 1,
    lat: 112,
    lng: 111,
    access_token: user.access_token,
    __code: user.__code,
  });

  const {data} = await Fetch.post(MOBILE_CLIENTS_URL, form);

  if (data.code === 1) {
    const clients = data.mobile_clients;
    await syncAllClients(clients);
  }
  return data;
};

export const handleSetLogs = async (user, id, timestart, timeend) => {
  const formData = newFormData({
    client_key: user.client_key,
    client_auth: 1,
    access_token: user.access_token,
    __code: user.__code,
    client_id: id,
    time_start: timestart,
    time_end: timeend,
  });

  const {data} = await Fetch.post(
    HISTORY_CHECKIN_URL + '?time_start=' + timestart + '&time_end=' + timeend,
    formData,
  );

  if (data.code === 1) {
    let newLog = {
      name: user.mobile_clients[1].name,
    };
    data.logs.forEach(item => {
      const item_logs = item.logs;
      const _day = moment(new Date(item.date * 1000))
        .format('DD/MM')
        .toString();
      let len = item_logs.length;
      const _in = item_logs[0].time;
      len--;
      const _out = len > 0 ? item_logs[len].time : '--:--';
      const temp = {
        [_day]: {
          checkin: _in,
          checkout: _out,
        },
      };

      newLog = {...newLog, ...temp};

      let logs = [];
      item.logs.forEach(i => {
        let datas = [
          {
            time: moment(new Date(i.time * 1000))
              .format('DD/MM HH:mm:ss')
              .toString(),
            IP: i.ip,
          },
        ];
        logs = [...logs, ...datas];
      });

      newLog = {
        ...newLog,
        [_day]: {
          ...newLog[_day],
          ...{logs},
        },
      };
      setLogs(newLog);
      // setLogsAction(newLog)
    });
  }

  return data;
};
