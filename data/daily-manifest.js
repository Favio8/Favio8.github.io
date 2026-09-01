/* ================================================================
 * 科研日报索引 —— data/daily-manifest.js
 * --------------------------------------------------------------
 * 【这个文件现在是可选的，日常更新不用碰它】
 *   页面会通过 GitHub API 自动发现 daily/ 下所有 YYYY-MM-DD.md。
 *   每天写日报只剩一步：复制 _TEMPLATE.md → 改名为日期.md → 写 → push。
 *   不用来这里登记，主页和归档页都会自动出现。
 *
 * 【那它还有什么用】
 *   a. 回退：API 限流（匿名 60 次/小时/访客）、断网或 file:// 预览时，
 *      页面退回到这里登记的条目，不至于空白
 *   b. 加速：这里写过 title/summary 的条目，主页卡片无需再拉 md 解析
 *   留着旧数据不影响自动发现（两路数据按日期去重，manifest 优先）。
 *
 * 【如果还想手动登记（可选）】
 *   在数组最前面加一行：
 *        { file: 'YYYY-MM-DD.md', date: 'YYYY-MM-DD', tags: ['标签'] },
 *   title/summary 可省略：页面会读 md 里的 frontmatter 自动补齐。
 *
 * 【字段说明】
 *   file    md 文件名，必须与 daily/ 下的真实文件名完全一致（必填）
 *   date    YYYY-MM-DD，与文件名、md 内 frontmatter 的 date 三处一致（必填）
 *   title   卡片标题，省略则回退为「YYYY-MM-DD 日报」
 *   summary 卡片摘要，省略则显示「（摘要待补充，点击查看详情）」
 *   tags    标签数组
 *   readMinutes  预计阅读分钟数，显示在卡片右上角
 *
 * 【两个硬性要求】
 *   1. 必须用普通 <script src> 加载，绝不能加 type="module"
 *      —— ES module 在本地 file:// 预览时会被 CORS 拦截
 *   2. 数组请保持日期倒序（最新的在最前）
 *      主页只取前 3 条；归档页内部会再排一次序，顺序写错也不会乱
 *
 * 【CDN 缓存提示】
 *   GitHub Pages 有 CDN 缓存，若提交后页面没变，可给引用加版本号
 *   （换个日期值即可强制刷新）：
 *     <script src="data/daily-manifest.js?v=20260901"></script>
 * ================================================================ */

window.DAILY_MANIFEST = [
    {
        file: '2026-09-01.md',
        date: '2026-09-01',
        title: 'ReAct 精读收尾 + 复现 Action 空间设计',
        summary: '把 ReAct 的 Thought/Act/Obs 三段式抽象成一个最小 Agent Loop，跑通 20 条 HotpotQA 样本，观察幻觉率随推理步数的变化。',
        tags: ['Agent', 'ReAct'],
        readMinutes: 3
    },
    {
        file: '2026-08-31.md',
        date: '2026-08-31',
        // 标题与摘要故意留空：演示「只加一行、正文 frontmatter 自动补齐」的最小维护姿势
        tags: ['Agent', 'Memory']
    },
    {
        file: '2026-08-30.md',
        date: '2026-08-30',
        title: 'Agent OS 调研：沙箱与权限模型',
        summary: '梳理了三篇 Agent 运行时的相关工作，尝试给出一个「工具调用 → 权限校验 → 沙箱执行」的统一抽象。',
        tags: ['Agent OS', 'Sandbox'],
        readMinutes: 4
    }
];
