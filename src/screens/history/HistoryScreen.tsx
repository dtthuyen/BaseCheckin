import styled from 'styled-components';
import {Color} from '../../themes/Color';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
// @ts-ignore
import moment from 'moment';
import {Calendar, LocaleConfig} from 'react-native-calendars/src';
import {useAtIdClient, useUser} from '../../store/constant';
import {handleSetLogs} from '../../utils/func';
import {useAsyncFn} from '../../hooks/useAsyncFn';
import {CalendarView} from './Calender';
import {getAllClients, useClientByKey} from '../../store/clients';

const Container = styled.View`
  flex: 1;
  background-color: ${Color.white};
  border-top-color: ${Color.gray6};
  border-top-width: 8px;
`;

export const HistoryScreen = () => {
  const user = useUser();
  const clients = getAllClients();
  const id = useAtIdClient();
  const name = useClientByKey(id)?.name;

  const [{value, loading, error}, getLogs] = useAsyncFn((start, end) => {
    const _log = handleSetLogs(user, start, end, name);
    return _log;
  }, []);

  useEffect(() => {
    if (clients.length) {
      let start = moment(new Date()).startOf('month').valueOf() / 1000;
      let end = moment(new Date()).endOf('month').valueOf() / 1000;
      getLogs(start, end).then(r => {});
    }
  }, []);

  const pressLeft = useCallback((subtractMonth, date) => {
    const start =
      moment(new Date(date.getFullYear(), date.getMonth() - 1, 1))
        .startOf('month')
        .valueOf() / 1000;
    const end =
      moment(new Date(date.getFullYear(), date.getMonth() - 1, 1))
        .endOf('month')
        .valueOf() / 1000;
    getLogs(start, end).then(r => {});
    subtractMonth();
  }, []);

  const pressRight = useCallback((addMonth, date) => {
    const start =
      moment(new Date(date.getFullYear(), date.getMonth() + 1, 1))
        .startOf('month')
        .valueOf() / 1000;
    const end =
      moment(new Date(date.getFullYear(), date.getMonth() + 1, 1))
        .endOf('month')
        .valueOf() / 1000;
    getLogs(start, end).then(r => {});
    addMonth();
  }, []);

  return (
    <Container>
      <CalendarView
        pressLeft={pressLeft}
        pressRight={pressRight}
        loading={loading}
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
