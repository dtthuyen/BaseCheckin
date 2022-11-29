import { memo, useMemo } from "react";
// @ts-ignore
import moment from "moment/moment";
import { Color } from "../../themes/Color";
import styled from "styled-components";

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
}

export const Header = memo(({date}: propsHeader) => {
  const day = 'Ngày ' + moment(date).format('DD/MM/YYYY').toString();
  const CurrentDay = useMemo(() => {
    return <TextDayHeader>{day}</TextDayHeader>;
  }, [day]);

  return (
    <ViewDayHeader>
      {CurrentDay}
      <SubTextHeader>(Danh sách lịch sử chấm công)</SubTextHeader>
    </ViewDayHeader>
  );
});
