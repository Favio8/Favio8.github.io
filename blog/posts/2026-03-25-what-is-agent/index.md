---
title: 什么是 Agent？为什么大模型需要它？
date: 2026-03-25
tags: [Architecture]
excerpt: 从 ChatGPT 到 AutoGPT，我们看到了大模型能力的飞跃，但单纯的语言理解已经无法满足复杂任务的需求。本文从零开始，梳理 Agent 的定义、它解决的核心问题，以及为什么 Agent 是 LLM 发展的下一场革命。
readTime: 8 min
cover: assets/img/post-cover-what-is-agent.jpg
---

## 一、Agent 的定义

在 AI 领域，**Agent（智能体）**指的是能够自主感知环境、做出决策并执行动作以达成目标的系统。传统的软件 Agent（如 RPA 机器人）依赖预定义规则工作；而基于 LLM 的 Agent，则利用大模型的推理能力，在动态环境中规划行为序列。

> "An agent is a system that uses LLM to determine which actions to take and in which sequence, then executes them."
> — Anthropic, 2024

换句话说，Agent 并不只是"回答问题"，而是：

- **感知**：理解当前状态（用户指令、文件内容、API 返回结果等）
- **规划**：将复杂任务拆解为可执行的子步骤
- **执行**：调用工具（搜索、代码执行、文件读写等）完成具体操作
- **反思**：评估结果，若失败则调整策略重新尝试

## 二、为什么 LLM 需要 Agent 架构？

纯 LLM 的能力有三大根本性局限：

### 1. 知识截止日期

模型权重在训练时冻结，无法获取实时信息。Agent 可以通过调用搜索 API、读取数据库来突破这一限制。

### 2. 无法执行外部操作

LLM 只能输出文本，无法真正"做事"。Agent 通过工具调用（Tool Use），让 LLM 能够操作文件系统、调用 API、控制软件。

### 3. 长程推理的上下文限制

当任务跨越几十个步骤时，上下文窗口会溢出。Agent 架构通过记忆系统（Memory）将关键信息持久化，让长程任务成为可能。

## 三、Agent 的核心组件

一个完整的 LLM Agent 通常由以下组件构成：

- **规划器（Planner）**：负责任务分解，常用 CoT（Chain-of-Thought）、ToT（Tree-of-Thought）
- **工具库（Tool Set）**：搜索引擎、代码解释器、文件操作、数据库查询等
- **记忆系统（Memory）**：短期上下文 + 长期历史存储与检索
- **执行器（Executor）**：调用工具并处理返回结果的循环控制器
- **评估器（Evaluator）**：判断当前状态是否达成目标，决定是否继续

## 四、一个最简单的 Agent 循环

```python
while not goal_achieved:
    thought = llm.think(context)      # LLM 思考当前状态
    action = parse_action(thought)     # 解析出要执行的 action
    observation = execute(action)       # 执行 action，获取反馈
    context.append(observation)        # 将结果写回 context
    if failed_attempts > max_retries:   # 重试上限保护
        break
```

这段伪代码展示了 ReAct（Reasoning + Acting）范式的核心思想：**思考与行动交替进行，直到任务完成**。

## 结语

Agent 并不是大模型的"插件"，而是重新定义了 LLM 的使用方式——从被动回答，到主动规划并执行复杂任务。这是通向 AGI 的必经之路，也是当前 AI 研究最激动人心的方向之一。

接下来的文章，我会深入探讨几种主流 Agent 架构（ReAct、Plan-and-Execute、Multi-Agent），以及如何设计可靠的记忆系统。敬请期待。
