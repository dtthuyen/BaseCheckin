import {memo, useCallback, useEffect, useState} from 'react';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';
import {useAsyncFn} from '../../hooks/useAsyncFn';
import {Form} from './component/Form';
import {IC_CAMERA, IC_CHECKIN_HAND, IC_LOCATION} from '../../assets';
import {Color} from '../../themes/Color';
import styled from 'styled-components';
import Geolocation from '@react-native-community/geolocation';
import {checkCamera, checkLocation, handleGetClients} from '../../utils/func';
import useBoolean from '../../hooks/useBoolean';
import ModalClient from './component/ModalClient';
import {getAllClients} from '../../store/clients';

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
  setPosition: any;
  setID: any;
}

export const CheckEnableScreen = memo(
  ({
    enableLocation,
    enableCamera,
    enableClient,
    setEnableLocation,
    setEnableCamera,
    setEnableClient,
    setDisableCamera,
    setDisableLocation,
    setDisableClient,
    setPosition,
    setID,
  }: props) => {
    useEffect(() => {
      checkCamera(setEnableCamera, setDisableCamera);
      checkLocation(setEnableLocation, setDisableLocation, setPosition);
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
              console.log('camera disable', result);
              setDisableCamera();
              break;
            case RESULTS.GRANTED:
              console.log('The permission camera is granted');
              setEnableCamera();
              break;
          }
        })
        .catch(error => {
          // ???
        });
    }, []);

    const onPressLocation = useCallback(() => {
      request(
        Platform.OS === 'ios'
          ? parseInt(Platform.Version, 10) < 13
            ? PERMISSIONS.IOS.LOCATION_ALWAYS
            : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      )
        .then(r => {
          switch (r) {
            case RESULTS.UNAVAILABLE:
            case RESULTS.DENIED:
            case RESULTS.LIMITED:
            case RESULTS.BLOCKED:
              console.log('location disable', r);
              setDisableLocation();
              break;
            case RESULTS.GRANTED:
              console.log('The permission location is granted');
              Geolocation.getCurrentPosition(
                info => setPosition(info),
                error => alert(error.message),
                {
                  enableHighAccuracy: false,
                  timeout: 5000,
                  maximumAge: 10000,
                },
              );
              setEnableLocation();
              break;
          }
        })
        .catch(error => {
          console.log('onPressLocation error', error);
        });
    }, []);

    const [modal, openModal, closeModal] = useBoolean(false);

    const client = getAllClients() || [];

    // const onPressClients = useCallback(() => {
    //   openModal();
    // }, []);

    return (
      <Container>
        <Text>
          ????? c?? th??? s??? d???ng t??nh n??ng checkin b???n vui l??ng ch???n thao t??c
          Anable/disable
        </Text>

        <View>
          <Form
            source={IC_CHECKIN_HAND}
            text={'Checkin client'}
            subText={'Mobile checkin'}
            enable={enableClient}
            onPress={openModal}
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

        <ModalClient
          client={client}
          closeModal={closeModal}
          modal={modal}
          setID={setID}
          setEnableClient={setEnableClient}
        />
      </Container>
    );
  },
);
