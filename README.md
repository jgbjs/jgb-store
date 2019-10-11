

# jgb-store

jgb数据流插件。用于多页面、多组件数据同步更新。

## 使用

### 初始化

需要在`app.js`一开始初始化

```ts
// app.js
import { init } from 'jgb-store';

init();
```

### 定义store

```ts
// store.ts
import { createStore } from 'jgb-store';

export const store =  createStore({
  data: {
    testStore: 1
  }
});
```

### 页面使用store

```ts
// pages/index.ts
import { store } from '../store';
import { JPage } from 'jgb-weapp';

JPage({
  /** 全局使用  */
  $useAll: true,
  $store: store,
  onChange() {
    // 改变数据
    this.$store.data.testStore++;
    // 更新数据
    this.$update();
    // 也可以在store中调用$update
    //	store.$update();
  }
});
```



### 扩展参数说明

#### Page or Component

* `$useAll`

判断是否全部使用`store.data`及 `app.globalStore.data`

**默认只有在`data`中定义的同名数据才会赋值**

* `$store`

使用定义的`store`数据



#### App

* globalStore

全局`store`, 当时用`$useAll`时会更新此数据

### 扩展属性说明

* `$store` - `InnerStore`

对`$store`参数的实例化

* `$update`

更新`store`数据变化，使用`diff`更新

## 感谢

[westore](https://github.com/Tencent/westore)