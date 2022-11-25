import {setClientsAction, useUser} from '../../store/constant';
import {Fetch} from '../../utils/fetch';
import {useCallback, useEffect} from 'react';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';
import {useAsyncFn} from '../../hooks/useAsyncFn';
import {Form} from './component/Form';
import {IC_CAMERA, IC_CHECKIN_HAND, IC_LOCATION} from '../../assets';
import {Color} from '../../themes/Color';
import styled from 'styled-components';

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${Color.white};
`;

const View = styled.View`
  width: 100%;
  margin-top: 15px;
`;

const Text = styled.Text`
  font-weight: 400;
  color: ${Color.gray3};
  font-size: 15px;
  line-height: 18px;
`;

interface props {
  enableLocation: boolean;
  enableCamera: boolean;
  enableClient: boolean;
  setEnableLocation: any;
  setEnableCamera: any;
  setEnableClient: any;
  setDisableCamera: any;
  setDisableLocation: any;
  setDisableClient: any;
}

export const CheckEnableScreen = ({
  enableLocation,
  enableCamera,
  enableClient,
  setEnableLocation,
  setEnableCamera,
  setEnableClient,
  setDisableCamera,
  setDisableLocation,
  setDisableClient,
}: props) => {
  const user = useUser();

  console.log(user);

  const [{value, loading, error}, onGetClients] = useAsyncFn(async () => {
    const formData = {
      client_key: user.client_key,
      client_auth: 1,
      lat: 112,
      lng: 111,
      access_token: user.access_token,
      __code: user.__code,
    };

    const form = new FormData();

    for (let key in formData) {
      form.append(key, formData[key]);
    }
    const {data} = await Fetch.post(
      'checkin.base.vn/ajax/api/me/clients',
      form,
    );

    if (data.code === 1) {
      setEnableClient();
      setClientsAction(data.mobile_clients);
    }

    return data;
  }, []);

  useEffect(() => {
    user.mobile_clients ? setEnableClient() : setDisableClient;
    check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
          case RESULTS.DENIED:
          case RESULTS.LIMITED:
          case RESULTS.BLOCKED:
            console.log('location disable');
            setDisableLocation();
            break;
          case RESULTS.GRANTED:
            console.log('The permission location is granted');
            setEnableLocation();
            break;
        }
      })
      .catch(error => {
        // …
      });

    check(PERMISSIONS.IOS.CAMERA)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
          case RESULTS.DENIED:
          case RESULTS.LIMITED:
          case RESULTS.BLOCKED:
            console.log('camera disable');
            setDisableCamera();
            break;
          case RESULTS.GRANTED:
            console.log('The permission camera is granted');
            setEnableCamera();
            break;
        }
      })
      .catch(error => {
        // …
      });
  }, []);

  const onPressCamera = useCallback(() => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    )
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
          case RESULTS.DENIED:
          case RESULTS.LIMITED:
          case RESULTS.BLOCKED:
            console.log('camera disable');
            setDisableCamera();
            break;
          case RESULTS.GRANTED:
            console.log('The permission camera is granted');
            setEnableCamera();
            break;
        }
      })
      .catch(error => {
        // …
      });
  }, []);

  const onPressLocation = useCallback(() => {
    request(
      Platform.OS === 'ios'
        ? parseInt(Platform.Version, 10) < 13
          ? PERMISSIONS.IOS.LOCATION_ALWAYS
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : Platform.Version < 29
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    )
      .then(r => {
        switch (r) {
          case RESULTS.UNAVAILABLE:
          case RESULTS.DENIED:
          case RESULTS.LIMITED:
          case RESULTS.BLOCKED:
            console.log('camera disable');
            setDisableLocation();
            break;
          case RESULTS.GRANTED:
            console.log('The permission camera is granted');
            setEnableLocation();
            break;
        }
      })
      .catch(error => {
        // …
      });
  }, []);

  return (
    <Container>
      <Text>
        Để có thể sử dụng tính năng checkin bạn vui lòng chọn thao tác
        Anable/disable
      </Text>

      <View>
        <Form
          source={IC_CHECKIN_HAND}
          text={'Checkin client'}
          subText={'Mobile checkin'}
          enable={enableClient}
          onPress={onGetClients}
        />
        <Form
          source={IC_CAMERA}
          text={'Camera'}
          onPress={onPressCamera}
          enable={enableCamera}
        />
        <Form
          source={IC_LOCATION}
          text={'Location'}
          onPress={onPressLocation}
          enable={enableLocation}
        />
      </View>
    </Container>
  );
};
