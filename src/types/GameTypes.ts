export interface Player {
  id: string;
  name: string;
  level: number;
  experience: number;
  skills: {
    threshold: number;
    vrf: number;
    blocklock: number;
    dcipher: number;
  };
  inventory: string[];
  currentMission?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cryptoTech: 'threshold' | 'vrf' | 'blocklock' | 'dcipher';
  requiredSkill: number;
  rewards: {
    experience: number;
    items: string[];
  };
  challenges: Challenge[];
  npcDialogue: NPCDialogue[];
  isCompleted: boolean;
  isUnlocked: boolean;
}

export interface Challenge {
  id: string;
  type: 'puzzle' | 'code' | 'math' | 'timing' | 'memory';
  title: string;
  description: string;
  instruction: string;
  solution: any;
  userAnswer?: any;
  attempts: number;
  maxAttempts: number;
  timeLimit?: number;
  hints: string[];
  isCompleted: boolean;
}

export interface NPCDialogue {
  id: string;
  speaker: string;
  text: string;
  emotion: 'happy' | 'confused' | 'angry' | 'surprised' | 'worried';
  choices?: {
    text: string;
    response: string;
  }[];
}

export interface GameState {
  player: Player;
  currentScene: 'intro' | 'hub' | 'mission' | 'challenge' | 'dialogue' | 'blog' | 'mission-complete';
  activeMission?: Mission;
  activeChallenge?: Challenge;
  activeDialogue?: NPCDialogue;
  missions: Mission[];
  gamePhase: 'intro' | 'playing' | 'completed';
  notifications: string[];
}

export interface ThresholdChallenge {
  shares: { id: string; value: number; x: number }[];
  threshold: number;
  target: number;
  selectedShares: string[];
  polynomial?: number[];
}

export interface VRFChallenge {
  seed: string;
  publicKey: string;
  proof: {
    gamma: string;
    c: string;
    s: string;
  };
  expectedOutput: string;
  verificationSteps: {
    step: string;
    value: string;
    isCorrect?: boolean;
  }[];
}

export interface BlocklockChallenge {
  currentBlock: number;
  targetTime: string;
  avgBlockTime: number;
  variance: number;
  calculatedBlock?: number;
  riskAssessment?: 'low' | 'medium' | 'high';
}

export interface DCipherChallenge {
  networkNodes: {
    id: string;
    x: number;
    y: number;
    type: 'sender' | 'receiver' | 'relay';
    isActive: boolean;
    connections: string[];
  }[];
  message: string;
  attackScenario: 'ddos' | 'partition' | 'latency';
  path: string[];
  redundantPaths: string[][];
}
