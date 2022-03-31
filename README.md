# EnglishFlow

## 解决什么问题

1. 我需要经常 StackOverflow, 英文文章, 英文文档, 但其中有不少英语单词我不知道什么意思
2. 英文社区也有很多有趣的东西(比如 reddit.ProgrammerHumor)
3. 我希望能逐渐提升自己的英语水平

但是

1. 我经常忘记英语单词的意思
2. 当前各种查单词的应用/网页对于我来说都有些繁琐, 心智负担较大
3. 全文翻译, 需要频繁对比中文段落与英文段落, 心智负担较大
4. 下述应用不能完全满足需求
   - Google Translate
   - DeepL
   - Youdao
   - Google Search: 'define FooBar'
   - Google Search: 'pronounce FooBar'

所以我希望有一种功能:

1. 不破坏当前英文的上下文
2. 快速获取中文释义

所以我写了这个叫做 EnglishFlow (以下简称 EF)的脚本

## 功能展示

![wikipedia](./screenshots/q.gif)

## 使用流程

### 前置条件

- 需要在电脑上安装 node/npm/yarn
- 需要编辑器, 推荐 vscode
- 一丁点儿 yaml 书写能力
- 在浏览器中安装 tampermonkey 插件(extension)

### 在 tampermonkey 中添加脚本

clone/download 本项目至桌面

修改 `entry/Windows.js` 中的内容, 将 `🚧YOUR_NAME🚧` 替换为你自己的用户名

使用 tampermonkey 的 [@require](https://www.tampermonkey.net/documentation.php#_require) tag, 以方便开发

### 开启项目

1. `yarn`
   - 添加依赖
2. `yarn tsc -w`
   - 编译 index.ts / server.ts 至 dist 中
3. `yarn start`
   - w-dict: 监听 dictionary.yaml, 编译为 json
   - w-profile: 监听 profile.yaml, 编译为 json
   - w-style: 监听 style.less, 编译为 css
   - serve: 开启 node.js 服务器, 作为运行在 tampermonkey 中 EF 的数据源
     - EF 当前使用轮询的方式和服务器交互

### 添加英文网页标识

在 `profile.yaml` 中添加需要运行 ef 的网页

在 old.contain 中添加目标网址包含的字符串就行了, 注意 `,` 号. 当然会有重复网址和冲突网址的问题, 还没实现

我已经在其中添加了很多网址了

- contain: 当前网页的 url 如果包含 contain 中的字符串, 则使用该 profile
- rootSelector: 从那些节点开始遍历
- style: 独特的样式
- strategies: 脚本执行策略
- notMatchClassName: 不匹配哪些 className

### 阅读英文网页

数据来源

### 查询单词

- `shift+f`, 根据选中的关键字(短语/句子)快捷打开如下网页
  - 有道词典
  - Google Translate
    - 词频信息对我来说比较重要
- EF 这时会同时查询 google translate 的发音

### 添加单词/助记标识/伪词根

- 打开 `dictionary.yaml`, 添加单词, 我选择使用 `|` 来分隔同一个单词(伪单词/伪词根)的释义
- 我已经在其中添加了很多单词了
  - 我个人会尽量合并相同词根的单词
    - NotFull 表示不匹配和该 key 完全相同的单词
      - 比如 `foo` 匹配 foobar, 而不必配 foo
    - FullMatch 表示仅仅匹配和该 key 完全相同的单词
      - 比如 `foo` 匹配 foo, 而不必配 foobar

### 回到网页

- 你会发现你刚才添加的标识已经同步到网页上了

### 词典当然应该根据首字母

我会同时编译一份根据 keyword 重新排序的 yaml 至 dist 中, 手动 copy 至 src/dictionary.yaml 即可

## 自行开发

### 核心逻辑

开启网页后, EF 会以 profile.yaml 中配置的 `rootSelector` 为根节点遍历 DOM 中的 `Text`. 如果发现 `Text` 中的文本能匹配到 dictionary.yaml 中添加的 keyword, 则将其替换为名为 `eft` 的标签

通过监听 `eft` 标签的 `mouseenter` 事件, EF 会在网页上展示对应单词的翻译, 以此来达到助记/提醒的效果. 让我可以不脱离上下文获取英文单词的意思. 并且仅仅在有需要时"背"这个单词(伪词根)

EF 会以轮询的方式请求本地在 `localhost:8000` 开启的 node.js server, 当 dictionary.yaml 变更时, EF 会刷新整个页面

### 网页端主要功能

src/index.ts

### 样式

style.less

## 当前项目中出出现的一些问题

- 添加 eft / efti 在部分页面会导致样式错误, 但是我难以排查问题所在
  - Google Search
  - npm
- 播放声音的功能还不是太好

## Q&A

### 如果我不想一个一个添加单词怎么办?

我个人的选择是一个一个的添加, 当然也可以全量添加. 有需要的话可以将 ecdit 中的 csv 数据编译为 json ... 当然如果你已经这样做了的话, 相信你不一定愿意使用 EF 中现有的:

1. 以 json 格式存储数据
2. 每次更新数据都是获取完整的字典数据

### 用了这个脚本就能读懂英文了吗?

不能完全读懂每一句话. 以我当前的水平长难句还是要慢慢理解

### Chrome Extension Store 上有很多同样功能的插件, 你要和他们竞争吗?

我只需要满足自己的需要即可
