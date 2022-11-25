import Modal from 'react-native-modal';
import styled from 'styled-components';
import {Color} from '../../themes/Color';
import {ScrollView} from 'react-native';
// @ts-ignore
import moment from 'moment';

const ViewModal = styled.View`
  width: 100%;
  max-height: 50%;
  background-color: ${Color.white};
  border-radius: 10px;
  overflow: hidden;
`;
const View = styled.View`
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
`;

const ViewItem = styled.View`
  width: 100%;
  height: 44px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  justify-content: center;
  border-bottom: ${Color.gray_border};
  border-bottom-width: 0.5px;
`;
const TextLog = styled.Text`
  font-weight: 600;
  font-size: 11px;
`;

const TextIP = styled.Text`
  font-weight: 400;
  color: ${Color.gray3};
  margin-top: 3px;
  font-size: 10px;
`;

const Day = styled.View`
  width: 100%;
  justify-content: center;
  background-color: ${Color.background_color};
  margin-bottom: 12px;
`;

const TextDay = styled.Text`
  font-size: 15px;
  font-weight: 600;
  margin: 12px;
  color: ${Color.white};
`;

interface props {
  log: any;
  name: string;
  modal?: boolean;
  day?: any;
  onBackdropPress?: any;
}

export const ModalLogs = ({log, name, modal, day, onBackdropPress}: props) => {
  const newDate = new Date(day.dateString);

  const text = moment(newDate).format('dddd, DD/MM/YYYY');

  return (
    <Modal
      isVisible={modal}
      onBackdropPress={onBackdropPress}
      style={{
        margin: 0,
        justifyContent: 'flex-end',
      }}>
      <ViewModal>
        <ScrollView>
          <Day>
            <TextDay>{text}</TextDay>
          </Day>
          <Items log={log} name={name} />
        </ScrollView>
      </ViewModal>
    </Modal>
  );
};

const Items = ({log, name}: props) => {
  return (
    <View>
      {log.map((item, index) => (
        <ViewItem>
          <TextLog>{item.time}</TextLog>
          <TextIP>{'IP: ' + item.IP + ' ' + name}</TextIP>
        </ViewItem>
      ))}
    </View>
  );
};
