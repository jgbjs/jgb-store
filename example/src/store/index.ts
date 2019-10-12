import { createStore } from 'jgb-store';

const data = {
  storeData: 'store'
};

export const store = createStore({
  data,
  onChange(diff, ctx) {
    console.log('diff =>', ctx);
  },
  updateStore() {
    this.$update();
  }
});
