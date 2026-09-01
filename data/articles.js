/* ================================================================
 * 公众号文章清单 —— data/articles.js
 * --------------------------------------------------------------
 * 用途：主页「文章与随笔」板块的数据源。站内不建详情页，卡片直接跳微信原文。
 *
 * 【如何新增一篇文章 —— 一行速记（推荐）】
 *   在数组里加一个字符串条目，只写系列和微信链接（位置随意）：
 *       'Agent论文阅读 | https://mp.weixin.qq.com/s/xxxxx',
 *   完事。标题自动编号（Agent论文阅读 · 第 7 篇）、封面自动生成该系列
 *   专属渐变色、标签默认取系列名。条目加在数组任何位置都行——
 *   自动按日期倒序排列，没写日期的视为最新。
 *
 * 【完整写法（想自定义标题/日期/摘要/封面时再用）】
 *   用大括号对象写全字段，除 url 外全部可选。
 *   url 暂时拿不到就先写 '__REPLACE_ME__'，页面会自动显示
 *   「链接待填」角标并阻止跳转，不会把读者甩到一个死链上
 *
 * 【字段说明】
 *   title    文章标题（与公众号推文保持一致）
 *   series   所属系列名，如「Agent论文阅读」「技术碎碎念」。
 *            出现两个及以上系列时，主页筛选栏自动出现，无需改 HTML
 *   date     发布日期 YYYY-MM-DD，用于排序与展示
 *   excerpt  一句话摘要，卡片上显示 2 行
 *   cover    封面图路径，相对仓库根，如 blog/posts/.../images/cover.png。
 *            不写则自动生成该系列专属渐变色封面（同系列永远同色）
 *   url      微信公众号原文链接。失效或被删时，把 dead 设为 true
 *   source   来源标注，默认「微信公众号」
 *   tags     标签数组，建议 1-3 个
 *   mirror   本地存档的 md 路径，微信链接失效时的兜底入口
 *   dead     布尔值，true 时卡片置灰、只保留「本地存档」入口
 *
 * 【维护备忘（2026-09-01）】
 *   - Agent论文阅读 1-3 在 blog/ 有对应站内笔记，配了本地封面图；
 *     其余条目暂无 cover，自动走渐变封面，无需处理
 *   - 新增的 7 条暂缺发布日期（微信页面抓不到，也没有存档可查）：
 *     页面把无日期条目一律视为最新，数组内顺序即卡片展示顺序
 *     （已按推文实际发布先后排列）。以后查到日期补上 date 字段即可，
 *     排序会自动修正
 *   - 「AI漫慢谈」系列的官方栏目名暂按推文分组标题使用；若正式名
 *     有出入（如「AI漫谈」），改这 1 条的 series 值即可
 *
 * 【迁移提醒】
 *   本文件已在根目录 data/ 下。今后可让 blog/index.html 也引用它，
 *   消除「文章元数据在两个文件各维护一份」的问题。
 * ================================================================ */

window.ARTICLES = [
    // ===== 技术碎碎念（系列） =====
    {
        title: 'DeepSeek Harness：从零搞懂"一切皆插件"的开源 Agent 框架',
        series: '技术碎碎念',
        excerpt: '拆解 DeepSeek Harness 的"一切皆插件"设计，看工具、上下文与执行流如何被统一编排。',
        url: 'https://mp.weixin.qq.com/s?__biz=MzkwNzY5NDc1Mw==&mid=2247483864&idx=1&sn=9fa9e38ca38e195688307a36e61733dd&chksm=c0d40616f7a38f000938d880b34b7ea17bf1100faf9f7fd96b61634f2f6e99005b92a4491c0d&scene=178&cur_album_id=4447954932155170825&search_click_id=#rd',
        source: '微信公众号',
        tags: ['Agent', 'DeepSeek', '开源框架']
    },
    {
        title: 'Transformer：从零搞懂注意力机制与核心架构',
        series: '技术碎碎念',
        excerpt: '从注意力机制讲起，逐步拆解 Transformer 的整体架构，搞懂位置编码、多头注意力等核心部件。',
        url: 'https://mp.weixin.qq.com/s?__biz=MzkwNzY5NDc1Mw==&mid=2247483783&idx=1&sn=632a0cad4606603083b75619b3d1c718&chksm=c0d40649f7a38f5f8d211aa75399df7f3d33f541498c5238a223df880f4efc6b90beac83a19b&scene=178&cur_album_id=4447954932155170825&search_click_id=#rd',
        source: '微信公众号',
        tags: ['Transformer', '注意力机制', '深度学习']
    },
    {
        title: '一篇讲透 Docker 入门：容器、镜像与宿主机',
        series: '技术碎碎念',
        excerpt: '从镜像、容器与宿主机三者的关系讲起，把 Docker 的核心概念和常用操作一次讲透。',
        url: 'https://mp.weixin.qq.com/s?__biz=MzkwNzY5NDc1Mw==&mid=2247483771&idx=1&sn=9ded876deb0db45f23dd1aa18cb6542c&chksm=c0d406b5f7a38fa35dde73060fd0a6e9a0a5209f921b499e9855204fbb2c150dbe9899f8b2dc&scene=178&cur_album_id=4447954932155170825&search_click_id=#rd',
        source: '微信公众号',
        tags: ['Docker', '容器', 'Linux']
    },

    // ===== AI漫慢谈（系列） =====
    {
        title: 'FDE：AI 时代最稀缺的不是算力，是"翻译官"',
        series: 'AI漫慢谈',
        excerpt: 'AI 落地最缺的不是模型和算力，而是把真实业务翻译成系统能力的人——Forward Deployed Engineer。',
        url: 'https://mp.weixin.qq.com/s?__biz=MzkwNzY5NDc1Mw==&mid=2247483855&idx=1&sn=eeccd9e6cb017a25a37165760c9aa113&chksm=c0d40601f7a38f17ba1ee03e266983d636652f88c7e21b2012d398f93531a4d6a66acd91ab65&scene=178&cur_album_id=4641743336440217604&search_click_id=#rd',
        source: '微信公众号',
        tags: ['FDE', 'AI 行业', '随笔']
    },

    // ===== Agent论文阅读（系列）=====
    {
        title: 'Agent论文阅读（6）| VOYAGER：智能体也可以玩转 Minecraft？',
        series: 'Agent论文阅读',
        excerpt: 'VOYAGER 让 Agent 在 Minecraft 里自动写课程、写代码、存技能，用"会成长的技能库"实现终身学习。',
        url: 'https://mp.weixin.qq.com/s?__biz=MzkwNzY5NDc1Mw==&mid=2247483844&idx=1&sn=eb6a9776effa06dfaa87dd05ce7d1218&chksm=c0d4060af7a38f1cff5bdd7892cfe10ddf4f00180d9fa0044246273f5c4682ca1d71fadd79e8&scene=178&cur_album_id=4426313903543042048&search_click_id=#rd',
        source: '微信公众号',
        tags: ['Agent', 'Lifelong Learning', 'Skill Library']
    },
    {
        title: 'Agent论文阅读（5）| Generative Agents：让大模型在赛博小镇里"过日子"',
        series: 'Agent论文阅读',
        excerpt: '25 个 AI 居民凭借记忆流、反思与规划在虚拟小镇上生活，涌现出传八卦、组织派对等社会行为。',
        url: 'https://mp.weixin.qq.com/s?__biz=MzkwNzY5NDc1Mw==&mid=2247483830&idx=1&sn=ace1a8af11c0a9a514a44c3393e15dbd&chksm=c0d40678f7a38f6e9fc665d1161029eb8d5484b18de9f2041519508685005bd8290dea40d8bc&scene=178&cur_album_id=4426313903543042048&search_click_id=#rd',
        source: '微信公众号',
        tags: ['Agent', 'Memory', 'Social Simulation']
    },
    {
        title: 'Agent论文阅读（4）| Reflexion：让大模型在"试错"中学会"反思"',
        series: 'Agent论文阅读',
        excerpt: 'Reflexion 让 Agent 把失败经历转成语言化的自我反思，存入记忆指导下一轮尝试，不改一个权重就能越做越好。',
        url: 'https://mp.weixin.qq.com/s?__biz=MzkwNzY5NDc1Mw==&mid=2247483815&idx=1&sn=9dc6450e11c96ce0115e010e193af492&chksm=c0d40669f7a38f7fa79df99ff37169e68a0f8f364eb5efb90a4718ef4dec91cb17f1d6a782a9&scene=178&cur_album_id=4426313903543042048&search_click_id=#rd',
        source: '微信公众号',
        tags: ['Agent', 'Reflection', 'Reasoning']
    },
    {
        title: 'Agent论文阅读（3）| Tree of Thoughts：让大模型学会"先看后走"的思维树',
        date: '2026-03-27',
        series: 'Agent论文阅读',
        excerpt: 'ToT 把复杂规划转化为思维树上的搜索问题，通过思想分解、并行生成、状态评估与搜索四个模块，赋予模型分支探索与回溯的能力。',
        cover: 'blog/posts/2026-03-27-ToT/images/cover.png',
        url: 'https://mp.weixin.qq.com/s?__biz=MzkwNzY5NDc1Mw==&mid=2247483760&idx=1&sn=3d1c10621538b55fc41f38b73ee94cf7&chksm=c0d406bef7a38fa87e425677d12cbb22e8cf8bf19c8ae1209394cf0832157d9365ac43bb363d&scene=178&cur_album_id=4426313903543042048&search_click_id=#rd',
        source: '微信公众号',
        tags: ['Agent', 'Planning/Reasoning', 'NeurIPS 2023']
    },
    {
        title: 'Agent论文阅读（2）| Toolformer: 语言模型可以自学使用工具',
        date: '2026-03-23',
        series: 'Agent论文阅读',
        excerpt: 'Toolformer 提出自监督范式，让语言模型通过少量 API 示例自学「何时调用哪个工具」，用外部能力弥补自身短板。',
        cover: 'blog/posts/2026-03-23-Toolformer/images/cover.png',
        url: 'https://mp.weixin.qq.com/s?__biz=MzkwNzY5NDc1Mw==&mid=2247483743&idx=1&sn=c4503fd17d44f78874bf654f3492cedd&chksm=c0d40691f7a38f87afd72a14673a9d6afab4e25fa0b01eacb33022e91102df963ebbea665cdd&scene=178&cur_album_id=4426313903543042048&search_click_id=#rd',
        source: '微信公众号',
        tags: ['Agent', 'ToolUse', 'Self-Supervised']
    },
    {
        title: 'Agent论文阅读（1）ReAct',
        date: '2026-03-14',
        series: 'Agent论文阅读',
        excerpt: 'ReAct 首次打破推理与行动的壁垒，让 LLM 交替生成推理轨迹与具体操作：用推理更新行动计划，用行动从外部环境获取真实信息。',
        cover: 'blog/posts/2026-03-14-ReAct/images/cover.png',
        url: 'https://mp.weixin.qq.com/s?__biz=MzkwNzY5NDc1Mw==&mid=2247483734&idx=1&sn=09a687ad0b5c41c6ea947bff726beee7&chksm=c0d40698f7a38f8ea565419dcdfbe9cc8a28b4defc6d91b1b9e23bb58d1328b43bd79e440096&scene=178&cur_album_id=4426313903543042048&search_click_id=#rd',
        source: '微信公众号',
        tags: ['Agent', 'Planning/Reasoning', 'ToolUse']
    }
];
