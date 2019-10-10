import { JPage, jgb } from 'jgb-weapp';
import { store } from '../../store';

JPage({
  $useAll: true,
  $store: store,
  data: {
    index: 0
  },
  onLoad() {
    console.log(this.data);
  },
  onTap() {
    this.$store.data.storeData = 'page';
    this.$update();
  },
  toSamePage() {
    jgb.navigateTo({
      url: `/pages/index/index?id=${Math.random()}`
    });
  }
});
