import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useGameEngine } from './hooks/useGameEngine';
import { ToastProvider } from './components/ToastNotification';
import { GameHub } from './components/GameHub';
import { MissionView } from './components/MissionView';
import { ChallengeView } from './components/ChallengeView';
import { IntroScreen } from './components/IntroScreen';
import { BlogSection } from './components/BlogSection';
import { MissionComplete } from './components/MissionComplete';
import { theme } from './theme';
import './App.css';

function App() {
  const { gameState, actions } = useGameEngine();

  const renderCurrentScene = () => {
    switch (gameState.currentScene) {
      case 'intro':
        return <IntroScreen onStartGame={actions.startGame} />;
      case 'hub':
        return <GameHub gameState={gameState} onStartMission={actions.startMission} onGoToBlog={actions.goToBlog} />;
      case 'mission':
        return (
          <MissionView 
            mission={gameState.activeMission!} 
            onStartChallenge={actions.startChallenge}
            onReturnToHub={actions.returnToHub}
          />
        );
      case 'challenge':
        return (
          <ChallengeView
            challenge={gameState.activeChallenge!}
            onSubmitAnswer={actions.submitChallengeAnswer}
            onReturnToMission={() => actions.startMission(gameState.activeMission!.id)}
          />
        );
      case 'blog':
        return <BlogSection onReturnToHub={actions.returnToHub} />;
      case 'mission-complete':
        return <MissionComplete mission={gameState.activeMission!} onReturnToHub={actions.returnToHub} />;
      default:
        return <GameHub gameState={gameState} onStartMission={actions.startMission} onGoToBlog={actions.goToBlog} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <div className="App">
          {renderCurrentScene()}
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
