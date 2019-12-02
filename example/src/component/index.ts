import { JComponent } from 'jgb-weapp';
import { store } from '../store/index';

JComponent({
  $store: store,
  $useAll: true,
  data: {
    ori: 'ori',
  },
  properties: {
    propValue: {
      type: String,
      value: '',
      observer(nv) {
        console.log('properties: propValue', nv);
      },
    },
  },
  attached() {
    console.log(this.data);
    this.$watchStoreChange(() => {
      console.log('component: watchStoreChange');
    });
    this.updateOri()
  },
  methods: {
    onTap() {
      store.data.storeData = 'component';
      store.updateStore();
      store.$update();
    },
    updateOri() {
      this.setData({
        ori: 'ori-new',
      });
    },
  },
});
