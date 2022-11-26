import {createSlice, PayloadAction, Store} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {useSelector} from 'react-redux';
interface RawUser {}
const initialState: RawUser | null = null;

const {actions, reducer} = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      return {
        ...action.payload,
      };
    },
    setClients: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        mobile_clients: {
          ...action.payload,
        },
      };
    },
    setToggleCheckin: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        toggleCheckin: action.payload,
      };
    },
    reset: () => {
      return {};
    },
  },
});

let _store: Store | undefined;

const _getStore = (): Store => {
  if (!_store) {
    throw new Error(
      'You need to run setStore right after init store to use this function',
    );
  }
  return _store;
};

export const constantSetStore = (store: Store) => {
  _store = store;
};

export const setUserAction = (data: RawUser | null) => {
  return _getStore().dispatch(actions.setUser(data));
};

export const setClientsAction = (data: any) => {
  return _getStore().dispatch(actions.setClients(data));
};

export const setToggleCheckin = (data: any) => {
  return _getStore().dispatch(actions.setToggleCheckin(data));
};

export const resetUser = () => {
  return _getStore().dispatch(actions.reset());
};

export const useUser = () => {
  return useSelector(state => state['constant'].user) || {};
};

export const useToggleCheckIn = () => {
  return useSelector(state => state['constant'].user?.toggleCheckin) || false;
};

export const useClients = () => {
  return useSelector(state => state['constant'].user?.mobile_clients) || {};
};

export const constantReducer = combineReducers({
  user: reducer,
});
