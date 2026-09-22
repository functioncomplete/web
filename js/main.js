/* ============================================================
   FunctionComplete — 交互与双语切换
   策略：HTML 内联中文为初始渲染（利于 SEO / 无 JS 可用）；
        JS 在初始化时快照中文原文，英文由词典提供。
        切换时只做「快照恢复 / 词典覆盖」，避免中英文本重复维护。
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'fct-lang';
  var DEFAULT_LANG = 'zh';

  /* ---------- 英文词典（键与 HTML 的 data-i18n 一一对应） ---------- */
  var EN = {
    /* nav */
    'nav.problem': 'Problem',
    'nav.architecture': 'Architecture',
    'nav.security': 'Security',
    'nav.performance': 'Performance',
    'nav.economics': 'Economics',
    'nav.roadmap': 'Roadmap',
    'nav.whitepaper': 'Whitepaper',

    /* hero */
    'hero.badge': 'Ethereum L2 · Gate-level On-chain Functions',
    'hero.h1a': 'The Ethereum L2 whose',
    'hero.h1b': 'compute layer cannot do harm',
    'hero.h1c': '',
    'hero.lead': 'Pure computation functions built from NAND gates, with LATCH flip-flops exposing internal state, as the sole compute primitive of the L2. Computation and state are fully separated — safety is a property of the architecture, not of application-layer code quality.',
    'hero.cta1': 'Explore the architecture',
    'hero.cta2': 'Read the whitepaper',
    'hero.stat1': 'TPS',
    'hero.stat2': 'TEE latency',
    'hero.stat3': '$FCT total supply',

    /* problem */
    'problem.eyebrow': 'Status quo',
    'problem.h2': 'Today, L2 safety depends on application-layer code',
    'problem.lead': 'Optimistic Rollups use fraud proofs, but carry challenge-period latency and on-chain dispute costs. ZK Rollups remove the challenge period with validity proofs, but proof generation is expensive. More fundamentally, in both cases the L2 compute logic is a <strong>stateful, callable smart contract</strong>.',
    'problem.c1t': 'Composability risk',
    'problem.c1d': 'Composing external contracts requires trusting they will not reenter or manipulate state. Risk compounds with composition depth.',
    'problem.c2t': 'Audit burden',
    'problem.c2d': 'Every new contract needs its own audit. Costs are high and full coverage cannot be guaranteed.',
    'problem.c3t': 'Formal verification is hard',
    'problem.c3d': 'The state space of stateful contracts is enormous, making formal verification extremely difficult and rarely exhaustive.',

    /* insight */
    'insight.eyebrow': 'Core insight',
    'insight.h2': 'Total separation of computation and state',
    'insight.p1': 'If the L2 compute logic is carried by pure logic functions that are <strong>physically incapable of doing harm</strong>, while state management is handled by an independent, tightly controlled settlement contract — then L2 safety no longer depends on application-layer code quality, but is <strong>guaranteed by the architecture itself</strong>.',
    'insight.p2': 'Calling a stranger\u2019s function has exactly one worst case: it returns a wrong result. It <strong>cannot cause any security harm</strong>.',

    /* concept */
    'concept.eyebrow': 'Core concept',
    'concept.h2': 'Gate-level on-chain functions',
    'concept.lead': 'Each function is defined by a network of NAND gates. NAND is functionally complete — it alone can build any combinational logic circuit. Add LATCH flip-flops to hold internal state, and functions express sequential logic, reaching Turing completeness.',
    'concept.nandT': 'NAND gate',
    'concept.nandD': 'The functionally complete primitive. NAND alone builds any combinational logic circuit.',
    'concept.latchT': 'LATCH flip-flop',
    'concept.latchD': 'Each LATCH stores one bit of internal state, updated every compute cycle.',
    'concept.tableCap': 'Key properties of functions',
    'concept.th1': 'Property',
    'concept.th2': 'Description',
    'concept.p1k': 'No side effects',
    'concept.p1v': 'Functions cannot call external contracts or write any external state',
    'concept.p2k': 'Read-only callable',
    'concept.p2v': 'Calling a function is a read-only query — no gas, no transaction',
    'concept.p3k': 'Deterministic',
    'concept.p3v': 'Given identical input and internal state, a function always returns the same output',
    'concept.p4k': 'Composable',
    'concept.p4v': 'A function can be called as a submodule of another; composition is structural',
    'concept.p5k': 'Formally verifiable',
    'concept.p5v': 'Pure logic is naturally suited to model checking and theorem proving',

    /* architecture */
    'arch.eyebrow': 'Architecture',
    'arch.h2': 'Three decoupled layers',
    'arch.l1t': 'Settlement layer · Ethereum mainnet',
    'arch.l1d': 'State root storage · Proof verification · Asset custody · Final arbitration',
    'arch.l1a': 'Inherits mainnet economic security',
    'arch.l1b': 'Final arbiter of all disputes',
    'arch.a1': 'submit state root + proof',
    'arch.l2t': 'Execution layer · Off-chain verifiable compute network',
    'arch.l2d': 'Parallel function execution · Proof generation · State tree management · Transaction ordering',
    'arch.l2a': 'TEE / ZK coprocessors',
    'arch.l2b': 'Horizontally scalable',
    'arch.a2': 'call functions',
    'arch.l3t': 'Compute layer · Gate-level on-chain functions',
    'arch.l3d': 'No side effects · Trustless composition · Turing complete · Formally verifiable',
    'arch.l3a': 'Physically cannot do harm',
    'arch.l3b': 'Calls consume no gas',

    /* security */
    'sec.eyebrow': 'Security model',
    'sec.h2': 'Absolute safety of the compute layer',
    'sec.lead': 'This safety level is unique among existing L2 designs — the attack surface of reentrancy and state manipulation is eliminated at the architectural level.',
    'sec.s1t': 'Immune to reentrancy',
    'sec.s1d': 'Functions cannot call external contracts, so reentrancy is physically impossible.',
    'sec.s2t': 'Immune to state manipulation',
    'sec.s2d': 'Functions cannot write external state, so there is no external state to maliciously modify.',
    'sec.s3t': 'Trustless composition',
    'sec.s3d': 'Composing any function — including a stranger\u2019s — has a worst case of returning a wrong value, never security harm.',
    'sec.s4t': 'Formally verifiable',
    'sec.s4d': 'Pure logic is naturally suited to model checking and theorem proving, and can be verified exhaustively.',
    'sec.pathsH': 'Three selectable proof paths',
    'sec.p1t': 'TEE path',
    'sec.p1d': 'Trusts hardware vendors · ~100 ms latency · highest performance',
    'sec.p2t': 'ZK path',
    'sec.p2d': 'Trusts cryptography · no need to trust hardware vendors',
    'sec.p3t': 'Optimistic path',
    'sec.p3d': 'Trusts economic incentives · minimal on-chain overhead',
    'sec.pathsNote': 'Users choose freely among the three paths according to their application\u2019s security requirements.',

    /* performance */
    'perf.eyebrow': 'Performance',
    'perf.h2': 'Capacity with no hard ceiling',
    'perf.lead': 'The off-chain execution layer scales horizontally: TPS grows linearly with the number of execution nodes, no longer bounded by a single sequencer or prover.',
    'perf.th0': 'Dimension',
    'perf.r1': 'Compute primitive',
    'perf.r1a': 'Stateful smart contract',
    'perf.r1c': 'Side-effect-free gate-level function',
    'perf.r2': 'Compute safety',
    'perf.r2a': 'Reentrancy and related risks',
    'perf.r2c': 'Physically cannot do harm',
    'perf.r3': 'Composition safety',
    'perf.r3a': 'Security risk exists',
    'perf.r3c': 'Trustless composition',
    'perf.r4': 'Formal verification',
    'perf.r4a': 'Difficult',
    'perf.r4b': 'Partial support',
    'perf.r4c': 'Naturally suited, exhaustive',
    'perf.r5a': '~100–2,000',
    'perf.r5b': '~2,000–5,000',
    'perf.r5c': '5,000–15,000+',
    'perf.r6': 'Latency',
    'perf.r6a': 'Minutes (challenge period)',
    'perf.r6b': 'Seconds to tens of seconds',
    'perf.r6c': '30–90 ms (TEE)',
    'perf.r7': 'Proof mechanism',
    'perf.r7a': 'Fraud proof',
    'perf.r7b': 'Validity proof',
    'perf.r7c': 'Selectable TEE / ZK / Optimistic',
    'perf.r8': 'Trust assumption',
    'perf.r8a': 'Honest challenger',
    'perf.r8b': 'Cryptography',
    'perf.r8c': 'Selectable by layer',
    'perf.r9': 'Creator economy',
    'perf.r9a': 'No native incentive',
    'perf.r9c': 'Function royalties + mining + governance rewards',

    /* economics */
    'eco.eyebrow': 'Economics',
    'eco.h2': 'The $FCT token',
    'eco.allocH': 'Token allocation',
    'eco.a1': 'Community mining',
    'eco.a2': 'Ecosystem fund',
    'eco.a3': 'Team',
    'eco.a3n': '6-year linear vesting',
    'eco.a4': 'Early supporters',
    'eco.totalL': 'Total supply',
    'eco.mechH': 'Three core mechanisms',
    'eco.m1t': 'PoC staking & slashing',
    'eco.m1d': 'Execution nodes stake $FCT as collateral. Submitting a wrong state root or invalid proof gets the stake slashed — part burned, part rewarded to the challenger.',
    'eco.m2t': 'Fee burning',
    'eco.m2d': 'EIP-1559 style: base fee is fully burned and adjusts dynamically with usage; priority fee flows to the execution node reward pool. The more the protocol is used, the stronger the deflationary pressure.',
    'eco.m3t': 'Function royalties',
    'eco.m3d': 'When a function is referenced or composed, its original designer earns a composition royalty, deducted from the priority fee at 1%.',

    /* creator economy */
    'creator.eyebrow': 'Creator economy',
    'creator.h2': 'Every function creator earns a lasting return',
    'creator.lead': 'Design happens entirely off-chain — no gas, free to iterate. Deployment mints a function NFT; the logic becomes immutable and can be published to the function marketplace.',
    'creator.i1t': 'Call royalties',
    'creator.i1d': 'When a function is called, part of the priority fee is distributed to its creator automatically, with no trusted intermediary.',
    'creator.i2t': 'Composition royalties',
    'creator.i2d': 'When an \u201cadder\u201d is referenced by a \u201cmultiplier\u201d, the adder\u2019s creator earns every time the multiplier is called.',
    'creator.i3t': 'PoC mining rewards',
    'creator.i3d': 'A function mining pool rewards quality compute modules by call count, composition count, verification coverage and community rating.',
    'creator.i4t': 'Governance & audit rewards',
    'creator.i4d': 'Participating in governance or landing a successful audit report earns $FCT and reputation.',
    'creator.i5t': 'Bounties & contests',
    'creator.i5d': 'Tasks like \u201cimplement an efficient SHA-256 function\u201d or \u201cminimize the gate count of a 4-bit adder\u201d carry one-off bounties.',
    'creator.fwT': 'Economic flywheel',
    'creator.fw1': 'Quality functions attract calls',
    'creator.fw2': 'Calls generate royalties',
    'creator.fw3': 'Revenue attracts more creators',
    'creator.fw4': 'A richer library draws more DApps',

    /* roadmap */
    'road.eyebrow': 'Roadmap',
    'road.h2': 'Three-step multi-chain rollout',

    /* cta */
    'cta.h2': 'Make safety a property of the architecture',
    'cta.lead': 'Let the compute layer of Ethereum L2 become code that is physically incapable of doing harm — and let every function creator earn a lasting return from the computation value they create.',
    'cta.b1': 'Download whitepaper',
    'cta.b2': 'Revisit the architecture',

    /* footer */
    'footer.note': 'Whitepaper v1.0 · Gate-level on-chain functions & multi-chain deployment',
    /* --- 多链：架构拓扑 --- */
    'arch.topoH': 'Multi-chain topology',
    'arch.topo1t': 'Ethereum mainnet',
    'arch.topo1d': 'Trust root · Settlement arbitration · Function NFT identity anchor',
    'arch.topo2t': 'Robinhood Chain',
    'arch.topo2d': 'High-frequency EVM execution · RWA entry point',
    'arch.topo3t': 'Solana',
    'arch.topo3d': 'High-performance parallel execution · ZK verification layer',
    'arch.topo4t': 'Rome Protocol',
    'arch.topo4d': 'Atomic interoperability bridge between EVM and Solana',

    /* --- 多链：概念表 --- */
    'concept.p6k': 'Cross-chain anchorable',
    'concept.p6v': 'Function NFTs are registered on Ethereum and can be executed and composed across chains',

    /* --- 多链部署章节 --- */
    'mc.eyebrow': 'Multi-chain',
    'mc.h2': 'Three steps: Ethereum → Robinhood Chain → Solana',
    'mc.lead': 'Each step is independently verifiable rather than dependent on the previous one being finished — if a step hits a technical obstacle, earlier results are not invalidated.',
    'mc.c1t': 'Ethereum',
    'mc.c1r': 'Trust root · Cross-chain identity layer',
    'mc.c1a': 'Deploy the settlement contract: final verification of state roots and proofs',
    'mc.c1b': 'Publish the ERC-721 function NFT standard defining the NAND gate network data structure',
    'mc.c1c': 'Lightweight TEE verification contract as a template for later chains',
    'mc.c2t': 'Robinhood Chain',
    'mc.c2r': 'Near-zero-cost EVM port · RWA entry',
    'mc.c2a': 'Built on Arbitrum Orbit + Nitro; Solidity contracts migrate almost unchanged',
    'mc.c2b': '~100 ms block time — two orders of magnitude more frequent state updates',
    'mc.c2c': 'Priority fees convert entirely into creator royalties; ~2,000 tokenized stocks and ETFs already live',
    'mc.c3t': 'Solana',
    'mc.c3r': 'Architectural rewrite · Peak performance',
    'mc.c3a': 'Functions compile to BPF read-only pure programs: read-only accounts only, no CPI, never writable',
    'mc.c3b': 'NAND networks compile to Noir circuits; Groth16 proofs verified via alt_bn128 syscalls (170K–500K CU, constant)',
    'mc.c3c': 'Function NFTs use Metaplex Core; the Royalties Plugin enforces royalties with up to 5 creators',
    'mc.c4t': 'Rome Protocol',
    'mc.c4r': 'EVM ↔ Solana atomic interoperability',
    'mc.c4a': 'Embeds a full EVM bytecode interpreter inside the Solana runtime',
    'mc.c4b': 'Solidity contracts call Solana programs atomically via CPI',
    'mc.c4c': 'EVM and Solana share one state — no bridge, no wrapping',
    'mc.riskH': 'Risk control: progressive decoupling',
    'mc.risk1': 'Function NFTs on Ethereum are already valid before any Robinhood Chain migration',
    'mc.risk2': 'Function execution on Robinhood Chain already runs independently before Solana programs are deployed',
    'mc.risk3': 'Solana BPF pure-compute programs and Groth16 verification can be tested independently of the Rome bridge',
    'mc.risk4': 'A failed Rome Protocol integration does not invalidate results on Ethereum or Robinhood Chain',

    /* --- 多链性能 --- */
    'perf.mcH': 'Multi-chain performance characteristics',
    'perf.mcC1': 'Chain',
    'perf.mcC2': 'Role',
    'perf.mcC3': 'Performance characteristics',
    'perf.mc1n': 'Ethereum',
    'perf.mc1p': 'Settlement & trust root',
    'perf.mc1f': '12 s blocks, high security, low execution frequency',
    'perf.mc2n': 'Robinhood Chain',
    'perf.mc2p': 'High-frequency EVM & RWA',
    'perf.mc2f': '~100 ms blocks, EVM compatible, near-real-time state updates',
    'perf.mc3n': 'Solana',
    'perf.mc3p': 'Parallel execution & ZK verification',
    'perf.mc3f': 'Sealevel parallelism, sub-second confirmation, Groth16 verification at 170K–500K CU',
    'perf.mc4n': 'Rome Protocol',
    'perf.mc4p': 'EVM-Solana interoperability',
    'perf.mc4f': 'Solidity contracts run inside the Solana runtime, atomic CPI calls, shared state',
    'perf.r10': 'Multi-chain security',
    'perf.r10a': 'Higher bridge risk',
    'perf.r10c': 'ETH anchoring + Rome shared state + Solana read-only programs',

    /* --- 多链经济适配 --- */
    'eco.mcH': 'Multi-chain fee & royalty adaptation',
    'eco.mc1t': 'Ethereum settlement layer',
    'eco.mc1d': 'EIP-1559 style: base fee fully burned, priority fee to the execution node reward pool.',
    'eco.mc2t': 'Robinhood Chain',
    'eco.mc2d': 'First-come-first-served ordering, no priority-fee front-running. Priority fees no longer accelerate transactions but convert entirely into creator royalties — economics decoupled from ordering.',
    'eco.mc3t': 'Solana',
    'eco.mc3d': 'Function NFTs use Metaplex Core; the Royalties Plugin enforces creator royalties with up to 5 creators; the state manager triggers SPL Token transfers on each call.',

    /* --- 路线图：三步走多链部署 --- */
    'road.s1': 'Step 1',
    'road.s2': 'Step 2',
    'road.s3': 'Step 3',
    'road.s4': 'Step 4',
    'road.p1t': 'Ethereum — Functional validation & security anchoring',
    'road.p1a': 'Publish the FunctionComplete protocol specification',
    'road.p1b': 'Deploy the mainnet/testnet settlement contract',
    'road.p1c': 'Publish the ERC-721 function NFT standard (NAND network data structure / I-O interface / royalty parameters)',
    'road.p1d': 'Implement the base function library: adder, comparator, hash',
    'road.p1e': 'Deploy a lightweight TEE verification contract',
    'road.p1v': 'Strategic value: function NFTs on Ethereum become the identity layer of the ecosystem, with provenance and ownership traceable to the mainnet anchor',
    'road.p2t': 'Robinhood Chain — Near-zero-cost EVM port & RWA landing',
    'road.p2a': 'Migrate Solidity contracts almost unchanged: function NFT, royalty distribution, settlement verification',
    'road.p2b': 'Adapt to first-come-first-served ordering: priority fees convert entirely into creator royalties',
    'road.p2c': 'Use ~100 ms blocks to achieve near-real-time state updates',
    'road.p2d': 'Land RWA use cases: dividend-calculation and compliance-check functions composed trustlessly by multiple protocols',
    'road.p2e': 'Launch the function marketplace, royalty contracts, PoC staking/slashing and fee burning',
    'road.p2v': 'Strategic value: obtain 100 ms blocks and an RWA ecosystem entry at near-zero cost, proving trustless composition on real assets',
    'road.p3t': 'Solana — Architectural rewrite & peak performance',
    'road.p3a': 'Compile gate-level functions to BPF read-only pure programs (read-only accounts / no CPI / never writable / PDA state)',
    'road.p3b': 'Compile NAND networks to Noir circuits; Groth16 proofs verified on-chain via alt_bn128 syscalls',
    'road.p3c': 'Verification costs ~170K–500K compute units — constant and predictable',
    'road.p3d': 'Integrate Rome Protocol so Solidity contracts can atomically CPI-call Solana programs',
    'road.p3e': 'Issue Solana function NFTs via Metaplex Core with the Royalties Plugin; start the Solana function mining pool and governance',
    'road.p3v': 'Strategic value: peak performance, parallel execution and Solana ecosystem interoperability — closing the multi-chain loop',
    'road.p4t': 'Multi-chain autonomy & ecosystem expansion',
    'road.p4a': 'Fully decentralized execution network',
    'road.p4b': 'Recursive ZK proofs for cross-cycle state machines',
    'road.p4c': 'Explore cross-chain function calls and cross-chain royalty settlement',
    'road.p4d': 'Build the native application ecosystem; full autonomy of the creator economy',
    'road.p4e': 'Multi-chain governance coordination: Ethereum anchors identity, Robinhood Chain handles high-frequency RWA, Solana provides parallel performance and ZK verification'
  };

  var META = {
    zh: {
      title: 'FunctionComplete — 门级链上函数与多链部署',
      desc: 'FunctionComplete 以门级链上函数（NAND + LATCH）为唯一计算原语，实现计算层物理上无法作恶的绝对安全。三步走多链部署：以太坊锚定信任根源与函数 NFT 身份，Robinhood Chain 承接 RWA 高频，Solana 提供并行执行与 Groth16 验证。'
    },
    en: {
      title: 'FunctionComplete — Gate-level On-chain Functions & Multi-chain Deployment',
      desc: 'FunctionComplete uses gate-level on-chain functions (NAND + LATCH) as its sole compute primitive, delivering a compute layer that physically cannot do harm. Three-step multi-chain rollout: Ethereum anchors the trust root and function NFT identity, Robinhood Chain handles high-frequency RWA, Solana provides parallel execution and Groth16 verification.'
    }
  };

  /* ---------- 初始化：快照中文原文 ---------- */
  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var snapshot = new Map();
  nodes.forEach(function (el) {
    // 含富文本的键（problem.lead）需保存 HTML，其余用纯文本
    snapshot.set(el, el.innerHTML);
  });

  function setRich(el, value) {
    // 词典值里含标签的用 innerHTML，否则用 textContent（更安全）
    if (/<[a-z][\s\S]*>/i.test(value)) el.innerHTML = value;
    else el.textContent = value;
  }

  function applyLang(lang) {
    if (lang !== 'en') lang = 'zh';
    var root = document.documentElement;
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'zh' ? 'zh' : 'en');

    nodes.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (lang === 'en' && EN[key] != null) {
        setRich(el, EN[key]);
      } else {
        el.innerHTML = snapshot.get(el);   // 恢复中文快照
      }
    });

    var m = META[lang] || META.zh;
    document.title = m.title;
    var d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute('content', m.desc);

    // 白皮书下载链接跟随语言
    var wp = lang === 'en' ? 'FCT-whitepaper-en.md' : 'FCT-whitepaper-zh.md';
    Array.prototype.forEach.call(document.querySelectorAll('[data-wp]'), function (a) {
      a.setAttribute('href', wp);
      a.setAttribute('download', '');
    });

    var btn = document.getElementById('langToggle');
    if (btn) btn.setAttribute('aria-label',
      lang === 'zh' ? 'Switch to English' : '切换为中文');

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* 隐私模式忽略 */ }
  }

  /* ---------- 语言切换 ---------- */
  var stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  applyLang(stored || DEFAULT_LANG);

  var toggle = document.getElementById('langToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-lang') === 'zh' ? 'en' : 'zh';
      applyLang(next);
    });
  }

  /* ---------- 滚动入场 ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 导航当前区块高亮 ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = '#' + e.target.id;
        navLinks.forEach(function (a) {
          var on = a.getAttribute('href') === id;
          a.style.color = on ? 'var(--cy)' : '';
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
