import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  GitBranch, 
  HelpCircle,
  X,
  Radio,
  Box,
  Archive,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Swords,
  ShieldCheck,
} from 'lucide-react';
import { playSound } from '../utils/sound';
import { logActivityEvent } from '../utils/activityEvents';
import { renderFormattedCodeText } from '../utils/textUtils';
import { CommitGraph3D, Commit3DNode } from './CommitGraph3D';
import { openGitnautAI } from './AskGitnautAI';

export interface Mission {
  id: number;
  title: string;
  badgeName: string;
  oneSentenceGoal: string;
  totalSteps: number;
  currentStepHint: string;
  scenario: string;
  simpleExplanation: {
    analogy: string;
    whatItDoes: string;
    whyItMatters: string;
  };
  dangerAlert?: string;
  initialState: {
    branch: string;
    files?: { id: string; name: string; status: 'modified' | 'staged' | 'secret'; desc: string }[];
    commits?: Commit3DNode[];
    stashCount?: number;
    remoteSynced?: boolean;
    conflictActive?: boolean;
  };
  validCommands: string[];
  tapActions: { label: string; cmd: string }[];
  hint: string;
}

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: 'Mission 1: Airlock Staging',
    badgeName: 'Airlock Specialist',
    oneSentenceGoal: 'Select the 2 safe files, then stage them into the airlock.',
    totalSteps: 2,
    currentStepHint: 'Step 1 of 2: Click the 2 safe files below (avoid .env.secret) or run git add.',
    scenario: 'The engineering crew finished manufacturing navigation_core.ts and thruster_control.ts. But a cadet dropped an unshielded .env.secret fuel cell right on the cargo deck!',
    simpleExplanation: {
      analogy: 'Think of packing your backpack: you want your notebooks inside, but definitely NOT an open carton of melted ice cream!',
      whatItDoes: '`git add` lets you stage only the safe files before you permanently snapshot them.',
      whyItMatters: 'If you type `git add .` carelessly, you could publish secret passwords to the public internet!'
    },
    dangerAlert: 'Warning: Committing .env.secret leaks private master credentials. Keep secrets out of Git.',
    initialState: {
      branch: 'main',
      files: [
        { id: 'f1', name: 'src/navigation_core.ts', status: 'modified', desc: 'Safe navigation guidance software' },
        { id: 'f2', name: 'src/thruster_control.ts', status: 'modified', desc: 'Safe ion propulsion throttle' },
        { id: 'f3', name: '.env.secret', status: 'secret', desc: 'DANGER: Contains raw master keys!' },
      ],
      commits: [
        { hash: 'a10b42', msg: 'Starship reactor online', branch: 'main' },
      ],
    },
    validCommands: [
      'git add src/navigation_core.ts src/thruster_control.ts',
      'git add src/thruster_control.ts src/navigation_core.ts',
      'git add src/navigation_core.ts',
      'git add src/thruster_control.ts',
      'git add src/*',
    ],
    tapActions: [
      { label: 'Tap to Stage Safe Files', cmd: 'git add src/navigation_core.ts src/thruster_control.ts' },
    ],
    hint: 'Run "git add src/navigation_core.ts src/thruster_control.ts" or tap the safe cargo modules directly.',
  },
  {
    id: 2,
    title: 'Mission 2: Multiverse Split',
    badgeName: 'Multiverse Pilot',
    oneSentenceGoal: 'Create and jump to branch feat/hyper-warp in one command.',
    totalSteps: 1,
    currentStepHint: 'Step 1 of 1: Create and switch to feat/hyper-warp.',
    scenario: 'You must install an experimental "Hyper-Warp Cannon" to escape an alien fleet. You need an isolated parallel branch to test safely.',
    simpleExplanation: {
      analogy: 'Like making a copy of your save game before a boss fight so you can test stunts without losing progress!',
      whatItDoes: '`git switch -c <name>` clones reality into an alternate timeline and jumps you right into it.',
      whyItMatters: 'Allows you to build features fearlessly without destabilizing production code on main.'
    },
    initialState: {
      branch: 'main',
      commits: [
        { hash: 'c1a09e', msg: 'Starship hull initialized', branch: 'main' },
        { hash: 'd42f8b', msg: 'Sub-light engines stable', branch: 'main' },
      ],
    },
    validCommands: ['git switch -c feat/hyper-warp', 'git checkout -b feat/hyper-warp'],
    tapActions: [
      { label: 'Tap to Switch to feat/hyper-warp', cmd: 'git switch -c feat/hyper-warp' },
    ],
    hint: 'Use "git switch -c feat/hyper-warp" to branch and switch simultaneously.',
  },
  {
    id: 3,
    title: 'Mission 3: Meteor Storm Stash',
    badgeName: 'Subspace Hopper',
    oneSentenceGoal: 'Stash your dirty uncommitted changes into temporary storage.',
    totalSteps: 1,
    currentStepHint: 'Step 1 of 1: Tuck dirty files into your stash pocket.',
    scenario: 'You are assembling messy laser wires on your workbench when a swarm strikes! Commander orders an emergency warp jump to main, but your workspace is dirty.',
    simpleExplanation: {
      analogy: 'When your room is messy with LEGO blocks and guests arrive, you tuck them in a drawer (`git stash`), then retrieve them later (`git stash pop`)!',
      whatItDoes: '`git stash` shelves all uncommitted changes into a safe temporary pocket.',
      whyItMatters: 'Allows you to jump to another branch to fix an urgent bug without committing broken code!'
    },
    initialState: {
      branch: 'experiment-laser',
      files: [
        { id: 'f1', name: 'laser_optics.ts', status: 'modified', desc: 'Half-written messy calculations' },
        { id: 'f2', name: 'plasma_injector.ts', status: 'modified', desc: 'Unfinished syntax errors' },
      ],
      commits: [
        { hash: 'e201b8', msg: 'Main laser generator', branch: 'experiment-laser' },
      ],
      stashCount: 0,
    },
    validCommands: ['git stash', 'git stash push', 'git stash save'],
    tapActions: [
      { label: 'Tap to Shelve: git stash', cmd: 'git stash' },
    ],
    hint: 'Run "git stash" to safely store your unfinished edits.',
  },
  {
    id: 4,
    title: 'Mission 4: Orbital Uplink',
    badgeName: 'Orbital Architect',
    oneSentenceGoal: 'Push your local commits to the remote origin main.',
    totalSteps: 1,
    currentStepHint: 'Step 1 of 1: Transmit commits to the cloud.',
    scenario: 'Your local ship has recorded 2 new flight memory crystals. The Orbital Starbase ("origin/main") cannot see them until you transmit via tractor beam!',
    simpleExplanation: {
      analogy: 'Like saving photos on your phone: they only exist locally until you upload them to the cloud for the crew!',
      whatItDoes: '`git push` uploads your local commit history to the remote cloud repository.',
      whyItMatters: 'Backs up your work and enables teammates to synchronize your changes.'
    },
    initialState: {
      branch: 'main',
      commits: [
        { hash: '7f9102', msg: 'Shield matrix reinforced', branch: 'main' },
        { hash: '8a2b34', msg: 'Plasma torpedoes calibrated', branch: 'main' },
      ],
      remoteSynced: false,
    },
    validCommands: ['git push', 'git push origin main', 'git push -u origin main'],
    tapActions: [
      { label: 'Tap to Transmit: git push', cmd: 'git push origin main' },
    ],
    hint: 'Run "git push origin main" to upload commits to the remote repository.',
  },
  {
    id: 5,
    title: 'Mission 5: Quantum Harvest',
    badgeName: 'Quantum Surgeon',
    oneSentenceGoal: 'Cherry-pick only commit a8f9b2 onto main.',
    totalSteps: 1,
    currentStepHint: 'Step 1 of 1: Isolate and grab commit a8f9b2.',
    scenario: 'The test-pod branch unstable-lab has 2 corrupted commits that cause fires, but also has 1 vital antidote: commit a8f9b2 ("fix: shield deflector leak").',
    simpleExplanation: {
      analogy: 'Like picking the delicious olives off a pizza without taking the mushrooms you dislike!',
      whatItDoes: '`git cherry-pick <hash>` copies one specific commit from another branch into your current branch.',
      whyItMatters: 'You don\'t have to merge 50 buggy commits just to get the single 2-line security hotfix.'
    },
    initialState: {
      branch: 'main',
      commits: [
        { hash: 'e1122a', msg: 'Stable flight controls', branch: 'main' },
        { hash: 'a8f9b2', msg: 'fix: shield deflector leak', branch: 'unstable-lab' },
        { hash: 'b9981c', msg: 'BROKEN: unstable laser explosion', branch: 'unstable-lab' },
      ],
    },
    validCommands: ['git cherry-pick a8f9b2'],
    tapActions: [
      { label: 'Tap to Cherry-Pick a8f9b2', cmd: 'git cherry-pick a8f9b2' },
    ],
    hint: 'Run "git cherry-pick a8f9b2" to grab only that commit.',
  },
  {
    id: 6,
    title: 'Mission 6: Tachyon Time Reversal',
    badgeName: 'Grand Chrono Master',
    oneSentenceGoal: 'Revert commit 9e3b11 with a safe inverse commit.',
    totalSteps: 1,
    currentStepHint: 'Step 1 of 1: Create an inverse commit with git revert.',
    scenario: 'Commit 9e3b11 introduced a fatal sensor glitch that was already synced with 12 wingmates. If you use "git reset", you will corrupt their local repos! Use git revert instead.',
    simpleExplanation: {
      analogy: 'If you accidentally painted a red streak on a shared wall, you paint a clean white layer over it instead of tearing down the wall!',
      whatItDoes: '`git revert <hash>` creates an inverse commit that neatly cancels a past mistake without rewriting shared history.',
      whyItMatters: 'Safe for team collaboration because it leaves shared public history intact.'
    },
    initialState: {
      branch: 'main',
      commits: [
        { hash: '4f8812', msg: 'Life support operational', branch: 'main' },
        { hash: '9e3b11', msg: 'fatal: sensor feedback loop', branch: 'main' },
      ],
    },
    validCommands: ['git revert 9e3b11', 'git revert --no-edit 9e3b11'],
    tapActions: [
      { label: 'Tap to Safe Revert 9e3b11', cmd: 'git revert 9e3b11' },
    ],
    hint: 'Type "git revert 9e3b11" to generate an inverse rollback commit.',
  },
  {
    id: 7,
    title: 'Mission 7: Omega Boss – Merge Collision',
    badgeName: 'Omega Conflict Slayer',
    oneSentenceGoal: 'Pick a coordinate vector, stage the resolved file, and commit to seal the merge.',
    totalSteps: 3,
    currentStepHint: 'Step 1 of 3: Choose your coordinate vector to strip conflict markers.',
    scenario: 'Both branches plotted jump coordinates on line 42 of warp_coordinates.nav. Git halted with a Merge Conflict! Resolve the collision markers and seal the merge commit!',
    simpleExplanation: {
      analogy: 'Two pilots scribbled conflicting coordinates on the flight windshield. Git pauses with markers so YOU choose the route, erase markers, and fly!',
      whatItDoes: 'When lines conflict, Git inserts markers (`<<<<<<<` and `>>>>>>>`). You inspect the file, remove the markers, stage, and commit.',
      whyItMatters: 'Resolving conflicts calmly is the hallmark of a senior software engineer.'
    },
    initialState: {
      branch: 'main',
      conflictActive: true,
      files: [
        { id: 'f_conflict', name: 'warp_coordinates.nav', status: 'modified', desc: 'Contains active <<<<<<< HEAD conflict markers!' }
      ],
      commits: [
        { hash: 'e4401a', msg: 'main: Target Orion-Alpha-7', branch: 'main' },
        { hash: 'f9921b', msg: 'feat/recon-scout: Target Vega-Prime-9', branch: 'feat/recon-scout' }
      ]
    },
    validCommands: [
      'git add warp_coordinates.nav',
      'git commit -m "fix: resolve warp conflict"',
      'git commit',
      'git merge --continue'
    ],
    tapActions: [
      { label: 'Tap to Stage File', cmd: 'git add warp_coordinates.nav' },
      { label: 'Tap to Seal Merge Commit', cmd: 'git commit -m "fix: resolve warp conflict"' },
    ],
    hint: 'Choose your coordinate option in the HUD, then stage and commit.',
  },
];

interface ArcadeDrill {
  id: number;
  title: string;
  badge: string;
  question: string;
  scenario: string;
  options: { label: string; isCorrect: boolean; feedback: string }[];
}

const ARCADE_DRILLS: ArcadeDrill[] = [
  {
    id: 1,
    title: 'Secret Leak Evacuation',
    badge: 'Security Scanner',
    scenario: 'You ran `git add .` by accident, staging a private `.env` file! You have NOT committed yet.',
    question: 'How do you safely remove `.env` from staging without deleting your real file on disk?',
    options: [
      { label: 'git restore --staged .env', isCorrect: true, feedback: 'Correct! Unstages the file while keeping your edits safe on disk.' },
      { label: 'git rm -rf .env', isCorrect: false, feedback: 'Dangerous! That permanently deletes the file from your computer!' },
      { label: 'git push --force', isCorrect: false, feedback: 'Catastrophic! That publishes everything to the remote repository!' },
      { label: 'git clean -fd', isCorrect: false, feedback: 'Incorrect: git clean deletes untracked files.' },
    ],
  },
  {
    id: 2,
    title: 'Detached HEAD Rescue',
    badge: 'Chrono Anchor',
    scenario: 'You checked out an old commit hash `a8f9b2` to inspect it, and made 2 great commits. Git warns you are in "Detached HEAD" state.',
    question: 'How do you save those commits onto a permanent branch before switching away?',
    options: [
      { label: 'git switch -c new-feature-rescue', isCorrect: true, feedback: 'Spot on! Instantly anchors your floating commits to a brand new branch.' },
      { label: 'git checkout main', isCorrect: false, feedback: 'Warning: Switching away will leave your commits unreferenced!' },
      { label: 'git commit --amend', isCorrect: false, feedback: 'Incorrect: That only modifies the current commit.' },
      { label: 'git reset --hard', isCorrect: false, feedback: 'Dangerous! That discards uncommitted changes.' },
    ],
  },
  {
    id: 3,
    title: 'Commit Message Amend',
    badge: 'Typo Slayer',
    scenario: 'You just committed with message: "feat: add user logni" (embarrassing typo!).',
    question: 'You haven\'t pushed yet. What is the cleanest 1-command fix?',
    options: [
      { label: 'git commit --amend -m "feat: add user login"', isCorrect: true, feedback: 'Perfection! Rewrites the message of the very last commit cleanly.' },
      { label: 'git revert HEAD', isCorrect: false, feedback: 'No, that creates a second undo commit instead of fixing the typo.' },
      { label: 'git reset --hard HEAD~10', isCorrect: false, feedback: 'Extreme overkill! That erases your last 10 commits!' },
      { label: 'git stash pop', isCorrect: false, feedback: 'Incorrect: stash is for dirty uncommitted changes.' },
    ],
  },
  {
    id: 4,
    title: 'The Time Traveler Reflog',
    badge: 'Reflog Oracle',
    scenario: 'A teammate accidentally deleted their branch with `git branch -D feat/auth`. They are in panic.',
    question: 'Which superpower command lists everywhere HEAD has stepped, letting you recover the lost commit?',
    options: [
      { label: 'git reflog', isCorrect: true, feedback: 'Legendary! `git reflog` is Git\'s ultimate flight recorder and safety net.' },
      { label: 'git status', isCorrect: false, feedback: 'Status only shows current working tree state.' },
      { label: 'git diff', isCorrect: false, feedback: 'Diff shows differences between trees, not the HEAD history journal.' },
      { label: 'git remote -v', isCorrect: false, feedback: 'Shows remote URLs, nothing to do with lost commits.' },
    ],
  },
];

interface GitGameProps {
  onClose: () => void;
  isEmbedded?: boolean;
  initialTab?: 'campaign' | 'arcade' | 'sandbox';
}

export function GitGame({ onClose, isEmbedded = false, initialTab = 'campaign' }: GitGameProps) {
  const [activeTab, setActiveTab] = useState<'campaign' | 'arcade' | 'sandbox'>(initialTab);
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [commandInput, setCommandInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [, setWrongTries] = useState(0);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [nextStepMessage, setNextStepMessage] = useState<string | null>(null);
  const [showStory, setShowStory] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<string[]>([]);
  const [completedMissionIds, setCompletedMissionIds] = useState<number[]>([]);
  const [bossConflictChoice, setBossConflictChoice] = useState<'none' | 'head' | 'incoming' | 'both'>('none');
  const [bossStaged, setBossStaged] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Arcade Drills State
  const [currentDrillIdx, setCurrentDrillIdx] = useState(0);
  const [drillAnswered, setDrillAnswered] = useState<number | null>(null);

  // Free Lab Sandbox State
  const [sandboxBranch, setSandboxBranch] = useState('main');
  const [sandboxCommits, setSandboxCommits] = useState<Commit3DNode[]>([
    { hash: 'a10b42', msg: 'Starship reactor online', branch: 'main' },
    { hash: 'c39d88', msg: 'Deflector shields calibrated', branch: 'main' },
  ]);
  const [sandboxStaged, setSandboxStaged] = useState<string[]>(['radar_array.ts']);
  const [sandboxUnstaged, setSandboxUnstaged] = useState<string[]>(['cockpit_hud.ts']);
  const [sandboxStash, setSandboxStash] = useState<string[]>([]);

  const mission = MISSIONS[currentMissionIdx];
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCommandInput('');
    setMissionCompleted(false);
    setShowHint(false);
    setWrongTries(0);
    setNextStepMessage(null);
    setStagedFiles([]);
    setBossConflictChoice('none');
    setBossStaged(false);
    setTerminalLogs([
      `Cockpit Terminal // Ready`,
      `Goal: ${mission.oneSentenceGoal}`,
      `Type the command below or tap the instant action button!`,
    ]);
  }, [currentMissionIdx]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleStageFile = (file: { id: string; name: string; status: 'modified' | 'staged' | 'secret' }) => {
    if (file.status === 'secret') {
      playSound('error');
      setTerminalLogs(prev => [
        ...prev,
        `⚠️  Warning: You attempted to stage "${file.name}"! Avoid staging secrets.`,
      ]);
      setWrongTries(w => {
        const next = w + 1;
        if (next >= 2) setShowHint(true);
        return next;
      });
      return;
    }

    playSound('laser');
    setStagedFiles(prev => {
      const exists = prev.includes(file.name);
      const updated = exists ? prev.filter(f => f !== file.name) : [...prev, file.name];
      setTerminalLogs(p => [
        ...p,
        exists ? `  Unstaged "${file.name}".` : `  Staged "${file.name}". Ready for snapshot.`
      ]);

      if (updated.length === 2 && !updated.includes('.env.secret')) {
        setNextStepMessage('Both safe files staged! Step complete.');
        handleMissionVictory('git add src/navigation_core.ts src/thruster_control.ts');
      } else {
        setNextStepMessage(`Next: Stage the remaining safe file (${updated.length}/2 staged)`);
      }
      return updated;
    });
  };

  const handleExecuteCommand = (cmdToRun?: string) => {
    const rawCmd = (cmdToRun || commandInput).trim();
    if (!rawCmd) return;

    playSound('type');
    const normalized = rawCmd.replace(/\s+/g, ' ');
    setTerminalLogs(prev => [...prev, `$ ${rawCmd}`]);

    if (mission.id === 1) {
      if (normalized === 'git add .' || normalized.includes('.env')) {
        playSound('error');
        setTerminalLogs(prev => [
          ...prev,
          `⚠️  Warning: Staging .env.secret leaks keys. Stage only safe files.`,
        ]);
        setCommandInput('');
        setWrongTries(w => {
          const next = w + 1;
          if (next >= 2) setShowHint(true);
          return next;
        });
        return;
      }
      if (
        normalized === 'git add src/navigation_core.ts src/thruster_control.ts' ||
        normalized === 'git add src/thruster_control.ts src/navigation_core.ts' ||
        normalized === 'git add src/*'
      ) {
        setNextStepMessage('All safe files staged! Objective complete.');
        handleMissionVictory(rawCmd);
        return;
      }
    }

    if (mission.id === 7) {
      if (normalized.startsWith('git add') && normalized.includes('warp_coordinates.nav')) {
        if (bossConflictChoice === 'none') {
          playSound('error');
          setTerminalLogs(prev => [
            ...prev,
            `⚠️  Please select a coordinate vector above first to remove conflict markers.`,
          ]);
          setCommandInput('');
          setWrongTries(w => {
            const next = w + 1;
            if (next >= 2) setShowHint(true);
            return next;
          });
          return;
        }
        playSound('success');
        setBossStaged(true);
        setNextStepMessage('Next: Seal the merge with git commit -m "fix: resolve warp conflict"');
        setTerminalLogs(prev => [
          ...prev,
          `  Staged resolved "warp_coordinates.nav".`,
        ]);
        setCommandInput('');
        return;
      }

      if (normalized.startsWith('git commit') || normalized === 'git merge --continue') {
        if (!bossStaged) {
          playSound('error');
          setTerminalLogs(prev => [
            ...prev,
            `⚠️  Cannot commit: Conflict not staged yet! Run "git add warp_coordinates.nav" first.`,
          ]);
          setCommandInput('');
          setWrongTries(w => {
            const next = w + 1;
            if (next >= 2) setShowHint(true);
            return next;
          });
          return;
        }
        setNextStepMessage('Merge sealed successfully! Boss defeated.');
        handleMissionVictory(rawCmd);
        return;
      }
    }

    const isValid = mission.validCommands.some(vc => normalized === vc || normalized.startsWith(vc));

    if (isValid) {
      setNextStepMessage('Step verified successfully!');
      handleMissionVictory(rawCmd);
    } else {
      playSound('error');
      setTerminalLogs(prev => [
        ...prev,
        `  Command not recognized for this goal: "${rawCmd}".`,
      ]);
      setWrongTries(w => {
        const next = w + 1;
        if (next >= 2) setShowHint(true);
        return next;
      });
    }

    setCommandInput('');
  };

  const handleMissionVictory = (commandUsed: string) => {
    playSound('levelUp');
    setMissionCompleted(true);
    setCompletedMissionIds(prev => Array.from(new Set([...prev, mission.id])));
    logActivityEvent({
      type: 'mission',
      commandId: commandUsed,
      xp: 50,
    });
    setTerminalLogs(prev => [
      ...prev,
      `✨  Great job! Verified via "${commandUsed}".`,
      `⭐  Mission objective completed!`,
      `🏆  Badge unlocked: [${mission.badgeName}]`,
    ]);
  };

  const handleNextMission = () => {
    if (currentMissionIdx + 1 < MISSIONS.length) {
      playSound('complete');
      setCurrentMissionIdx(i => i + 1);
    }
  };

  const handleSelectDrillOption = (idx: number) => {
    if (drillAnswered !== null) return;
    setDrillAnswered(idx);
    const drill = ARCADE_DRILLS[currentDrillIdx];
    const isCorrect = drill.options[idx].isCorrect;
    if (isCorrect) {
      playSound('success');
      logActivityEvent({
        type: 'drill',
        commandId: drill.options[idx].label,
        xp: 25,
      });
    } else {
      playSound('error');
    }
  };

  const handleNextDrill = () => {
    playSound('click');
    setDrillAnswered(null);
    if (currentDrillIdx + 1 < ARCADE_DRILLS.length) {
      setCurrentDrillIdx(i => i + 1);
    } else {
      setCurrentDrillIdx(0);
    }
  };

  const runLabCommand = (action: string) => {
    switch (action) {
      case 'add': {
        if (sandboxUnstaged.length === 0) return;
        playSound('laser');
        setSandboxStaged(prev => [...prev, ...sandboxUnstaged]);
        setSandboxUnstaged([]);
        logActivityEvent({ type: 'command', commandId: 'git add .', xp: 10 });
        break;
      }
      case 'commit': {
        if (sandboxStaged.length === 0) {
          playSound('error');
          return;
        }
        playSound('success');
        const hash = Math.random().toString(16).substring(2, 8);
        setSandboxCommits(prev => [
          ...prev,
          { hash, msg: `Update ${sandboxStaged.join(', ')}`, branch: sandboxBranch },
        ]);
        setSandboxStaged([]);
        setSandboxUnstaged([`module_${sandboxCommits.length + 1}.ts`]);
        logActivityEvent({ type: 'command', commandId: 'git commit', xp: 20 });
        break;
      }
      case 'branch': {
        playSound('warp');
        const newB = `feat/warp-${sandboxCommits.length}`;
        setSandboxBranch(newB);
        logActivityEvent({ type: 'command', commandId: `git switch -c ${newB}`, xp: 15 });
        break;
      }
      case 'switch_main': {
        playSound('click');
        setSandboxBranch('main');
        logActivityEvent({ type: 'command', commandId: 'git switch main', xp: 10 });
        break;
      }
      case 'stash': {
        if (sandboxUnstaged.length === 0 && sandboxStaged.length === 0) return;
        playSound('stash');
        setSandboxStash(prev => [...prev, `stash@{${prev.length}}: WIP on ${sandboxBranch}`]);
        setSandboxUnstaged([]);
        setSandboxStaged([]);
        logActivityEvent({ type: 'command', commandId: 'git stash', xp: 15 });
        break;
      }
      case 'pop': {
        if (sandboxStash.length === 0) return;
        playSound('pop');
        setSandboxStash(prev => prev.slice(0, -1));
        setSandboxUnstaged(['restored_cargo.ts']);
        logActivityEvent({ type: 'command', commandId: 'git stash pop', xp: 15 });
        break;
      }
    }
  };

  const currentDrill = ARCADE_DRILLS[currentDrillIdx];

  const content = (
    <div className={`card-base relative w-full flex flex-col overflow-hidden font-sans min-w-0 ${
      isEmbedded ? 'min-h-[600px]' : 'max-h-[96vh]'
    }`}>
      {/* Control Bar: Sub-tabs and mode switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border bg-surface-2/60 gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center bg-surface p-1 rounded-[10px] border border-border text-sm font-semibold w-fit">
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('campaign');
              }}
              className={`px-4 py-1.5 rounded-[8px] transition-all cursor-pointer min-h-[36px] ${
                activeTab === 'campaign'
                  ? 'bg-accent text-accent-ink font-bold shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Missions
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('arcade');
              }}
              className={`px-4 py-1.5 rounded-[8px] transition-all cursor-pointer min-h-[36px] ${
                activeTab === 'arcade'
                  ? 'bg-accent text-accent-ink font-bold shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Speed Drills
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('sandbox');
              }}
              className={`px-4 py-1.5 rounded-[8px] transition-all cursor-pointer min-h-[36px] ${
                activeTab === 'sandbox'
                  ? 'bg-accent text-accent-ink font-bold shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Free Lab
            </button>
          </div>
          <span className="text-xs text-text-muted pt-0.5">
            {activeTab === 'campaign' && 'Scenario-based story challenges solving real repo incidents'}
            {activeTab === 'arcade' && 'Rapid-fire emergency incident quizzes to test your reflexes'}
            {activeTab === 'sandbox' && 'Interactive zero-gravity sandbox to test any Git command in 3D'}
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              playSound('warp');
              const msg = activeTab === 'campaign' 
                ? `I need a hint for ${mission.title}: ${mission.scenario}`
                : activeTab === 'arcade'
                ? `Explain the answer for the speed drill: ${currentDrill.question}`
                : `What are some cool Git sandbox experiments I can try?`;
              openGitnautAI(msg);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-surface hover:bg-surface-2 border border-border hover:border-accent text-accent text-xs font-bold transition-all cursor-pointer shadow-xs min-h-[36px]"
            title="Ask UFO AI Copilot for advice on this challenge"
          >
            <span>🛸 Ask UFO Copilot</span>
          </button>
          {!isEmbedded && (
            <button
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] bg-surface-2 hover:bg-border border border-border text-text-muted hover:text-text cursor-pointer"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      {/* Level Tabs Strip: Horizontal scroll row */}
      {activeTab === 'campaign' && (
        <div className="bg-surface/80 border-b border-border px-4 sm:px-6 py-2.5 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-2 min-w-max">
            {MISSIONS.map((m, idx) => {
              const isSelected = idx === currentMissionIdx;
              const isCleared = completedMissionIds.includes(m.id);
              const isBoss = m.id === 7;

              return (
                <button
                  key={m.id}
                  onClick={() => {
                    playSound('click');
                    setCurrentMissionIdx(idx);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-sm transition-all cursor-pointer border min-h-[44px] ${
                    isSelected
                      ? 'bg-surface-2 text-accent border-accent font-bold'
                      : isCleared
                      ? 'bg-surface-2 text-accent border-border font-semibold'
                      : 'bg-surface-2 text-text-muted border-border hover:text-text'
                  }`}
                >
                  {isBoss ? (
                    <Swords className="w-4 h-4 text-accent" strokeWidth={1.75} />
                  ) : isCleared ? (
                    <CheckCircle2 className="w-4 h-4 text-accent" strokeWidth={1.75} />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-surface text-text-muted flex items-center justify-center text-xs font-bold">
                      {m.id}
                    </span>
                  )}
                  <span>{isBoss ? 'Omega Boss' : `Level 0${m.id}`}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 1: CAMPAIGN MISSIONS */}
      {activeTab === 'campaign' && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Main task pane */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-surface text-text">
            {/* (1) GOAL IN ONE SENTENCE WITH STEP INDICATOR */}
            <div className="p-5 rounded-[12px] bg-surface-2 border border-border space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-semibold text-cyan uppercase tracking-wider">
                  Mission Goal
                </span>
                <span className="text-xs text-accent bg-surface px-2.5 py-0.5 rounded-[8px] border border-border font-semibold">
                  {mission.currentStepHint.split(':')[0]}
                </span>
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-text tracking-normal">
                {mission.oneSentenceGoal}
              </h2>
              <p className="text-sm text-text-muted font-medium">
                {mission.currentStepHint}
              </p>
            </div>

            {/* Next Step Banner */}
            {nextStepMessage && (
              <div className="p-3.5 rounded-[10px] bg-accent/15 border border-accent text-text text-sm flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" strokeWidth={1.75} />
                <span className="font-semibold">{nextStepMessage}</span>
              </div>
            )}

            {/* (2) THE INTERACTIVE TASK */}
            <div className="space-y-4">
              {/* 3D Animated Commit Graph */}
              <CommitGraph3D
                commits={mission.initialState.commits || [
                  { hash: 'a10b42', msg: 'System initialized', branch: mission.initialState.branch },
                ]}
                currentBranch={mission.initialState.branch}
                hasConflict={mission.id === 7 && !bossStaged}
              />

              {/* Tap actions available for EVERY mission */}
              <div className="p-5 rounded-[12px] bg-surface-2 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text">
                    Interactive Actions (Tap or Type):
                  </span>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="btn-secondary min-h-[38px] px-3 py-1 text-xs gap-1.5"
                  >
                    <HelpCircle className="w-4 h-4 text-cyan" strokeWidth={1.75} />
                    <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                  </button>
                </div>

                {showHint && (
                  <div className="p-3.5 rounded-[10px] bg-surface border border-accent/40 text-text text-sm animate-in fade-in">
                    <span className="font-bold text-accent block mb-0.5">Need a hand?</span>
                    <span className="text-text-muted">{mission.hint}</span>
                  </div>
                )}

                {/* Mission 1 Cargo Selection */}
                {mission.id === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {mission.initialState.files?.map(file => {
                      const isStaged = stagedFiles.includes(file.name);
                      const isSecret = file.status === 'secret';
                      return (
                        <button
                          key={file.id}
                          onClick={() => handleStageFile(file)}
                          className={`p-3 rounded-[10px] border text-left text-sm transition-all cursor-pointer min-h-[44px] ${
                            isStaged
                              ? 'bg-accent/15 border-accent text-accent font-semibold'
                              : isSecret
                              ? 'bg-danger/15 border-danger text-danger hover:bg-danger/25'
                              : 'bg-surface hover:bg-surface-2 border-border text-text'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs font-bold truncate">{file.name}</span>
                            {isStaged ? (
                              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />
                            ) : (
                              <Box className="w-4 h-4 text-text-muted shrink-0" strokeWidth={1.75} />
                            )}
                          </div>
                          <p className="text-xs text-text-muted">{file.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Mission 7 Boss Conflict Vector Picker */}
                {mission.id === 7 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-semibold text-text-muted block">Pick unified vector:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          playSound('click');
                          setBossConflictChoice('head');
                        }}
                        className={`p-3 rounded-[10px] border text-sm text-left cursor-pointer min-h-[44px] ${
                          bossConflictChoice === 'head' ? 'bg-surface border-accent text-accent font-bold' : 'bg-surface border-border text-text-muted'
                        }`}
                      >
                        Keep HEAD (Orion-Alpha-7)
                      </button>
                      <button
                        onClick={() => {
                          playSound('click');
                          setBossConflictChoice('incoming');
                        }}
                        className={`p-3 rounded-[10px] border text-sm text-left cursor-pointer min-h-[44px] ${
                          bossConflictChoice === 'incoming' ? 'bg-surface border-cyan text-cyan font-bold' : 'bg-surface border-border text-text-muted'
                        }`}
                      >
                        Keep Incoming (Vega-Prime-9)
                      </button>
                      <button
                        onClick={() => {
                          playSound('success');
                          setBossConflictChoice('both');
                        }}
                        className={`p-3 rounded-[10px] border text-sm text-left cursor-pointer min-h-[44px] ${
                          bossConflictChoice === 'both' ? 'bg-surface border-accent text-accent font-bold' : 'bg-surface border-border text-text-muted'
                        }`}
                      >
                        Combine Both (Harmonic)
                      </button>
                    </div>
                  </div>
                )}

                {/* Tap Action Buttons for all missions */}
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {mission.tapActions.map((act) => (
                    <button
                      key={act.cmd}
                      onClick={() => handleExecuteCommand(act.cmd)}
                      className="btn-secondary text-sm gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-cyan" strokeWidth={1.75} />
                      <span>{act.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* (4) COLLAPSIBLE "WHY THIS MATTERS" & STORY SECTION */}
            <div className="rounded-[12px] border border-border bg-surface-2 overflow-hidden">
              <button
                onClick={() => setShowStory(!showStory)}
                className="w-full p-4 flex items-center justify-between text-left text-sm font-semibold text-text hover:bg-surface transition-colors cursor-pointer min-h-[44px]"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan" strokeWidth={1.75} />
                  <span>Why this matters & Mission Story</span>
                </div>
                {showStory ? <ChevronUp className="w-4 h-4" strokeWidth={1.75} /> : <ChevronDown className="w-4 h-4" strokeWidth={1.75} />}
              </button>
              {showStory && (
                <div className="p-4 border-t border-border space-y-3 text-sm text-text-muted leading-relaxed animate-in fade-in">
                  <div>
                    <strong className="text-text block mb-0.5">Flight Scenario:</strong>
                    {renderFormattedCodeText(mission.scenario)}
                  </div>
                  <div>
                    <strong className="text-text block mb-0.5">Everyday Metaphor:</strong>
                    {renderFormattedCodeText(mission.simpleExplanation.analogy)}
                  </div>
                  <div>
                    <strong className="text-text block mb-0.5">Takeaway:</strong>
                    {renderFormattedCodeText(mission.simpleExplanation.whyItMatters)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* (3) THE TERMINAL */}
          <div className="flex-1 flex flex-col p-4 sm:p-5 bg-[#07080F] border-t lg:border-t-0 lg:border-l border-border min-h-[340px]">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 text-xs text-text-muted font-mono">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-accent" strokeWidth={1.75} />
                <span className="font-bold text-text">cockpit-terminal</span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-border" />
                <span className="w-2.5 h-2.5 rounded-full bg-surface-2" />
                <span className="w-2.5 h-2.5 rounded-full bg-accent/60" />
              </div>
            </div>

            {/* Terminal Log */}
            <div className="flex-1 overflow-y-auto py-3 space-y-1.5 font-mono text-xs max-h-[280px] lg:max-h-[380px] scrollbar-thin">
              {terminalLogs.map((log, index) => (
                <div
                  key={index}
                  className={`leading-relaxed whitespace-pre-wrap ${
                    log.includes('Warning') || log.includes('DANGER')
                      ? 'text-danger font-semibold'
                      : log.includes('Accomplished') || log.includes('Staged') || log.includes('Great job')
                      ? 'text-success font-bold'
                      : log.startsWith('$')
                      ? 'text-cyan font-bold'
                      : 'text-text-muted'
                  }`}
                >
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Next Mission / Victory Button */}
            {missionCompleted ? (
              <div className="pt-3 border-t border-border">
                <button
                  onClick={handleNextMission}
                  className="btn-primary w-full min-h-[48px] text-base"
                >
                  <span>{currentMissionIdx + 1 === MISSIONS.length ? 'All Missions Cleared!' : `Advance to Level 0${currentMissionIdx + 2}`}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleExecuteCommand();
                }}
                className="pt-3 border-t border-border flex items-center gap-2"
              >
                <span className="text-cyan font-mono font-bold text-sm">$</span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={e => setCommandInput(e.target.value)}
                  placeholder={`Type command or tap buttons above`}
                  style={{ fontSize: '16px' }}
                  className="flex-1 bg-surface border border-border text-text rounded-[10px] px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:border-cyan min-h-[44px]"
                />
                <button
                  type="submit"
                  className="btn-primary min-h-[44px] px-5 py-2.5 text-sm"
                >
                  Run
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SPEED DRILLS */}
      {activeTab === 'arcade' && (
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-6 max-w-2xl mx-auto w-full">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-accent fill-accent" strokeWidth={1.75} />
              Emergency Incident Drill {currentDrillIdx + 1} of {ARCADE_DRILLS.length}
            </span>
            <h3 className="font-heading text-xl font-bold text-text mt-1">
              {currentDrill.title}
            </h3>
          </div>

          <div className="p-5 rounded-[12px] bg-surface-2 border border-border space-y-2">
            <p className="text-sm text-text-muted font-medium">
              {renderFormattedCodeText(currentDrill.scenario)}
            </p>
            <p className="text-base font-bold text-text pt-1">
              {renderFormattedCodeText(currentDrill.question)}
            </p>
          </div>

          <div className="space-y-3">
            {currentDrill.options.map((opt, i) => {
              const isSelected = drillAnswered === i;
              return (
                <button
                  key={i}
                  disabled={drillAnswered !== null}
                  onClick={() => handleSelectDrillOption(i)}
                  className={`w-full p-4 rounded-[12px] border text-left text-sm transition-all cursor-pointer min-h-[48px] flex flex-col justify-between ${
                    drillAnswered === null
                      ? 'bg-surface-2 hover:bg-border border-border text-text'
                      : isSelected
                      ? opt.isCorrect
                        ? 'bg-accent/15 border-accent text-text'
                        : 'bg-danger/15 border-danger text-text'
                      : opt.isCorrect
                      ? 'bg-accent/15 border-accent text-text'
                      : 'bg-surface border-border text-text-muted opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-link">$ {opt.label}</span>
                    {drillAnswered !== null && opt.isCorrect && (
                      <span className="text-accent font-bold flex items-center gap-1 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-accent" strokeWidth={1.75} /> Correct!
                      </span>
                    )}
                  </div>
                  {drillAnswered !== null && isSelected && (
                    <div className="mt-2 text-xs font-sans text-text-muted border-t border-border pt-2">
                      {opt.feedback}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {drillAnswered !== null && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextDrill}
                className="btn-primary"
              >
                <span>Next Drill</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FREE LAB SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-surface text-text">
          <div>
            <h3 className="font-heading text-lg font-bold text-text flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-cyan" strokeWidth={1.75} />
              Zero-Gravity Flight Lab (3D Simulation)
            </h3>
            <p className="text-sm text-text-muted mt-0.5 leading-relaxed">
              Execute Git commands freely to watch the 3D commit graph react. All actions log to your real Star Map.
            </p>
          </div>

          <CommitGraph3D
            commits={sandboxCommits}
            currentBranch={sandboxBranch}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-[12px] bg-surface-2 border border-border space-y-3">
              <span className="text-sm font-bold text-cyan flex items-center gap-1.5">
                <Box className="w-4 h-4" strokeWidth={1.75} />
                1. Cargo Bay & Airlock
              </span>
              <div className="space-y-1 text-sm font-mono">
                <span className="text-xs text-text-muted font-sans font-semibold">Unstaged:</span>
                {sandboxUnstaged.length === 0 ? (
                  <span className="text-text-muted italic block text-xs">Clean (0 files)</span>
                ) : (
                  sandboxUnstaged.map(f => (
                    <div key={f} className="p-1.5 rounded-[6px] bg-surface border border-border text-text text-xs">
                      {f}
                    </div>
                  ))
                )}
              </div>
              <div className="space-y-1 text-sm font-mono pt-2 border-t border-border">
                <span className="text-xs text-accent font-bold font-sans">Staged:</span>
                {sandboxStaged.length === 0 ? (
                  <span className="text-text-muted italic block text-xs">Empty</span>
                ) : (
                  sandboxStaged.map(f => (
                    <div key={f} className="p-1.5 rounded-[6px] bg-accent/10 border border-accent text-accent text-xs">
                      {f}
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => runLabCommand('add')}
                  className="flex-1 min-h-[40px] rounded-[8px] bg-surface hover:bg-surface-2 border border-border text-cyan font-mono text-xs font-bold cursor-pointer transition-colors"
                >
                  git add .
                </button>
                <button
                  onClick={() => runLabCommand('commit')}
                  className="flex-1 min-h-[40px] rounded-[8px] bg-accent hover:bg-accent-hover text-accent-ink font-mono text-xs font-bold cursor-pointer transition-colors"
                >
                  git commit
                </button>
              </div>
            </div>

            <div className="p-5 rounded-[12px] bg-surface-2 border border-border space-y-3">
              <span className="text-sm font-bold text-cyan flex items-center gap-1.5">
                <GitBranch className="w-4 h-4" strokeWidth={1.75} />
                2. Branch Controls
              </span>
              <div className="text-sm text-text-muted">
                Current Branch: <strong className="font-mono text-cyan">{sandboxBranch}</strong>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => runLabCommand('branch')}
                  className="min-h-[40px] py-2 rounded-[8px] bg-accent hover:bg-accent-hover text-accent-ink font-mono text-xs font-bold cursor-pointer transition-colors"
                >
                  git switch -c new-branch
                </button>
                <button
                  onClick={() => runLabCommand('switch_main')}
                  className="min-h-[40px] py-2 rounded-[8px] bg-surface hover:bg-surface-2 border border-border text-text font-mono text-xs cursor-pointer transition-colors"
                >
                  git switch main
                </button>
              </div>
            </div>

            <div className="p-5 rounded-[12px] bg-surface-2 border border-border space-y-3">
              <span className="text-sm font-bold text-cyan flex items-center gap-1.5">
                <Archive className="w-4 h-4" strokeWidth={1.75} />
                3. Subspace Stash
              </span>
              <div className="text-sm text-text-muted">
                Stashes in pocket: {sandboxStash.length}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => runLabCommand('stash')}
                  className="flex-1 min-h-[40px] rounded-[8px] bg-accent hover:bg-accent-hover text-accent-ink font-bold text-xs cursor-pointer transition-colors"
                >
                  git stash
                </button>
                <button
                  onClick={() => runLabCommand('pop')}
                  className="flex-1 min-h-[40px] rounded-[8px] bg-surface hover:bg-surface-2 border border-border text-cyan text-xs font-bold cursor-pointer transition-colors"
                >
                  git stash pop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-bg/80 backdrop-blur-md">
      <div className="w-full max-w-5xl">
        {content}
      </div>
    </div>
  );
}
