> home page of FunctionComplete: A Gate-Level On-Chain Function Based Ethereum Layer 2 Protocol!

# FunctionComplete 官网

门级链上函数的以太坊 L2 协议官网 —— **单页 Landing + 中英双语 + 纯静态**。

## 目录结构

```
website/
├── index.html              单页站点（结构 + 内联中文）
├── css/style.css           电路图美学样式
├── js/main.js              双语切换 + 滚动入场 + 导航高亮
├── FCT-whitepaper-zh.md    白皮书（中文，下载用）
├── FCT-whitepaper-en.md    白皮书（英文，下载用）
├── assets/                 （预留）
├── .nojekyll               静态部署用，跳过 Jekyll 处理
└── README.md
```

## 本地预览

```bash
cd website
python3 -m http.server 8770
# 打开 http://127.0.0.1:8770/
```

## 设计说明

### 电路图美学
呼应协议的「门级 NAND」身份，不模仿 ethereum.org / Optimism / zkSync 的既有风格：

| 元素 | 实现 |
|---|---|
| 深色底 + PCB 网格 | `body::before` 网格渐变 + 径向遮罩 |
| 青色信号线 | Hero 背景 SVG 虚线走线，`stroke-dashoffset` 动画模拟信号流动 |
| 逻辑门符号 | NAND 门 / LATCH 触发器内联 SVG；Logo 是 NAND + LATCH 组合 |
| 等宽字体 | 标签、数据、导航使用 `--mono` 字族 |
| 配色 | 青 `#22d3ee`（信号）· 绿 `#34d399`（通过）· 琥珀 `#fbbf24`（警示）· 紫 `#a78bfa`（ZK） |

### 双语方案
**HTML 内联中文为初始渲染**（利于 SEO 与无 JS 场景），JS 在初始化时**快照中文原文**，
英文由 `js/main.js` 的 `EN` 词典提供。切换时只做「快照恢复 / 词典覆盖」。

- 优点：中英文本**不重复维护**，不会漂移；无 JS 也能看到完整中文站
- 键数量：HTML 181 个 `data-i18n` ↔ 词典 181 个键（已校验一一对应）
- 切换会同步更新：`<html lang>`、`<title>`、`<meta description>`、白皮书下载链接
- 偏好持久化在 `localStorage['fct-lang']`

## 内容来源

全部内容取自 `../FCT 白皮书.md`（**v1.0 多链部署版**，635 行），未杜撰数据：

- 架构三层 + 多链拓扑、安全模型、三条证明路径 → §3 / §4
- TPS 5,000–15,000+、延迟 30–90ms、多链性能特征 → §5
- **$FCT 总量 210,000,000,000、分配（早期支持者 20%）、PoC/销毁/版税、多链手续费适配** → §7
- 创作者经济五类收入 + 飞轮 → §8
- L2 对比表（含多链安全行）→ §9
- **三步走多链部署**（以太坊 → Robinhood Chain → Solana → 多链自治）→ §10
- 风险控制：渐进式解耦 → §11

### 多链内容映射

| 站点区块 | 白皮书来源 |
|---|---|
| 架构区「多链拓扑」 | §3.1 多链拓扑 |
| 多链部署章节（4 张链卡片） | §1.4 + §3.5–3.7 |
| 性能区「多链性能特征」表 | §5.2 |
| 经济区「多链手续费与版税适配」 | §7.3 |
| 风险控制说明 | §11 |

> ✅ 早期版本的「代币分配合计 90%」缺口已由白皮书更新修复（早期支持者 10% → **20%**）。

## 部署


```bash
git clone git@github.com-functioncomplete-web:functioncomplete/web.git
git remote set-url origin git@github.com-functioncomplete-web:functioncomplete/web.git
git push -u origin main
```

> ⚠️ 私钥与公钥**都不应提交到仓库**。公钥仅在 GitHub 后台登记即可。

.nojekyll` 已就位（防止 Jekyll 处理带下划线/点的路径）。仓库设置里把 Pages 指向根目录即可。

## 已验证项

- ✅ 181 个 i18n 键 HTML ↔ 词典完全对齐，无缺失/无冗余
- ✅ 桌面（1440×900）与移动（390×844）均无横向溢出
- ✅ 控制台零错误
- ✅ 所有页内锚点均有对应 `id`
- ✅ 双语切换：标题 / h1 / 白皮书链接 / localStorage 全部跟随
- ✅ 白皮书下载链接随语言切换（zh ↔ en）
