import {createDynamicReducer} from '../../utils/createDynamicReducer';
import {RawClients, RawLogs} from '../../utils/type';
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

export const syncAllLogs = (logs: RawClients[]) => {
  let query: {[id: string]: string[]} = {};
  let ids: string[] = [];

  logs.forEach(log => {
    ids.push(log['id'].toString());
  });

  batch(() => {
    syncLogs(logs);
    setQueriesLogs({
      all: ids,
      ...query,
    });
  });
};
