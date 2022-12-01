import {applyMiddleware, combineReducers, createStore} from 'redux';
// @ts-ignore
import {persistStore, persistReducer} from 'redux-persist';
// @ts-ignore
import AsyncStorage from '@react-native-async-storage/async-storage';
import {composeWithDevTools} from 'redux-devtools-extension';
import {constantReducer, constantSetStore} from './constant';
import {clientsReducer, clientsSetStore} from './clients';
import {logsReducer, logsSetStore} from './logs';

const middlewares: any[] = [];

const enhancer = composeWithDevTools(applyMiddleware(...middlewares));

const appReducer = combineReducers({
  constant: constantReducer,
  clients: clientsReducer,
  logs: logsReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['constant', 'clients', 'logs'],
};

const pReducer = persistReducer(persistConfig, appReducer);

export const store = createStore(pReducer, enhancer);
export const persistor = persistStore(store);

constantSetStore(store);
clientsSetStore(store);
logsSetStore(store);
