import styled from 'styled-components';
import * as React from 'react';
import useBoolean from '../../../hooks/useBoolean';
import {Color} from '../../../themes/Color';
import {useCallback, useEffect, useMemo} from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

const Container = styled.TouchableOpacity`
  height: 64px;
  width: 100%;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: ${Color.gray6};
`;

const View = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Icon = styled.Image`
  width: 28px;
  height: 28px;
`;

const TextView = styled.View`
  margin-left: 16px;
  flex-direction: column;
`;

const TextTitle = styled.Text`
  font-size: 17px;
  color: ${Color.black2};
  font-weight: 400;
`;

const SubText = styled.Text`
  color: ${Color.gray3};
  font-size: 13px;
`;

const Text = styled.Text<{isActive: boolean}>`
  font-size: 15px;
  color: ${p => (p.isActive ? Color.green : Color.gray3)};
`;

interface props {
  source: string;
  text: string;
  subText?: string;
  onPress?: () => void;
  enable: boolean;
  loading?: boolean;
}

export const Form = ({source, text, subText, onPress, enable}: props) => {
  const TextActive = useMemo(() => {
    return enable ? 'Enable' : ' Disable';
  }, [enable]);

  return (
    <Container onPress={onPress}>
      <View>
        <Icon source={source} />
        <TextView>
          <TextTitle>{text}</TextTitle>
          {subText ? <SubText>{subText}</SubText> : null}
        </TextView>
      </View>
      <Text isActive={enable}>{TextActive}</Text>
    </Container>
  );
};
