import styled from 'styled-components';
import {Color} from '../../themes/Color';
import {IC_NEXT, IC_PREVIOUS} from '../../assets';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
// @ts-ignore
import moment from 'moment';
import {Calendar, LocaleConfig} from 'react-native-calendars/src';
import {Fetch} from '../../utils/fetch';
import {useAsyncFn} from '../../hooks/useAsyncFn';
import {DayForm} from './DayForm';
import {useToggleCheckIn, useUser} from '../../store/constant';

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

export const HistoryScreen = () => {
  const user = useUser();
  const check = useToggleCheckIn();

  console.log(check);
  const [log, setLog] = useState({});

  const [{value, loading, error}, onGetHistory] = useAsyncFn(async () => {
    const formData = {
      client_key: user.client_key,
      client_auth: 1,
      access_token: user.access_token,
      __code: user.__code,
      client_id: user.mobile_clients['1'].id,
      time_start: 1667236454,
      time_end: 1669828454,
    };

    const form = new FormData();

    for (let key in formData) {
      form.append(key, formData[key]);
    }
    const {data} = await Fetch.post('checkin.base.vn/ajax/api/me/logs', form);

    return data;
  }, []);

  const dateDay = useCallback(date => {
    return (
      `${date.day}`.padStart(2, '0') + '/' + `${date.month}`.padStart(2, '0')
    );
  }, []);

  useEffect(() => {
    onGetHistory().then(r => {
      if (r.code === 1) {
        let newLog = {
          name: user.mobile_clients['1'].name,
        };
        r.logs.forEach(item => {
          const item_logs = item.logs;
          const _day = moment(new Date(item.date * 1000))
            .format('DD/MM')
            .toString();
          let len = item_logs.length;
          const _in = item_logs[0].time;
          len--;
          const _out = len > 0 ? item_logs[len].time : '--:--';
          const temp = {
            [_day]: {
              checkin: _in,
              checkout: _out,
            },
          };

          newLog = {...newLog, ...temp};

          let logs = [];
          item.logs.forEach(i => {
            let data = [
              {
                time: moment(new Date(i.time * 1000))
                  .format('DD/MM HH:mm:ss')
                  .toString(),
                IP: i.ip,
              },
            ];
            logs = [...logs, ...data];
          });

          newLog = {
            ...newLog,
            [_day]: {
              ...newLog[_day],
              ...{logs},
            },
          };
          setLog(newLog);
        });
      }
    });
  }, [check]);

  console.log(user.mobile_clients);

  return (
    <Container>
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
            <Icon source={IC_PREVIOUS} />
          ) : (
            <Icon source={IC_NEXT} />
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
