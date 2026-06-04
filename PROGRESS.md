# PROGRESS

## [2026-06-04] Task: Connect pages via navigation menu buttons

### 완료 내용
- `index.html` 상단 nav PROJECTS/PAPERS/STUDY/ABOUT 링크를 실제 페이지 경로로 연결
- `index.html` 우측 사이드바 폴더 헤딩(Projects/Papers/Study Lists) 및 About 항목을 `<a>` 태그로 변환, 각 페이지로 연결
- `zen_matrix_soft_papers/code.html` 신규 생성 (Zen Matrix Soft 디자인, `data/papers.js` 연동)
- `zen_matrix_soft_study_archive_toggle_nav/code.html` — nav/sidebar/footer 링크 연결
- `zen_matrix_soft_about_me_toggle_nav/code.html` — nav/sidebar/footer 링크 연결
- `zen_matrix_soft_project_hub_toggle_nav_1/code.html` — nav/sidebar/footer 링크 연결, 현재 페이지 active 스타일 적용
- `data/render.js` — `renderSidebar()` 사이드바 동적 항목 경로를 `window.location.pathname` 기반 base path 감지로 실제 페이지 URL 사용

### 구현 결정사항
- 루트(`index.html`)에서는 `zen_matrix_soft_xxx/code.html` 형태의 상대 경로 사용
- 서브디렉토리 페이지에서는 `../zen_matrix_soft_xxx/code.html` 형태 사용
- PROJECTS는 `variant_1`만 연결 (variant_2는 비연결)
- 각 페이지의 active nav 항목에 `text-primary border-b-2 border-primary-fixed` 스타일 적용
- `render.js` base path 감지: `window.location.pathname`이 `/zen_matrix_soft_`를 포함하면 `../` prefix 사용

### 다음 단계
- `zen_matrix_soft_papers/code.html` 콘텐츠 보강 (abstract 추가, 디자인 세부 조정)
- `zen_matrix_soft_project_hub_toggle_nav_2` 연결 여부 결정
- `zen_matrix_soft_landing_page_with_toggleable_right_nav/code.html` (구형 랜딩) nav 링크 업데이트
