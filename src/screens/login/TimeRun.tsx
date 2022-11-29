import { memo, useEffect, useMemo, useState } from "react";
import { Color } from "../../themes/Color";
import styled from "styled-components";
// @ts-ignore
import moment from "moment/moment";
import { View } from "react-native";

const TextTime = styled.Text`
  margin-top: 12px;
  color: ${Color.background_color};
  font-size: 40px;
  font-weight: 500;
`;

export const TimeRun = () => {
  const [time, setTime] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setTime(moment(date).format('HH:mm:ss').toString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const Time = useMemo(() => <TextTime>{time}</TextTime>, [time])

  return (
    <View>
      {Time}
    </View>

  )
};
