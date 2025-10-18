'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import type { ReactElement, SVGProps } from 'react';

type LearningMode = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
  accent: string;
  metric: string;
};

type ToolPreview = {
  title: string;
  description: string;
  image: string;
  points: string[];
};

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  highlight: string;
};

const heroHeadline = '让每一次教与学都准确抵达学生的下一次突破';

const learningModes: LearningMode[] = [
  {
    id: 'rescue',
    title: '救急模式',
    subtitle: '快速梳理',
    description:
      '针对考前冲刺与短期提分，AI 自动诊断学习薄弱点，生成 7 日急救方案并实时追踪执行情况。',
    icon: LifelineIcon,
    accent: 'from-rose-500/90 via-orange-500/80 to-amber-400/70',
    metric: '72% 学生 1 周内显著提升',
  },
  {
    id: 'boost',
    title: '提分模式',
    subtitle: '系统进阶',
    description:
      '构建长期学习闭环，通过知识图谱和智能练习巩固，保障稳步提分与持续反馈。',
    icon: AscendIcon,
    accent: 'from-violet-500/90 via-indigo-500/80 to-sky-400/70',
    metric: '平均提分 18.6 分/学季',
  },
  {
    id: 'teach',
    title: '教学模式',
    subtitle: '课堂赋能',
    description:
      '为教师提供备课、讲练和作业一体化工具，课堂互动实时可视，因材施教更加轻松。',
    icon: BlackboardIcon,
    accent: 'from-emerald-500/90 via-teal-500/80 to-cyan-400/70',
    metric: '课堂互动提升 2.5 倍',
  },
];

const toolPreviews: ToolPreview[] = [
  {
    title: '精准诊断仪表盘',
    description:
      '全链路可视化掌握学生画像，错题类型、知识掌握度与学习情绪一目了然。',
    image: '/images/tool-diagnostics.svg',
    points: ['多维度热力图分析', 'AI 推荐学习路径', '跨班级对比一键生成'],
  },
  {
    title: 'AI 教案工作坊',
    description:
      '输入教学目标，自动产出教案、练习与点评要点，节省 60% 备课时间。',
    image: '/images/tool-workbench.svg',
    points: ['即时语音转文字', '跨学科素材融合', '课堂互动脚本同步'],
  },
  {
    title: '学习旅程 App',
    description:
      '学生端、家长端同步进度提醒，以鼓励与奖励机制保持学习动能。',
    image: '/images/tool-journey.svg',
    points: ['移动端学习任务推送', '家长反馈实时联动', '正向激励系统'],
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      '“第一次看到孩子主动规划学习，系统推送的练习正中要害，两周后数学卷子再也不是盲点。”',
    author: '张老师',
    role: '重点中学数学组长',
    highlight: '班级平均分领先区内 12 分',
  },
  {
    quote:
      '“课堂实时互动面板让我随时掌握学生状态，讲练结合的节奏变得异常顺滑。”',
    author: 'Liang 教研员',
    role: '区域智慧教育项目负责人',
    highlight: '课堂参与度提升 240%',
  },
  {
    quote:
      '“提分模式的周计划让孩子知道努力的方向，成就感带来持续的好状态。”',
    author: '王女士',
    role: '初三家长',
    highlight: '中考目标顺利达成',
  },
];

const benefits = [
  {
    title: '与教学深度融合',
    description: '遵循课程标准与双减要求，AI 不替代教师，而是让课堂更有温度。',
  },
  {
    title: '数据安全合规',
    description: 'ISO 认证与本地化部署选择，多层加密守护学校与学生隐私。',
  },
  {
    title: '全程服务陪伴',
    description: '专家顾问驻校支持，落地培训与成长营让每位老师都能轻松上手。',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: custom * 0.08,
    },
  }),
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <HeroSection />
      <LearningModesSection />
      <ToolPreviewSection />
      <TestimonialSection />
      <BenefitsSection />
      <FinalCtaSection />
      <HeroBackground />
    </main>
  );
}

function HeroSection() {
  return (
    <section
      id="vision"
      aria-labelledby="vision-heading"
      className="relative isolate px-6 pb-24 pt-28 sm:px-10 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[minmax(0,_1fr)_minmax(320px,_420px)]">
        <div className="relative z-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur"
            role="status"
            aria-live="polite"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            智慧学习·全场景协同
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="space-y-6"
          >
            <h1 id="vision-heading" className="text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {heroHeadline}
            </h1>
            <p className="max-w-xl text-lg text-slate-200/85 sm:text-xl">
              汇聚 AI 洞察、课堂互动与成长陪伴的混合式学习平台。我们帮助学校与机构实现个性化教学、精细化管理，让每位学习者始终被看见、被理解、被激励。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-wrap items-center gap-4"
            role="group"
            aria-label="主要行动"
          >
            <a
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-400/40 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
              href="#learning"
            >
              预约体验
              <span className="ml-2 inline-block rounded-full bg-slate-950/10 px-2 py-0.5 text-sm font-medium">
                立即开启
              </span>
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white/90 backdrop-blur transition hover:-translate-y-0.5 hover:border-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              href="#tools"
            >
              查看产品图谱
            </a>
          </motion.div>

          <motion.dl
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-2 gap-6 text-left text-sm text-slate-300 sm:text-base md:grid-cols-3"
          >
            {[{
              value: '38 所',
              label: '合作试点学校',
            },
            {
              value: '96%',
              label: '教师满意度',
            },
            {
              value: '240 万+',
              label: '精准学习记录',
            }].map((item, index) => (
              <motion.div
                key={item.label}
                variants={fadeInUp}
                custom={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
              >
                <dt className="text-xs uppercase tracking-widest text-slate-300/70">{item.label}</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">{item.value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative z-10"
        >
          <Card className="overflow-hidden border-white/20 bg-gradient-to-br from-white/20 via-white/5 to-white/0 p-0">
            <CardHeader className="relative space-y-3 bg-gradient-to-br from-slate-900/30 via-slate-900/60 to-slate-900/30 p-6">
              <div className="flex items-center justify-between text-sm text-slate-300/90">
                <span>实时课堂脉搏</span>
                <span className="inline-flex items-center gap-2 text-emerald-300">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" aria-hidden="true" />
                  Live
                </span>
              </div>
              <CardTitle className="text-2xl text-white">今日成长瞬间</CardTitle>
              <CardDescription>可视化捕捉每一次高光互动，AI 自动生成课堂纪要。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 bg-slate-900/30 p-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/20">
                <Image
                  src="/images/hero-illustration.svg"
                  alt="学习数据可视化界面示意"
                  fill
                  priority
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 text-sm text-slate-200/90">
                <p className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>AI 智能点评</span>
                  <span className="font-semibold text-emerald-300">已完成</span>
                </p>
                <p className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>班级关注指数</span>
                  <span className="font-semibold text-sky-300">+18%</span>
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/10 bg-slate-900/40 px-6 py-4 text-sm text-slate-300/80">
              <div>
                <p className="font-medium text-white">明日亮点预告</p>
                <p>AI 将自动推送课堂延伸活动与个性化练习计划。</p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function LearningModesSection() {
  return (
    <section
      id="learning"
      aria-labelledby="learning-heading"
      className="relative z-10 px-6 py-24 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl space-y-4"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300/90">三大学习模式</p>
            <h2 id="learning-heading" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              精准匹配学习场景，让每一份努力都被看见
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="max-w-xl text-base text-slate-200/80"
          >
            三大模式覆盖救急、提分与教学合作的核心诉求，系统以连贯的数据链路驱动，从洞察到行动一气呵成，保障跨角色协同效率。
          </motion.p>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid gap-8 lg:grid-cols-3"
        >
          {learningModes.map((mode, index) => (
            <motion.article key={mode.id} variants={fadeInUp} custom={index}>
              <Card className="h-full border-white/10 bg-slate-900/50 p-0">
                <div className={`relative h-36 w-full overflow-hidden rounded-t-3xl bg-gradient-to-br ${mode.accent}`}>
                  <mode.icon
                    aria-hidden
                    className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 text-white/40"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),transparent_55%)]" aria-hidden />
                </div>
                <CardHeader className="space-y-3 px-6 pt-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    {mode.subtitle}
                  </span>
                  <CardTitle className="text-2xl text-white">{mode.title}</CardTitle>
                  <CardDescription className="text-base text-slate-200/80">
                    {mode.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-4 text-sm text-emerald-200/90">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1 font-medium text-emerald-200">
                    {mode.metric}
                  </span>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ToolPreviewSection() {
  return (
    <section
      id="tools"
      aria-labelledby="tools-heading"
      className="relative z-10 px-6 py-24 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 space-y-4"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300/90">全链路工具矩阵</p>
          <h2 id="tools-heading" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            协作无缝衔接，真正做到“教、学、评”一致
          </h2>
          <p className="max-w-3xl text-base text-slate-200/80">
            从课堂前的诊断、课堂中的互动到课后的复盘，Context0 以数据驱动决策，以体验取胜，为师生打造沉浸式学习旅程。
          </p>
        </motion.div>
        <motion.div
          className="grid gap-8 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
        >
          {toolPreviews.map((tool, index) => (
            <motion.article key={tool.title} variants={fadeInUp} custom={index} className="flex h-full flex-col">
              <Card className="flex h-full flex-col border-white/10 bg-slate-900/50 p-0">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl border-b border-white/10 bg-slate-950/20">
                  <Image
                    src={tool.image}
                    alt={`${tool.title} 示意图`}
                    fill
                    sizes="(min-width: 1024px) 400px, 100vw"
                    className="object-cover"
                  />
                </div>
                <CardHeader className="space-y-3 px-6 pt-6">
                  <CardTitle className="text-2xl text-white">{tool.title}</CardTitle>
                  <CardDescription className="text-base text-slate-200/80">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <ul className="space-y-3 text-sm text-slate-200/90">
                    {tool.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-emerald-300" aria-hidden />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonial-heading"
      className="relative z-10 px-6 py-24 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 space-y-4"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300/90">真实声音</p>
          <h2 id="testimonial-heading" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            专家、教师与家长共同见证的温暖改变
          </h2>
          <p className="max-w-3xl text-base text-slate-200/80">
            数据背后，是每一位学习者的真实故事。从课堂互动到家庭陪伴，我们让成长路径更加清晰、可持续、更有人情味。
          </p>
        </motion.div>
        <motion.div
          className="grid gap-8 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
        >
          {testimonials.map((testimonial, index) => (
            <motion.blockquote key={testimonial.author} variants={fadeInUp} custom={index}>
              <Card className="h-full border-white/10 bg-slate-900/50 p-0">
                <CardContent className="space-y-6 px-6 py-6">
                  <p className="text-lg leading-relaxed text-slate-100/90">{testimonial.quote}</p>
                  <footer className="space-y-1 text-sm text-slate-200/80">
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p>{testimonial.role}</p>
                    <p className="text-emerald-300">{testimonial.highlight}</p>
                  </footer>
                </CardContent>
              </Card>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section
      id="benefits"
      aria-labelledby="benefits-heading"
      className="relative z-10 px-6 py-24 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 space-y-4"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300/90">为什么选择我们</p>
          <h2 id="benefits-heading" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            不止是工具，更是值得信赖的教育伙伴
          </h2>
        </motion.div>
        <motion.div
          className="grid gap-8 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
        >
          {benefits.map((benefit, index) => (
            <motion.article key={benefit.title} variants={fadeInUp} custom={index}>
              <Card className="h-full border-white/10 bg-slate-900/50">
                <CardHeader className="space-y-3">
                  <CardTitle className="text-2xl text-white">{benefit.title}</CardTitle>
                  <CardDescription className="text-base text-slate-200/80">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="relative z-20 px-6 pb-24 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-emerald-500/20 via-slate-900/70 to-indigo-500/10 p-12 text-center shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <h2 id="cta-heading" className="text-3xl font-semibold text-white sm:text-4xl">
            邀请您与我们一起，打造下一代暖科技课堂
          </h2>
          <p className="mx-auto max-w-3xl text-base text-slate-100/80">
            预约顾问演示或申请校园试点，亲历 Context0 如何让教学决策更智慧、让学习体验更有温度。
          </p>
          <div className="flex flex-wrap justify-center gap-4" role="group" aria-label="页面结尾行动">
            <a
              href="mailto:hello@context0.cn"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-white/40 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              安排 1 对 1 咨询
            </a>
            <a
              href="#vision"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-base font-semibold text-white/90 backdrop-blur transition hover:-translate-y-0.5 hover:border-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              下载产品白皮书
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -20, 20, 0],
          opacity: [0.35, 0.5, 0.4, 0.35],
        }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-32 top-40 h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-[120px]"
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 30, -20, 0],
          opacity: [0.25, 0.45, 0.35, 0.25],
        }}
        transition={{ duration: 24, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-[60%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-amber-400/10 blur-[140px]"
        animate={{
          scale: [1, 1.1, 0.95, 1],
          opacity: [0.2, 0.3, 0.25, 0.2],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-0 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full border border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

function LifelineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" {...props}>
      <circle cx="32" cy="32" r="20" opacity="0.6" />
      <path d="M17 33h8l4-10 6 18 4-10h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AscendIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" {...props}>
      <path d="M12 46l16-20 12 10 12-18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M44 22h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BlackboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" {...props}>
      <rect x="8" y="14" width="48" height="32" rx="4" />
      <path d="M14 48h36" strokeLinecap="round" />
      <path d="M26 26h20" strokeLinecap="round" />
      <path d="M26 34h12" strokeLinecap="round" />
    </svg>
  );
}
