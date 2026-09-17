/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeType = 'light' | 'dark' | 'forest' | 'sunset' | 'industrial';
export type DensityType = 'normal' | 'compact';

export interface DashboardLayout {
  showHero: boolean;
  showStats: boolean;
  showQuickActions: boolean;
  showAbsents: boolean;
  showBalancingGraph: boolean;
  showIO: boolean;
  showUpcoming: boolean;
}

export interface ManpowerBreakdown {
  present: number;
  absent: number;
}

export interface LineManpower {
  Operator: ManpowerBreakdown;
  Helper: ManpowerBreakdown;
  'Iron Man': ManpowerBreakdown;
}

export interface BottleneckInfo {
  station: string;
  cycleTime: number; // in seconds
  targetCT: number; // in seconds
  status: 'ok' | 'high' | 'critical';
  action: string;
  notes?: string;
}

export interface Top5Meeting {
  held: 'yes' | 'no';
  attendance: number;
  items: string[];
  notes?: string;
}

export interface TimeStudy {
  done: 'yes' | 'no' | 'partial';
  type: 'time' | 'production' | 'both';
  observedRate: number;
  standardRate: number;
  findings?: string;
}

export interface BuildUpCurve {
  day: '1' | '2' | '3' | '4' | 'stable';
  plannedPct: number;
  achievedPct: number;
  operators: number;
  notes?: string;
}

export interface LineIELead {
  name: string;
  level: string;
  period: string;
  weeklyNotes?: string;
  monthlyNotes?: string;
  additionalInfo?: string;
}

export interface LineEntry {
  id: number;
  date: string; // YYYY-MM-DD
  lineNo: string;
  floor: string;
  buyer: string;
  style: string;
  smv: number; // Standard Minute Value
  plannedMP: number;
  workingHours: number;
  targetEff: number;
  targetProd: number;
  achievedProd: number;
  efficiency: number;
  remarks: string;
  orderQty: number;
  dailyInput: number;
  dailyOutput: number;
  wip: number;
  balancingGraph: 'day1' | 'day2' | 'day3' | 'day4' | 'complete';
  nextStyle: string;
  nextStyleDate: string;
  mp: LineManpower;
  balanceMethod: string;
  balanceNotes: string;
  top5: Top5Meeting;
  bottleneck: BottleneckInfo;
  timeStudy: TimeStudy;
  buildUp: BuildUpCurve;
  lineIE: LineIELead;
}

export type ChecklistStatus = 'yes' | 'no' | 'pending';

export interface ChecklistMap {
  [date: string]: ChecklistStatus[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  category: 'line_balancing' | 'time_study' | 'bottleneck_study' | 'tr_sample' | 'kaizen_ci' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  targetDate: string;
  dueTime: string;
  lineNo: string;
  assignedToRole: string;
  assignedToName: string;
  assignedByRole: string;
  assignedByName: string;
  subtasks: Subtask[];
  notes?: string;
  createdAt: string;
  completedAt?: string;
  isPointOfWork?: boolean;
  leanMethod?: string;
  stationLocation?: string;
  urgencyLevel?: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  targetDate: string;
  lineNo: string;
  category: string;
  assignedToRole: string;
  assignedToName: string;
  assignedByRole: string;
  assignedByName: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  alertMinutesBefore: number;
  locationOrFloor: string;
}

export interface LeanMethod {
  id: string;
  name?: string;
  tagline?: string;
  description?: string;
  category: string;
  garmentApplication?: string;
  steps?: string[];
  typicalBenefit?: string;
  title?: string;
  purpose?: string;
  icon?: string;
  index?: string;
  accent?: 'teal' | 'orange' | 'gold' | 'slate';
  walkTip?: string;
  focusMetric?: string;
}

export interface LeanAction {
  id: string;
  methodId: string;
  methodTitle?: string;
  methodName?: string;
  lineNo: string;
  stationOrLocation?: string;
  actionText?: string;
  title?: string;
  issue?: string;
  solution?: string;
  expectedBenefit?: string;
  assignee?: string;
  owner?: string;
  urgency?: 'immediate' | 'shift_end' | 'next_day';
  status: 'pending' | 'in_progress' | 'completed' | 'planned';
  createdAt: string;
  completedAt?: string;
}

export type LeanActionItem = LeanAction;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'todo' | 'alert' | 'line' | 'sync' | 'warning';
  timestamp: string;
  read: boolean;
  lineNo?: string;
  targetRole?: string;
}

export interface RoleTier {
  id: string;
  level: number;
  name: string;
  shortCode: string;
  color: string;
  description: string;
  systemRole: string; // e.g. 'ADMIN', 'HOD', 'MANAGER', 'IE_ASST_MANAGER', 'LINE_IE'
  systemEdit: string; // 'Full', 'Read-Only'
  deletionReset: string; // 'Authorized', 'Restricted'
  checklistSignoff: string; // 'Authorized', 'Submit Only'
  managesTiers: string; // 'T1, T2, T3, T4', 'Self Only', etc.
  canManageLines: boolean;
  canEditLineData: boolean;
  canApproveChecklist: boolean;
  canCreateTodos: boolean;
  canExport: boolean;
}

export interface UserProfile {
  name: string;
  jobTitle: string;
  role: 'admin' | 'hod' | 'assistant_manager' | 'officer' | 'manager' | 'sr_executive' | 'executive';
  tierId: string;
  email: string;
  employeeId?: string;
  assignedUnit?: string;
}

export interface SyncState {
  status: 'live' | 'syncing' | 'idle' | 'error' | 'connected';
  latencyMs: number;
  lastSyncTime: string;
  cloudEndpoint?: string;
}

export interface AppStore {
  lineEntries: LineEntry[];
  checklists: ChecklistMap;
  todos: TodoItem[];
  schedules: ScheduleItem[];
  leanActions: LeanActionItem[];
  notifications: NotificationItem[];
  profile: UserProfile;
  dashboardLayout: DashboardLayout;
  theme: ThemeType;
  density: DensityType;
  syncState: SyncState;
}
