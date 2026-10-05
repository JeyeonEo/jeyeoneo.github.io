const PROJECTS = [
  {
    id: "Thinking_KT",
    title: "Thinking-KT",
    tags: ["Knowledge_Tracing", "Reasoning_Model", "Test_Time_Scaling", "Education_AI"],
    sections: [
      { number: "01", text: "Training-free knowledge tracing using small reasoning models, with prediction, personalized feedback, and learning recommendation handled in one framework." },
      { number: "02", text: "The work studies test-time scaling for learner-state prediction instead of relying on a separate fine-tuned KT model for every task." },
      { number: "03", text: "Submitted to ARR October 2026 as Submission #902. A public preprint is available on arXiv.", italic: true }
    ],
    system_info: [
      "STATUS: ARR October 2026 submission",
      "OPENREVIEW: Y3e2cEr0Ws",
      "PREPRINT: arXiv:2601.01708"
    ],
    github_url: "https://openreview.net/forum?id=Y3e2cEr0Ws",
    github_label: "OPENREVIEW / THINKING-KT",
    image_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675' viewBox='0 0 1200 675'%3E%3Crect width='1200' height='675' fill='%23121412'/%3E%3Cg fill='none' stroke='%239caf9f' stroke-width='2' opacity='.5'%3E%3Cpath d='M120 470 C280 180 420 540 580 260 S900 180 1080 420'/%3E%3Cpath d='M120 400 C260 520 430 180 610 410 S900 500 1080 250' opacity='.4'/%3E%3C/g%3E%3Cg fill='%239caf9f'%3E%3Ccircle cx='120' cy='470' r='7'/%3E%3Ccircle cx='580' cy='260' r='7'/%3E%3Ccircle cx='1080' cy='420' r='7'/%3E%3C/g%3E%3C/svg%3E",
    image_label: "THINKING-KT / ARR OCT 2026",
    ranking: [
      { rank: "01", name: "Thinking-KT", active: true },
      { rank: "02", name: "BuddyBench", active: false },
      { rank: "03", name: "Offline RL / UAV", active: false },
      { rank: "04", name: "Enterprise Agentic AI", active: false }
    ]
  },
  {
    id: "BuddyBench",
    title: "BuddyBench & BuddyBench-Sim",
    tags: ["Benchmark", "Personalization", "Synthetic_Data", "Causal_Inference"],
    sections: [
      { number: "01", text: "A privacy-constrained benchmark for pediatric social-communication personalization." },
      { number: "02", text: "BuddyBench-Sim provides a synthetic companion dataset for reproducible evaluation." }
    ],
    system_info: ["PREPRINT: arXiv:2605.28089", "PUBLIC CODE: BuddyBench-Sim"],
    github_url: "https://github.com/JeyeonEo/BuddyBench-Sim",
    github_label: "GITHUB / BUDDYBENCH-SIM"
  },
  {
    id: "Offline_RL_UAV",
    title: "Offline RL for UAV Emergency Network Recovery",
    tags: ["Offline_RL", "UAV", "Sparse_Reward", "Dataset_Quality"],
    sections: [
      { number: "01", text: "An empirical study of how dataset reward ratio and trajectory diversity affect offline RL in sparse-reward UAV recovery tasks." }
    ],
    system_info: ["IEEE Communications Letters 28(5): 1058–1061"],
    github_url: "https://doi.org/10.1109/LCOMM.2023.3339478",
    github_label: "IEEE / DOI"
  },
  {
    id: "Enterprise_Agentic_AI",
    title: "Enterprise Agentic AI Training",
    tags: ["Agentic_AI", "RAG", "Evaluation", "Enterprise_AI"],
    sections: [
      { number: "01", text: "Hands-on AI training and workflow design for engineers and enterprise teams." },
      { number: "02", text: "Focus areas include LLMs, agents, RAG, evaluation, security, cost, and maintainability under real operating constraints." }
    ],
    system_info: ["APPLIED AI / TRAINING", "PUBLIC CLIENT DETAILS OMITTED"],
    github_url: "https://github.com/JeyeonEo",
    github_label: "GITHUB / JEYEONEO"
  }
];