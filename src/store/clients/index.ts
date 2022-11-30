import {createDynamicReducer} from '../../utils/createDynamicReducer';
import {RawClients} from '../../utils/type';
import {batch} from 'react-redux';

const {setStore, reducer, useByKey, setQueries, useKeysByQuery, sync, reset} =
  createDynamicReducer<RawClients>('clients', 'id');

export const clientsSetStore = setStore;
export const clientsReducer = reducer;
export const setQueriesClients = setQueries;
export const useClientByKey = useByKey;
export const useKeysByQueryClient = useKeysByQuery;
export const syncClients = sync;
export const resetClients = reset;

export const syncAllClients = (clients: RawClients[]) => {
  let query: {[id: string]: string[]} = {};
  let ids: string[] = [];
  console.log('syncAllClients');
  console.log(clients);

  clients.forEach(client => {
    ids.push(client['id'].toString());
  });

  console.log(ids);

  batch(() => {
    syncClients(clients);
    setQueriesClients({
      all: ids,
      ...query,
    });
  });
};

export const getAllClients = () => {
  const ids = useKeysByQueryClient('all');
  let clients: RawClients[] = [];
  ids.forEach(item => {
    const _client = useClientByKey(item);
    clients.push(_client);
  });

  return clients;
};
