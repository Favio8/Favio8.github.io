---
title: "Agent论文阅读（3）| Tree of Thoughts：让大模型学会\"先看后走\"的思维树"
author: "Favio"
date: "2026-03-27"
journal: "NeurIPS 2023"
year: "2023"
tags:
  - Agent
  - Planning/Reasoning
  - Deliberate Planning
  - Search-Based
category: 论文阅读笔记
status: 已读
direction: 属于规划与推理方向的核心工作，提出了将搜索算法与LLM生成能力结合的框架，让模型具备"先看后走"和"试错剪枝"的系统2慢思考能力
abstract: "Tree of Thoughts (ToT) 提出了将复杂规划问题转化为在「思维树」上的搜索问题。通过引入思想分解、并行生成、状态评估和搜索算法四个模块，赋予了大模型在局部探索多个分支、在全局评估状态并回溯的能力。实验表明，在24点游戏中GPT-4+ToT成功率达74%，远超CoT的4%。"
theme: morandi-forest
themeName: "莫兰迪森林"
---

## 0.引言
当前的大语言模型（LLM）受限于从左到右的自回归生成机制，在面对复杂的长程任务时，往往会因为“一步错，步步错”而陷入困境。为了打破这一局限，本文提出了一种名为 **”思维树”**（Tree of Thought，ToT）的推理框架。**与传统“思维链”（CoT）单向、线性的多步推理不同**，ToT允许模型在多个并行的推理分支中进行探索、自我评估，并在必要的时候进行回溯。***这极大地提升了Agent在复杂环境下的规划与推理（Planning/Reasoning）能力，使其能够真正像人类“慢思考”一样，解决需要全局统筹与战略搜索的复杂决策难题。***


## 1. 论文信息

**论文标题：**  
Tree of Thoughts: Deliberate Problem Solving with Large Language Models

**作者：**  
Shunyu Yao, Dian Yu, Jeffrey Zhao, Izhak Shafran, Thomas L. Griffiths, Yuan Cao, Karthik Narasimhan

**机构：**  
Princeton University, Google DeepMind

**发表时间：**  
NeurIPS 2023

**论文链接：**  
https://proceedings.neurips.cc/paper/2023/hash/271db9922b8d1f4dd7aaef84ed5ac703-Abstract.html

**代码链接：**  
https://github.com/princeton-nlp/tree-of-thought-llm

---

## 2. 研究背景（Background）
随着模型规模的扩大，LLM已经展现出惊人的常识和推理能力。然而，如果仔细观察LLM生成回答的机制，会发现它本质上仍然是在做“逐个token的自回归预测”。
在认知心理学中有一个著名的“双系统”理论：**系统1（System 1）是快速、自动、依靠自觉的**；**系统2（System 2）则是缓慢、深思熟虑、包含逻辑推演的**。作者认为，当前LLM从左到右的文本生成机制，极其类似于人类的“系统1”。但是，要让LLM成为真正通用的Agent规划器（General Problem Solver），仅靠“系统1”的本能反应是远远不够的，它急需一个能进行深思熟虑的“系统2”来进行复杂规划。


## 3. 论文要解决的问题（Problem）
现有的Prompt范式（如标准输入输出IO、思维链CoT、自洽性思维链CoT-SC），虽然让模型学会了“多步思考”，但依然局限于线性推进，面临着**两大根本性缺陷**：
- 1.**局限上缺乏探索（Locally lack of exploration）**：模型在一个思考步骤中，不会去同时展开和尝试多种不同的分支可能性（无法实现“树的延展”）。
- 2.**全局上缺乏规划（Globally lack of planning）**：模型不会评估当前推进的状态，也没有前瞻（Lookahead）或回溯（Backtracking）机制。一旦在某一步产生幻觉或计算错误，只能将错就错，无法退回到安全点重新开始选择。


## 4. 核心思想（Key Idea）

![](https://img.wemd.app/1774577816544_3q3a6e.png)

论文中的核心思想非常简练而优雅：将复杂的规划问题转化为在一个”思维树（Tree of Thought）”上的搜索问题。在这棵树中，每一个节点代表一个”部分解（状态s）”，由输入和迄今为止的思维序列组成。***通过引入启发式的搜索算法，赋予大模型在局部探索多个分支、在全局评估状态并回溯的能力。***


## 5. 整体架构（Architecture）

![](https://img.wemd.app/1774577842395_hmmv29.png)

要将ToT真正运转起来，作者将其解耦为四个高度模块化的核心组件：
- 1.**思想分解（Thought Decomposition）**：怎么把复杂问题拆解？一个Thought可以是一个词、一个方程式，或者一整段写作计划。关键在于拆解得既要让LLM能产生多样化的选择，又要大到足够让LLM去评估它的潜力。
- 2.**思想生成（Thought Generator）**：当前状态如何向下长出新分支？论文给出了两种策略：
  - 独立同分布采样（i.i.d.sampling）：适用于思路空间丰富、自由度高的任务（如创意写作），通过多次独立采样获得多样性。
  - 顺序式提案（$Sequential\ proposal$）：适用于思路空间约束性强、粒度小的任务（如填字游戏），在同一个context下让大模型一次性生成多个不同分支，避免重复。
- 3.**状态评估（State Evaluator）**：如何决定哪个分支值得走下去？传统搜索靠人工规则或专门训练的模型，ToT则让LLM当自己的裁判：
  - 独立状态评估（$Value\ indenpently$）：独立审视每个状态，给出分数或分类（如”确定能成”、”有可能”、”绝无可能”），用于快速剪枝。
  - 跨状态投票（$Vote\ across\ states$）：让LLM对比多个候选项并票选出最好的，适用于难以绝对量化评分的开放性任务。
- 4.**搜索算法（Search Algorithm）**：结合上述组件，套用经典的搜索算法。例如树深度浅时用广度优先算法（BFS），树深度深时用带有回溯机制的深度优先搜索（DFS）。


## 6. 方法细节与实验设计（Method & Experiments）
论文通过三个硬核任务来验证ToT的威力，这里以最经典的“24点游戏（Game of 24）”为例来看看它是如何运转的。输入4个数字，只用加减乘除算出24.

在ToT框架下，这个问题被拆解为这样：
- 1.**思想定义**：总共需要3个步骤。每一步就是一个中间方程式。
- 2.**思想生成**：在每一步。给定剩下的数字，让LLM提出多种可能的下一步计算（顺序式提案）。
- 3.**状态评估**：让LLM充当裁判，对每一个中间状态打上标签（sure/likely/impossible）。例如，当剩下的数字太大时，LLM会利用常识判断为impossible，算法会直接剪枝，停止这一分支的探索。
- 4.**搜索策略**：采用广度优先搜索（BFS），每一步只保留最靠谱的b=5个分支继续往下走。



## 7. 实验结果（Results）
![](https://img.wemd.app/1774577856783_et9e9b.png)

实验结果可谓降维打击。在24点游戏中，即使是最强的GPT-4，使用传统的思维链（CoT）成功率仅有4.0%。而采用了ToT（b=5）框架后，成功率直接飙升至**74%**！

为什么提升这么大呢？在错误分析（Error Analysis）给出了***直击灵魂***的答案：在使用CoT时，超过60%的失败实际上发生在第一步。由于LLM本质上是从左到右的自回归生成，一旦第一步选错了方向。后续的推导就算逻辑再严密，也全盘皆输，根本无法自救。ToT的价值正是赋予了模型”先看后走”和”试错剪枝”的能力。


## 8. 优点（Strengths）
- 1.**赋予了LLM“系统2”的慢思考能力**：彻底打破了自回归模型“一步错，步步错”的魔咒，让大模型真正拥有了类似人类的“先看后走”的前瞻能力与“剪枝回溯”的自我纠错能力。
- 2.**极高的模块化与可插拔性**：ToT并不是一个黑盒，它的“思想拆解”、“生成”、“评估”和“搜索算法”都是解耦的，开发者可以根据具体任务灵活替换组件（比如说根据树的深度切换BFS或DFS）。


## 9. 局限性（Limitations）
- 1.**高昂的算力与Token成本**：天下没有免费的午餐。根据论文附录的成本分析，在24点游戏中执行一次ToT需要消耗约5.5K tokens，其计算成本几乎等同于运行100次普通的CoT。这种“用推理期算力换取智能”的代价，在当前API计费模式下非常昂贵。
- 2.**并非所有任务都需要ToT**：作者坦言，对于GPT-4本身就已经很擅长的常规NLP任务或简单问答，引入ToT并不会带来显著收益，反而会白白浪费时间和算力。
  论好钢必须用在需要长程规划和复杂决策的刀刃上这回事儿。


## 10. 我的理解（My Thoughts）
看完这篇论文，最大的启发是：ToT绝不仅仅是一个进阶的Prompt技巧，而是***一种全新的Agent系统架构设计***。
过去我们总是在“如何向大模型提问“上死磕，而ToT告诉我们，通往AGI的另一条路是 *”系统工程”*。它巧妙地将经典的传统AI搜索算法（BFS/DFS）与现代大模型的生成能力结合了起来。大模型不再是一个黑盒的”算命先生“，而是成为了搜索树上的”节点扩展器“与”启发式评估函数“。***这证明了在推理阶段投入更多算力（Inference-time Compute）来换取更强的认知能力，是一条完全可行的路径。***



## 11. 可以改进的方向（Future Work）
尽管 ToT 效果惊人，但作为早期的探索框架，依然有很大的优化空间：
1. **破除自我评估的幻觉（Evaluation Bottleneck）：** 目前 ToT 依赖 LLM “左脚踩右脚”自己给自己打分，这很容易产生盲目自信。未来可以引入轻量级的 ML 模型（如专门的奖励模型 Reward Model）来做打分，或者采用多 Agent 交叉验证（Multi-Agent Debate）来提升评估的客观性。
2. **结合外部工具反馈（Tool Use / Grounding）：** 对于有客观标准的环境（如写代码、数学计算），Agent 完全可以调用外部工具（如代码解释器、计算器）来获取真实的执行反馈，用真实的 Environment Feedback 取代 LLM 的主观评估，彻底消灭幻觉。
3. **动态路由搜索（Dynamic Search）：** 未来的系统应该学会“动态切换”，遇到简单问题直接 System 1（自回归）秒答，遇到复杂卡点再自动触发 System 2（ToT 展开），从而平衡算力成本与成功率。



## 12. 参考资料（References）

**Tree of Thoughts (ToT)**: Yao, S., Yu, D., Zhao, J., Shafran, I., Griffiths, T. L., Cao, Y., & Narasimhan, K. (2023). **Tree of Thoughts: Deliberate Problem Solving with Large Language Models**. _Advances in Neural Information Processing Systems (NeurIPS)_.

**Chain-of-Thought (CoT)**: Wei, J., Wang, X., Schuurmans, D., Bosma, M., Chi, E., Le, Q., & Zhou, D. (2022). **Chain of thought prompting elicits reasoning in large language models**. _Advances in Neural Information Processing Systems (NeurIPS)_.

**Self-Consistency (CoT-SC)**: Wang, X., Wei, J., Schuurmans, D., Le, Q., Chi, E., Narang, S., ... & Zhou, D. (2022). **Self-consistency improves chain of thought reasoning in language models**. _arXiv preprint arXiv:2203.11171_.

**ReAct**: Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., & Cao, Y. (2023). **ReAct: Synergizing Reasoning and Acting in Language Models**. _International Conference on Learning Representations (ICLR)_.




