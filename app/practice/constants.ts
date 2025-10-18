export type PracticeMode = "sentence" | "paragraph";

export interface ToolHint {
  id: string;
  name: string;
  mnemonic: string;
  description: string;
  example: string;
}

export interface PracticePrompt {
  id: string;
  label: string;
  summary: string;
  systemPrompt: string;
  helperText: string;
  placeholder: string;
  toolIds: string[];
  charLimit?: number;
}

interface PracticeSectionDefinition {
  title: string;
  description: string;
  prompts: PracticePrompt[];
  defaultCharLimit: number;
}

export const TOOL_HINTS: Record<string, ToolHint> = {
  rewrite: {
    id: "rewrite",
    name: "层层改写",
    mnemonic: "ACRE — 调整 (Adjust) · 清晰 (Clarify) · 重组 (Reshape) · 强调 (Emphasise)",
    description:
      "先调整词语与语序，再检查信息是否清晰，最后重组句式并强调关键信息。",
    example:
      "例：原句“解决方案需要很多资源” → 改写“该方案需要投入大量人力与预算”。"
  },
  tone: {
    id: "tone",
    name: "语气雕刻",
    mnemonic: "3T — Target · Tone · Texture",
    description:
      "先确认目标读者 (Target)，再决定语气 (Tone)，最终补足细节纹理 (Texture)。",
    example:
      "例：面向客户时，用温和肯定语气：“我们很乐意协助您完成...”。"
  },
  scaffold: {
    id: "scaffold",
    name: "段落支架",
    mnemonic: "SPE — Statement · Proof · Echo",
    description:
      "段落先抛出观点 (Statement)，接着给出数据/例证 (Proof)，最后回扣主题 (Echo)。",
    example:
      "例：观点句→引用数据→总结意义，形成完整的说明链条。"
  },
  imagery: {
    id: "imagery",
    name: "具象化",
    mnemonic: "SEE — Situation · Emotion · Evidence",
    description:
      "通过描述具体情境、情绪与证据，让抽象概念更易于理解。",
    example:
      "例：把“流程复杂”改写为“员工需要跨越七个审批节点才能完成”。"
  },
  checklist: {
    id: "checklist",
    name: "表达检查表",
    mnemonic: "精度 · 连贯 · 行动",
    description:
      "提交前快速检查三个面向：信息是否准确、逻辑是否连贯、行动是否明确。",
    example:
      "例：确保段落末尾点出下一步行动或预期结果。"
  }
};

export const PRACTICE_SECTIONS: Record<PracticeMode, PracticeSectionDefinition> = {
  sentence: {
    title: "句子改写",
    description: "使用预设提示练习将句子改写得更清晰、有说服力。",
    defaultCharLimit: 320,
    prompts: [
      {
        id: "sentence-clarity",
        label: "澄清重点",
        summary: "强调关键信息，让句子一次读懂。",
        systemPrompt:
          "你是一位写作教练，请改写以下句子，使其结构清晰、重点突出，同时避免冗长或模糊的表述。",
        helperText: "聚焦核心信息，适度拆分长句并替换模糊词。",
        placeholder: "请粘贴需要改写的句子，例如：产品上线时间需要再确认。",
        toolIds: ["rewrite", "imagery", "checklist"],
        charLimit: 320
      },
      {
        id: "sentence-tone",
        label: "调整语气",
        summary: "根据对象调整语气与措辞。",
        systemPrompt:
          "请将以下句子改写为既专业又亲切的语气，保持事实准确，并让读者清楚下一步行动。",
        helperText: "确认对象是谁，再调整语气与用词温度。",
        placeholder: "例：请把“你必须尽快提交”调整为更温和的表达。",
        toolIds: ["tone", "rewrite", "checklist"],
        charLimit: 280
      }
    ]
  },
  paragraph: {
    title: "段落写作",
    description: "通过段落模板练习说明、说服与行动号召。",
    defaultCharLimit: 1200,
    prompts: [
      {
        id: "paragraph-briefing",
        label: "说明型段落",
        summary: "用 SPE 支架清楚说明现况与需求。",
        systemPrompt:
          "请使用“SPE — Statement, Proof, Echo”结构撰写一段说明，开头点出重点资讯，接着提供数据或证据佐证，最后回扣意义与下一步。",
        helperText: "让读者明白“发生什么”、“为什么重要”以及“接下来怎么办”。",
        placeholder: "例如：向团队说明本周冲刺的重点与支援需求。",
        toolIds: ["scaffold", "imagery", "checklist"],
        charLimit: 1000
      },
      {
        id: "paragraph-persuasion",
        label: "说服型段落",
        summary: "结合案例与情感，促发行动。",
        systemPrompt:
          "撰写一段说服性的文字：先描述读者面临的场景，再说明解决方案与好处，最后给出明确的行动邀请。",
        helperText: "示例、好处与行动要紧密相扣。",
        placeholder: "例如：劝说客户参加全新的培训课程。",
        toolIds: ["imagery", "tone", "checklist"],
        charLimit: 1100
      }
    ]
  }
};
