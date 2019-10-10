import { stateDiff } from '../src/diff';

describe('diff', () => {
  it('object add', () => {
    const state = { data: 1 };
    const preState = {};
    const newState = {};
    stateDiff(state, preState, '', newState);
    expect(newState).toEqual(state);
  });

  it('object update', () => {
    const state = { data: 1 };
    const preState = { data: 2 };
    const newState = {};
    stateDiff(state, preState, '', newState);
    expect(newState).toEqual(state);
  });

  it('object remove', () => {
    const state = {};
    const preState = { data: 2 };
    const newState = {};
    stateDiff(state, preState, '', newState);
    expect(newState).toEqual(state);
  });

  it('array add', () => {
    const state = [{ data: 2 }, { data: 2 }];
    const preState = [{ data: 2 }];
    const newState = {};
    stateDiff(state, preState, '', newState);
    expect(newState).toEqual({ '[1]': { data: 2 } });
  });

  it('array update', () => {
    const state = [{ data: 3 }];
    const preState = [{ data: 2 }];
    const newState = {};
    stateDiff(state, preState, '', newState);
    expect(newState).toEqual({ '[0].data': 3 });
  });

  it('array remove', () => {
    const state = [];
    const preState = [{ data: 2 }];
    const newState = {};
    stateDiff(state, preState, '', newState);
    expect(newState).toEqual({});
  });
});
