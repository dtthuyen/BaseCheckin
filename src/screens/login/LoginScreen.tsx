import styled from 'styled-components';
import {memo, useCallback, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {Color} from '../../themes/Color';
import {useAsyncFn} from '../../hooks/useAsyncFn';
import {Fetch} from '../../utils/fetch';
import {IC_APP, IC_LOCK, IC_MAIL, IMAGE_BGR_LOGIN} from '../../assets';
import {GET_SECRET_KEY_URL, LOGIN_URL, LoginParams} from '../../utils/type';
import {setUserAction} from '../../store/constant';
import {navigateToMainScreen} from '../../utils/navigation';
import {handleGetClients, newFormData} from '../../utils/func';

const Container = styled.View`
  flex: 1;
`;

const ImageBackground = styled.Image`
  position: absolute;
  width: 100%;
  height: 50%;
  z-index: -1;
  bottom: 0;
`;

const SectionLogo = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 39px;
`;

const SectionInput = styled.View`
  flex: 1;
  padding-left: 37px;
  padding-right: 37px;
`;

const SectionLogin = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 129px;
  padding-left: 37px;
  padding-right: 37px;
`;

const LogoApp = styled.Image`
  width: 97px;
  height: 117px;
`;

const InputView = styled.View`
  width: 100%;
  border-bottom-width: 1px;
  margin-top: 50px;
  border-bottom-color: ${Color.gray_border};
  flex-direction: row;
  padding-bottom: 14px;
  align-items: center;
`;

const IconInput = styled.Image`
  height: 20px;
  width: 20px;
  margin-right: 14px;
`;

const TextInput = styled.TextInput`
  font-size: 15px;
  width: 100%;
`;

const BtnForgotPwd = styled.TouchableOpacity`
  justify-self: flex-end;
  margin-top: 26px;
  align-self: flex-end;
`;

const BtnLoginHandle = styled.TouchableOpacity`
  height: 48px;
  width: 100%;
  border-radius: 100px;
  background-color: ${Color.background_color};
  justify-content: center;
  align-items: center;
`;

const TextLogin = styled.Text`
  font-size: 15px;
  text-transform: uppercase;
  color: ${Color.white};
  font-weight: 700;
`;

const TextForgotPwd = styled.Text`
  font-size: 13px;
  font-weight: 400;
  color: ${Color.gray3};
  text-decoration-line: underline;
`;

const LoginScreen = () => {
  const [params, setParams] = useState<LoginParams>({
    username: 'hien2@yopmail.com',
    password: 'hien123456',
  });

  const onTextChange = useCallback(
    (keyName: string, value: string) => {
      setParams({
        ...params,
        [keyName]: value,
      });
    },
    [params],
  );

  const [{value, loading, error}, onLogin] = useAsyncFn(async () => {
    const {data} = await Fetch.get(GET_SECRET_KEY_URL);

    const formData = {
      client_key: data['client'].client_key,
      client_secret: data['client'].client_secret,
      email: params.username,
      password: params.password,
      __code: 'native',
    };

    const form = newFormData(formData);

    const temp = await Fetch.post(LOGIN_URL, form);

    if (temp.data.code === 1) {
      const params = {
        ...formData,
        access_token: temp.data.client.access_token,
        isLogin: true,
      };
      setUserAction(params);
      const _clients = await handleGetClients(params);
      console.log('login handleGetClients', _clients);
      navigateToMainScreen();
    }

    return temp.data;
  }, []);

  return (
    <Container>
      <SectionLogo>
        <LogoApp source={IC_APP} />
      </SectionLogo>

      <SectionInput>
        <InputView>
          <IconInput source={IC_MAIL} />
          <TextInput
            value={params.username}
            onChangeText={text => onTextChange('username', text)}
            keyboardType={'email-address'}
            placeholder={'Email'}
          />
        </InputView>
        <InputView>
          <IconInput source={IC_LOCK} />
          <TextInput
            value={params.password}
            onChangeText={text => onTextChange('password', text)}
            placeholder={'M???t kh???u'}
            secureTextEntry={true}
          />
        </InputView>
        <BtnForgotPwd>
          <TextForgotPwd>Qu??n m???t kh???u?</TextForgotPwd>
        </BtnForgotPwd>
      </SectionInput>

      <SectionLogin>
        <BtnLoginHandle onPress={onLogin}>
          {loading ? (
            <ActivityIndicator color={'#fff'} />
          ) : (
            <TextLogin>????ng nh???p</TextLogin>
          )}
        </BtnLoginHandle>
      </SectionLogin>

      <ImageBackground source={IMAGE_BGR_LOGIN} />
    </Container>
  );
};

export default memo(LoginScreen);
