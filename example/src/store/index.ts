import { createStore } from 'jgb-store';

const data = {
  storeData: 'store'
};

export const store = createStore({
  data,
  updateStore() {
    this.$update();
  }
});
