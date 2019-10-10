import { IStore } from 'jgb-store';

const data = {
  storeData: 'store'
};

export const store: IStore<typeof data> = {
  data: data
};
