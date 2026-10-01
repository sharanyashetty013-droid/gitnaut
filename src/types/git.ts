export type StageId = 
  | 'stage-1'
  | 'stage-2'
  | 'stage-3'
  | 'stage-4'
  | 'stage-5'
  | 'stage-6'
  | 'stage-7'
  | 'stage-8';

export interface CommandWhyNeeded {
  disasterWithout: string;
  rescueWith: string;
  realWorldAnalogy: string;
}

export interface GitCommand {
  id: string;
  stageId: StageId;
  name: string;
  syntax: string;
  oneLiner: string;
  detailedTip?: string;
  category: string;
  isSpecialFile?: boolean;
  whyNeeded?: CommandWhyNeeded;
  flags?: { flag: string; description: string }[];
  visualType: 
    | 'init'
    | 'clone'
    | 'config'
    | 'gitignore'
    | 'status'
    | 'add'
    | 'commit'
    | 'diff'
    | 'diff-staged'
    | 'log'
    | 'log-graph'
    | 'show'
    | 'blame'
    | 'restore'
    | 'restore-staged'
    | 'reset'
    | 'revert'
    | 'rm'
    | 'mv'
    | 'clean'
    | 'branch-list'
    | 'branch-create'
    | 'checkout'
    | 'checkout-b'
    | 'merge'
    | 'rebase'
    | 'branch-delete'
    | 'remote-list'
    | 'remote-add'
    | 'push'
    | 'push-u'
    | 'pull'
    | 'fetch'
    | 'stash'
    | 'stash-pop'
    | 'cherry-pick'
    | 'tag';
}

export interface GitStage {
  id: StageId;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  commands: GitCommand[];
}

export interface UserProgress {
  learnedCommandIds: string[];
  lastLearnedCommandId: string | null;
  streakDates: string[]; // ISO YYYY-MM-DD
  completedStageIds: string[];
}
