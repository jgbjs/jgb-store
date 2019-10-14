import { IStore, IStoreUpdate } from '../types/extension';
import { IAnyObject } from 'jgb-weapp/types/JPage';
import { utils, JComponent } from 'jgb-weapp';
import {
  InnerStore,
  getGlobalStore,
  getPage,
  deepCopy,
  getAllData
} from './store';

const hook = utils.hook;
const page = Symbol('page');

export interface IPageExtenstion {
  $store: InnerStore;
  $update: IStoreUpdate;
  setData: JComponent['setData'];
  globalStore: IAnyObject;
  route: string;
}

export function create(
  opts: IAnyObject,
  type: 'Page' | 'Component'
): IAnyObject {
  const $store: IStore = opts.$store;
  const store = new InnerStore($store);
  const globalStore = getGlobalStore();
  const storeUpdate = store.update.bind(store);

  opts.data = opts.data || {};

  if (typeof $store.$update !== 'function') {
    $store.$update = storeUpdate;
  }

  if (type === 'Page') {
    hook(opts, 'onLoad', function(this: IPageExtenstion) {
      defineReadOnly(this, '$store', store);
      defineReadOnly(this, '$update', storeUpdate);
      defineReadOnly(this, '$useAll', !!opts.$useAll);
      defineReadOnly(this, '$watchStoreChange', function(this: any, cb: any) {
        store.onChange(cb, this);
      });

      store.addInstance(this);
      globalStore.update = this.$update;
      this.globalStore = globalStore;
      getInitState($store.data, opts.data, opts.$useAll);
      this.setData(opts.data);
    });

    hook(opts, 'onShow', function(this: IPageExtenstion) {
      globalStore.update = this.$update;
      store.update();
    });

    hook(opts, 'onUnload', function(this: IPageExtenstion) {
      store.removeInstance(this);
    });
  }

  if (type === 'Component') {
    hook(opts, 'created', function(this: IPageExtenstion) {
      defineReadOnly(this, '$store', store);
      defineReadOnly(this, '$update', storeUpdate);
      defineReadOnly(this, '$useAll', !!opts.$useAll);
      defineReadOnly(this, '$watchStoreChange', function(this: any, cb: any) {
        store.onChange(cb, this);
      });
    });
    // Component.attached ->  Page.onLoad -> Component.ready
    // 获取当前页面路径要在ready注册
    hook(opts, 'ready', function(this: IPageExtenstion) {
      const curPage: IPageExtenstion = getPage() as any;
      // @ts-ignore
      this[page] = curPage;
      this.globalStore = curPage.globalStore;
      this.route = curPage.route;
      store.addInstance(this);
      getInitState($store.data, opts.data, opts.$useAll);
      this.setData(opts.data);
    });

    hook(opts, 'detached', function(this: IPageExtenstion) {
      store.removeInstance(this);
    });
  }

  delete opts.$store;

  return opts;
}

function getInitState(from: IAnyObject, to: IAnyObject, useAll: boolean) {
  const fromObj = getAllData(from);
  if (useAll) {
    Object.assign(to, deepCopy(fromObj));
  } else {
    Object.keys(to).forEach(
      key => fromObj.hasOwnProperty(key) && (to[key] = deepCopy(fromObj[key]))
    );
  }
}

function defineReadOnly(ctx: any, name: string, value: any) {
  Object.defineProperty(ctx, name, {
    get() {
      return value;
    }
  });
}
