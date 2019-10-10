import { JComponent, JPage } from 'jgb-weapp';
import { create } from './create';

/**
 * 初始化store 注入
 */
export function init() {
  JComponent.intercept(obj => {
    if (obj.$store) {
      return create(obj, 'Component');
    }
    return obj;
  });

  JPage.intercept(obj => {
    if (obj.$store) {
      return create(obj, 'Page');
    }
    return obj;
  });
}
