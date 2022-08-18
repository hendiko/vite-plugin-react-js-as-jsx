> 本项目 fork 自 [dravenww/vite-plugin-react-js-support](https://github.com/dravenww/vite-plugin-react-js-support)

# vite-plugin-react-js-as-jsx

vite 对 jsx 语法只认 tsx 和 jsx 后缀的文件，可是项目中有很多 js 类型的文件也是 jsx；

# API

```js
import vitePluginReactJsAsJsx from "vite-plugin-react-js-as-jsx";

const plugin = vitePluginReactJsAsJsx(babelPlugins, options);
```

- babelPlguins:`Array` Babel 的插件列表。
- options
  - jsxInject: `Boolean` 是否注入 "import React from 'react'", 默认为 `true`。
  - rule: `Regexp|Function|String` 探测文件是否需要本插件进行处理。
  - include: `Array<rule>` 需要包含在内的规则数组。
  - exclude: `Array<rule>` 需要排除在外的规则数组。
  - ignoreNodeModules: `Boolean` 是否排除 `node_modules` 目录。默认为 `true`。

在某些情况下，你可能需要处理从第三方导入的 '.js'，可以在 'include' 中添加规则，'include' 规则高于 'exclude'。

示例：

```js
import vitePlugin from "vite-plugin-react-js-as-jsx";
export default {
  plugins: [
    vitePlugin([], {
      jsxInject: true,
      include: ["node_module/some-third-party-lib"], // 表示some-third-party-lib 这个包下的代码需要本插件处理
    }),
  ],
};
```

# 安装

```

npm install --save-dev vite-plugin-react-js-as-jsx
or
yarn add vite-plugin-react-js-as-jsx


```

# 使用

```
import vitePlugin from 'vite-plugin-react-js-as-jsx';
export default {
    plugins: [
        vitePlugin([], { jsxInject: true }),
    ]
}

```

# 备注

```
// 对于vite预构建会报错的问题，需要把配置改下
export default ({command, mode}) => {
  const rollupOptions = {};
  if(command === 'serve') {
    rollupOptions.input = []
  }
  return {
    build: {
      rollupOptions: rollupOptions
    },
    optimizeDeps: {
      entries: false,
    },
  }
}
```

# 参数

```
// 之所以支持这个配置，是因为cra4版本以后在子文件中不会引入react；
// 如果你的子文件已经引入了react，可以把这项设置为false;
// 而且vite本身的jsxInject只对x(jsx|tsx)结尾的文件类型提供支持;
// 默认会根据react大于等于17的版本，自动注入
jsxInject: true, // 是否为js文件注入 import React from 'react';默认为true
```

还支持传入其他 babel 的 plugin，数组类型。
