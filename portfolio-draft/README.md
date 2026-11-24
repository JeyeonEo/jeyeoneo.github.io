# Personal Portfolio

GitHub Pages로 배포하는 정적 포트폴리오입니다. 빌드 도구 없이 HTML/CSS/JS로 동작하고, 노트 그래프용 데이터만 Node 스크립트로 생성합니다.

## 구조

| 경로 | 내용 |
|---|---|
| `data/profile.json` | 이름, 소개, 링크, 약력 타임라인 |
| `data/books.json` | 읽은 책 |
| `data/courses.json` | 수강한 인강, 자격증 |
| `data/writings.json` | 논문, 테크니컬 에세이 |
| `data/teaching.json` | 강의 내역 |
| `data/products.json` | 발행한 인강, 전자책 |
| `notes/*.md` | 논문 메모 (그래프의 노드) |
| `data/notes.json` | `notes/*.md`에서 생성됨. 직접 수정하지 않음 |

데이터는 지금 한글 문자열만 들어 있습니다. 영어 모드에서도 한글이 그대로 나오고, 메뉴·버튼 같은 UI 라벨만 영어로 바뀝니다. 영어 버전을 추가하려면 해당 항목만 `"title": { "ko": "...", "en": "..." }` 형태로 바꾸면 그 항목부터 영어로 나옵니다.

## 노트 작성

`notes/파일명.md`를 만들고 맨 위에 frontmatter를 적습니다.

```md
---
title: 논문 제목
type: paper          # paper | essay
authors: 저자
year: 2020
source: NeurIPS
url: https://arxiv.org/abs/...
tags: [nlp, scaling]
---
# 논문 제목

내용. 다른 메모는 [[파일명]] 또는 [[메모 제목|표시할 글자]] 로 연결합니다.
```

연결된 쌍이 그래프의 선이 됩니다. 첫 번째 태그가 노드 색이 되고, `type: essay`는 속이 빈 원으로 그려집니다.

## 로컬 확인

```bash
node scripts/build-notes.mjs
python3 -m http.server 8000
```

`http://localhost:8000` 에서 확인합니다. `file://` 로 열면 JSON을 읽지 못합니다.

## 배포

1. GitHub에 저장소를 만들고 이 폴더를 `main` 브랜치로 push 합니다.
2. 저장소 Settings → Pages → Source를 **GitHub Actions**로 바꿉니다.
3. push 할 때마다 `.github/workflows/deploy.yml`이 `data/notes.json`을 다시 만들어 배포합니다.

저장소 이름이 `<아이디>.github.io`이면 주소는 `https://<아이디>.github.io/`, 그 외에는 `https://<아이디>.github.io/<저장소>/` 입니다. 모든 경로가 상대 경로라서 어느 쪽이든 그대로 동작합니다.

## 바꿔야 할 곳

- 프로필 사진: `data/profile.json`에 `"photo": "img/me.jpg"` 추가
- 색상: `css/style.css` 맨 위 `:root`
- 마퀴 문구: `js/app.js`의 `drawMarquee`
