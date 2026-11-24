---
title: Attention Is All You Need
type: paper
authors: Vaswani et al.
year: 2017
source: NeurIPS
url: https://arxiv.org/abs/1706.03762
tags: [nlp, architecture]
---
# Attention Is All You Need

RNN 없이 self-attention만으로 시퀀스를 처리하는 Transformer를 제안했다.

- 토큰 간 거리가 멀어도 한 번의 행렬곱으로 연결된다. 순차 의존이 사라져 병렬화가 쉬워진다.
- 계산량은 시퀀스 길이의 제곱으로 늘어난다. 긴 문맥에서 병목이 되는 이유이다.
- 위치 정보는 구조가 아니라 positional encoding으로 따로 넣는다.

후속 연구: [[bert]]는 인코더만, [[scaling-laws]]는 이 구조를 키웠을 때의 경향을 다룬다.
