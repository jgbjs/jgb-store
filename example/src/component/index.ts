import { JComponent } from 'jgb-weapp';
import { store } from '../store/index';

JComponent({
  $store: store,
  $useAll: true,
  data: {},
  attached() {
    console.log(this.data);
  },
  methods:{
    onTap() {
      store.data.storeData = 'component'
      this.$update()
    }
  }
});
