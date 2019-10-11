import { createStore } from 'jgb-store';

const data = {
  storeData: 'store'
};

export const store = createStore({
  data,
  updateStore() {
    console.log(this.data);
    this.$update();
  }
});
