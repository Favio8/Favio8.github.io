---
title: Agent 的记忆系统：从短期到长期的全链路设计
date: 2026-03-10
category: Agent随笔
featured: false
tags: [Memory, Architecture]
excerpt: 记忆是 Agent 智能的核心。一个好的记忆系统需要同时处理即时上下文、历史摘要与长期知识持久化。本文探讨如何在资源受限的条件下，设计一个高效、可插拔的记忆存储与检索架构。
readTime: 10 min
---

如果说推理是 Agent 的"大脑"，那么记忆就是 Agent 的"硬盘"。没有记忆的 Agent，每次交互都是从零开始；有了记忆，Agent 才能在多次会话中积累经验、保持一致性，完成真正有意义的长程任务。

本文将探讨如何设计一个完整的 Agent 记忆系统，分三层处理不同的记忆需求。

## 一、记忆系统的三层架构

类比人类大脑的信息处理机制，Agent 的记忆也可以分为三个层次：

### 1. 感官记忆（感官输入）

即当前对话窗口内的全部上下文。对 LLM 来说，这就是每次 API 调用时传入的 `messages` 列表。它完整保留当前任务的全部细节，但容量有限（受限于 context window）。

### 2. 工作记忆（短期记忆）

跨轮次保留的关键信息。比如一个多步骤任务中，已经完成的前 5 个步骤的结果、用户的核心偏好设置、当前任务的整体进度。工作记忆通常存在内存中，容量比感官记忆大，但会话结束会丢失。

### 3. 长期记忆（持久记忆）

跨会话积累的知识、经验、摘要。需要持久化到外部存储（文件、数据库、向量数据库）。通过检索（Retrieval）在需要时召回。

> **记忆系统设计的核心矛盾：**
> 记忆越完整，推理越准确，但 token 成本越高、检索越慢。

## 二、记忆的写入策略

什么时候该写入记忆？常见策略有两种：

### 策略 A：每轮写入

每个 Agent 循环结束后，把关键信息写入记忆。这种方式简单，但容易造成记忆膨胀，且大量重复信息会干扰检索质量。

### 策略 B：摘要触发（推荐）

只有当对话长度超过阈值（如 20 轮），才触发摘要生成，将前 N 轮压缩为一段摘要。这种方式更高效，但摘要过程本身需要消耗 LLM 资源。

```python
# 简单的摘要触发逻辑
if len(conversation_history) > MAX_TURNS:
    summary = llm.summarize(conversation_history[-MAX_TURNS:])
    memory_store.add({"type": "summary", "content": summary})
    conversation_history = conversation_history[-KEEP_TURNS:]
    # 保留最后 KEEP_TURNS 轮 + 摘要，保持上下文连贯性
```

## 三、记忆的检索策略

记忆只有被正确召回才有价值。检索策略决定了 Agent 能否在需要时快速找到相关信息。

### 向量检索（Vector Retrieval）

最常用的方案：将记忆文本 embedding 后存入向量数据库（如 ChromaDB、FAISS），检索时用余弦相似度找最相关的记忆片段。

```python
import chromadb

client = chromadb.Client()
collection = client.get_collection("agent_memory")

# 写入
embedding = embed_text(memory_item)
collection.add(ids=[memory_id], embeddings=[embedding], documents=[memory_text])

# 检索
results = collection.query(query_embeddings=[query_embedding], n_results=3)
```

### 基于时间的衰减（Temporal Decay）

给每条记忆附加一个"重要性分数"和"时间戳"，检索时综合考虑相关性和新鲜度，模拟人类记忆遗忘的自然过程。

### 混合检索（Hybrid Retrieval）

将向量检索与关键词检索（BM25）结合，取两者的交集结果。实践表明，混合检索在大多数场景下优于单一检索方式。

## 四、实用建议

基于我的实验经验，总结几条实用建议：

- **先简单，后复杂**：先用朴素的 JSON 文件存储 + 全文搜索跑通流程，再在瓶颈处引入向量数据库
- **记忆要结构化**：不要存纯文本，存包含 timestamp、type、importance 等元数据的结构化对象
- **定期清理**：设置记忆的最大容量（如 1000 条），超过后按重要性/新鲜度淘汰
- **可审计**：Agent 的决策过程最好有日志，记忆写入和检索都应可追溯

记忆系统是 Agent 架构中最容易"做过头"的部分。我的建议是：从最简单的方案开始，在实际使用中发现不足，再逐步升级。

下一次，我会写一篇关于 **Tool Use（工具调用）** 的实战文章，包括如何设计工具接口、如何做工具选择的 LLM prompt 优化。
