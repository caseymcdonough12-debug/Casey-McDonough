import { ProgressState, TrackId } from '../types';
import { TRACKS } from './tracks';

interface JobTrackContent {
  likelyJobs: string[];
  companyTypes: string[];
}

const JOB_TRACK_CONTENT: Partial<Record<TrackId, JobTrackContent>> = {
  finance: {
    likelyJobs: ['Financial Analyst', 'FP&A Analyst', 'Investment Banking Analyst', 'Equity Research Associate'],
    companyTypes: [
      'Corporate finance teams at mid-size and large companies',
      'Regional and boutique investment banks',
      'Asset management and private equity firms',
      'Financial planning & advisory firms',
    ],
  },
  accounting: {
    likelyJobs: ['Staff Accountant', 'Bookkeeper', 'Audit Associate', 'Accounts Payable/Receivable Specialist'],
    companyTypes: [
      'Public accounting firms (Big 4 and regional)',
      'Small business accounting practices',
      'Corporate accounting departments',
      'Nonprofit finance teams',
    ],
  },
  economics: {
    likelyJobs: ['Economic/Policy Analyst', 'Market Research Analyst', 'Data Analyst', 'Pricing Analyst'],
    companyTypes: [
      'Government agencies and think tanks',
      'Market research firms',
      'Consulting firms',
      'Corporate strategy or pricing teams',
    ],
  },
  consulting: {
    likelyJobs: ['Business Analyst', 'Associate Consultant', 'Strategy Analyst', 'Corporate Strategy Associate'],
    companyTypes: [
      'Management consulting firms (MBB, Big 4 advisory arms)',
      'Corporate strategy teams',
      'Boutique consultancies',
      'Internal strategy & ops groups',
    ],
  },
  marketing: {
    likelyJobs: ['Marketing Analyst', 'Growth Marketing Associate', 'Performance Marketing Coordinator', 'Marketing Coordinator'],
    companyTypes: [
      'In-house marketing teams at growing companies',
      'Digital marketing & performance agencies',
      'E-commerce and DTC brands',
      'Startup growth teams',
    ],
  },
  operations: {
    likelyJobs: ['Operations Analyst', 'Process Improvement Analyst', 'Supply Chain Coordinator', 'Operations Associate'],
    companyTypes: [
      'Manufacturing and logistics companies',
      'Retail and e-commerce operations teams',
      'Healthcare operations departments',
      'Operations teams at growing startups',
    ],
  },
};

interface ReportSection {
  headline: string;
  detail: string;
  items?: string[];
}

export interface WeeklyReport {
  strongestTrackId: TrackId;
  strongestTrackName: string;
  accuracyPct: number;
  secondTrackName: string | null;
  kind: 'jobs' | 'personalFinance' | 'startups';
  report1: ReportSection;
  report2: ReportSection;
  report3: ReportSection;
}

function accuracyOf(recentAnswers: boolean[]): number {
  if (recentAnswers.length === 0) return 0;
  const correct = recentAnswers.filter(Boolean).length;
  return Math.round((correct / recentAnswers.length) * 100);
}

function personalFinanceSections(accuracyPct: number, proficiency: number): [ReportSection, ReportSection] {
  if (proficiency <= 2) {
    return [
      {
        headline: 'Next money move: build your emergency fund',
        detail:
          "You've got the budgeting basics down — the next move that pays off most is building a starter emergency fund, so a surprise expense doesn't turn into a spiral of debt.",
      },
      {
        headline: "This week's goal",
        detail: 'Set aside $25–$50 this week toward a $500 starter emergency fund. Even a small automatic transfer counts.',
      },
    ];
  }
  if (proficiency === 3) {
    return [
      {
        headline: 'Next money move: start investing',
        detail:
          'Your budgeting and safety net are in good shape — the next move is opening a retirement or brokerage account and automating a small contribution so compound growth starts working for you.',
      },
      {
        headline: "This week's goal",
        detail: 'Open (or check on) a Roth IRA or brokerage account and set up a recurring $25–$100/month contribution.',
      },
    ];
  }
  return [
    {
      headline: 'Next money move: automate and optimize',
      detail:
        "You're past the basics — the next move is automating a fixed percentage of every paycheck into investments before you ever see it, and checking your accounts for fees quietly eating into returns.",
    },
    {
      headline: "This week's goal",
      detail: 'Check the expense ratios on your investment accounts and increase your automatic contribution by 1%.',
    },
  ];
}

function startupsSections(proficiency: number): [ReportSection, ReportSection] {
  if (proficiency <= 2) {
    return [
      {
        headline: 'Your founder fit: problem-first',
        detail:
          "You're still building fundamentals — the founders who do best at this stage spend most of their time deeply understanding a customer's problem before building anything. That's a strength worth leaning into.",
      },
      {
        headline: 'Next-step resources',
        detail: '',
        items: [
          'Y Combinator Startup School (free, self-paced)',
          'Talk to 10 potential customers before building anything',
          'r/startups and Indie Hackers community',
        ],
      },
    ];
  }
  if (proficiency === 3) {
    return [
      {
        headline: 'Your founder fit: traction-first',
        detail:
          "You're comfortable with the fundamentals — you're suited to a scrappy, traction-first approach: ship something small fast and use real signals, not opinions, to decide what to build next.",
      },
      {
        headline: 'Next-step resources',
        detail: '',
        items: [
          'Y Combinator Startup School (free, self-paced)',
          'Local startup accelerator or incubator programs',
          'Indie Hackers community',
        ],
      },
    ];
  }
  return [
    {
      headline: 'Your founder fit: fundraising-savvy',
      detail:
        "You're strong with the numbers side of building a company — you may be suited to a capital-efficient, fundraising-aware path: knowing exactly how much to raise and why.",
    },
    {
      headline: 'Next-step resources',
      detail: '',
      items: [
        'Accelerator programs for your stage (Y Combinator, Techstars)',
        'Angel investor and founder communities in your city',
        'A fractional CFO or advisor once you start raising',
      ],
    },
  ];
}

export function buildWeeklyReport(progress: ProgressState): WeeklyReport | null {
  const entries = (Object.keys(progress) as TrackId[])
    .map((id) => ({ id, tp: progress[id] }))
    .filter((e) => e.tp && e.tp.recentAnswers.length > 0);

  if (entries.length === 0) return null;

  const ranked = entries
    .map((e) => ({ ...e, accuracy: accuracyOf(e.tp.recentAnswers) }))
    .sort((a, b) => b.accuracy - a.accuracy || b.tp.xp - a.tp.xp);

  const top = ranked[0];
  const second = ranked[1];
  const strongestTrackName = TRACKS[top.id].name;
  const accuracyPct = top.accuracy;

  const report1: ReportSection = {
    headline: 'Where you\'re succeeding most',
    detail: second
      ? `You're strongest in ${strongestTrackName}, answering ${accuracyPct}% of recent questions correctly — you're also putting in solid work in ${TRACKS[second.id].name}.`
      : `You're strongest in ${strongestTrackName}, answering ${accuracyPct}% of recent questions correctly.`,
  };

  if (top.id === 'personalFinance') {
    const [report2, report3] = personalFinanceSections(accuracyPct, top.tp.effectiveProficiency);
    return {
      strongestTrackId: top.id,
      strongestTrackName,
      accuracyPct,
      secondTrackName: second ? TRACKS[second.id].name : null,
      kind: 'personalFinance',
      report1,
      report2,
      report3,
    };
  }

  if (top.id === 'startups') {
    const [report2, report3] = startupsSections(top.tp.effectiveProficiency);
    return {
      strongestTrackId: top.id,
      strongestTrackName,
      accuracyPct,
      secondTrackName: second ? TRACKS[second.id].name : null,
      kind: 'startups',
      report1,
      report2,
      report3,
    };
  }

  const jobContent = JOB_TRACK_CONTENT[top.id];
  if (!jobContent) return null; // shouldn't happen — every non-PF/startups track has content

  return {
    strongestTrackId: top.id,
    strongestTrackName,
    accuracyPct,
    secondTrackName: second ? TRACKS[second.id].name : null,
    kind: 'jobs',
    report1,
    report2: {
      headline: "Jobs you'd likely succeed in",
      detail: '',
      items: jobContent.likelyJobs,
    },
    report3: {
      headline: 'Where to look',
      detail: '',
      items: jobContent.companyTypes,
    },
  };
}
