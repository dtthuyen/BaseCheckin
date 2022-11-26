import styled from 'styled-components';
import {Color} from '../../themes/Color';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import useBoolean from '../../hooks/useBoolean';
import MapView, {
  enableLatestRenderer,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
// @ts-ignore
import moment from 'moment';
import {CheckEnableScreen} from './CheckEnableScreen';
import {setToggleCheckin, useUser} from '../../store/constant';
import {Fetch} from '../../utils/fetch';
import {useAsyncFn} from '../../hooks/useAsyncFn';
import {RNCamera} from 'react-native-camera';
import {newFormData} from '../../utils/func';
import {ActivityIndicator, Alert} from 'react-native';

const CheckinScreen = () => {
  let camera: any;
  const user = useUser();

  const toggleCheck = user.toggleCheckin ?? false;
  const [check, setCheck] = useState(toggleCheck);

  useEffect(() => {
    setToggleCheckin(check);
  }, [check]);

  const [enableClient, setEnableClient, setDisableClient] = useBoolean(false);
  const [enableCamera, setEnableCamera, setDisableCamera] = useBoolean(false);
  const [enableLocation, setEnableLocation, setDisableLocation] =
    useBoolean(false);

  const now = new Date();
  const day = moment(now).format('dddd, DD/MM/YYYY').toString();
  const Day = useMemo(() => <TextDay>{day}</TextDay>, [day]);

  const [time, setTime] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setTime(moment(date).format('HH:mm:ss').toString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const Time = useMemo(() => <TextTime>{time}</TextTime>, [time]);
  const CameraCheckIn = useMemo(() => {
    return (
      <RNCamera
        ref={ref => (camera = ref)}
        style={style.styleView}
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onGoogleVisionBarcodesDetected={({barcodes}) => {
          // console.log(barcodes);
        }}
      />
    );
  }, []);

  const [{value, loading, error}, onCheckIn] = useAsyncFn(async () => {
    const {uri} = await camera.takePictureAsync();
    const id = user.mobile_clients[1].id;

    const form = newFormData({
      client_key: user.client_key,
      client_auth: 1,
      access_token: user.access_token,
      __code: user.__code,
      lat: position['coords']?.latitude || 112,
      lng: position['coords']?.longitude || 111,
      client_id: id,
      ts: new Date().getTime(),
      photo: uri,
    });

    const {data} = await Fetch.post(
      'checkin.base.vn/ajax/api/me/checkin/mobile',
      form,
    );

    if (data.code === 1) {
      setCheck(!check);
      Alert.alert('Bạn đã check in');
    }

    return data;
  });

  const onPressCheckin = useCallback(() => {
    onCheckIn().then(r => {
      if (r.code === 1) {
        setCheck(!check);
        Alert.alert('Bạn đã check in');
      }
    });
  }, []);

  const [position, setPosition] = useState({});

  enableLatestRenderer();

  return enableLocation && enableCamera && enableClient ? (
    <ContainerCheckIn>
      {Day}
      {Time}
      <ViewLocation>
        <MapView
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: position['coords'].latitude || 112,
            longitude: position['coords']?.longitude || 111,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          showsUserLocation={true}
          style={style.styleView}
        />
      </ViewLocation>

      <ViewCamera>{CameraCheckIn}</ViewCamera>

      <BtnCheck onPress={onCheckIn}>
        {loading ? (
          <ActivityIndicator color={Color.green} />
        ) : (
          <TextCheck>chấm công</TextCheck>
        )}
      </BtnCheck>

      <ViewInfo>
        <TextInfo>CO - Chấm công mobile</TextInfo>
      </ViewInfo>
    </ContainerCheckIn>
  ) : (
    <CheckEnableScreen
      setPosition={setPosition}
      enableLocation={enableLocation}
      enableCamera={enableCamera}
      enableClient={enableClient}
      setEnableLocation={setEnableLocation}
      setEnableCamera={setEnableCamera}
      setEnableClient={setEnableClient}
      setDisableCamera={setDisableCamera}
      setDisableLocation={setDisableLocation}
      setDisableClient={setDisableClient}
    />
  );
};

const ContainerCheckIn = styled.View`
  flex: 1;
  padding: 32px;
  background-color: ${Color.white};
  align-items: center;
  border-top-color: ${Color.gray6};
  border-top-width: 8px;
`;

const TextDay = styled.Text`
  color: ${Color.gray1};
  font-size: 20px;
  font-weight: 500;
`;

const TextTime = styled.Text`
  margin-top: 12px;
  color: ${Color.background_color};
  font-size: 40px;
  font-weight: 500;
`;

const ViewLocation = styled.View`
  overflow: hidden;
  width: 100%;
  height: 120px;
  margin-top: 20px;
`;

const ViewCamera = styled(ViewLocation)`
  height: 279px;
  margin-top: 8px;
`;

const BtnCheck = styled.TouchableOpacity`
  margin-top: 18px;
  border-color: ${Color.green1};
  border-width: 1px;
  border-radius: 15px;
  width: 100%;
  height: 50px;
  align-items: center;
  justify-content: center;
`;

const TextCheck = styled.Text`
  text-transform: uppercase;
  color: ${Color.green};
  font-size: 17px;
  font-weight: 600;
`;

const ViewInfo = styled.View`
  margin-top: 12px;
  width: 50%;
  height: 25px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${Color.green2};
`;

const TextInfo = styled.Text`
  color: ${Color.green1};
  font-size: 11px;
`;

const style = {
  styleView: {
    flex: 1,
  },
  regionMapView: {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  },
};

export default CheckinScreen;
