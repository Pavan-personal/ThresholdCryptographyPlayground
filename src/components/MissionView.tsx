import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  CheckCircle,
  Info,
} from '@mui/icons-material';
import { Mission } from '../types/GameTypes';

interface MissionViewProps {
  mission: Mission;
  onStartChallenge: (challengeId: string) => void;
  onReturnToHub: () => void;
}

export function MissionView({ mission, onStartChallenge, onReturnToHub }: MissionViewProps) {
  const completedChallenges = mission.challenges.filter(c => c.isCompleted).length;
  const totalChallenges = mission.challenges.length;
  const progressPercent = (completedChallenges / totalChallenges) * 100;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onReturnToHub}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {mission.title.replace(/[🏦🎰⏰🌐🎭]/g, '').trim()}
          </Typography>
          <Chip 
            label={mission.difficulty} 
            color={mission.difficulty === 'beginner' ? 'success' : 
                   mission.difficulty === 'intermediate' ? 'warning' : 'error'}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Mission Overview */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Mission Overview
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {mission.description.replace(/[🚨☕🎲📅🌍😉😅🎯]/g, '')}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Learning Objectives
              </Typography>
              <Typography variant="body2" paragraph>
                Master {mission.cryptoTech.toUpperCase()} technology through hands-on problem solving.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Technology:</strong> {mission.cryptoTech.replace('dcipher', 'dCipher')}
              </Typography>
              <Typography variant="body2">
                <strong>Rewards:</strong> +{mission.rewards.experience} XP, Skill advancement
              </Typography>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Challenges: {completedChallenges}/{totalChallenges}
                </Typography>
                {mission.isCompleted && (
                  <CheckCircle sx={{ color: 'success.main' }} />
                )}
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progressPercent} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Challenges */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Mission Challenges
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {mission.challenges.map((challenge, index) => (
            <Card 
              key={challenge.id}
              sx={{ 
                border: challenge.isCompleted ? '2px solid #4caf50' : '1px solid #333',
              }}
            >
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  gap: 3
                }}>
                  {/* Challenge Info */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="h6" sx={{ mr: 2 }}>
                        {challenge.title}
                      </Typography>
                      {challenge.isCompleted && (
                        <CheckCircle sx={{ color: 'success.main' }} />
                      )}
                      <Chip 
                        label={challenge.type} 
                        size="small" 
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {challenge.description}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: 2, 
                      alignItems: 'center',
                      mb: 2
                    }}>
                      {challenge.timeLimit && (
                        <Typography variant="caption" color="text.secondary">
                          Time Limit: {Math.floor(challenge.timeLimit / 60)}:{(challenge.timeLimit % 60).toString().padStart(2, '0')}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        Attempts: {challenge.attempts}/{challenge.maxAttempts}
                      </Typography>
                    </Box>

                    {/* Challenge Preview */}
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Info sx={{ mr: 1, fontSize: 'small' }} />
                        <Typography variant="subtitle2">
                          What you'll learn:
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {challenge.instruction}
                      </Typography>
                    </Paper>
                  </Box>
                  
                  {/* Action Button */}
                  <Box sx={{ 
                    display: 'flex', 
                    minWidth: { xs: '100%', md: 200 },
                    justifyContent: { xs: 'stretch', md: 'flex-end' }
                  }}>
                    {challenge.isCompleted ? (
                      <Button
                        variant="outlined"
                        startIcon={<PlayArrow />}
                        onClick={() => onStartChallenge(challenge.id)}
                        sx={{ minWidth: { xs: '100%', md: 160 } }}
                      >
                        Review Challenge
                      </Button>
                    ) : challenge.attempts >= challenge.maxAttempts ? (
                      <Button 
                        variant="outlined" 
                        disabled
                        sx={{ minWidth: { xs: '100%', md: 160 } }}
                      >
                        Max Attempts Reached
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={() => onStartChallenge(challenge.id)}
                        sx={{ minWidth: { xs: '100%', md: 160 } }}
                      >
                        Start Challenge
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Mission Summary */}
        {mission.isCompleted && (
          <Paper sx={{ p: 3, mt: 4, bgcolor: 'success.dark' }}>
            <Typography variant="h6" gutterBottom>
              Mission Completed!
            </Typography>
            <Typography variant="body2">
              Congratulations! You have mastered {mission.cryptoTech.toUpperCase()} technology. 
              You earned {mission.rewards.experience} experience points and advanced your cryptographic skills.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
}