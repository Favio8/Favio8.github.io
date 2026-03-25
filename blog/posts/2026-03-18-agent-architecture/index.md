---
title: Agent 架构解析：ReAct、Plan-and-Execute 与 Multi-Agent
date: 2026-03-18
category: Agent随笔
featured: true
tags: [Architecture, Planning]
excerpt: 目前主流的 Agent 架构有三种范式：ReAct 的思考-行动循环、Plan-and-Execute 的先规划后执行、以及最近火热的 Multi-Agent 协作。本文通过流程图与代码示例，对比三种架构的优劣与适用场景。
readTime: 12 min
---

在上一篇文章中，我们定义了 Agent 的基本概念：一个由 LLM 驱动的感知-规划-执行-反思循环。但具体如何组织这个循环，存在多条技术路径。本文将深入分析目前最主流的三种架构。

## 一、ReAct：思考与行动交织

**ReAct**（Reasoning + Acting）由普林斯顿大学和 Google Research 在 2023 年提出，核心理念是：*将推理过程显式化，让 LLM 在每一步都同时输出"思考"和"行动"*。

ReAct 的典型输出格式：

```
Thought: 我需要先搜索关于 Transformer 的最新论文。
Action: search[query="Transformer architecture 2024"]
Observation: 找到了 10 篇相关论文，排名第一的是 ...
Thought: 排名第一的论文看起来最相关，我需要获取摘要。
Action: browse[url="https://arxiv.org/xxx"]
Observation: [论文摘要内容]
...
```

ReAct 的优势在于**透明可控**：我们可以清楚看到 Agent 的推理过程，便于调试。但它的局限也很明显：每一步都需要重新调用 LLM，推理成本较高，且在长程任务中容易陷入"思考链断裂"。

### ReAct 适用场景

- 需要高可解释性的任务（客服、医疗咨询）
- 搜索 + 信息收集类任务
- 中等长度（5-15 步）的任务链

## 二、Plan-and-Execute：先想后做

**Plan-and-Execute**（规划-执行）架构由 BabyAGI、AutoGPT 等项目推广，核心理念是：*先一次性规划完整路径，再逐条执行*。

工作流程：

```python
# Step 1: Plan
llm_input = "任务：帮我分析这批销售数据并生成报告"
plan = llm.plan(llm_input)
# 输出: ["Step 1: 读取 CSV 文件",
#        "Step 2: 数据清洗（处理缺失值）",
#        "Step 3: 计算关键指标（GMV、复购率）",
#        "Step 4: 生成可视化图表",
#        "Step 5: 撰写分析报告"]

# Step 2: Execute（循环执行上述计划）
for step in plan:
    result = execute(step)
    if error:
        replan()  # 出错则重新规划
```

优势在于**效率更高**：规划阶段只需要调用一次 LLM，执行阶段可以是简单的预定义动作，不需要每次都调用模型。代价是规划质量依赖模型的全局推理能力，且无法在执行中动态调整。

> Plan-and-Execute 适合"你知道怎么做但懒得做"的任务；
> ReAct 适合"你自己也不确定怎么做，需要边想边探索"的任务。

## 三、Multi-Agent：多角色协作

最新的研究方向是让**多个 Agent 协作**，每个 Agent 有独立的角色、工具和知识。类似于软件工程中的微服务架构：

```
  [User Request]
        |
  [Manager Agent]
  /      |      \
[Research]  [Coder]  [Reviewer]
    |          |          |
[Search]   [Execute]  [Validate]
    \          |         /
      ------[Result]------
```

Manager Agent 负责分解任务并分配给专门的子 Agent：Research Agent 做调研，Coder Agent 写代码，Reviewer Agent 做评审。这种架构在复杂软件工程任务中表现出色（如 Devin AI、Cognition 的 Devin）。

### Multi-Agent 的核心挑战

- **通信开销**：Agent 间消息传递的 token 消耗巨大
- **状态一致性**：多个 Agent 共享的上下文需要精心设计
- **死锁与循环**：Agent 间可能相互等待或陷入循环论证

## 四、架构对比总结

三种架构各有优劣，场景适配是关键：

- **ReAct**：透明、可控，适合需要人类监督的任务
- **Plan-and-Execute**：高效、资源友好，适合流程相对固定的任务
- **Multi-Agent**：强大、复杂，适合需要多角色协作的开放式任务

实际项目中，这三种架构并非互斥。常见的做法是用 Plan-and-Execute 做顶层调度，内部某些步骤用 ReAct 做精细推理，特定子任务交给专门的 Multi-Agent 子系统处理。

下一篇文章，我会深入聊一聊 Agent 的**记忆系统**——短期上下文、长程历史、以及如何在有限窗口内维护"记忆一致性"。
