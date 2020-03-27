# Pkg Master <img src="https://img.shields.io/badge/pkg--master-创建和发布模块的管理工具-66f.svg">

[![author](https://img.shields.io/badge/author-JowayYoung-f66.svg)](https://github.com/JowayYoung/pkg-master)
[![version](https://img.shields.io/badge/version-0.0.4-f66.svg)](https://github.com/JowayYoung/pkg-master)
[![node](https://img.shields.io/badge/node-%3E%3D%208.0.0-3c9.svg)](https://github.com/JowayYoung/pkg-master)
[![npm](https://img.shields.io/badge/npm-%3E%3D%205.0.0-3c9.svg)](https://github.com/JowayYoung/pkg-master)
[![test](https://img.shields.io/badge/test-passing-f90.svg)](https://github.com/JowayYoung/bruce-cli)
[![build](https://img.shields.io/badge/build-passing-f90.svg)](https://github.com/JowayYoung/bruce-cli)
[![coverage](https://img.shields.io/badge/coverage-100%25-09f.svg)](https://github.com/JowayYoung/bruce-cli)
[![license](https://img.shields.io/badge/license-MIT-09f.svg)](https://github.com/JowayYoung/bruce-cli)

> `pkg-master`是一个用于创建`npm`模块基础文件且可将模块发布到`npm`的命令行工具

### 安装

`npm i -g pkg-master`

> 安装失败

- 将npm源镜像设置为淘宝镜像：`npm config set registry https://registry.npm.taobao.org`
- 重新执行命令安装：`npm i -g pkg-master`

### 使用

命令|缩写|功能
:-:|:-:|-
`pkg-master create` | `pkg-master c` | 创建模块
`pkg-master publish` | `pkg-master p` | 发布模块

推荐使用缩写命令`pkg-master c`创建模块和`pkg-master p`发布模块

> 步骤

- `pkg-master c`创建模块，提供一系列问题让你自定义模块的基本文件
- `cd yourModuleName`进入创建完成的模块，开发你的模块功能
- `pkg-master p`发布模块，如果执行步骤出错，请根据提示修复并重新执行`pkg master p`

![发布模块](https://yangzw.vip/static/article/pkg-master/pkg-master.gif)

### 版权

MIT © [Joway Young](https://github.com/JowayYoung)

### 后记

如果觉得`pkg-master`对你的项目开发流程有帮助，可在[Issue](https://github.com/JowayYoung/pkg-master/issues)上`提出你的宝贵建议`，笔者会认真阅读并整合你的建议。喜欢的可以给`pkg-master`一个[Start](https://github.com/JowayYoung/pkg-master)，或者[Fork](https://github.com/JowayYoung/pkg-master)本项目到自己的`Github`上，根据自身需求进行定制功能。

**关注公众号`IQ前端`，一个专注于CSS/JS开发技巧的前端公众号，更多前端小干货等着你喔**

![](https://yangzw.vip/static/frontend/account/IQ前端公众号.jpg)