import { JApp } from 'jgb-weapp';
import { init } from 'jgb-store';

init();

JApp({
  data: {},
  onLaunch() {
    console.log('test $appOptions', this.$appOptions);
  },
  cust() {
    console.log(this.data);
  }
});
