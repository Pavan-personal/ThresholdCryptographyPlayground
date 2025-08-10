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
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' },
              fontWeight: 'bold',
              mb: 2
            }}
          >
            Threshold Cryptography Playground
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              color: 'text.secondary',
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Master advanced cryptographic technologies through interactive challenges and real-world scenarios
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={onStartGame}
            sx={{ 
              px: 6, 
              py: 2, 
              fontSize: '1.2rem',
              borderRadius: 3,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s'
            }}
          >
            Enter Playground
          </Button>
        </Box>

        {/* Features */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4, 
          mb: 8 
        }}>
          <Paper sx={{ 
            p: 4, 
            height: '100%', 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <School sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="bold">Educational Approach</Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Learn through solving real mathematical problems step-by-step with comprehensive guidance.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">
                ✓ Interactive explanations with examples
              </Typography>
              <Typography variant="body2">
                ✓ Manual calculations required - build real understanding
              </Typography>
              <Typography variant="body2">
                ✓ Progressive difficulty with detailed feedback
              </Typography>
            </Box>
          </Paper>
          
          <Paper sx={{ 
            p: 4, 
            height: '100%',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
              Technologies Covered
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Security sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="body1">Threshold Cryptography</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Casino sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="body1">Verifiable Random Functions</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="body1">Blocklock Time-Release</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Hub sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="body1">dCipher Networks</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Mission Preview */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
            Challenge Missions
          </Typography>
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
            gap: 3,
            maxWidth: 1200,
            mx: 'auto'
          }}>
            {[
              {
                title: 'Threshold Signatures',
                description: 'Learn how to combine cryptographic shares using Lagrange interpolation',
                icon: <Security sx={{ fontSize: 32 }} />,
                difficulty: 'Beginner'
              },
              {
                title: 'VRF Verification',
                description: 'Verify random number generation and detect manipulation',
                icon: <Casino sx={{ fontSize: 32 }} />,
                difficulty: 'Intermediate'
              },
              {
                title: 'Time-Locked Encryption',
                description: 'Calculate precise blockchain timing for time-release mechanisms',
                icon: <Schedule sx={{ fontSize: 32 }} />,
                difficulty: 'Intermediate'
              },
              {
                title: 'Network Resilience',
                description: 'Design fault-tolerant distributed systems under attack',
                icon: <Hub sx={{ fontSize: 32 }} />,
                difficulty: 'Advanced'
              }
            ].map((mission, index) => (
              <Card key={index} sx={{ 
                // height: '100%', 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-4px)',
                },
                transition: 'all 0.3s'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3, position: 'relative' }}>
                  <Box sx={{ mb: 2, color: 'primary.main' }}>
                    {mission.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {mission.title}
                  </Typography>
                  <Typography variant="body2" sx={{ minHeight: 60, color: 'text.secondary' }}>
                    {mission.description}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    px: 2, 
                    py: 0.5, 
                    borderRadius: 1, 
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                  }} style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    color: 'white',
                  }}>
                    {mission.difficulty}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
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
            Enter Playground
          </Button>
        </Box>
      </Container>
    </Box>
  );
}