export type SpeedStepId = "understand" | "angle" | "material" | "outline";

export interface StepPrompt {
  id: string;
  headline: string;
  helper: string;
  example: string;
  keywords: string[];
}

export interface SpeedStepMeta {
  id: SpeedStepId;
  title: string;
  timebox: string;
  summary: string;
  goals: string[];
  prompts?: StepPrompt[];
}

export interface StatementField {
  id: string;
  label: string;
  placeholder: string;
  helper: string;
}

export interface MaterialNode {
  id: string;
  label: string;
  angle: string;
  spark: string;
}

export interface MaterialCluster {
  id: string;
  title: string;
  description: string;
  color: string;
  nodes: MaterialNode[];
}

export interface OutlineSegment {
  id: string;
  label: string;
  focus: string;
  hint: string;
}

export interface GuidanceTip {
  id: string;
  title: string;
  body: string;
}

export const SPEED_STEPS: SpeedStepMeta[] = [
  {
    id: "understand",
    title: "① 审题：拆解命题意图",
    timebox: "1分钟",
    summary:
      "极速扫描题干，找出限制语、价值判断与写作场景，先锁定“写什么”再谈怎么写。",
    goals: [
      "划出题干中的主语/客体、价值词与限制条件",
      "判断文体与角度，明确读者期待",
      "生成一条能点醒自己的提示语"
    ],
    prompts: [
      {
        id: "audience",
        headline: "我正在跟谁说话？",
        helper: "界定读者对象能决定语言姿态与论证深度。",
        example: "如果是写给社团新人，语气要亲切并强调行动步骤。",
        keywords: ["读者", "语域", "语气"]
      },
      {
        id: "pain-point",
        headline: "题干真正担心的问题是什么？",
        helper: "尝试把题目翻译成一句日常抱怨或期待。",
        example:
          "命题：谈谈“数字文明”。翻译：大家担心技术冷漠，请给出暖心的答案。",
        keywords: ["问题意识", "隐含焦虑"]
      },
      {
        id: "value",
        headline: "题目暗示的价值立场？",
        helper: "抓住褒义/贬义词，判断态度范围。",
        example:
          "“弘扬传统文化”意味着肯定态度，但仍要说明对当下的现实意义。",
        keywords: ["价值观", "立场", "语感"]
      }
    ]
  },
  {
    id: "angle",
    title: "② 立意：搭建中心论点",
    timebox: "2分钟",
    summary:
      "用一句三段式中心句把立场、理由与行动连成线，确保论证主轴能贯穿全文。",
    goals: [
      "写出一句包含立场、原因、行动的中心句",
      "挑出最能支撑立场的核心价值词",
      "确定全文要回答的关键问题"
    ]
  },
  {
    id: "material",
    title: "③ 选材：抓取支撑素材",
    timebox: "4分钟",
    summary:
      "像脑图一样布置素材节点——人物、事件、数据、比喻——并选出最有张力的组合。",
    goals: [
      "至少挑选 3 个来源不同的素材节点",
      "为每个素材写下一句“为什么 relevant”",
      "决定素材在文章中承担的功能（铺垫/论证/对比）"
    ]
  },
  {
    id: "outline",
    title: "④ 构架：落笔成文",
    timebox: "3分钟",
    summary:
      "把中心句拆成段落任务，安排起承转合与金句位置，形成可直接落笔的段落提纲。",
    goals: [
      "写出 4~5 个段落标题",
      "标注每段的论证任务与要使用的素材",
      "准备一句收束全文、向未来延伸的结语"
    ]
  }
];

export const STATEMENT_FIELDS: StatementField[] = [
  {
    id: "scenario",
    label: "情境",
    placeholder: "例如：愈演愈烈的短视频成瘾",
    helper: "描述眼前的问题或变化，给读者画面感。"
  },
  {
    id: "position",
    label: "价值判断",
    placeholder: "例如：需要以节制与共情来重新设计算法",
    helper: "用一个态度词+动词，清晰表态。"
  },
  {
    id: "action",
    label: "行动指向",
    placeholder: "例如：让技术回到服务人的初衷",
    helper: "说明要做什么/拥抱怎样的未来。"
  }
];

export const STATEMENT_PREVIEW_TEMPLATE =
  "面对{{scenario}}，我们应当{{position}}，从而{{action}}。";

export const MATERIAL_CLUSTERS: MaterialCluster[] = [
  {
    id: "people",
    title: "人物案例",
    description: "把抽象价值落地成可共鸣的真实面孔。",
    color: "#60a5fa",
    nodes: [
      {
        id: "yuancode",
        label: "袁隆平守住“稻谷之海”",
        angle: "技术以人为本的温度",
        spark: "小处写每日巡田，大处连到国家粮食安全"
      },
      {
        id: "yasmin",
        label: "清洁工 Yasmin 的数字识字课",
        angle: "技术普惠与数字公平",
        spark: "讲述社区志愿者如何用手机课堂消弭城乡差距"
      },
      {
        id: "huangdanian",
        label: "黄大年的归国选择",
        angle: "个人理想与时代使命",
        spark: "以回国科研故事落点“向内燃烧”的担当"
      }
    ]
  },
  {
    id: "evidence",
    title: "数据洞察",
    description: "用数字强化可信度或制造反差。",
    color: "#facc15",
    nodes: [
      {
        id: "report-mental",
        label: "世界卫生组织：青年焦虑指数飙升 25%",
        angle: "数字时代的心理健康隐忧",
        spark: "引出技术发展必须包含情绪照护"
      },
      {
        id: "city-carbon",
        label: "深圳 2030 年碳排强度降低 65%",
        angle: "制度创新带动绿色转型",
        spark: "强调系统治理与协同治理的重要性"
      },
      {
        id: "village-livestream",
        label: "乡村直播带货年销售额破 100 亿",
        angle: "数字经济的城乡反哺",
        spark: "说明技术激活传统产业的生命力"
      }
    ]
  },
  {
    id: "contrast",
    title: "对比视角",
    description: "用反面或历史镜像制造思辨空间。",
    color: "#f472b6",
    nodes: [
      {
        id: "library-vs-feed",
        label: "图书馆式深阅读 vs. 信息流刷屏",
        angle: "耐心的价值",
        spark: "提醒读者数字焦虑背后的选择自由"
      },
      {
        id: "apollo-gig",
        label: "阿波罗计划与“零工经济”",
        angle: "组织方式的演化",
        spark: "从协同到碎片，呼唤新的集体主义"
      },
      {
        id: "handcraft-ai",
        label: "手作匠人与 AI 生成",
        angle: "人的不可替代性",
        spark: "以温度与瑕疵作为价值，反向衬托自动化"
      }
    ]
  }
];

export const OUTLINE_SEGMENTS: OutlineSegment[] = [
  {
    id: "hook",
    label: "开篇引题",
    focus: "用画面或反差把读者拉进问题现场",
    hint: "可以引用人物故事或数据作为引子"
  },
  {
    id: "stance",
    label: "亮明立场",
    focus: "抛出你的中心句，解释为何此刻必须这样选择",
    hint: "与审题提示语呼应"
  },
  {
    id: "evidence-a",
    label: "论证一：现实镜头",
    focus: "选用人物/事件素材，展示立场的真实影响",
    hint: "最好包含细节或描写"
  },
  {
    id: "evidence-b",
    label: "论证二：思辨拓展",
    focus: "用对比或数据推开视野，提供新的解释",
    hint: "回答读者心中的“又如何”"
  },
  {
    id: "closing",
    label: "结尾升华",
    focus: "呼吁行动或展望未来，把情绪收束在希望里",
    hint: "可再点题或呼应开头"
  }
];

export const STEP_TIPS: Record<SpeedStepId, GuidanceTip[]> = {
  understand: [
    {
      id: "highlight",
      title: "高亮限制词",
      body: "把题干中的限制语（例如“在校园内”“青年视角”）圈出，能避免跑题。"
    },
    {
      id: "mirror",
      title: "换位复述",
      body: "用“所以你想让我…”试着复述命题，检验理解是否精准。"
    }
  ],
  angle: [
    {
      id: "verb-first",
      title: "以动词定方向",
      body: "中心句里的动词决定文章气质：是“拥抱”“修复”还是“点燃”？"
    },
    {
      id: "sound-check",
      title: "朗读一次",
      body: "大声读中心句，确认节奏流畅、措辞坚定。"
    }
  ],
  material: [
    {
      id: "tri-source",
      title: "三源法则",
      body: "优先选择来自人物、数据、对比三种不同维度的素材，论证更立体。"
    },
    {
      id: "why-now",
      title: "回答“凭什么”",
      body: "每放入一个素材，就写下一句它“凭什么能打动读者”。"
    }
  ],
  outline: [
    {
      id: "one-sentence",
      title: "段落一句话",
      body: "确保每个段落都能被一句话概括，否则内容容易松散。"
    },
    {
      id: "call-forward",
      title: "预留金句",
      body: "提前在纲要里标记呼应开头的句子，写作时就不会忘。"
    }
  ]
};

export const PRACTICE_SUGGESTIONS = [
  {
    id: "timer",
    title: "准备 10 分钟倒计时",
    description: "真实模拟考场节奏，给每一步一个响亮的提示声。"
  },
  {
    id: "peer",
    title: "和同伴互换材料",
    description: "练习完把纲要给同伴复述，检验结构是否清晰。"
  },
  {
    id: "rewrite",
    title: "隔天再写一次",
    description: "第二天带着同一套素材重写，巩固熟练度。"
  }
];

export const CTA_CONTENT = {
  headline: "想把速成法用到真题上？",
  body: "挑一套近三年的省卷，按照这份流程完成 3 套练习，配合计时器体验节奏感。",
  actionLabel: "开始实战演练",
  actionHref: "https://www.yuanfudao.com/essay-practice",
  secondaryHint: "或者把这张流程打印贴在书桌前，每天晨读 5 分钟复盘。"
};
