---
title: Training language models to follow instructions with human feedback
type: paper
authors: Ouyang et al.
year: 2022
source: NeurIPS
url: https://arxiv.org/abs/2203.02155
tags: [nlp, alignment]
---
# InstructGPT

사전학습 모델을 SFT, 보상모델, PPO 순으로 사람 선호에 맞춘다.

- 1.3B 모델이 175B 원본보다 사람 평가에서 선호된다. 규모가 전부는 아니라는 근거이며 [[scaling-laws]]와 대비된다.
- 보상모델이 불완전하면 보상 해킹이 생긴다.
