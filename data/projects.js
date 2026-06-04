// ============================================================
// PROJECTS — 새 프로젝트 추가 시 이 배열에 항목을 추가하세요.
// id       : 사이드바 파일트리에 표시되는 이름 (언더스코어 사용)
// title    : 프로젝트 카드 헤딩 텍스트
// github_url / github_label : GitHub 링크 및 표시 텍스트
// tags     : 배지 목록 (첫 번째 태그가 강조색으로 표시됨)
// sections : 번호 + 설명 블록 (italic: true/false)
// ranking  : 보조 메타데이터
// system_info : 공개 가능한 설명 목록
// ============================================================

const PROJECTS = [
  {
    id: "Neural_Emptiness",
    title: "Neural Emptiness Engine",
    github_url: "https://github.com/zen-matrix/neu-emp",
    github_label: "github.com/zen-matrix/neu-emp",
    tags: ["WEB_SERVICE", "AI_SYNTHESIS", "ZEN_ALGORITHM"],
    sections: [
      {
        number: "01",
        text: "Logic module designed to simulate the state of Sunyata within a distributed ledger. This engine processes noise into silence with 99.9% efficiency.",
        italic: true
      },
      {
        number: "02",
        text: "Core architecture leverages dithered neural weights to prevent overfitting in spiritual contexts. All protocols remain stateless.",
        italic: false
      }
    ],
    ranking: [
      { rank: 1, name: "hypespot", active: true },
      { rank: 2, name: "hypespot", active: true },
      { rank: 3, name: "hypespot", active: false },
      { rank: 4, name: "hypespot", active: false }
    ],
    system_info: [
      "Digital enlightenment achieved through procedural generation.",
      "All system dependencies have been fully decoupled from linear reality."
    ]
  },

  { id: "Zen_Matrix_Core", title: "Zen Matrix Core" },
  { id: "HypeSpot_V2", title: "HypeSpot V2" }
];
