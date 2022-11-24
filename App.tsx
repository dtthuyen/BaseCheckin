import {StatusBar} from 'react-native';

import Routes from './src/Routes';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {persistor, store} from './src/store';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <StatusBar
          translucent={true}
          barStyle={'dark-content'}
          backgroundColor={'transparent'}
        />
        <Routes />
      </PersistGate>
    </Provider>
  );
};

export default App;
