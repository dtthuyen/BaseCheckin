import {Color} from '../../themes/Color';
import styled from 'styled-components';
import {useCallback} from 'react';
import {ModalLogs} from './ModalLogs';
import useBoolean from '../../hooks/useBoolean';
import {format_DMY, format_HH_MM} from '../../utils/func';

interface propsDayComponent {
  state: any;
  date: any;
  log: any;
  nameOffice: string;
  day: any;
}

export const DayForm = ({
  date,
  state,
  log,
  nameOffice,
  day,
}: propsDayComponent) => {
  const cin = format_HH_MM(log?.checkin);
  const cout = format_HH_MM(log?.checkout);

  const timeIn = new Date(format_DMY(log?.checkin) + 'T' + '08:30').getTime();
  const timeOut = new Date(format_DMY(log?.checkout) + 'T' + '17:30').getTime();

  const _in = log?.checkin;
  const _out = log?.checkout;

  const colorIn = timeIn > _in ? Color.green : Color.red;
  const colorOut = timeOut < _out ? Color.green : Color.red;

  const onPressDay = useCallback(() => {
    if (log) openModal();
  }, [date]);

  const [modal, openModal, closeModal] = useBoolean(false);

  return (
    <ViewDayComponent onPress={onPressDay}>
      <TextDayComponent state={state}>{date}</TextDayComponent>
      {state === 'disabled' ? null : (
        <View>
          <TextCheckin _color={colorIn}>{cin}</TextCheckin>
          <TextCheckout _color={colorOut}>
            {cout === 'Invalid date' ? '--:--' : cout}
          </TextCheckout>
        </View>
      )}

      <ModalLogs
        day={day}
        log={log?.logs || []}
        name={nameOffice}
        modal={modal}
        onBackdropPress={closeModal}
      />
    </ViewDayComponent>
  );
};

const ViewDayComponent = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 15px;
  border: ${Color.gray_border} 0.4px;
  height: 89px;
  width: 100%;
`;

const View = styled.View`
  align-items: center;
`;

const TextDayComponent = styled.Text<{state: any}>`
  font-size: 11px;
  font-weight: 400;
  color: ${p => (p.state === 'disabled' ? Color.gray4 : Color.gray3)};
`;

const TextCheckin = styled.Text<{_color: string}>`
  font-size: 11px;
  font-weight: 500;
  color: ${p => p._color};
  margin-top: 14px;
`;

const TextCheckout = styled(TextCheckin)`
  margin-top: 8px;
`;
