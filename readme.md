# Pkg Master

**`pkg-master`是一个用于创建`npm`模块基础文件且可将模块发布到`npm`的命令行工具**

### 安装

> `npm i -g pkg-master`
> `yarn add global pkg-master`

### 使用

命令 | 缩写 | 描述
-- | -- | --
`pkg-master new` | `pkg-master n` | 创建模块
`pkg-master publish` | `pkg-master p` | 发布模块

- `pkg-master n`创建模块，提供一系列问题让你自定义模块的基本文件
- `cd yourModuleName`进入创建完成的模块，开发你的模块功能
- `pkg-master p`发布模块，如果执行步骤出错，请根据提示修复并执行`pkg master p`

### License

MIT © [Joway Young](https://github.com/JowayYoung)