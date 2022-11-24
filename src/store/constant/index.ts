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
      if (action.payload) {
        return {
          ...action.payload,
        };
      }
      return null;
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
  console.log(data);
  return _getStore().dispatch(actions.setUser(data));
};

export const resetUser = () => {
  return _getStore().dispatch(actions.reset());
};

export const useUser = () => {
  return useSelector(state => state['constant'].user) || {};
};

export const constantReducer = combineReducers({
  user: reducer,
});
