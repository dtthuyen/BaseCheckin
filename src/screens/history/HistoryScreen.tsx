import styled, {keyframes} from 'styled-components';
import {Color} from '../../themes/Color';
import {memo, useCallback, useEffect} from 'react';
// @ts-ignore
import moment from 'moment';
import {Calendar, LocaleConfig} from 'react-native-calendars/src';
import {useAtIdClient, useUser} from '../../store/constant';
import {handleSetLogs} from '../../utils/func';
import {useAsyncFn} from '../../hooks/useAsyncFn';
import {CalendarView} from './Calender';
import {getAllClients, useClientByKey} from '../../store/clients';
import AnimatedColorView from 'react-native-animated-colors';
import {useKeysByQueryLogs, useLogsByKey} from '../../store/logs';

const Container = styled.View`
  flex: 1;
  background-color: ${Color.white};
  // border-top-color: ${Color.gray6};
  // border-top-width: 7px;
`;

export const HistoryScreen = () => {
  const user = useUser();
  const clients = getAllClients();
  let ids: string[] = useKeysByQueryLogs('all');

  const [{value, loading, error}, getLogs] = useAsyncFn(async (start, end) => {
    const _log = await handleSetLogs(user, start, end, ids);
    return _log;
  }, []);

  useEffect(() => {
    if (clients && clients.length) {
      let start = moment(new Date()).startOf('month').valueOf() / 1000;
      let end = moment(new Date()).endOf('month').valueOf() / 1000;
      getLogs(start, end).then(r => {});
    }
  }, []);

  const pressLeft = useCallback(async (subtractMonth, date) => {
    const id = moment(new Date(date.getFullYear(), date.getMonth() - 1, 1))
      .format('MM-YYYY')
      .toString();
    const end =
      moment(new Date(date.getFullYear(), date.getMonth() - 1, 1))
        .endOf('month')
        .valueOf() / 1000;
    if (!ids.includes(id) || end > new Date().getTime() / 1000) {
      ids = [...ids, ...[id]];
      const start =
        moment(new Date(date.getFullYear(), date.getMonth() - 1, 1))
          .startOf('month')
          .valueOf() / 1000;

      await getLogs(start, end).then(r => {});
    }
    subtractMonth();
  }, []);

  const pressRight = useCallback(async (addMonth, date) => {
    const id = moment(new Date(date.getFullYear(), date.getMonth() + 1, 1))
      .format('MM-YYYY')
      .toString();
    const end =
      moment(new Date(date.getFullYear(), date.getMonth() + 1, 1))
        .endOf('month')
        .valueOf() / 1000;
    if (!ids.includes(id) || end > new Date().getTime() / 1000) {
      ids = [...ids, ...[id]];
      const start =
        moment(new Date(date.getFullYear(), date.getMonth() + 1, 1))
          .startOf('month')
          .valueOf() / 1000;

      await getLogs(start, end).then(r => {});
    }
    addMonth();
  }, []);

  return (
    <Container>
      <AnimatedColorView
        style={{
          height: 8,
          width: '100%',
        }}
        activeIndex={loading ? 1 : 0}
        colors={[Color.gray6, Color.green]}
        duration={1500}
        loop={loading}
      />
      <CalendarView
        pressLeft={pressLeft}
        pressRight={pressRight}
        // setkey={setKey}
        // _key={_key}
      />
    </Container>
  );
};

LocaleConfig.locales['vn'] = {
  monthNames: [
    'Th??ng M???t',
    'Th??ng Hai',
    'Th??ng Ba',
    'Th??ng T??',
    'Th??ng N??m',
    'Th??ng 6',
    'Th??ng B???y',
    'Th??ng T??m',
    'Th??ng Ch??n',
    'Th??ng M?????i',
    'Th??ng M?????i M???t',
    'Th??ng M?????i Hai',
  ],
  monthNamesShort: [
    'Th??ng 1',
    'Th??ng 2',
    'Th??ng 3',
    'Th??ng 4',
    'Th??ng 5',
    'Th??ng 6',
    'Th??ng 7',
    'Th??ng 8',
    'Th??ng 9',
    'Th??ng 10',
    'Th??ng 11',
    'Th??ng 12',
  ],
  dayNames: [
    'Th??? Hai',
    'Th??? Ba',
    'Th??? T??',
    'Th??? N??m',
    'Th??? S??u',
    'Th??? B???y',
    'Ch??? Nh???t',
  ],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'H??m nay',
};
LocaleConfig.defaultLocale = 'vn';
