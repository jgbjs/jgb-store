import { IAnyObject } from 'jgb-weapp/types/JPage';

export const TYPE_ARRAY = '[object Array]';
export const TYPE_OBJECT = '[object Object]';

export function getType(obj: any) {
  return Object.prototype.toString.call(obj);
}

export function addDiffState(newState: IAnyObject, key: string, val: any) {
  key !== '' && (newState[key] = val);
}

export function stateDiff(
  state: any,
  preState: any,
  path: string,
  newState: IAnyObject
) {
  if (state === preState) return;
  const stateType = getType(state);
  const preStateType = getType(preState);
  if (stateType === TYPE_OBJECT) {
    const stateKeys = Object.keys(state);
    const preStateKeys = Object.keys(preState || {});
    const stateLen = stateKeys.length;
    const preStateLen = preStateKeys.length;
    if (path !== '') {
      if (
        preStateType !== TYPE_OBJECT ||
        stateLen < preStateLen ||
        stateLen === 0 ||
        preStateLen === 0
      ) {
        addDiffState(newState, path, state);
        return;
      }
      preStateKeys.forEach(key => {
        state[key] === undefined && (state[key] = null); // 已删除的属性设置为null
      });
    }
    stateKeys.forEach(key => {
      const subPath = path === '' ? key : path + '.' + key;
      stateDiff(state[key], preState[key], subPath, newState);
    });
    return;
  }
  if (stateType === TYPE_ARRAY) {
    if (
      preStateType !== TYPE_ARRAY ||
      state.length < preState.length ||
      state.length === 0 ||
      preState.length === 0
    ) {
      addDiffState(newState, path, state);
      return;
    }
    (preState as any[]).forEach((item, index) => {
      state[index] === undefined && (state[index] = null); // 已删除的属性设置为null
    });
    (state as any[]).forEach((item, index) =>
      stateDiff(item, preState[index], path + '[' + index + ']', newState)
    );
    return;
  }
  addDiffState(newState, path, state);
}