// Confirmed profile and project information, updated 2026-10-13.
// Project dates follow the first recorded month in the active repositories.
window.FAVIO_PORTFOLIO = {
    zh: {
        categories: ['全部', '学习助手', '科研工具', '学术写作'],
        projects: [
            {
                name: 'StudyClaw', subtitle: '本地优先的 AI 学习助手',
                category: '学习助手', icon: 'fa-book-open', date: '2026.08 — 至今',
                role: '独立开发者', status: 'Windows 桌面安装包已验证',
                description: '把本地资料组织成课程大纲与题卡，串联对话学习、测验评估和 SM-2 间隔复习，让学习记录可保存、可迁移。',
                highlights: ['独立负责产品设计、全栈开发及桌面交付', '增量构建、流式对话、阅读标注与引用定位', '基于 DeepSeek Harness 开源基座，采用本地文件保存状态'],
                tags: ['TypeScript', 'Next.js', 'React', 'Electron', 'SM-2'],
                url: 'https://github.com/Favio8/studyclaw-next', private: false
            },
            {
                name: 'Research Radar', subtitle: '科研论文推荐与主题调研系统',
                category: '科研工具', icon: 'fa-compass', date: '2026.07 — 至今',
                role: '独立开发者', status: '已部署至实验室内网',
                description: '面向科研课题组，汇集多源论文并生成中文摘要，结合成员兴趣和阅读反馈提供个性化推荐，通过飞书完成信息分发。',
                highlights: ['成员画像、反馈学习、去重、频控与夜间静默', '导师看板、主题调研、模型降级与调用预算控制', '独立完成全栈实现及 Docker Compose 部署'],
                tags: ['Python', 'FastAPI', 'Celery', 'PostgreSQL', 'Redis', 'React'],
                url: '', private: true
            },
            {
                name: 'ScholarFlow', subtitle: '证据驱动的 AI 学术写作工作台',
                category: '学术写作', icon: 'fa-file-lines', date: '2026.10 — 至今',
                role: '独立开发者', status: '持续迭代 · 已有宿主集成验证',
                description: '独立开发 DeepSeek Harness 学术写作插件，将资料、定位证据、论点、大纲和正文关联起来，支持审查修订及多格式导出。',
                highlights: ['引用关联、修改预览与明确采用', '版本冲突检测、多文件事务与中断恢复', '复用宿主模型、会话及授权能力，完成隔离环境集成验证'],
                tags: ['TypeScript', 'React', 'Zod', 'Markdown AST', 'DSH'],
                url: 'https://github.com/Favio8/dsh-scholarflow', private: false
            }
        ],
        awards: [
            '2023–2024 学年 · 国家奖学金',
            '2024–2025 学年 · 国家励志奖学金',
            '2025 · 全国大学生数学建模竞赛省一等奖',
            '2024 · 全国大学生数学竞赛省二等奖',
            '2024 · 美国数学建模大赛 Honorable Mention',
            '2026.04 · 校优秀共青团干部'
        ],
        research: [
            {
                name: 'Micro-AIOS 多智能体操作系统化运行时研究',
                role: '独立研究', date: '2026.03 — 2026.05',
                description: '围绕多智能体系统中的调度、上下文外置、工具权限及协作追踪，基于 Python、asyncio、ChromaDB 和 Pydantic 构建微内核式研究原型。',
                contribution: '实现优先级调度、aging 防饥饿、软/强抢占、sandbox 与容量限制，并通过基准测试和发布验证评估任务响应表现。',
                tags: ['Agent Runtime', 'Python', 'asyncio', 'ChromaDB']
            },
            {
                name: '安检 X 光图像违禁品检测研究',
                role: '项目负责人 · 国家级大创项目', date: '2025.10 — 2026.04',
                description: '针对安检图像的遮挡、目标重叠和未知类别识别问题，基于 YOLOv8、SIXRay、MS COCO 2017 与 PASCAL VOC 开展封闭集到开集检测研究。',
                contribution: '制定技术路线，参与 PAO-YOLO 方法设计，引入原型对齐、类别去相关及自适应阈值；完成主实验、跨数据集泛化验证与消融实验。',
                tags: ['Computer Vision', 'YOLOv8', 'Open-set Detection', 'PAO-YOLO']
            }
        ],
        skills: [
            { name: '编程与开发', icon: 'fa-code', description: '围绕实际项目进行设计、实现和持续迭代。', items: ['Python', 'TypeScript / JavaScript', 'C / C++', 'Git / Linux'] },
            { name: 'AI 与研究', icon: 'fa-brain', description: '关注智能体运行时、学习工具与计算机视觉。', items: ['Agent 系统与工具调用', 'PyTorch / YOLO', '结构化输出与证据定位', '模型评估与实验验证'] },
            { name: '应用与交付', icon: 'fa-layer-group', description: '打通前端、异步任务、数据状态及部署链路。', items: ['React / Next.js / Electron', 'FastAPI / Celery', 'PostgreSQL / Redis', 'Docker Compose / 自动化测试'] }
        ]
    },
    en: {
        categories: ['All', 'AI Learning', 'Research Tools', 'Academic Writing'],
        projects: [
            {
                name: 'StudyClaw', subtitle: 'A local-first AI learning assistant',
                category: 'AI Learning', icon: 'fa-book-open', date: 'Aug 2026 — Present',
                role: 'Independent developer', status: 'Windows installer validated',
                description: 'Turns local materials into a course outline and question cards, connecting tutoring, assessment and SM-2 spaced review with portable learning records.',
                highlights: ['Own product design, full-stack development and desktop delivery', 'Incremental builds, streaming chat, reading annotations and source navigation', 'Built on the DeepSeek Harness open-source foundation with file-based state'],
                tags: ['TypeScript', 'Next.js', 'React', 'Electron', 'SM-2'],
                url: 'https://github.com/Favio8/studyclaw-next', private: false
            },
            {
                name: 'Research Radar', subtitle: 'Paper recommendations and topic research',
                category: 'Research Tools', icon: 'fa-compass', date: 'Jul 2026 — Present',
                role: 'Independent developer', status: 'Deployed on the lab intranet',
                description: 'Collects papers from multiple sources, generates Chinese summaries and personalizes recommendations from research interests and feedback, delivered through Feishu.',
                highlights: ['Profiles, feedback learning, deduplication, rate limits and quiet hours', 'Supervisor dashboard, topic research, model fallback and call budgets', 'Independent full-stack implementation and Docker Compose deployment'],
                tags: ['Python', 'FastAPI', 'Celery', 'PostgreSQL', 'Redis', 'React'],
                url: '', private: true
            },
            {
                name: 'ScholarFlow', subtitle: 'An evidence-driven academic writing workspace',
                category: 'Academic Writing', icon: 'fa-file-lines', date: 'Oct 2026 — Present',
                role: 'Independent developer', status: 'In active development · Host integration validated',
                description: 'A DeepSeek Harness plugin linking materials, located evidence, claims, outlines and manuscript text, with review, revisions and multi-format export.',
                highlights: ['Citation mapping, change previews and explicit acceptance', 'Version-conflict detection, multi-file transactions and interruption recovery', 'Reuses host models, sessions and authorization; integration checked in an isolated host'],
                tags: ['TypeScript', 'React', 'Zod', 'Markdown AST', 'DSH'],
                url: 'https://github.com/Favio8/dsh-scholarflow', private: false
            }
        ],
        awards: [
            '2023–2024 · National Scholarship',
            '2024–2025 · National Encouragement Scholarship',
            '2025 · Provincial First Prize, CUMCM',
            '2024 · Provincial Second Prize, Chinese Mathematics Competitions',
            '2024 · Honorable Mention, MCM',
            'Apr 2026 · Outstanding Youth League Cadre, Xidian University'
        ],
        research: [
            {
                name: 'Micro-AIOS: an OS-inspired multi-agent runtime',
                role: 'Independent research', date: 'Mar 2026 — May 2026',
                description: 'A microkernel-style prototype in Python, asyncio, ChromaDB and Pydantic, exploring scheduling, externalized context, tool capabilities and traceable collaboration.',
                contribution: 'Implemented priority scheduling, aging, soft/hard preemption, sandboxing and capacity limits; evaluated task responsiveness through benchmarks and release validation.',
                tags: ['Agent Runtime', 'Python', 'asyncio', 'ChromaDB']
            },
            {
                name: 'Prohibited-object detection in security X-ray images',
                role: 'Project lead · National undergraduate innovation project', date: 'Oct 2025 — Apr 2026',
                description: 'Research on occlusion, overlapping objects and unknown categories using YOLOv8, SIXRay, MS COCO 2017 and PASCAL VOC, extending closed-set detection to open-set recognition.',
                contribution: 'Defined the technical plan and contributed to PAO-YOLO with prototype alignment, class decorrelation and adaptive thresholds; completed main, cross-dataset and ablation experiments.',
                tags: ['Computer Vision', 'YOLOv8', 'Open-set Detection', 'PAO-YOLO']
            }
        ],
        skills: [
            { name: 'Programming & Development', icon: 'fa-code', description: 'Design, implement and iterate on working projects.', items: ['Python', 'TypeScript / JavaScript', 'C / C++', 'Git / Linux'] },
            { name: 'AI & Research', icon: 'fa-brain', description: 'Agent runtimes, learning tools and computer vision.', items: ['Agent systems & tool calling', 'PyTorch / YOLO', 'Structured output & evidence tracing', 'Model evaluation & experiments'] },
            { name: 'Applications & Delivery', icon: 'fa-layer-group', description: 'Connect interfaces, asynchronous tasks, state and deployment.', items: ['React / Next.js / Electron', 'FastAPI / Celery', 'PostgreSQL / Redis', 'Docker Compose / Automated testing'] }
        ]
    }
};

window.portfolioData = function (locale) {
    return window.FAVIO_PORTFOLIO[locale] || window.FAVIO_PORTFOLIO.zh;
};
