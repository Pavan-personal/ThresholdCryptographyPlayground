import { useState, useCallback, } from 'react';
import { GameState, Player,  } from '../types/GameTypes';
import { generateMissions } from '../data/missions';

const initialPlayer: Player = {
  id: 'player-1',
  name: 'Rookie Hacker',
  level: 1,
  experience: 0,
  skills: {
    threshold: 0,
    vrf: 0,
    blocklock: 0,
    dcipher: 0
  },
  inventory: ['laptop', 'coffee'],
  currentMission: undefined
};

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>({
    player: initialPlayer,
    currentScene: 'intro',
    missions: generateMissions(),
    gamePhase: 'intro',
    notifications: []
  });

  const addNotification = useCallback((message: string) => {
    setGameState(prev => ({
      ...prev,
      notifications: [...prev.notifications, message].slice(-3) // Keep only last 3
    }));
    
    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        notifications: prev.notifications.slice(1)
      }));
    }, 3000);
  }, []);

  const updatePlayerSkill = useCallback((skill: keyof Player['skills'], amount: number) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        skills: {
          ...prev.player.skills,
          [skill]: Math.min(100, prev.player.skills[skill] + amount)
        }
      }
    }));
    addNotification(`${skill.toUpperCase()} skill increased by ${amount}!`);
  }, [addNotification]);

  const addExperience = useCallback((amount: number) => {
    setGameState(prev => {
      const newExperience = prev.player.experience + amount;
      const newLevel = Math.floor(newExperience / 100) + 1;
      const leveledUp = newLevel > prev.player.level;
      
      if (leveledUp) {
        addNotification(`Level Up! You are now level ${newLevel}!`);
      }
      
      return {
        ...prev,
        player: {
          ...prev.player,
          experience: newExperience,
          level: newLevel
        }
      };
    });
  }, [addNotification]);

  const startMission = useCallback((missionId: string) => {
    const mission = gameState.missions.find(m => m.id === missionId);
    if (!mission || !mission.isUnlocked) {
      addNotification("Mission not available!");
      return;
    }

    setGameState(prev => ({
      ...prev,
      activeMission: mission,
      currentScene: 'mission',
      player: {
        ...prev.player,
        currentMission: missionId
      }
    }));
    addNotification(`Started mission: ${mission.title}`);
  }, [gameState.missions, addNotification]);

  const startChallenge = useCallback((challengeId: string) => {
    if (!gameState.activeMission) return;
    
    const challenge = gameState.activeMission.challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    setGameState(prev => ({
      ...prev,
      activeChallenge: challenge,
      currentScene: 'challenge'
    }));
  }, [gameState.activeMission]);

  const submitChallengeAnswer = useCallback((answer: any) => {
    if (!gameState.activeChallenge) return false;

    const challenge = gameState.activeChallenge;
    
    // Custom validation for threshold challenge
    let isCorrect = false;
    
    if (challenge.id === 'threshold-math') {
      const solution = challenge.solution as any;
      const userAnswer = answer;
      
      // Check if correct executives selected
      const correctExecs = solution.selectedExecutives.sort().join(',') === 
                          userAnswer.selectedExecutives.sort().join(',');
      
      // Check coefficients
      const coefficientsCorrect = correctExecs && 
        solution.selectedExecutives.every((execId: string) => 
          parseFloat(userAnswer.coefficients[execId]) === parseFloat(solution.coefficients[execId])
        );
      
      // Check signature (allow some tolerance for floating point)
      const signatureCorrect = Math.abs(userAnswer.signature - solution.signature) < 0.1;
      
      if (correctExecs && coefficientsCorrect && signatureCorrect) {
        isCorrect = true;
      }
    } else {
      // Default comparison for other challenges
      isCorrect = JSON.stringify(answer) === JSON.stringify(challenge.solution);
    }
    
    setGameState(prev => {
      if (!prev.activeChallenge) return prev;
      
      const updatedChallenge = {
        ...prev.activeChallenge,
        userAnswer: answer,
        attempts: prev.activeChallenge.attempts + 1,
        isCompleted: isCorrect
      };

      const updatedMissions = prev.missions.map(mission => {
        if (mission.id === prev.activeMission?.id) {
          return {
            ...mission,
            challenges: mission.challenges.map(c => 
              c.id === challenge.id ? updatedChallenge : c
            ),
            isCompleted: mission.challenges.every(c => 
              c.id === challenge.id ? isCorrect : c.isCompleted
            )
          };
        }
        return mission;
      });

      return {
        ...prev,
        activeChallenge: updatedChallenge,
        missions: updatedMissions,
        activeMission: updatedMissions.find(m => m.id === prev.activeMission?.id)
      };
    });

    if (isCorrect) {
      // Check if mission is complete
      setTimeout(() => {
        const mission = gameState.missions.find(m => m.id === gameState.activeMission?.id);
        if (mission?.challenges.every(c => c.isCompleted)) {
          // Navigate to mission complete page
          setGameState(prev => ({
            ...prev,
            currentScene: 'mission-complete'
          }));
        }
      }, 1000);
    }

    return isCorrect;
  }, [gameState.activeChallenge, gameState.activeMission, gameState.missions]);

  const completeMission = useCallback(() => {
    if (!gameState.activeMission) return;

    const mission = gameState.activeMission;
    addExperience(mission.rewards.experience);
    
    setGameState(prev => {
      const updatedMissions = prev.missions.map(m => {
        if (m.id === mission.id) {
          return { ...m, isCompleted: true };
        }
        // Unlock next mission
        if (m.id === getNextMissionId(mission.id)) {
          return { ...m, isUnlocked: true };
        }
        return m;
      });

      return {
        ...prev,
        missions: updatedMissions,
        currentScene: 'hub',
        activeMission: undefined,
        activeChallenge: undefined,
        player: {
          ...prev.player,
          currentMission: undefined,
          inventory: [...prev.player.inventory, ...mission.rewards.items]
        }
      };
    });

    addNotification(`Mission "${mission.title}" completed! 🏆`);
  }, [gameState.activeMission, addExperience, addNotification]);

  const returnToHub = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentScene: 'hub',
      activeMission: undefined,
      activeChallenge: undefined,
      activeDialogue: undefined
    }));
  }, []);

  const goToBlog = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentScene: 'blog'
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'playing',
      currentScene: 'hub'
    }));
    addNotification("Welcome to Crypto Heist Academy! 🎭");
  }, [addNotification]);

  return {
    gameState,
    actions: {
      startGame,
      startMission,
      startChallenge,
      submitChallengeAnswer,
      completeMission,
      returnToHub,
      goToBlog,
      updatePlayerSkill,
      addExperience,
      addNotification
    }
  };
}

function getNextMissionId(currentMissionId: string): string {
  const missionOrder = ['threshold-heist', 'vrf-casino', 'blocklock-vault', 'dcipher-network'];
  const currentIndex = missionOrder.indexOf(currentMissionId);
  return missionOrder[currentIndex + 1] || '';
}
