import * as React from 'react';
import {
  NavigationContainerRef,
  StackActions,
  DrawerActions,
} from '@react-navigation/native';

import {TransitionPresets} from '@react-navigation/stack';

export const defaultScreenOptions = TransitionPresets.SlideFromRightIOS;

// @ts-ignore
export const navigationRef = React.createRef<NavigationContainerRef>();

export const navigation = () => navigationRef.current!;

export const createNavigate =
  <T extends object>(screen: string) =>
  (params?: T) => {
    return navigation().navigate(screen, params);
  };

export const createReplace =
  <T extends object>(screenName: string) =>
  (params?: T) => {
    return navigation().dispatch(StackActions.replace(screenName, params));
  };

export const goBack = () => navigation().goBack();

export const toggleDrawer = () =>
  navigation().dispatch(DrawerActions.toggleDrawer());

export const replaceWithMainScreen = createReplace('Main')

export const navigateToLoginScreen = createNavigate('Login');

export const navigateToMainScreen = createNavigate('Main');
