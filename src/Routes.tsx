import * as React from 'react';
import {memo, useCallback, Suspense} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
// import {LoginScreen} from './screens/login/LoginScreen';
const LoginScreen = React.lazy(() => import('./screens/login/LoginScreen'));
import {
  navigateToHomeScreen,
  navigateToMainScreen,
  navigationRef,
  replaceWithHomeScreen,
} from './utils/navigation';
import {HomeScreen} from './screens/HomeScreen';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {HistoryScreen} from './screens/history/HistoryScreen';
const CheckinScreen = React.lazy(
  () => import('./screens/checkin/CheckinScreen'),
);
import {Color} from './themes/Color';
import {BaseStyles} from './themes/BaseStyle';
import styled from 'styled-components';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {resetUser, useUser} from './store/constant';
import * as child_process from 'child_process';
import {useAsyncFn} from './hooks/useAsyncFn';
import {newFormData} from './utils/func';
import {Fetch} from './utils/fetch';

export const RootStack = createStackNavigator();
export const ModalStack = createStackNavigator();

const Tab = createMaterialTopTabNavigator();

const Container = styled.View`
  flex: 1;
`;

const Header = styled.View`
  width: 100%;
  background-color: ${Color.background_color};
  align-items: center;
  padding-bottom: 15px;
  flex-direction: row;
  justify-content: center;
`;

const Text = styled.Text`
  font-weight: 500;
  color: ${Color.white};
  font-size: 20px;
`;

const MyTabs = () => {
  const user = useUser();
  const [{value, loading, error}, exit] = useAsyncFn(async () => {
    const formData = newFormData({
      access_token: user.access_token,
      client_key: user.client_key,
      client_auth: 1,
      __code: user.__code,
    });

    const {data} = await Fetch.post(
      'api.base.vn/extapi/oauth/logout',
      formData,
    );

    if (data.code === 1) {
      resetUser();
      replaceWithHomeScreen();
    }

    return data;
  });

  console.log(value);
  console.log(error);

  const logout = useCallback(() => {
    resetUser();
    replaceWithHomeScreen();
  }, []);

  return (
    <Container>
      <Header style={BaseStyles().paddingTopInsets}>
        <TouchableOpacity onPress={exit}>
          {loading ? (
            <ActivityIndicator color={Color.green} />
          ) : (
            <Text>Checkin</Text>
          )}
        </TouchableOpacity>
      </Header>

      <Suspense fallback={<View />}>
        <Tab.Navigator
          initialRouteName={'Checkin'}
          screenOptions={({route}) => ({
            tabBarLabelStyle: {
              fontSize: 15,
              fontWeight: '600',
              textTransform: 'none',
            },
            tabBarActiveTintColor: Color.background_color,
            tabBarInactiveTintColor: Color.gray3,
            title: route.name === 'Checkin' ? 'Checkin' : 'Lịch sử',
          })}>
          <Tab.Screen name="Checkin" component={CheckinScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
        </Tab.Navigator>
      </Suspense>
    </Container>
  );
};

export const ModalStackComponent = memo(function ModalStackComponent() {
  return (
    <Suspense fallback={<View />}>
      <ModalStack.Navigator
        initialRouteName={'Home'}
        screenOptions={{headerShown: false}}>
        <RootStack.Screen name={'Home'} component={HomeScreen} />
        <RootStack.Screen name={'Login'} component={LoginScreen} />
        <RootStack.Screen name={'Main'} component={MyTabs} />
      </ModalStack.Navigator>
    </Suspense>
  );
});

const Routes = memo(function Routes() {
  const routeNameRef = React.useRef<string>('');

  const onStateChange = useCallback(() => {
    const previousRouteName = routeNameRef.current;
    // @ts-ignore
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

    if (currentRouteName && previousRouteName !== currentRouteName) {
      // analytics().setCurrentScreen(currentRouteName);
      routeNameRef.current = currentRouteName;
    }
  }, []);
  return (
    <NavigationContainer ref={navigationRef} onStateChange={onStateChange}>
      <RootStack.Navigator
        initialRouteName={'Root'}
        screenOptions={{headerShown: false}}>
        <RootStack.Screen name={'Root'} component={ModalStackComponent} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
});

export default Routes;
