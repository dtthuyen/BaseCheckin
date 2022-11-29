import styled from 'styled-components';
import {Color} from '../../themes/Color';
import {IC_NEXT, IC_PREVIOUS} from '../../assets';
import {memo, useCallback, useEffect, useMemo} from 'react';
// @ts-ignore
import moment from 'moment';
import {Calendar, LocaleConfig} from 'react-native-calendars/src';
import {DayForm} from './DayForm';
import {useClients, useLogs, useUser} from '../../store/constant';
import {handleSetLogs} from '../../utils/func';
import {Header} from './Header';
import {useAsyncFn} from '../../hooks/useAsyncFn';
import {ActivityIndicator} from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${Color.white};
  border-top-color: ${Color.gray6};
  border-top-width: 8px;
`;

const IconArrow = styled.Image`
  width: 24px;
  height: 24px;
`;

const View = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const HistoryScreen = () => {
  const log = useLogs();
  const user = useUser();
  const clients = useClients();

  const dateDay = useCallback(date => {
    return (
      `${date.day}`.padStart(2, '0') + '/' + `${date.month}`.padStart(2, '0')
    );
  }, []);

  const [{value, loading, error}, getLogs] = useAsyncFn(() => {
    const id = clients[1]?.id;
    const _log = handleSetLogs(user, id);
    return _log;
  }, []);

  useEffect(() => {
    if (clients.length) getLogs().then(r => {});
  }, []);

  return (
    <Container>
      {loading ? (
        <View>
          <ActivityIndicator color={Color.green} />
        </View>
      ) : (
        <Calendar
          style={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
          theme={{
            textSectionTitleColor: Color.black1,
            weekVerticalMargin: 0,
            'stylesheet.calendar.header': {
              week: {
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: Color.gray6,
                alignItems: 'center',
                height: 44,
              },
              dayHeader: {
                borderColor: Color.gray_border,
                borderWidth: 0.5,
                flex: 1,
                height: '100%',
                textAlign: 'center',
                paddingTop: 14,
              },
            },
          }}
          showSixWeeks={true}
          renderHeader={date => <Header date={date} />}
          renderArrow={direction =>
            direction === 'left' ? (
              <IconArrow source={IC_PREVIOUS} />
            ) : (
              <IconArrow source={IC_NEXT} />
            )
          }
          dayComponent={({date, state}) => (
            <DayForm
              day={date}
              date={dateDay(date)}
              state={state}
              log={log[dateDay(date)]}
              nameOffice={log['name']}
            />
          )}
        />
      )}
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
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};
LocaleConfig.defaultLocale = 'vn';
