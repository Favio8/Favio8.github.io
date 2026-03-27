---
author:
journal:
status: 待读
year:
tags:
  - Agent
  - Planning/Reasoning
  - ToolUse
方向定位: 属于规划与推理与工具调用的交叉点，定义了Agent如何通过“思维链”引导“行动”，并根据“观察”更新“思维”的基本工作流
theme: morandi-forest
themeName: "莫兰迪森林"
title: "Agent论文阅读（1）ReAct"
---

## 0. 引言
在大模型Agent的研究中，推理（Reasoning）和行动（Acting）长期以来被视为两个独立领域。ReAct 首次打破了这一壁垒。

传统的 Chain-of-Thought（CoT）推理虽然表现优异，但其本质是一个缺乏外部反馈的”静态黑盒”，容易产生事实幻觉；而传统的交互式决策模型虽然可以行动，却缺乏高层的规划和目标管理能力。ReAct提出了一种全新范式：让LLM以**交替的方式生成推理轨迹和特定操作**，***推理帮助模型更新行动计划并处理异常，而行动则让模型能够从外部环境（如Wikipedia）来获取真实信息***。

## 1. 论文信息

**论文标题：**  
ReAct: Synergizing Reasoning and Acting in Language Models

**作者：**  
Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao

**机构：**  
Department of Computer Science, Princeton University 
Google Research, Brain team

**发表：**
ICLR 2023

**论文链接：**  
https://openreview.net/forum?id=WE_vluYUL-X

**代码链接：**  
https://github.com/ysymyth/ReAct

**任务场景：**
1. 知识密集型推理：多步问答（HotpotQA）和事实验证（FEVER）
2. 互动决策任务：文字游戏（ALFWorld）和网页购物导航（WebShop）
3. 核心工具：设计了一个 Wikipedia API，让模型能够主动搜索并检索外部知识

## 2. 研究背景（Background）

目前，LLM在语言理解和交互式决策任务上表现出色。但是在 ReAct 提出之前，研究人员主要将模型的两种核心能力作为独立的主题进行探索：
- 推理能力（Reasoning）：比如”思维链”（Chain-of-Thought, CoT）提示，让模型通过内部表征一步步进行算术、常识或符号推理任务
- 行动能力（Acting）：探索使用预训练语言模型在交互式环境中（如网页浏览、文字游戏）生成特定领域的动作或执行计划

但是在处理复杂决策任务时，LLM往往面临着两大挑战：
- 1.推理与现实脱节（Reasoning without Grounding）：传统的“思维链”（CoT）是一个静态黑盒，模型仅依赖内部记忆。一旦中间事实出错，幻觉就会在后续推理中不断积累，导致逻辑崩盘。
- 2.行动缺乏逻辑（Acting without Reasoning）：如果模型仅生成行动代码（Act-only），它就无法理解高层目标，在遇到环境反馈时容易陷入死循环或产生机械性的重复动作。

核心动机：人类智能的精髓在于“交替协同”。我们通过推理来制定计划和应对异常，通过行动来观察环境并获取新知识。

在人类智能中，言语推理和任务导向的行动是无缝结合的。认知科学表明，这种“内心独白（inner speech）”在人类认知中发挥着至关重要的作用：
- 自我条件与策略化：帮助我们制定计划并监督进度的完成情况
- 异常处理：比如在做饭时发现缺盐，推理会指导我们寻找替代品（如酱油）
- 维护工作记忆：在执行长序列任务时，帮助我们记住“现在到哪了”以及“下一步该查什么”

然而在AI领域，LLM这两种能力一直被分开研究：
1.推理派（Reasoning-only）：如CoT，专注于模型内部的逻辑推演，但不与外部环境进行交互
2.行动派（Act-only）：专注于预测动作指令，但是缺乏高层目标的规划和对复杂环境的抽象理解

ReAct 的出现，正是为了弥合这两个领域之间的鸿沟，完美诠释了”知行合一”的核心理念。

## 3. 论文要解决的问题（Problem）

尽管大语言模型（LLM）在推理（如 CoT）和行动（如计划生成）方面表现出色，但这两者长期处于”分家”状态。这种割裂导致了以下核心问题：

1. **推理幻觉与错误传播 (Hallucination & Error Propagation)** ：
    - 在纯推理模式（CoT）下，模型仅依赖其内部表示生成推理轨迹。
    - 由于缺乏与外部世界的实时挂钩，模型容易产生事实性幻觉（编造知识）。
    - 一旦初始推理出现偏差，错误会随着推理链条不断放大，导致最终答案完全偏离事实。
2. **行动规划能力缺失 (Lack of High-level Planning)** ：
    - 在纯行动模式（Act-only）下，模型直接预测环境指令。
    - 由于缺乏中间的抽象思考，模型难以维护一个长期的”工作记忆”。
    - 这导致模型在复杂环境中容易迷失目标，或者在遇到异常反馈（如找不到物品）时，陷入机械重复的无效动作中。
3. **知识更新的滞后性** ：
    - 静态的推理无法让模型在任务执行过程中吸收新的环境反馈，限制了其处理未知或动态情况的能力。

## 4. 核心思想（Key Idea）


![](https://img.wemd.app/1773420821520_r3067i.png)

ReAct 的灵魂在于将**推理轨迹**与**任务特定的动作**进行协同 (Synergy)。
- **动作空间的升维**：ReAct 将智能体的动作空间 $\mathcal{A}$ 扩展为 $\hat{\mathcal{A}} = \mathcal{A} \cup \mathcal{L}$，其中 $\mathcal{L}$ 是语言空间。
- **语言即思考 (Thought)**：在语言空间中的动作被定义为“思考”或”推理轨迹”。这些“思考”虽然不直接改变外部环境，***但会更新智能体的上下文 (Context)，用于合成有用信息、维护工作记忆或调整计划。***
- **双向协同机制**：
    - **推理辅助行动 (Reasoning to Act)**：推理轨迹帮助模型分解目标、创建行动计划、处理异常情况并追踪进度。
    - **行动引导推理 (Acting to Reason)**：行动允许模型与外部源（如 Wikipedia API）交互，收集真实世界的新信息，从而修正和更新推理内容。

![](https://img.wemd.app/1773420864408_qcdqbo.jpg)

| **核心组件**             | **论文中的定义**           | **实际作用**           |
| -------------------- | -------------------- | ------------------ |
| **Thought (推理)**     | 语言空间动作 $\mathcal{L}$ | 分解任务、提取观察中的信息、修正错误 |
| **Action (行动)**      | 环境动作空间 $\mathcal{A}$ | 搜索信息、查看具体内容、完成任务   |
| **Observation (观察)** | 环境反馈 $o_t$           | 提供外部真实世界的知识作为推理依据  |


## 5. 整体架构（Architecture）

![](https://img.wemd.app/1773420879939_5xfb5n.jpg)

ReAct 建立在一个通用的”代理-环境”交互框架之上，采用了交替生成的模式
- **时序决策过程**：在每个时间步 $t$，代理根据当前的上下文 $c_t$（包含历史观察、思考和动作）执行动作 $\hat{a}_t$。
- **上下文演进**：上下文通过公式 $c_{t+1} = (c_t, \hat{a}_t, o_t)$ 不断更新。
- **Prompt 驱动的闭环**：
    - **少样本提示 (Few-shot Prompting)**：使用冻结的大语言模型（如 PaLM-540B），通过少量人工编写的轨迹（包含 Thought, Action, Observation）进行引导。
    - **交替循环 (Thought-Action-Observation Loop)**：模型先产出一段思考，接着生成一个动作；环境反馈观察结果后，再进入下一轮思考。


## 6. 方法细节（Method）
ReAct 的核心逻辑在于将智能体的推理过程显式化，并将其作为一种特殊的“动作”嵌入到决策序列中，从而实现“边思考边行动”。
### 核心公式与逻辑
- **增强动作空间**：ReAct 将传统的动作空间 $\mathcal{A}$ 扩展为 $\hat{\mathcal{A}} = \mathcal{A} \cup \mathcal{L}$，其中 $\mathcal{L}$ 是语言空间。
- **推理轨迹 (Thought)**：当智能体生成 $\hat{a}_t \in \mathcal{L}$ 时，它在执行“推理轨迹”。
    - **特性**：这种动作不直接影响外部环境，因此没有环境观测反馈 ($o_t$)。
    - **作用**：通过推理当前上下文 $c_t$ 来组合有用信息，并更新内部状态，为未来的思考或行动提供支撑。
    - **更新公式**：$c_{t+1} = (c_t, \hat{a}_t)$
- **外部动作 (Action)**：当智能体采取 $\hat{a}_t \in \mathcal{A}$ 时，环境会返回观测结果 $o_t$。
    - **更新公式**：$c_{t+1} = (c_t, \hat{a}_t, o_t)$

### 实现机制：少样本提示 (Few-shot Prompting)
- **模型与学习方式**：实验主要基于 **PaLM-540B** 模型，通过在提示词中加入少量人类编写的轨迹示例（Few-shot）进行引导，无需参数微调。
- **轨迹结构**：每个解题示例都是一个由 **(Thought, Action, Observation)** 构成的循环。
    - **Thought** 的具体类型包括：分解任务目标、提取观察值中的重要信息、执行常识推理、调整行动计划以及处理异常情况。

### 任务适配策略
- **知识推理任务**（如 HotpotQA）：采用“密集思考”模式，即强制在推理、行动与观察之间进行交替。
- **交互决策任务**（如 ALFWorld）：采用“稀疏思考”模式，允许模型自主决定何时需要生成 `Thought`。


## 7. 实验设计（Experiments）
为了全方位验证ReAct的“文武双全”，作者构建了严谨的实验：
- 推理与决策能力的测试：
  - 推理：HotpotQA（多跳问答）和FEVER（事实验证），考验Agent获取并加工外部知识的能力
  - 决策：ALFWorld（文字游戏）和WebShop（网页购物），考验Agent在复杂环境下的长程规划与执行能力
- 严谨的消融对比：
  - Standard：不加任何思考与行动，直接让LLM盲猜
  - CoT：纯推理模式，仅有思维链，没有外部干预
  - Act：纯行动模式，剥离了推理轨迹，直接输出指令
- 实验配置：核心实验基于PaLM-540B，采用少样本提示。例如，HotpotQA使用了6个示例，而FEVER使用了3个

## 8. 实验结果（Results）

![](https://img.wemd.app/1773420904970_hkf5fj.png)
![](https://img.wemd.app/1773420913552_ckhs86.png)

通过在不同类型的任务上进行测试，ReAct 证明了推理与行动协同作用的强大威力。以下是核心实验结果的总结：

#### 1. 知识密集型任务：减少幻觉，提升准确度
- **性能优于 Act-only**: 在 HotpotQA 和 FEVER 任务中，ReAct 的表现一致优于单纯生成动作（Act）的模型，这证明了推理在引导搜索和总结信息中的关键价值。
- **对抗幻觉**: 与纯推理的思维链（CoT）相比，ReAct 显著降低了事实幻觉率。在 HotpotQA 的分析中，CoT 的失败案例中有 56% 是由于幻觉导致的，而 ReAct 通过外部知识库的检索，使得推理过程更加可靠、真实。
- **最强组合方案**: 实验发现，将 ReAct 与 CoT-SC（带自一致性的思维链）结合是目前的最优解。在 FEVER 任务中，这种组合达到了 64.6% 的准确率，远超单一方法的表现。

#### 2. 交互式决策任务：样本效率的飞跃
- **极高的样本效率**: 仅通过 1 到 2 个上下文示例，ReAct 的成功率就超过了使用 $10^3 \sim 10^5$ 个样本训练的模仿学习和强化学习模型。
- **ALFWorld 表现**: 在文字游戏环境中，ReAct 的最佳成功率达到了 71%，而 Act-only 仅为 45%。
- **WebShop 表现**: 在真实的购物网站模拟环境中，ReAct 实现了 40% 的成功率，相比之前的最佳方法提升了 10% 的绝对成功率。

#### 3. 模型规模与微调的潜力 
- **微调的威力**: 仅使用 3,000 条轨迹进行微调后，PaLM-8B 规模的 ReAct 模型性能就超过了采用提示词（Prompting）方法的 PaLM-540B 巨型模型。
- **可扩展性**: 实验结果显示，随着模型参数规模的扩大，ReAct 处理复杂推理和长时间跨度行动的能力显著增强。
- 
## 9. 优点（Strengths）
ReAct 不仅仅在性能上取得了突破，更在实用性和系统透明度上展现了显著优势：

- **直观且易于设计 (Intuitive and Easy to Design)** ：设计 ReAct 提示词非常简单。人类注释者只需在动作之上打出他们的语言思考即可，不需要复杂的格式选择或特殊的示例筛选。
- **通用且灵活 (General and Flexible)**：得益于灵活的思考空间和思考-动作交互格式，ReAct 能够适应各种具有不同动作空间和推理需求的任务，包括问答、事实核查、文字游戏和网页导航等。
- **性能强劲且鲁棒 (Performant and Robust)**：ReAct 展现了极强的泛化能力。仅通过 1 到 6 个上下文示例进行学习，它在不同领域的表现就始终优于仅推理或仅行动的基准线。
- **符合人类认知且可控 (Human Aligned and Controllable)**：推理轨迹提供了极佳的可解释性。人类可以轻松检查推理过程和事实准确性，甚至可以通过“编辑思考”来实时引导或纠正智能体的行为。
- **克服幻觉与错误传播 (Reducing Hallucination)** ：通过与 Wikipedia 等外部知识库交互，ReAct 克服了思维链 (CoT) 常见的幻觉问题，使推理过程更加事实驱动且值得信赖。

## 10. 局限性（Limitations）

![](https://img.wemd.app/1773420927854_rjkexk.jpg)

尽管 ReAct 表现优异，但研究也揭示了它在实际应用中的三大瓶颈：
- **推理陷入“死循环”**：在复杂推理中，模型有时会进入一种“推理疲劳”状态，不断重复之前的 Thought 和 Action，无法根据当前观察推导出新的有效行动。
- **搜索失败导致的“链路断裂”**：ReAct 高度依赖外部信息的质量。如果搜索返回的是非启发性（Non-informative）的结果，会直接误导或中断模型的推理逻辑，且模型很难在此时自发地重新调整搜索策略。
- **上下文长度限制 (Context Length)**：由于每一轮都要记录“思维-行动-观察”的完整轨迹，ReAct 的 Prompt 长度增长极快。在多步复杂任务中，很容易触碰到大模型的输入长度上限，限制了其处理超长程任务的能力。
- **灵活性与结构的博弈**：这种固定的交替结构虽然提高了事实性，但相比于纯推理（CoT），在某种程度上也限制了模型灵活重组思路的自由度。

## 11. 我的理解（My Thoughts）
作为Agent领域的一篇开山之作，ReAct的真正价值不在于它引入了搜索工具，而在于它将“思考”这一原本隐藏在模型权重中的黑盒过程，转化为了可观察、可干预的自然语言轨迹。
- 知行合一的闭环：在ReAct之前，推理（CoT）和行动（Act）是断裂的。ReAct证明了：如果没有行动带来的外部反馈，推理容易产生幻觉；如果没有推理带来的高层规划，行动会变得盲目且机械。
- 从“结果导向”到“过程导向”：相比于WebGPT直接输出动作，ReAct强调了推理程序的显式化。这种“显式化”让模型具备了更好的可诊断性——当Agent犯错时，我们能够清楚地看到它是哪一步想偏了，而不是只能面对一个错误的输出发愁。

## 12. 简单复现（Implementation）

以下是 ReAct 核心逻辑的简化实现，展示了 Thought-Action-Observation 循环的基本框架：

```python
class ReActAgent:
    def __init__(self, llm, tools, max_steps=10):
        self.llm = llm           # 大语言模型（如 GPT-4、PaLM）
        self.tools = tools       # 可用工具集（如 Wikipedia 搜索）
        self.max_steps = max_steps

    def run(self, task):
        # 初始化上下文：包含任务描述 + Few-shot 示例
        context = self.build_prompt(task)

        for step in range(self.max_steps):
            # Step 1: LLM 生成 "思考" 或 "动作"
            response = self.llm.generate(context)

            # Step 2: 解析响应，判断类型
            if self.is_thought(response):
                # 推理轨迹：更新上下文，但不执行动作
                context += f"\nThought: {response}"
                # 注意：没有 Observation

            elif self.is_action(response):
                # 外部动作：执行工具调用
                action, query = self.parse_action(response)
                observation = self.execute_tool(action, query)

                # 更新上下文：包含动作 + 观察结果
                context += f"\nAction: {response}\nObservation: {observation}"

            elif self.is_answer(response):
                # 最终答案：任务完成
                return response

            else:
                # 无法解析的响应，继续循环
                continue

        return "达到最大步数限制"

    def build_prompt(self, task):
        # 构建 Few-shot Prompt
        return f"""
任务: {task}

示例格式:
Thought: 我需要先搜索...
Action: search[Python inventor]
Observation: Guido van Rossum created Python in 1991.

Thought: 现在我知道...
Action: finish[Guido van Rossum]
"""
```


## 13. 可以改进的方向（Future Work）

尽管ReAct奠定了基础，但是针对其局限性，我认为未来有几个关键的突破方向：
- 引入强化学习（RL）：正如作者所言，将ReAct与RL结合，可以让Agent在不断的试错中学习到更高效的搜索策略与推理路径，减少陷入“死循环”的概率。
- 长上下文与记忆管理：目前的ReAct轨迹极易达到上下文的上限。未来可以引入层级化存储或者针对Agent轨道优化的长文本模型，让Agent能够处理持续数天的长程任务。
- 多任务预训练与微调：初期实验证明，仅用3000条高质量轨迹微调小模型（如8B），其表现就能反超未微调的大模型。这说明了构建大规模的“推理-行动”指令微调数据集将是提升Agent通用能力的必经之路！

## 14. 参考资料（References）

**ReAct**: Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., & Cao, Y. (2023). **ReAct: Synergizing Reasoning and Acting in Language Models**. _International Conference on Learning Representations (ICLR)_.
 **Chain-of-Thought (CoT)**: Wei, J., Wang, X., Schuurmans, D., Bosma, M., Chi, E., Le, Q., & Zhou, D. (2022). **Chain of thought prompting elicits reasoning in large language models**. _arXiv preprint arXiv:2201.11903_.
**Self-Consistency (CoT-SC)**: Wang, X., Wei, J., Schuurmans, D., Le, Q., Chi, E., Narang, S., ... & Zhou, D. (2022). **Self-consistency improves chain of thought reasoning in language models**. _arXiv preprint arXiv:2203.11171_.
**PaLM**: Chowdhery, A., Narang, S., Devlin, J., Bosma, M., Mishra, G., Roberts, P., ... & Fiedel, N. (2022). **PaLM: Scaling language modeling with pathways**. _arXiv preprint arXiv:2204.02311_.


