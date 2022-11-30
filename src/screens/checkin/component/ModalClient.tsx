import Modal from 'react-native-modal';
import styled from 'styled-components';
// @ts-ignore
import moment from 'moment';
import {memo, useCallback, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import 'moment/locale/vi';
import {Color} from '../../../themes/Color';

const ViewModal = styled.View`
  width: 100%;
  max-height: 50%;
  background-color: ${Color.white};
  border-radius: 10px;
  overflow: hidden;
  padding-bottom: 12px;
`;

const View = styled.ScrollView`
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
`;

const ViewItem = styled.TouchableOpacity`
  width: 100%;
  padding-bottom: 10px;
  padding-top: 10px;
  justify-content: center;
  border-bottom: ${Color.gray_border};
  border-bottom-width: 0.5px;
`;

const TextClient = styled.Text`
  font-weight: 500;
  font-size: 13px;
  color: ${Color.black2};
`;

const TextID = styled(TextClient)`
  color: ${Color.gray3};
`;
const ViewChoose = styled.View`
  background-color: ${Color.background_color};
  padding: 12px;
`;
const TextChoose = styled.Text`
  font-weight: 600;
  font-size: 15px;
  color: ${Color.white};
`;

interface props {
  client: any;
  closeModal?: any;
  modal?: boolean;
  setID?: any;
  setEnableClient?: any;
}

const ModalClients = ({
  client,
  closeModal,
  modal,
  setID,
  setEnableClient,
}: props) => {
  return (
    <Modal
      isVisible={modal}
      onBackdropPress={closeModal}
      style={styles.styleModal}>
      <ViewModal>
        <ViewChoose>
          <TextChoose>Choose Client</TextChoose>
        </ViewChoose>

        <Items
          client={client}
          setID={setID}
          closeModal={closeModal}
          setEnableClient={setEnableClient}
        />
      </ViewModal>
    </Modal>
  );
};

const Items = ({client, setID, closeModal, setEnableClient}: props) => {
  const onPress = useCallback(id => {
    setID(id);
    closeModal();
    setEnableClient();
  }, []);

  return (
    <View>
      {client.map((item, index) => (
        <ViewItem key={index} onPress={() => onPress(item.id)}>
          <TextClient>{item.name}</TextClient>
          <TextID>{'ID: ' + item.id}</TextID>
        </ViewItem>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  styleModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
});

export default memo(ModalClients);
