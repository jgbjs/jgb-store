/// <reference path="../types/extension.d.ts" />

import { JComponent, JPage } from 'jgb-weapp';
import { create } from './create';
import { stateDiff as diff } from './diff';
import { createStore } from './store';

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

export { diff, createStore };
