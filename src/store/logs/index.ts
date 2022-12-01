import {createDynamicReducer} from '../../utils/createDynamicReducer';
import {RawLogs} from '../../utils/type';
import {batch} from 'react-redux';

const {setStore, reducer, sync, useByKey, setQueries, useKeysByQuery, reset} =
  createDynamicReducer<RawLogs>('logs', 'id');

export const logsSetStore = setStore;
export const logsReducer = reducer;
export const setQueriesLogs = setQueries;
export const useLogsByKey = useByKey;
export const useKeysByQueryLogs = useKeysByQuery;
export const syncLogs = sync;
export const resetLogs = reset;

export const syncAllLogs = (logs: RawLogs[], ids: string[]) => {
  console.log('syncAllLogs', logs, ids);

  let _id: string[] = [];
  logs.forEach(item => {
    if (!ids.includes(item.id)) _id.push(item.id);
  });

  console.log('syncAllLogs ids', [...ids, ..._id]);

  batch(() => {
    syncLogs(logs);
    setQueriesLogs({
      all: [...ids, ..._id],
    });
  });
};
