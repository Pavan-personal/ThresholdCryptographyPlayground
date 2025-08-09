import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  TextField,
  LinearProgress,
  Chip,
  Container,
} from '@mui/material';
import {
  Schedule,
  Casino,
  CheckCircle,
  Timer,
  Star,
  Security,
  AutoFixHigh,
} from '@mui/icons-material';
import { Challenge } from '../../types/GameTypes';
import { useToast } from '../ToastNotification';

interface BlocklockChallengeProps {
  challenge: Challenge;
  onSubmit: (answer: any) => void;
  onHint: () => void;
}

export function BlocklockChallenge({ challenge, onSubmit }: BlocklockChallengeProps) {
  const { showSuccess, showError, showInfo } = useToast();
  const [gamePhase, setGamePhase] = useState<'setup' | 'rolling' | 'calculating' | 'results'>('setup');
  const [diceValues, setDiceValues] = useState<number[]>([1, 1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [currentBlock] = useState(1000000);
  const [targetDelay] = useState(24);
  const [calculatedBlock, setCalculatedBlock] = useState('');
  const [gameScore, setGameScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [rollCount, setRollCount] = useState(0);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const rollDice = useCallback(async () => {
    setIsRolling(true);
    setGamePhase('rolling');
    setRollCount(prev => prev + 1);
    
    // Animated dice rolling
    const rollDuration = 2000;
    const rollInterval = 100;
    const steps = rollDuration / rollInterval;
    
    let currentStep = 0;
    const rollAnimation = setInterval(() => {
      setDiceValues([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
      
      currentStep++;
      if (currentStep >= steps) {
        clearInterval(rollAnimation);
        // Final dice values
        const finalValues = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ];
        setDiceValues(finalValues);
        setIsRolling(false);
        setGamePhase('calculating');
        setGameScore(prev => prev + 10);
        showInfo(`Dice rolled: ${finalValues.join('-')}. Total entropy: ${finalValues.reduce((a, b) => a + b, 0)}`);
      }
    }, rollInterval);
  }, [showInfo]);

  const calculateTargetBlock = () => {
    // Simplified blocklock calculation
    const diceSum = diceValues.reduce((sum, val) => sum + val, 0);
    const blocksPerHour = 6; // Approximate for Bitcoin
    const targetBlocks = targetDelay * blocksPerHour;
    const calculatedTarget = currentBlock + targetBlocks + (diceSum * 10);
    return calculatedTarget;
  };

  const submitAnswer = () => {
    const correctAnswer = calculateTargetBlock();
    const userAnswer = parseInt(calculatedBlock);
    const isCorrect = Math.abs(userAnswer - correctAnswer) <= 50; // Allow some tolerance
    
    const answer = {
      diceValues,
      targetDelay,
      calculatedBlock: userAnswer,
      correct: isCorrect
    };
    
    if (isCorrect) {
      setGameScore(prev => prev + 50);
      showSuccess(`Perfect calculation! Your target block ${userAnswer} is correct. Score: ${gameScore + 50} points!`);
    } else {
      showError(`Incorrect calculation. Expected around ${correctAnswer}, but got ${userAnswer}. Try again!`);
    }
    
    setGamePhase('results');
    onSubmit(answer);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 2
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              <Schedule sx={{ mr: 2, verticalAlign: 'middle' }} />
              Blocklock Time Challenge
            </Typography>
            <Typography variant="h6">
              Master time-locked cryptography with blockchain mechanics
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Box sx={{ mb: 2 }}>
              <Chip 
                icon={<Star />} 
                label={`Score: ${gameScore}`} 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mr: 1 }} 
              />
              <Chip 
                icon={<Timer />} 
                label={`Time: ${formatTime(timeSpent)}`} 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Game Progress */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Challenge Progress</Typography>
        <LinearProgress 
          variant="determinate" 
          value={
            gamePhase === 'setup' ? 25 :
            gamePhase === 'rolling' ? 50 :
            gamePhase === 'calculating' ? 75 : 100
          } 
          sx={{ height: 8, borderRadius: 4, mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          Phase: {gamePhase.charAt(0).toUpperCase() + gamePhase.slice(1)}
        </Typography>
      </Paper>

      {/* Mission Setup */}
      {gamePhase === 'setup' && (
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom color="primary">
            <Security sx={{ mr: 2 }} />
            Mission: Time-Locked Secret Vault
          </Typography>
          
          <Typography variant="body1" paragraph>
            You need to calculate the exact blockchain block number when a time-locked secret will be automatically 
            revealed. The vault uses <strong>Blocklock encryption</strong> - a cryptographic technique that ensures 
            secrets can only be decrypted after a specific amount of time has passed.
          </Typography>

          <Card sx={{ my: 3, bgcolor: 'info.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AutoFixHigh sx={{ mr: 1, verticalAlign: 'middle' }} />
                How Blocklock Works
              </Typography>
              <Typography variant="body2">
                Blocklock encryption ties decryption to blockchain progression. The secret can only be unlocked 
                when the blockchain reaches a specific block number, ensuring precise timing without trusted parties.
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>Mission Parameters:</Typography>
            <Typography variant="body1">
              <strong>Current Block:</strong> {currentBlock.toLocaleString()}<br/>
              <strong>Target Delay:</strong> {targetDelay} hours<br/>
              <strong>Network:</strong> Bitcoin (avg 6 blocks/hour)
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Step 1: Roll the Entropy Dice
          </Typography>
          <Typography variant="body2" paragraph>
            Roll three dice to generate random entropy that will be factored into the time-lock calculation.
            This ensures the exact timing cannot be predicted in advance.
          </Typography>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={rollDice}
              disabled={isRolling}
              startIcon={<Casino />}
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              {isRolling ? 'Rolling Dice...' : 'Roll Entropy Dice'}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Dice Rolling Animation */}
      {(gamePhase === 'rolling' || gamePhase === 'calculating') && (
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" gutterBottom color="primary">
            <Casino sx={{ mr: 2 }} />
            Entropy Generation
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3, 
            my: 4 
          }}>
            {diceValues.map((value, index) => (
              <Box
                key={index}
                sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: 2,
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  boxShadow: isRolling ? 6 : 3,
                  transform: isRolling ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                  transition: 'all 0.1s ease-in-out',
                  border: '3px solid',
                  borderColor: isRolling ? 'secondary.main' : 'primary.dark',
                  animation: isRolling ? 'spin 0.1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'scale(1.1) rotate(0deg)' },
                    '100%': { transform: 'scale(1.1) rotate(360deg)' }
                  }
                }}
              >
                {value}
              </Box>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6">
              Dice Sum: {diceValues.reduce((sum, val) => sum + val, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Entropy: {diceValues.join('-')}
            </Typography>
          </Box>

          {gamePhase === 'calculating' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Step 2: Calculate Target Block
              </Typography>
              
              <Card sx={{ p: 3, bgcolor: 'grey.50', mb: 3 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Calculation Formula:</strong>
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                  Target Block = Current Block + (Hours × Blocks/Hour) + (Dice Sum × 10)
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  Target Block = {currentBlock} + ({targetDelay} × 6) + ({diceValues.reduce((sum, val) => sum + val, 0)} × 10)
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', color: 'primary.main', fontWeight: 'bold' }}>
                  Target Block = {calculateTargetBlock()}
                </Typography>
              </Card>

              <TextField
                label="Enter Calculated Target Block"
                value={calculatedBlock}
                onChange={(e) => setCalculatedBlock(e.target.value)}
                type="number"
                fullWidth
                sx={{ mb: 3 }}
                placeholder="Calculate using the formula above"
                helperText="Use the calculation shown above to determine the target block"
              />

              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  onClick={submitAnswer}
                  disabled={!calculatedBlock}
                  startIcon={<CheckCircle />}
                  size="large"
                >
                  Submit Time-Lock Calculation
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      )}

      {/* Results */}
      {gamePhase === 'results' && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'success.main' }}>
            <CheckCircle sx={{ mr: 2, fontSize: 48, verticalAlign: 'middle' }} />
            Blocklock Challenge Complete!
          </Typography>
          
          <Card sx={{ p: 3, mb: 3, bgcolor: 'success.light' }}>
            <Typography variant="h6" gutterBottom>
              Mission Accomplished!
            </Typography>
            <Typography variant="body1">
              You've successfully calculated blockchain time-locks using entropy generation.
              <br/>Final Score: {gameScore} points in {formatTime(timeSpent)}
              <br/>Dice Rolls: {rollCount}
            </Typography>
          </Card>

          <Typography variant="h6" paragraph>
            Real-world Blocklock Applications:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="Sealed Auctions" />
            <Chip label="Voting Systems" />
            <Chip label="Digital Wills" />
            <Chip label="Timed Releases" />
          </Box>
        </Paper>
      )}
    </Container>
  );
}
