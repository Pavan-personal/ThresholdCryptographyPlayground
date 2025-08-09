import { Mission } from '../types/GameTypes';

export function generateMissions(): Mission[] {
  return [
    {
      id: 'threshold-heist',
      title: '🏦 The Great Bank Key Heist',
      description: 'Professor Crypto has lost his memory! Help him remember how to combine threshold signatures to unlock the bank vault... before his coffee gets cold! ☕',
      difficulty: 'beginner',
      cryptoTech: 'threshold',
      requiredSkill: 0,
      isUnlocked: true,
      isCompleted: false,
      rewards: {
        experience: 100,
        items: ['threshold-badge', 'brain-power-pill']
      },
      npcDialogue: [
        {
          id: 'prof-intro',
          speaker: 'Professor Crypto 👨‍🏫',
          text: "Oh no! I drank too much coffee and forgot how threshold signatures work! The bank vault needs 3 out of 5 executives to sign, but I can't remember the math! Help me before my reputation is ruined! 😅",
          emotion: 'worried',
          choices: [
            { text: "Don't worry Prof, I'll help you!", response: "Thank you! You're my only hope!" },
            { text: "Maybe try less coffee next time? 😏", response: "Very funny! Now help me fix this mess!" }
          ]
        },
        {
          id: 'exec-drama',
          speaker: 'Bank Executive Alice 💼',
          text: "Listen here rookie, this isn't child's play! One wrong calculation and the entire bank's security is compromised. Are you sure you can handle polynomial interpolation?",
          emotion: 'angry',
          choices: [
            { text: "I've got this! Just watch me.", response: "Hmph! We'll see about that..." },
            { text: "Um... what's a polynomial? 😅", response: "Oh great, another amateur. Professor, what have you done?!" }
          ]
        }
      ],
      challenges: [
        {
          id: 'threshold-math',
          type: 'math',
          title: 'Polynomial Magic',
          description: 'The 5 executives each hold a secret share. You need to combine exactly 3 shares using Lagrange interpolation to reconstruct the signature.',
          instruction: 'Select 3 executives and calculate the Lagrange coefficients manually. Then combine their shares to create the final signature.',
          solution: { 
            selectedExecutives: ['alice', 'bob', 'carol'], 
            coefficients: { alice: '3', bob: '-3', carol: '1' },
            signature: -16 
          },
          attempts: 0,
          maxAttempts: 3,
          timeLimit: 300,
          hints: [
            "Lagrange coefficient formula: L_i(0) = ∏(0-x_j)/(x_i-x_j) for j≠i",
            "You need exactly 3 shares, not more or less!",
            "Remember: signature = sum of (share_i × L_i(0))"
          ],
          isCompleted: false
        },
        {
          id: 'threshold-security',
          type: 'puzzle',
          title: 'Security Validation',
          description: 'Verify that your threshold signature is actually secure by testing attack scenarios.',
          instruction: 'Try to forge a signature with only 2 shares. The system should reject it!',
          solution: { attackSuccessful: false, validSignature: true },
          attempts: 0,
          maxAttempts: 2,
          hints: [
            "With only 2 shares, you can't reconstruct the polynomial",
            "The security comes from requiring the minimum threshold"
          ],
          isCompleted: false
        }
      ]
    },
    {
      id: 'vrf-casino',
      title: '🎰 The Rigged Casino Caper',
      description: 'Casino owner Tony "Lucky" Riggs is using fake randomness to cheat players! Use VRF to prove his slot machines are rigged and save the gamblers! 🎲',
      difficulty: 'intermediate',
      cryptoTech: 'vrf',
      requiredSkill: 15,
      isUnlocked: true,
      isCompleted: false,
      rewards: {
        experience: 150,
        items: ['vrf-detector', 'lucky-charm', 'casino-ban-hammer']
      },
      npcDialogue: [
        {
          id: 'casino-owner',
          speaker: 'Tony "Lucky" Riggs 🤵',
          text: "What?! My casino is perfectly fair! Just because I win 99.9% of the time doesn't mean anything is rigged! These machines use... uh... quantum randomness! Yeah, that's it! 😈",
          emotion: 'angry',
          choices: [
            { text: "Quantum randomness? Really? 🤔", response: "Of course! Very technical stuff, you wouldn't understand!" },
            { text: "Let me verify your VRF proofs then", response: "VRF? What's that? Some kind of virus?" }
          ]
        },
        {
          id: 'angry-gambler',
          speaker: 'Broke Gambler Betty 🎰',
          text: "I've lost my life savings here! These machines NEVER pay out! There's got to be something fishy going on. Please help us prove this place is a scam! 😭",
          emotion: 'worried'
        }
      ],
      challenges: [
        {
          id: 'vrf-verification',
          type: 'code',
          title: 'VRF Proof Detective 🕵️',
          description: 'Examine the VRF proofs from the slot machine. Real randomness should pass cryptographic verification.',
          instruction: 'Step through the VRF verification process: 1) Parse the proof, 2) Verify the elliptic curve math, 3) Check if output matches proof',
          solution: { proofValid: false, randomnessScore: 0.1, verdict: 'rigged' },
          attempts: 0,
          maxAttempts: 3,
          timeLimit: 400,
          hints: [
            "Check if e(proof_gamma, generator) = e(hash_point, public_key)",
            "Real randomness should have uniform distribution",
            "Tony's proofs are probably fake!"
          ],
          isCompleted: false
        },
        {
          id: 'randomness-analysis',
          type: 'puzzle',
          title: 'Pattern Hunter 📊',
          description: 'Analyze 100 "random" slot machine outcomes to find the hidden pattern.',
          instruction: 'Look at the sequence of wins/losses and identify the predictable pattern Tony is using.',
          solution: { pattern: 'lose-lose-lose-tiny-win', period: 4 },
          attempts: 0,
          maxAttempts: 4,
          hints: [
            "Real randomness has no patterns",
            "Count how often wins occur",
            "Look for repeating sequences"
          ],
          isCompleted: false
        }
      ]
    },
    {
      id: 'blocklock-vault',
      title: '⏰ The Time-Locked Treasure Vault',
      description: 'Evil Dr. Timezone has locked away the cure for "Monday Blues" in a time-locked vault! Calculate the exact block height to release it before the weekend ends! 📅',
      difficulty: 'intermediate',
      cryptoTech: 'blocklock',
      requiredSkill: 30,
      isUnlocked: true,
      isCompleted: false,
      rewards: {
        experience: 200,
        items: ['time-calculator', 'weekend-saver', 'monday-cure']
      },
      npcDialogue: [
        {
          id: 'dr-timezone',
          speaker: 'Dr. Timezone ⏰',
          text: "Mwahahaha! I've locked the Monday Blues cure until exactly Friday 5 PM! But I used blockchain time-locks, so if you calculate wrong, everyone suffers through Monday FOREVER! 😈",
          emotion: 'angry'
        },
        {
          id: 'worried-worker',
          speaker: 'Office Worker Sam 💼',
          text: "Please help us! Without the Monday cure, I'll have to pretend to work on spreadsheets all day! The horror! You must calculate the exact block height for Friday 5 PM! ⏰",
          emotion: 'worried',
          choices: [
            { text: "Don't worry, I'll save everyone from Monday!", response: "You're our hero!" },
            { text: "What's wrong with Mondays? 😏", response: "EVERYTHING! Please just help!" }
          ]
        }
      ],
      challenges: [
        {
          id: 'block-timing',
          type: 'math',
          title: 'Blockchain Time Machine ⏰',
          description: 'Calculate the exact block height for Friday 5 PM release, accounting for variable block times and network congestion.',
          instruction: 'Given current block height, average block time, and variance, calculate the target block for exactly Friday 5 PM.',
          solution: { targetBlock: 847563, confidence: 95, riskLevel: 'low' },
          attempts: 0,
          maxAttempts: 3,
          timeLimit: 500,
          hints: [
            "Account for weekend mining power changes",
            "Include safety margin for variance",
            "Consider timezone differences"
          ],
          isCompleted: false
        },
        {
          id: 'risk-assessment',
          type: 'puzzle',
          title: 'Risk Calculator 📊',
          description: 'Assess the probability of early/late unlock and plan contingencies.',
          instruction: 'Calculate risk scenarios: What if blocks come 20% faster? What if network congestion occurs?',
          solution: { earlyRisk: 15, lateRisk: 10, contingencyPlan: 'dual-lock' },
          attempts: 0,
          maxAttempts: 2,
          hints: [
            "Murphy's law: What can go wrong, will go wrong",
            "Plan for both early and late scenarios"
          ],
          isCompleted: false
        }
      ]
    },
    {
      id: 'dcipher-network',
      title: '🌐 The Network Chaos Chronicles',
      description: 'Cyber villain Network Nemesis is attacking the global internet! Design a resilient dCipher network that can survive his chaos and keep memes flowing! 🌍',
      difficulty: 'advanced',
      cryptoTech: 'dcipher',
      requiredSkill: 50,
      isUnlocked: true,
      isCompleted: false,
      rewards: {
        experience: 300,
        items: ['network-architect-badge', 'chaos-immunity', 'meme-protector']
      },
      npcDialogue: [
        {
          id: 'network-nemesis',
          speaker: 'Network Nemesis 💀',
          text: "I will bring down the entire internet! No more cat videos! No more memes! I'll partition your networks, DDoS your nodes, and create chaos! Your puny dCipher won't save you! 😈",
          emotion: 'angry'
        },
        {
          id: 'meme-lord',
          speaker: 'Supreme Meme Lord 👑',
          text: "The memes... they're disappearing! Without a resilient network, humanity will lose its most precious treasure - the ability to share funny pictures with text! You must save us! 😱",
          emotion: 'worried',
          choices: [
            { text: "I'll protect the memes at all costs!", response: "You are the chosen one!" },
            { text: "Maybe people should go outside more? 🤔", response: "BLASPHEMY! THE MEMES MUST FLOW!" }
          ]
        }
      ],
      challenges: [
        {
          id: 'network-topology',
          type: 'puzzle',
          title: 'Network Architect Master 🏗️',
          description: 'Design a network topology that can survive multiple simultaneous attacks while maintaining performance.',
          instruction: 'Place nodes strategically and create redundant paths that can handle DDoS, network partitions, and latency attacks.',
          solution: { 
            topology: 'mesh-hybrid', 
            redundancy: 3, 
            attackResistance: 95,
            performance: 85 
          },
          attempts: 0,
          maxAttempts: 3,
          timeLimit: 600,
          hints: [
            "Redundancy is key - multiple paths to every destination",
            "Consider geographic distribution",
            "Balance security with performance"
          ],
          isCompleted: false
        },
        {
          id: 'attack-simulation',
          type: 'timing',
          title: 'Chaos Survivor 🔥',
          description: 'Your network faces real-time attacks! Route messages efficiently while under fire.',
          instruction: 'Network Nemesis launches attacks in real-time. Adapt your routing to maintain connectivity.',
          solution: { messagesDelivered: 95, avgLatency: 150, networkUptime: 98 },
          attempts: 0,
          maxAttempts: 2,
          timeLimit: 180,
          hints: [
            "Adapt quickly to changing conditions",
            "Use alternative paths when primary routes fail",
            "Monitor network health continuously"
          ],
          isCompleted: false
        }
      ]
    }
  ];
}
