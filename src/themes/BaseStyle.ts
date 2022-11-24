import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMemo} from 'react';

export const BaseStyles = () => {
  const insets = useSafeAreaInsets();

  const paddingTopInsets = useMemo(() => {
    return {
      paddingTop: insets.top,
    };
  }, [insets]);

  return {paddingTopInsets, insets};
};
