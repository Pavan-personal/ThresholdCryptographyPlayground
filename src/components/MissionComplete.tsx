import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  ArrowForward,
  Star,
  Security,
  Casino,
  Schedule,
  Hub,
} from '@mui/icons-material';
import { Mission } from '../types/GameTypes';

interface MissionCompleteProps {
  mission: Mission;
  onReturnToHub: () => void;
}

const getMissionIcon = (cryptoTech: string) => {
  switch (cryptoTech) {
    case 'threshold': return <Security sx={{ fontSize: 48 }} />;
    case 'vrf': return <Casino sx={{ fontSize: 48 }} />;
    case 'blocklock': return <Schedule sx={{ fontSize: 48 }} />;
    case 'dcipher': return <Hub sx={{ fontSize: 48 }} />;
    default: return <Star sx={{ fontSize: 48 }} />;
  }
};

const getMissionTitle = (missionId: string) => {
  switch (missionId) {
    case 'threshold-heist': return 'The Great Bank Key Heist';
    case 'vrf-casino': return 'Casino Random Verification';
    case 'blocklock-vault': return 'Time-Locked Vault Challenge';
    case 'dcipher-network': return 'dCipher Network Defense';
    default: return 'Mission Complete';
  }
};

const getMissionSummary = (missionId: string) => {
  switch (missionId) {
    case 'threshold-heist': 
      return 'You successfully coordinated 3 executives to unlock the bank vault using Lagrange interpolation. The threshold signature was calculated perfectly, and the emergency transfer has been authorized.';
    case 'vrf-casino': 
      return 'You mastered verifiable random functions by proving the casino\'s randomness was fair and detecting manipulation attempts.';
    case 'blocklock-vault': 
      return 'You calculated the precise blockchain timing and successfully unlocked the time-locked vault at exactly the right moment.';
    case 'dcipher-network': 
      return 'You designed a resilient distributed network that can withstand various attacks while maintaining privacy and performance.';
    default: 
      return 'Congratulations on completing this cryptographic challenge!';
  }
};

export function MissionComplete({ mission, onReturnToHub }: MissionCompleteProps) {

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        {/* Success Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircle 
            sx={{ 
              fontSize: 80, 
              color: 'success.main', 
              mb: 2 
            }} 
          />
          <Typography variant="h3" gutterBottom sx={{ color: 'success.main' }}>
            Mission Accomplished!
          </Typography>
          <Typography variant="h5" color="text.secondary">
            {getMissionTitle(mission.id)}
          </Typography>
        </Box>

        {/* Mission Summary */}
        <Card sx={{ mb: 4, bgcolor: 'background.paper' }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Box sx={{ mb: 3, color: 'primary.main' }}>
              {getMissionIcon(mission.cryptoTech)}
            </Box>
            <Typography variant="h6" gutterBottom>
              What You Accomplished
            </Typography>
            <Typography variant="body1" paragraph>
              {getMissionSummary(mission.id)}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Chip 
                label={mission.cryptoTech.toUpperCase()} 
                color="primary" 
                variant="outlined"
              />
              <Chip 
                label={`${mission.difficulty} Level`} 
                color="success" 
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>



        {/* Action Buttons */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={onReturnToHub}
            endIcon={<ArrowForward />}
            sx={{ px: 4, py: 2 }}
          >
            Continue Learning
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
