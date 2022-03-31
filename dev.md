# TODO

- 监听 mouseover 事件
  - 在 webpage 添加 element, 而非在每个单词添加 element
    - 增加性能
    - 减少 overflow 的影响
  - audio synthesis
  - 避免拷贝文本时格式的改变
  - 可以做更深入的操作
    - add sentences
    - synthesis
- [Observe DOM Change](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- 添加短语这个类别
- 不仅仅进行前序匹配
- Refresh dictionary recurrently, thereby rerender DOM
  - 🚧 GM_getResource is static, can not observe file changes
    - 可以用 http server / websocket 来做, 工作量比较多
- Add scheme for `dictionary.yaml`
- 使用单一按键开启或关闭 EnglishFlow
- 全量匹配
- 不在网页中添加 efth 而是在 ef-panel 添加
- 通过 deep merge 设置网站规则

## eft > efti

- target: https://www.npmjs.com/package/indexeddb
- target: https://www.npmjs.com/package/lokijs

## 英语学习

- 是不是应该写个 english words stardard modal?:

```yaml
e: 'v'
ence: 'n'
itive: '能力'
logy: 学
logist: 学家
# ...
```

- 很多偏旁部首都起源于拉丁文

## Wikipedia

通过 wikipedia 获取知识很差吗?

https://www.zhihu.com/question/20299997/answer/14671882

## 我的"存在主义"

- 为什么没几个人用有道词典的划词取词功能?
- 为什么没有道词典的划词取词功能做的这么烂?
