---
title: BERT
type: paper
authors: Devlin et al.
year: 2018
source: NAACL 2019
url: https://arxiv.org/abs/1810.04805
tags: [nlp, pretraining]
---
# BERT

마스크 언어 모델링(MLM)으로 양방향 문맥을 사전학습한 인코더.

- 입력의 15%를 가리고 맞추게 해서 좌우 문맥을 동시에 쓴다.
- 사전학습 후 태스크별 헤드만 붙여 파인튜닝한다.
- 생성에는 맞지 않는다. 생성 쪽 흐름은 [[scaling-laws]]와 [[instructgpt]]로 이어진다.

기반 구조는 [[attention-is-all-you-need]].
