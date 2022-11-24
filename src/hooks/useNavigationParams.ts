import {useRoute} from '@react-navigation/native'

export const useNavigationParams = <T>() => {
  return (useRoute().params as unknown) as T;
};
