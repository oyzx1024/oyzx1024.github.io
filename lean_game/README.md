# Lean Proof Alchemy

一个纯前端 HTML 游戏原型，用图形化模块拼搭讲解 Lean4 入门证明。

## 运行

直接打开 `index.html` 即可运行，不需要安装依赖，也不需要联网。

## 文件

- `index.html`：页面入口。
- `styles.css`：手机竖屏 UI、模块、动画。
- `levels.js`：18 个本地关卡数据。
- `app.js`：渲染、拖拽、类型匹配、合成、拆解、intro、回放和存档。

## 存档

进度保存在浏览器 `localStorage`：

```js
leanProofAlchemyProgress
```
