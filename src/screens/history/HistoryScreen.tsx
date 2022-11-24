import styled from 'styled-components';
import {Color} from '../../themes/Color';
import {IC_NEXT, IC_PREVIOUS} from '../../assets';
import {memo, useCallback, useMemo} from 'react';
// @ts-ignore
import moment from 'moment';
import {TouchableOpacity, View, Text} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars/src';
import {Fetch} from '../../utils/fetch';
import {useAsyncFn} from '../../hooks/useAsyncFn';
import {useUser} from '../../store/constant';

const Container = styled.View`
  flex: 1;
  background-color: ${Color.white};
  border-top-color: ${Color.gray6};
  border-top-width: 8px;
`;

const Icon = styled.Image`
  width: 24px;
  height: 24px;
`;

const ViewDayCurrent = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 64px;
`;

const TextDayCurrent = styled.Text`
  font-size: 18px;
  color: ${Color.black2};
  font-weight: 500;
  line-height: 22px;
`;

const SubText = styled.Text`
  font-size: 13px;
  color: ${Color.gray3};
  line-height: 18px;
  margin-top: 4px;
`;

const ViewDayComponent = styled.View`
  flex-direction: column;
  //justify-content: center;
  align-items: center;
  height: 88px;
  //border: ${Color.gray_border};
`;

const TextDayComponent = styled.Text<{state: any}>`
  font-size: 11px;
  font-weight: 400;
  color: ${p => (p.state === 'disabled' ? Color.gray4 : Color.gray3)};
`;

const TextCheckin = styled.Text`
  font-size: 11px;
  font-weight: 500;
  color: ${Color.green};
  margin-top: 14px;
`;

const TextCheckout = styled(TextCheckin)`
  margin-top: 8px;
`;

interface propsHeader {
  date: any;
}

const Header = ({date}: propsHeader) => {
  const day = 'Ngày ' + moment(date).format('DD/MM/YYYY').toString();
  const CurrentDay = useMemo(() => {
    return <TextDayCurrent>{day}</TextDayCurrent>;
  }, [day]);

  return (
    <ViewDayCurrent>
      {CurrentDay}
      <SubText>(Danh sách lịch sử chấm công)</SubText>
    </ViewDayCurrent>
  );
};

interface propsDayComponent {
  state: any;
  date: any;
}

const DayComponent = ({date, state}: propsDayComponent) => {
  const day =
    `${date.day}`.padStart(2, '0') + '/' + `${date.month}`.padStart(2, '0');
  return (
    <ViewDayComponent>
      <TextDayComponent state={state}>{day}</TextDayComponent>
      {state === 'disabled' ? null : (
        <View>
          <TextCheckin>08:30</TextCheckin>
          <TextCheckout>05:31</TextCheckout>
        </View>
      )}
    </ViewDayComponent>
  );
};

export const HistoryScreen = () => {
  const user = useUser();
  const [{value, loading, error}, onGetHistory] = useAsyncFn(async () => {
    const formData = {
      client_key: user.client_key,
      client_auth: 1,
      access_token: user.access_token,
      __code: user.__code,
      client_id: '',
      time_start: 1667236454,
      time_end: 1669828454,
    };

    const form = new FormData();

    for (let key in formData) {
      form.append(key, formData[key]);
    }
    const {data} = await Fetch.post('checkin.base.vn/ajax/api/me/logs', form);

    if (data.code === 1) {
      // setEnableClient();
    }

    return data;
  }, []);

  return (
    <Container>
      <Calendar
        theme={{
          textSectionTitleColor: Color.black1,
        }}
        renderHeader={date => <Header date={date} />}
        renderArrow={direction =>
          direction === 'left' ? (
            <Icon source={IC_PREVIOUS} />
          ) : (
            <Icon source={IC_NEXT} />
          )
        }
        dayComponent={({date, state}) => (
          <DayComponent date={date} state={state} />
        )}
      />

      {/*<TouchableOpacity onPress={onPress}></TouchableOpacity>*/}
    </Container>
  );
};

LocaleConfig.locales['vn'] = {
  monthNames: [
    'Tháng Một',
    'Tháng Hai',
    'Tháng Ba',
    'Tháng Tư',
    'Tháng Năm',
    'Tháng 6',
    'Tháng Bảy',
    'Tháng Tám',
    'Tháng Chín',
    'Tháng Mười',
    'Tháng Mười Một',
    'Tháng Mười Hai',
  ],
  monthNamesShort: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  dayNames: [
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
    'Chủ Nhật',
  ],
  dayNamesShort: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  today: 'Hôm nay',
};
LocaleConfig.defaultLocale = 'vn';
