import {createSlice, PayloadAction, Store} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {useSelector} from 'react-redux';
import {RawUser} from '../../utils/type';

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
    setIdClient: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        atIdClient: action.payload,
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

export const setAtIdClient = (data: any) => {
  return _getStore().dispatch(actions.setIdClient(data));
};

export const resetUser = () => {
  return _getStore().dispatch(actions.reset());
};

export const useUser = () => {
  return useSelector(state => state['constant'].user) || {};
};

export const useAtIdClient = () => {
  return useSelector(state => state['constant'].user?.atIdClient) || null;
};

export const constantReducer = combineReducers({
  user: reducer,
});
