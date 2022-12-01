import {memo, useEffect, useMemo} from 'react';
// @ts-ignore
import moment from 'moment/moment';
import {Color} from '../../themes/Color';
import styled from 'styled-components';

const ViewDayHeader = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 64px;
`;

const TextDayHeader = styled.Text`
  font-size: 18px;
  color: ${Color.black2};
  font-weight: 500;
  line-height: 22px;
`;

const SubTextHeader = styled.Text`
  font-size: 13px;
  color: ${Color.gray3};
  line-height: 18px;
  margin-top: 4px;
`;

interface propsHeader {
  date: any;
  setkey: any;
}

export const Header = memo(({date, setkey}: propsHeader) => {
  const month = moment(new Date(date)).format('MM-YYYY').toString();
  const text = 'Tháng ' + month;

  useEffect(() => {
    setkey(month);
  }, [month]);

  const CurrentDay = useMemo(() => {
    return <TextDayHeader>{text}</TextDayHeader>;
  }, [text]);

  return (
    <ViewDayHeader>
      {CurrentDay}
      <SubTextHeader>(Danh sách lịch sử chấm công)</SubTextHeader>
    </ViewDayHeader>
  );
});
