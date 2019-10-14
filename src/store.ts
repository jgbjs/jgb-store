import { IAnyObject } from 'jgb-weapp/types/JPage';
import { IPageExtenstion } from './create';
import { stateDiff, TYPE_OBJECT, TYPE_ARRAY, getType } from './diff';
const innerInstances = new Map();

type DataOption = Record<string, any>;
type CustomOption = Record<string, any>;

interface IStoreExt {
  $update: InnerStore['update'];
}

type Instance<
  TData extends DataOption,
  TCustom extends CustomOption
> = TCustom & Data<TData> & IStoreExt;

interface Data<D extends DataOption> {
  /**
   *
   * `data`
   */
  data: D;
}

type Options<
  TData extends DataOption,
  TCustom extends CustomOption
> = (TCustom & Partial<Data<TData>>) & ThisType<Instance<TData, TCustom>>;

/**
 * store change callback
 */
type IDiffCallback = (diff: IAnyObject) => void;

/**
 * 创建store
 * */
export function createStore<
  TData extends DataOption,
  TCustom extends CustomOption
>(store: Options<TData, TCustom>): Options<TData, TCustom> & IStoreExt {
  return store as any;
}

export class InnerStore {
  data: IAnyObject;
  private cbs = [] as { cb: IDiffCallback; ctx: any }[];

  constructor(private $store: any) {
    this.data = $store.data || {};
    if (!innerInstances.has($store)) {
      innerInstances.set($store, {});
    }
  }

  /**
   * 更新store数据
   */
  update() {
    const promiseArr = [] as Promise<any>[];
    const route = getPage().route;
    // 获取当前页面所有关联的实例
    const vms: any[] = this.instances[route] || [];
    const storeData = getAllData(this.data);
    for (const vm of vms) {
      let obj: IAnyObject = {};
      if (vm.$useAll) {
        obj = storeData;
      } else {
        Object.keys(vm.data).forEach(
          key => storeData.hasOwnProperty(key) && (obj[key] = storeData[key])
        );
      }
      promiseArr.push(
        setState(vm, obj).then(diff => {
          if (!diff || Object.keys(diff).length === 0) return;
          const cbs = this.cbs.filter(({ ctx }) => ctx === vm);
          for (const { ctx, cb } of cbs) {
            cb.call(ctx, diff);
          }
        })
      );
    }
    return Promise.all(promiseArr);
  }

  get instances(): IAnyObject {
    return innerInstances.get(this.$store) || {};
  }

  /**
   * 绑定store change回调
   */
  onChange(cb: IDiffCallback, ctx: any) {
    if (typeof cb !== 'function')
      throw new Error(`onChange callback should be a Function`);

    this.cbs.push({ cb, ctx });
  }

  /**
   * 添加当前页面/组件实例
   */
  addInstance(ctx: IPageExtenstion) {
    const route = ctx.route;
    if (!Array.isArray(this.instances[route])) {
      this.instances[route] = [];
    }
    this.instances[route].unshift(ctx);
  }

  /**
   * 移除当前实例
   */
  removeInstance(ctx: IPageExtenstion) {
    this.instances[ctx.route] = this.instances[ctx.route].filter(
      (vm: any) => vm !== ctx
    );
  }
}

export function getGlobalStore(): IAnyObject {
  return getApp().globalStore || {};
}

const newState = Symbol();

/**
 * 设置数据
 */
function setState(vm: any, data: IAnyObject): Promise<IAnyObject> {
  vm[newState] = vm[newState] || {};
  Object.assign(vm[newState], data);
  return new Promise(resolve => {
    if (Object.keys(vm[newState]).length > 0) {
      const diffState = getDiffState(vm[newState], vm.data);
      vm[newState] = {};
      if (Object.keys(diffState).length > 0) {
        vm.setData(diffState, () => resolve(diffState));
        return;
      }
    }
    resolve({});
  });
}

/**
 * 比较数据
 */
function getDiffState(state: IAnyObject, preState: IAnyObject) {
  const newState: IAnyObject = {};
  stateDiff(deepCopy(state), preState, '', newState);
  return newState;
}

export function getPage() {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
}

/**
 * 获取store.data 及 globalStore.data
 */
export function getAllData(storeData: IAnyObject) {
  const globalStore = getApp().globalStore;
  if (globalStore && globalStore.data) {
    return Object.assign({ globalData: globalStore.data }, storeData);
  }
  return storeData;
}

export function deepCopy(data: any) {
  const type = getType(data);
  if (type === TYPE_OBJECT) {
    const obj: IAnyObject = {};
    Object.keys(data).forEach(key => (obj[key] = deepCopy(data[key])));
    return obj;
  }
  if (type === TYPE_ARRAY) {
    const arr: any[] = [];
    (data as any[]).forEach((item, index) => (arr[index] = deepCopy(item)));
    return arr;
  }
  return data;
}
