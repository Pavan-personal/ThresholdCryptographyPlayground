import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
  Paper,
  Tooltip,
  Fade,
  Slide,
  IconButton,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Zoom,
  Container,
} from '@mui/material';
import { 
  Security, 
  Calculate, 
  CheckCircle, 
  Error, 
  Help, 
  PlayArrow, 
  Shuffle,
  Lightbulb,
  AutoFixHigh,
  Timer,
  Star,
  School,
  Casino,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Challenge } from '../../types/GameTypes';
import { useToast } from '../ToastNotification';

interface ThresholdChallengeProps {
  challenge: Challenge;
  onSubmit: (answer: any) => void;
  onHint: () => void;
}

interface Executive {
  id: string;
  name: string;
  share: number;
  x: number;
  selected: boolean;
  avatar: string;
  role: string;
}

export function ThresholdChallenge({ challenge, onSubmit }: ThresholdChallengeProps) {
  const { showSuccess, showError, showInfo } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [executives, setExecutives] = useState<Executive[]>([
    { id: 'alice', name: 'Alice', share: 15, x: 1, selected: false, avatar: 'A', role: 'CEO' },
    { id: 'bob', name: 'Bob', share: 23, x: 2, selected: false, avatar: 'B', role: 'CTO' },
    { id: 'carol', name: 'Carol', share: 8, x: 3, selected: false, avatar: 'C', role: 'CFO' },
    { id: 'dave', name: 'Dave', share: 31, x: 4, selected: false, avatar: 'D', role: 'COO' },
    { id: 'eve', name: 'Eve', share: 12, x: 5, selected: false, avatar: 'E', role: 'CSO' }
  ]);
  
  const [coefficients, setCoefficients] = useState<{ [key: string]: string }>({});
  const [finalSignature, setFinalSignature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [animatingCard, setAnimatingCard] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showCalculation, setShowCalculation] = useState(false);

  const selectedExecutives = executives.filter(e => e.selected);
  const threshold = 3;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleExecutive = useCallback((id: string) => {
    setAnimatingCard(id);
    setTimeout(() => setAnimatingCard(null), 300);
    
    setExecutives(prev => prev.map(exec => {
      if (exec.id === id) {
        const newSelected = !exec.selected;
        if (newSelected && selectedExecutives.length >= threshold) {
          return exec;
        }
        return { ...exec, selected: newSelected };
      }
      return exec;
    }));
    
    if (selectedExecutives.length === 2) {
      setGameScore(prev => prev + 10);
    }
  }, [selectedExecutives.length, threshold]);

  const calculateHint = useCallback((exec: Executive) => {
    const others = selectedExecutives.filter(e => e.id !== exec.id);
    if (others.length !== 2) return '';
    
    const numerator = others.map(e => (0 - e.x)).reduce((a, b) => a * b, 1);
    const denominator = others.map(e => (exec.x - e.x)).reduce((a, b) => a * b, 1);
    return (numerator / denominator).toFixed(1);
  }, [selectedExecutives]);

  const submitAnswer = async () => {
    setIsSubmitting(true);
    
    const answer = {
      selectedExecutives: selectedExecutives.map(e => e.id),
      coefficients,
      signature: parseFloat(finalSignature)
    };
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      onSubmit(answer);
      setGameScore(prev => prev + 50);
      showSuccess(`Excellent! Your solution is correct. Score: ${gameScore + 50} points in ${formatTime(timeSpent)}!`);
    } catch (error) {
      showError('Incorrect answer. Please check your calculations and try again.');
    }
    
    setIsSubmitting(false);
  };

  const steps = [
    'Select 3 Executives',
    'Calculate Coefficients', 
    'Compute Final Signature',
    'Submit Solution'
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextStep = () => {
    setActiveStep(prev => prev + 1);
    setGameScore(prev => prev + 20);
  };

  const prevStep = () => {
    setActiveStep(prev => prev - 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Game Header with Stats */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
              <Security sx={{ mr: 2, verticalAlign: 'middle' }} />
              Threshold Cryptography Challenge
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Master the art of distributed cryptographic signatures
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Box sx={{ mb: 2 }}>
              <Chip 
                icon={<Star />} 
                label={`Score: ${gameScore}`} 
                variant="outlined"
                color="primary"
                sx={{ mr: 1 }} 
              />
              <Chip 
                icon={<Timer />} 
                label={`Time: ${formatTime(timeSpent)}`} 
                variant="outlined"
                color="primary"
              />
            </Box>
            <Box>
              <Button
                startIcon={<School />}
                onClick={() => setTutorialOpen(true)}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white', mr: 1 }}
                size="small"
              >
                Tutorial
              </Button>
              <Button
                startIcon={<Lightbulb />}
                onClick={() => setShowHint(!showHint)}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
                size="small"
              >
                Hint
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Progress Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} orientation="horizontal">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>
                <Typography variant="h6">{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <LinearProgress 
          variant="determinate" 
          value={(activeStep / (steps.length - 1)) * 100} 
          sx={{ mt: 2, height: 8, borderRadius: 4 }}
        />
      </Paper>

      {/* Mission Briefing */}
      <Fade in={activeStep === 0}>
        <Paper sx={{ p: 4, mb: 3, display: activeStep === 0 ? 'block' : 'none' }}>
          <Card sx={{ mb: 3, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Casino sx={{ mr: 1, verticalAlign: 'middle' }} />
                Mission Briefing: The Bank Vault Heist
              </Typography>
              <Typography variant="body1">
                A sophisticated bank vault requires exactly <strong>3 out of 5</strong> executive signatures 
                to authorize a critical $1M emergency transfer. The executives are scattered across different 
                locations, and you need to coordinate them to create a valid threshold signature using 
                <strong> Lagrange interpolation</strong>.
              </Typography>
            </CardContent>
          </Card>

          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
            Select Your Team of 3 Executives
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: 3, 
            mb: 4,
            justifyItems: 'center'
          }}>
            {executives.map((exec) => (
              <Zoom 
                key={exec.id} 
                in={true} 
                style={{ transitionDelay: `${executives.indexOf(exec) * 100}ms` }}
              >
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    height: 180,
                    border: exec.selected ? '3px solid' : '2px solid',
                    borderColor: exec.selected ? 'primary.main' : 'divider',
                    bgcolor: exec.selected ? 'primary.light' : 'background.paper',
                    transform: animatingCard === exec.id ? 'scale(0.95)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      boxShadow: 6,
                      transform: 'translateY(-8px)' 
                    },
                  }}
                  onClick={() => toggleExecutive(exec.id)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: exec.selected ? 'primary.main' : 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: 'white',
                      transition: 'all 0.3s'
                    }}>
                      {exec.avatar}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {exec.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {exec.role}
                    </Typography>
                    <Chip 
                      label={`Share: ${exec.share}`} 
                      size="small" 
                      sx={{ mr: 1, mb: 1 }} 
                    />
                    <Chip 
                      label={`x = ${exec.x}`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    {exec.selected && (
                      <Box sx={{ mt: 2 }}>
                        <CheckCircle sx={{ color: 'success.main', fontSize: 32 }} />
                        <Typography variant="caption" display="block" color="success.main">
                          Selected!
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Zoom>
            ))}
          </Box>
          
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" color={selectedExecutives.length === 3 ? 'success.main' : 'text.primary'}>
              Selected: {selectedExecutives.length}/3
            </Typography>
            {selectedExecutives.length < 3 && (
              <Typography variant="body2" color="text.secondary">
                You need exactly 3 executives to proceed
              </Typography>
            )}
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={nextStep}
              disabled={selectedExecutives.length !== 3}
              startIcon={<PlayArrow />}
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Begin Calculation
            </Button>
          </Box>
        </Paper>
      </Fade>

      {/* Coefficient Calculation */}
      <Fade in={activeStep === 1}>
        <Paper sx={{ p: 4, mb: 3, display: activeStep === 1 ? 'block' : 'none' }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
            <Calculate sx={{ mr: 2 }} />
            Calculate Lagrange Coefficients
          </Typography>
          
          <Card sx={{ mb: 4, bgcolor: 'info.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interactive Formula Calculator
              </Typography>
              <Box sx={{ 
                fontFamily: 'monospace', 
                fontSize: '1.4rem', 
                textAlign: 'center',
                bgcolor: 'primary.main',
                color: 'white',
                p: 3,
                borderRadius: 2,
                mb: 2
              }}>
                L<sub>i</sub>(0) = ∏<sub>j≠i</sub> (0 - x<sub>j</sub>) / (x<sub>i</sub> - x<sub>j</sub>)
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => setShowCalculation(!showCalculation)}>
                  {showCalculation ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                <Typography variant="body2">
                  {showCalculation ? 'Hide' : 'Show'} step-by-step calculation
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {showCalculation && (
            <Slide direction="down" in={showCalculation}>
              <Paper sx={{ p: 3, mb: 4, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Step-by-Step Example: Alice (x=1), Bob (x=2), Carol (x=3)
                </Typography>
                
                <Box sx={{ display: 'grid', gap: 3 }}>
                  {[
                    { name: 'Alice', x: 1, calc: 'L₁(0) = (0-2)(0-3) / (1-2)(1-3) = (-2)(-3) / (-1)(-2) = 6/2 = 3.0' },
                    { name: 'Bob', x: 2, calc: 'L₂(0) = (0-1)(0-3) / (2-1)(2-3) = (-1)(-3) / (1)(-1) = 3/(-1) = -3.0' },
                    { name: 'Carol', x: 3, calc: 'L₃(0) = (0-1)(0-2) / (3-1)(3-2) = (-1)(-2) / (2)(1) = 2/2 = 1.0' }
                  ].map((item, index) => (
                    <Fade key={index} in timeout={1000 + index * 300}>
                      <Box sx={{ 
                        p: 2, 
                        border: '2px solid', 
                        borderColor: 'primary.light',
                        borderRadius: 2,
                        bgcolor: 'white'
                      }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          {item.name}:
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                          {item.calc}
                        </Typography>
                      </Box>
                    </Fade>
                  ))}
                </Box>
              </Paper>
            </Slide>
          )}

          <Typography variant="h6" gutterBottom>
            Now calculate for your team: {selectedExecutives.map(e => e.name).join(', ')}
          </Typography>
          
          <Box sx={{ display: 'grid', gap: 3 }}>
            {selectedExecutives.map((exec, index) => {
              const others = selectedExecutives.filter(e => e.id !== exec.id);
              const hint = calculateHint(exec);
              
              return (
                <Slide key={exec.id} direction="right" in timeout={500 + index * 200}>
                  <Card sx={{ 
                    p: 3,
                    border: '2px solid',
                    borderColor: coefficients[exec.id] ? 'success.main' : 'grey.300',
                    transition: 'all 0.3s'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {exec.avatar}
                      </Box>
                      <Typography variant="h6">
                        {exec.name} (x<sub>{exec.x}</sub> = {exec.x})
                      </Typography>
                      {coefficients[exec.id] && (
                        <CheckCircle sx={{ color: 'success.main' }} />
                      )}
                    </Box>
                    
                    <Typography variant="body1" sx={{ 
                      fontFamily: 'monospace', 
                      mb: 3,
                      fontSize: '1.2rem',
                      p: 2,
                      bgcolor: 'grey.100',
                      borderRadius: 1
                    }}>
                      L<sub>{exec.x}</sub>(0) = {others.map(e => `(0-${e.x})`).join('')} / {others.map(e => `(${exec.x}-${e.x})`).join('')}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        label={`Coefficient for ${exec.name}`}
                        value={coefficients[exec.id] || ''}
                        onChange={(e) => setCoefficients(prev => ({...prev, [exec.id]: e.target.value}))}
                        type="number"
                        inputProps={{ step: 0.1 }}
                        sx={{ flexGrow: 1 }}
                        placeholder="Enter calculated value"
                      />
                      {showHint && (
                        <Tooltip title={`Answer: ${hint}`}>
                          <IconButton sx={{ bgcolor: 'warning.light' }}>
                            <Lightbulb />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Use calculator to verify">
                        <IconButton>
                          <AutoFixHigh />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Slide>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button onClick={prevStep} startIcon={<Security />}>
              Back to Selection
            </Button>
            <Button
              variant="contained"
              onClick={nextStep}
              disabled={Object.keys(coefficients).length !== 3}
              endIcon={<Calculate />}
              size="large"
            >
              Calculate Final Signature
            </Button>
          </Box>
        </Paper>
      </Fade>

      {/* Final Calculation */}
      <Fade in={activeStep === 2}>
        <Paper sx={{ p: 4, mb: 3, display: activeStep === 2 ? 'block' : 'none' }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
            <Star sx={{ mr: 2 }} />
            Combine the Shares
          </Typography>
          
          <Card sx={{ mb: 4, bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Final Formula:
              </Typography>
              <Box sx={{ 
                fontFamily: 'monospace', 
                fontSize: '1.4rem', 
                textAlign: 'center',
                bgcolor: 'success.main',
                color: 'white',
                p: 3,
                borderRadius: 2
              }}>
                Signature = Σ(share<sub>i</sub> × L<sub>i</sub>(0))
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ p: 4, mb: 4, bgcolor: 'primary.light' }}>
            <Typography variant="h6" gutterBottom color="white">
              Live Calculation Preview:
            </Typography>
            
            <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
              {selectedExecutives.map((exec) => {
                const coeff = parseFloat(coefficients[exec.id] || '0');
                const product = exec.share * coeff;
                return (
                  <Box key={exec.id} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    p: 2,
                    borderRadius: 1
                  }}>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', color: 'white' }}>
                      {exec.name}: {exec.share} × {coefficients[exec.id] || '___'}
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', color: 'white', fontWeight: 'bold' }}>
                      = {isNaN(product) ? '___' : product.toFixed(2)}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            
            <Box sx={{ 
              borderTop: '2px solid rgba(255,255,255,0.3)', 
              pt: 2,
              textAlign: 'center'
            }}>
              <Typography variant="h5" sx={{ fontFamily: 'monospace', color: 'white', fontWeight: 'bold' }}>
                Total = {selectedExecutives.reduce((sum, exec) => {
                  const coeff = parseFloat(coefficients[exec.id] || '0');
                  return sum + (exec.share * coeff);
                }, 0).toFixed(2)}
              </Typography>
            </Box>
          </Card>
          
          <TextField
            label="Enter Your Final Signature"
            value={finalSignature}
            onChange={(e) => setFinalSignature(e.target.value)}
            type="number"
            inputProps={{ step: 0.01 }}
            fullWidth
            sx={{ mb: 3 }}
            helperText="Copy the total value from above"
            InputProps={{
              style: { fontSize: '1.2rem' }
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={prevStep} startIcon={<Calculate />}>
              Back to Coefficients
            </Button>
            <Button
              variant="contained"
              onClick={nextStep}
              disabled={!finalSignature}
              endIcon={<Security />}
              size="large"
            >
              Submit Solution
            </Button>
          </Box>
        </Paper>
      </Fade>

      {/* Final Submission */}
      <Fade in={activeStep === 3}>
        <Paper sx={{ p: 4, textAlign: 'center', display: activeStep === 3 ? 'block' : 'none' }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
            <Security sx={{ mr: 2, fontSize: 48 }} />
            Ready to Submit?
          </Typography>
          
          <Typography variant="h6" paragraph>
            You've calculated the threshold signature: <strong>{finalSignature}</strong>
          </Typography>
          
          <Box sx={{ my: 4 }}>
            {isSubmitting ? (
              <Box>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6">
                  Submitting to secure vault...
                </Typography>
                <LinearProgress sx={{ mt: 2, maxWidth: 400, mx: 'auto' }} />
              </Box>
            ) : (
              <Button
                variant="contained"
                onClick={submitAnswer}
                size="large"
                sx={{ px: 6, py: 2, fontSize: '1.2rem' }}
                startIcon={<Security />}
              >
                Submit Final Solution
              </Button>
            )}
          </Box>
          
          {/* Submit result is now handled by toast notifications */}

          <Button onClick={prevStep} startIcon={<Calculate />} sx={{ mt: 2 }}>
            Back to Review
          </Button>
        </Paper>
      </Fade>

      {/* Tutorial Dialog */}
      <Dialog open={tutorialOpen} onClose={() => setTutorialOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <School sx={{ mr: 2 }} />
          Threshold Cryptography Tutorial
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Threshold cryptography is like a high-security vault that requires multiple keys to open. 
            In our 3-of-5 scheme, any 3 executives can combine their secret shares to create a valid signature.
          </Typography>
          <Typography variant="h6" gutterBottom>Key Concepts:</Typography>
          <Box component="ul">
            <li><strong>Secret Sharing:</strong> The master key is split into 5 pieces</li>
            <li><strong>Threshold:</strong> Only 3 pieces are needed to reconstruct it</li>
            <li><strong>Lagrange Interpolation:</strong> Mathematical method to combine shares</li>
            <li><strong>Security:</strong> 2 or fewer shares reveal nothing about the secret</li>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTutorialOpen(false)}>Got it!</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}