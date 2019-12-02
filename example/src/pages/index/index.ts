import { JPage, jgb } from 'jgb-weapp';
import { store } from '../../store';

JPage({
  $useAll: true,
  $store: store,
  data: {
    index: 0,
  },
  computed: {
    watchStoreData(): string {
      // @ts-ignore
      return this.data.storeData + '1';
    },
  },
  onLoad() {
    console.log(this.data);
    this.$watchStoreChange((diff: any) => {
      console.log('diff', diff);
    });
  },
  onTap() {
    this.$store.data.storeData = 'page';
    this.$update();
  },
  toSamePage() {
    jgb.navigateTo({
      url: `/pages/index/index?id=${Math.random()}`,
    });
  },
});
