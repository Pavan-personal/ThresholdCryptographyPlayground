import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Security,
  Casino,
  Schedule,
  Hub,
  Star,
  PlayArrow,
  MenuBook,
} from '@mui/icons-material';
import { GameState } from '../types/GameTypes';

interface GameHubProps {
  gameState: GameState;
  onStartMission: (missionId: string) => void;
  onGoToBlog: () => void;
}

const getMissionIcon = (cryptoTech: string) => {
  switch (cryptoTech) {
    case 'threshold': return <Security />;
    case 'vrf': return <Casino />;
    case 'blocklock': return <Schedule />;
    case 'dcipher': return <Hub />;
    default: return <Star />;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'success';
    case 'intermediate': return 'warning';
    case 'advanced': return 'error';
    default: return 'default';
  }
};

export function GameHub({ gameState, onStartMission, onGoToBlog }: GameHubProps) {
  const { missions } = gameState;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Playground
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<MenuBook />}
              // onClick={onGoToBlog}
              onClick={(e) => {
                e.preventDefault();
                window.open('https://thresholdcryptoplayground.vercel.app', '_blank');
              }}
              variant="outlined"
              size="small"
            >
              Blogs
            </Button>
            {/* <Typography variant="body2">
              Level {player.level}
            </Typography>
            <Typography variant="body2">
              {player.experience} XP
            </Typography> */}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>


        {/* Missions */}
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Cryptographic Challenges
        </Typography>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          {missions.map((mission) => (
            <Card
              key={mission.id}
              sx={{
                border: mission.isCompleted ? '2px solid #4caf50' : '1px solid',
                borderColor: mission.isCompleted ? '#4caf50' : 'divider',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s'
              }}
            >
              <CardContent>
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  gap: 3
                }}>
                  {/* Mission Info */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: "center", gap: 1 }}>
                      {/* <Box sx={{  color: 'primary.main' }}> */}
                      {getMissionIcon(mission.cryptoTech)}
                      {/* </Box> */}
                      {/* <Typography variant="h6" component="h2"> */}
                      {mission.title.replace(/[🏦🎰⏰🌐🎭]/g, '').trim()}
                      {/* </Typography> */}
                      {mission.isCompleted && (
                        <Star sx={{ ml: 2, color: 'warning.main' }} />
                      )}
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {mission.description.replace(/[🚨☕🎲📅🌍😉😅🎯]/g, '')}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip
                        label={mission.difficulty}
                        size="small"
                        color={getDifficultyColor(mission.difficulty) as any}
                      />
                      <Chip
                        label={mission.cryptoTech.toUpperCase()}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    {mission.isCompleted && (
                      <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                        ✓ Completed this session
                      </Typography>
                    )}
                  </Box>

                  {/* Action Button */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: { xs: '100%', md: 200 },
                    justifyContent: { xs: 'stretch', md: 'flex-end' }
                  }}>
                    <Button
                      variant={mission.isCompleted ? "outlined" : "contained"}
                      startIcon={<PlayArrow />}
                      onClick={() => onStartMission(mission.id)}
                      sx={{
                        minWidth: { xs: '100%', md: 160 },
                        py: 1.5
                      }}
                    >
                      {mission.isCompleted ? 'Replay Mission' : 'Start Mission'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Instructions */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              How to Play
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">
                • All missions are unlocked - play in any order you prefer
              </Typography>
              <Typography variant="body2">
                • Each mission teaches a different cryptographic technology
              </Typography>
              <Typography variant="body2">
                • Complete challenges by solving mathematical problems step-by-step
              </Typography>
              <Typography variant="body2">
                • Detailed explanations and examples are provided for each concept
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}