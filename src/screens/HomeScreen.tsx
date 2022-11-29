import styled from 'styled-components';
import {Color} from '../themes/Color';
import {IC_APP} from '../assets';
import {
  navigateToLoginScreen,
  replaceWithMainScreen,
} from '../utils/navigation';
import {useUser} from '../store/constant';
import {useEffect} from 'react';
import {handleGetClients} from '../utils/func';
import {useAsyncFn} from '../hooks/useAsyncFn';

const Container = styled.View`
  flex: 1;
`;

const SectionLogo = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 39px;
`;

const SectionTitle = styled.View`
  flex: 1;
  align-items: center;
`;

const SectionLogin = styled.View`
  flex: 1;
  align-items: center;
  padding-left: 37px;
  padding-right: 37px;
`;

const LogoApp = styled.Image`
  width: 97px;
  height: 117px;
`;

const Title = styled.Text`
  color: ${Color.background_color};
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.12px;
`;

const SubTitle = styled.Text`
  color: ${Color.gray1};
  font-size: 15px;
  font-weight: 400;
  text-align: center;
  margin-top: 7px;
`;

const BtnLoginHandle = styled.TouchableOpacity`
  height: 48px;
  width: 100%;
  border-width: 1px;
  border-radius: 100px;
  border-color: ${Color.background_color};
  justify-content: center;
  align-items: center;
  margin-top: 29px;
`;

const TextNotLogin = styled(SubTitle)`
  color: ${Color.gray3};
`;

const TextLogin = styled.Text`
  font-weight: 400;
  font-size: 15px;
  text-transform: uppercase;
  color: ${Color.background_color};
`;

const Loading = styled.ActivityIndicator`
  color: ${Color.background_color};
  margin-top: 50px;
`;

export const HomeScreen = () => {
  const isLogin = useUser().isLogin || false;
  const user = useUser();

  const [{value, loading, error}, onGetClients] = useAsyncFn(async () => {
    const data = await handleGetClients(user);
    return data;
  }, []);

  useEffect(() => {
    if (isLogin) {
      onGetClients().then(r => {});

      setTimeout(() => replaceWithMainScreen(), 1000);
    }
  }, [isLogin]);

  return (
    <Container>
      <SectionLogo>
        <LogoApp source={IC_APP} />
      </SectionLogo>

      <SectionTitle>
        <Title>Base Me</Title>
        <SubTitle>{`Giải pháp quản lý thông tin nhân sự\ncho doanh nghiệp 4.0`}</SubTitle>
        {loading ? <Loading /> : null}
      </SectionTitle>

      {!isLogin ? (
        <SectionLogin>
          <TextNotLogin>Bạn chưa đăng nhập</TextNotLogin>
          <BtnLoginHandle onPress={navigateToLoginScreen}>
            <TextLogin>Đăng nhập thủ công</TextLogin>
          </BtnLoginHandle>
        </SectionLogin>
      ) : (
        <SectionLogin></SectionLogin>
      )}
    </Container>
  );
};
