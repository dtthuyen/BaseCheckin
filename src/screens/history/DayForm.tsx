import {Color} from '../../themes/Color';
import styled from 'styled-components';
import {useCallback} from 'react';
import {ModalLogs} from './ModalLogs';
import useBoolean from '../../hooks/useBoolean';
import {format_DMY, format_HH_MM} from '../../utils/func';
import moment from 'moment';

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
  const newDate = moment(new Date(day.dateString)).format('dddd').toString();
  const cin = format_HH_MM(log?.checkin);
  const cout = format_HH_MM(log?.checkout);

  const timeInM = new Date(format_DMY(log?.checkin) + 'T' + '08:30').getTime();
  const timeOutM = new Date(format_DMY(log?.checkin) + 'T' + '12:00').getTime();
  const timeInA = new Date(format_DMY(log?.checkin) + 'T' + '13:00').getTime();
  const timeOutA = new Date(
    format_DMY(log?.checkout) + 'T' + '17:30',
  ).getTime();

  const _in = log?.checkin * 1000;
  const _out = log?.checkout * 1000;

  const colorIn =
    timeInM > _in
      ? Color.green
      : timeOutM < _in && timeInA > _in
      ? 'orange'
      : Color.red;
  const colorOut =
    newDate === 'Saturday'
      ? timeOutM < _out
        ? Color.green
        : Color.red
      : timeOutA < _out
      ? Color.green
      : timeInA > _out && timeOutM < _out
      ? 'orange'
      : Color.red;

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
