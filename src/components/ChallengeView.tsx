import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Challenge } from '../types/GameTypes';
import { ThresholdChallenge } from './challenges/ThresholdChallenge';
import { VRFChallenge } from './challenges/VRFChallenge';
import { BlocklockChallenge } from './challenges/BlocklockChallenge';

interface ChallengeViewProps {
  challenge: Challenge;
  onSubmitAnswer: (answer: any) => boolean;
  onReturnToMission: () => void;
}

export function ChallengeView({ challenge, onSubmitAnswer, onReturnToMission }: ChallengeViewProps) {
  const handleHint = () => {
    console.log('Hint requested for:', challenge.id);
  };

  const renderChallenge = () => {
    // Route to specific challenge component based on challenge type/id
    if (challenge.id === 'threshold-math' || challenge.id === 'threshold-security') {
      return (
        <ThresholdChallenge
          challenge={challenge}
          onSubmit={onSubmitAnswer}
          onHint={handleHint}
        />
      );
    }
    
    if (challenge.id === 'vrf-verification' || challenge.id === 'randomness-analysis') {
      return (
        <VRFChallenge
          challenge={challenge}
          onSubmit={onSubmitAnswer}
          onHint={handleHint}
        />
      );
    }
    
    if (challenge.id === 'blocklock-timing') {
      return (
        <BlocklockChallenge
          challenge={challenge}
          onSubmit={onSubmitAnswer}
          onHint={handleHint}
        />
      );
    }

    // Default challenge interface for other types
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {challenge.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          This challenge type ({challenge.type}) is under development. 
          The Threshold and VRF challenges are fully implemented.
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header Bar */}
      <AppBar position="static" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onReturnToMission}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {challenge.title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={challenge.type} size="small" />
            {/* <Chip 
              label={`${challenge.attempts}/${challenge.maxAttempts} attempts`} 
              size="small" 
              variant="outlined"
            /> */}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Challenge Content */}
      {renderChallenge()}
    </Box>
  );
}