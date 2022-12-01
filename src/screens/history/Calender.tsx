import {Color} from '../../themes/Color';
import {IC_NEXT, IC_PREVIOUS} from '../../assets';
import {DayForm} from './DayForm';
import {Calendar} from 'react-native-calendars';
import {useAtIdClient} from '../../store/constant';
import styled from 'styled-components';
import {useCallback, useState} from 'react';
import {Header} from './Header';
import {useClientByKey} from '../../store/clients';
import {useLogsByKey} from '../../store/logs';

interface props {
  pressLeft: any;
  pressRight: any;
  // setkey: any;
  // _key: any;
}
export const CalendarView = ({pressLeft, pressRight}: props) => {
  const [_key, setkey] = useState<string>();
  const _log = useLogsByKey(_key);
  const id = useAtIdClient();
  const nameOffice = useClientByKey(id).name;

  const dateDay = useCallback(date => {
    return (
      `${date.day}`.padStart(2, '0') + '/' + `${date.month}`.padStart(2, '0')
    );
  }, []);

  return (
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
      renderHeader={date => <Header date={date} setkey={setkey} />}
      renderArrow={direction =>
        direction === 'left' ? (
          <IconArrow source={IC_PREVIOUS} />
        ) : (
          <IconArrow source={IC_NEXT} />
        )
      }
      onPressArrowLeft={(subtractMonth, month) =>
        pressLeft(subtractMonth, month)
      }
      onPressArrowRight={(addMonth, month) => pressRight(addMonth, month)}
      dayComponent={({date, state}) => (
        <DayForm
          day={date}
          date={dateDay(date)}
          state={state}
          log={_log[dateDay(date)]}
          nameOffice={nameOffice}
        />
      )}
    />
  );
};

const IconArrow = styled.Image`
  width: 24px;
  height: 24px;
`;
