import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import {
  Security,
  Casino,
  Schedule,
  Hub,
  PlayArrow,
  School,
} from '@mui/icons-material';

interface IntroScreenProps {
  onStartGame: () => void;
}

export function IntroScreen({ onStartGame }: IntroScreenProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Threshold Cryptography Playground
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
            Master cryptographic technologies through hands-on challenges
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={onStartGame}
            sx={{ px: 4, py: 2, fontSize: '1.2rem' }}
          >
            Start Learning
          </Button>
        </Box>

        {/* Features */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 4, 
          mb: 6 
        }}>
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ mr: 2, fontSize: 32 }} />
                <Typography variant="h5">Educational Approach</Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Learn through solving real mathematical problems step-by-step.
              </Typography>
              <Typography variant="body2" paragraph>
                • Comprehensive explanations with examples
              </Typography>
              <Typography variant="body2" paragraph>
                • Manual calculations required - no shortcuts
              </Typography>
              <Typography variant="body2">
                • Progressive difficulty with detailed guidance
              </Typography>
            </Paper>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Technologies Covered
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Security sx={{ mr: 2 }} />
                  <Typography variant="body1">Threshold Cryptography</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Casino sx={{ mr: 2 }} />
                  <Typography variant="body1">Verifiable Random Functions</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ mr: 2 }} />
                  <Typography variant="body1">Blocklock Time-Release</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Hub sx={{ mr: 2 }} />
                  <Typography variant="body1">dCipher Networks</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Mission Preview */}
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Learning Missions
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3,
          justifyContent: 'center'
        }}>
          {[
            {
              title: 'Threshold Signatures',
              description: 'Learn how to combine cryptographic shares using Lagrange interpolation',
              icon: <Security />,
              difficulty: 'Beginner'
            },
            {
              title: 'VRF Verification',
              description: 'Verify random number generation and detect manipulation',
              icon: <Casino />,
              difficulty: 'Intermediate'
            },
            {
              title: 'Time-Locked Encryption',
              description: 'Calculate precise blockchain timing for time-release mechanisms',
              icon: <Schedule />,
              difficulty: 'Intermediate'
            },
            {
              title: 'Network Resilience',
              description: 'Design fault-tolerant distributed systems under attack',
              icon: <Hub />,
              difficulty: 'Advanced'
            }
          ].map((mission, index) => (
            <Card key={index} sx={{ width: 280, height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2, color: 'primary.main' }}>
                  {mission.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {mission.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, minHeight: 60 }}>
                  {mission.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {mission.difficulty}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Ready to Master Cryptography?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            All missions are unlocked. Choose any challenge to begin your learning journey.
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={onStartGame}
            sx={{ px: 6, py: 2 }}
          >
            Enter Academy
          </Button>
        </Box>
      </Container>
    </Box>
  );
}