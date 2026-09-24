> home page of FunctionComplete (FCT) — Technical Component Kit · Gate-level Functions + State Containers

# FunctionComplete (FCT) 官网

链上计算与状态管理**技术组件套件**官网 —— **单页 Landing + 中英双语 + 纯静态**。

**定位**：FCT 不是一条链、不是一个代币、不是 L2。它是一套技术组件：门级函数（NAND + LATCH）承担计算，DSU 承担状态接口，容器 + CSC 承担状态，由 Ethercoin 团队构建。

**重要声明**：FCT 无任何代币、预售或空投。经济媒介统一为 ETHER。

## 目录结构

```
web/
├── index.html              单页站点（v1.2 定位：双原语 / 五类组件 / 容器 / 证明 / 经济 / 路线图）
├── css/style.css           电路图美学样式（含 v2 追加：status-pill / warn-banner）
├── js/main.js              双语切换 + 滚动入场 + 导航高亮（EN 词典 137 键，与 HTML 一一对应）
├── FCT-whitepaper-zh.md    《FunctionComplete 技术组件白皮书 v1.2》（下载用）
├── assets/                 （预留）
├── CNAME                   functioncomplete.com
├── .nojekyll               静态部署用，跳过 Jekyll 处理
└── README.md
```

## 本地预览

```bash
python3 -m http.server 8770
# 打开 http://127.0.0.1:8770/
```

## 内容来源

- 全部内容取自 `../FunctionComplete 技术组件白皮书 v1.2.md`（本仓库上游为 `Functioncomplete/v2/website/`）
- 双语方案同 v1：HTML 内联中文为初始渲染，JS 快照 + EN 词典覆盖（137 键已校验一一对应）
- 开发状态区块（容器章节）展示 v2 组件套件 M1 已部署 Sepolia 的合约地址

## 版本历史

- **v2（当前）**：白皮书 v1.2 定位 —— 技术组件套件 / 双原语（门级函数 + DSU）/ 五类组件 / 无代币（ETHER 结算）/ 反诈骗声明 / M1 容器 Sepolia 上线状态
- v1（已下线）：以太坊 L2 + $FCT 代币（210B 供应）定位，与 v1.2 白皮书冲突，由 v2 替换

> 上游同步：`rsync -av /home/jackliao/文档/Functioncomplete/v2/website/ /tmp/opencode/web/`（保留 CNAME/.nojekyll/.gitignore）