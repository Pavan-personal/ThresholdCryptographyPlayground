import React, { useState, useCallback } from 'react';
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
  // StepContent,
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
  PlayArrow,
  Lightbulb,
  AutoFixHigh,
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
  const { showSuccess, showError } = useToast();
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
  const [showCalculation, setShowCalculation] = useState(false);

  const selectedExecutives = executives.filter(e => e.selected);
  const threshold = 3;

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

    // Validate that we have the required inputs
    if (selectedExecutives.length !== 3) {
      showError(`You must select exactly 3 executives. Currently selected: ${selectedExecutives.length}`);
      setIsSubmitting(false);
      return;
    }

    if (!finalSignature || finalSignature.trim() === '') {
      showError('You must enter a final signature value.');
      setIsSubmitting(false);
      return;
    }

    // Check if coefficients are entered for selected executives
    const missingCoefficients = selectedExecutives.filter(exec => !coefficients[exec.id] || coefficients[exec.id].trim() === '');
    if (missingCoefficients.length > 0) {
      showError(`Missing coefficients for: ${missingCoefficients.map(e => e.name).join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    const answer = {
      selectedExecutives: selectedExecutives.map(e => e.id),
      coefficients,
      signature: parseFloat(finalSignature)
    };

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate validation

    // Calculate the correct coefficients for ANY 3 executives using Lagrange interpolation
    const calculateCorrectCoefficients = (execs: Executive[]) => {
      if (execs.length !== 3) return null;

      // Sort by x position for consistent calculation
      const sortedExecs = execs.sort((a, b) => a.x - b.x);

      // Calculate Lagrange coefficients for x=0 (reconstructing at origin)
      const coefficients: { [key: string]: number } = {};
      let expectedSignature = 0;

      sortedExecs.forEach((exec, i) => {
        let numerator = 1;
        let denominator = 1;

        // Calculate L_i(0) = ∏(0-x_j)/(x_i-x_j) for j≠i
        sortedExecs.forEach((otherExec, j) => {
          if (i !== j) {
            numerator *= (0 - otherExec.x);
            denominator *= (exec.x - otherExec.x);
          }
        });

        const coefficient = numerator / denominator;
        coefficients[exec.id] = coefficient;
        expectedSignature += exec.share * coefficient;
      });

      return { coefficients, expectedSignature };
    };

    // Get the correct solution for the user's chosen executives
    const correctSolution = calculateCorrectCoefficients(selectedExecutives);

    if (!correctSolution) {
      showError('Please select exactly 3 executives.');
      setIsSubmitting(false);
      return;
    }

    // Check if coefficients match the calculated ones
    const coefficientsCorrect = selectedExecutives.every(exec => {
      const userCoeff = parseFloat(coefficients[exec.id] || '0');
      const correctCoeff = correctSolution.coefficients[exec.id];
      return Math.abs(userCoeff - correctCoeff) < 0.1;
    });

    // Check if final signature matches
    const signatureCorrect = Math.abs(parseFloat(finalSignature) - correctSolution.expectedSignature) < 0.1;

    const isCorrect = coefficientsCorrect && signatureCorrect;

    // Optional debug info (uncomment if needed)
    // console.log('Selected executives:', selectedExecutives.map(e => e.id));
    // console.log('Coefficients:', coefficients);
    // console.log('Final signature:', finalSignature);

    if (isCorrect) {
      onSubmit(answer); // Submit the correct answer
      showSuccess('🎉 VAULT UNLOCKED! You successfully reconstructed the $1,000,000 signature! The money is yours! 💰');
    } else {
      if (!coefficientsCorrect) {
        const selectedNames = selectedExecutives.map(e => e.name).join(', ');
        showError(`🧮 Mathematical error in coefficients for ${selectedNames}! Check your Lagrange interpolation calculations.`);
      } else {
        showError(`🔢 Wrong final signature! You got ${finalSignature}, but the vault signature should be ${correctSolution.expectedSignature.toFixed(2)}. Double-check your arithmetic!`);
      }
    }

    setIsSubmitting(false);
  };

  const steps = [
    'Select 3 Executives',
    'Calculate Coefficients',
    'Compute Final Signature',
    'Submit Solution'
  ];
  const nextStep = () => {
    setActiveStep(prev => prev + 1);
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
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'center' },
          gap: { xs: 2, md: 0 }
        }}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                color: 'primary.main',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}
            >
              <Security sx={{ mr: 2, fontSize: { xs: '1.5rem', md: '2rem' } }} />
              Threshold Cryptography Challenge
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1.25rem' } }}>
              Master the art of distributed cryptographic signatures
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            gap: 1,
            alignItems: 'center'
          }}>
            <Button
              startIcon={<School />}
              onClick={() => setTutorialOpen(true)}
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
              size="small"
            >
              Tutorial
            </Button>
            <Button
              startIcon={<Lightbulb />}
              onClick={() => setShowHint(prev => !prev)}
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
              size="small"
            >
              Hint
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Progress Stepper */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, overflow: 'hidden' }}>
        <Stepper
          activeStep={activeStep}
          orientation="horizontal"
          sx={{
            '& .MuiStepLabel-label': {
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
              display: { xs: 'none', sm: 'block' }
            },
            '& .MuiStepLabel-labelContainer': {
              maxWidth: { xs: '60px', sm: 'none' }
            }
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    display: { xs: index === activeStep ? 'block' : 'none', sm: 'block' }
                  }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <LinearProgress
          variant="determinate"
          value={(activeStep / (steps.length - 1)) * 100}
          sx={{ mt: 4, height: 8, borderRadius: 4 }}
        />
      </Paper>

      {/* Mission Briefing */}
      <Fade in={activeStep === 0}>
        <Paper sx={{ p: 4, mb: 3, display: activeStep === 0 ? 'block' : 'none' }}>
          <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }} style={{
                display: 'flex',
                alignItems: 'center',
              }}>
                <Casino sx={{ mr: 1, verticalAlign: 'middle' }} />
                Mission: The $1,000,000 Vault Heist
              </Typography>

              <Typography variant="body1" paragraph>
                <strong>The Situation:</strong> The Great Bank of Cryptopia's vault contains <strong>$1,000,000</strong> secured by threshold cryptography.
                The bank's security system split the vault's digital signature into <strong>5 secret pieces</strong> and gave one piece to each of the 5 executives.
              </Typography>

              <Typography variant="body1" paragraph>
                <strong>The Security Rule:</strong> To prevent any single person from stealing the money, the vault requires <strong>at least 3 executives</strong> to work together.
                This is called "3-of-5 threshold cryptography" - you need 3 out of 5 pieces to reconstruct the original signature.
              </Typography>

              <Typography variant="body1" paragraph>
                <strong>Your Mission:</strong> You've convinced 3 executives to help you "test the security system."
                Select any 3 executives from the 5 available, use their secret pieces, and reconstruct the vault signature using <strong>Lagrange interpolation mathematics</strong>.
              </Typography>

              <Typography variant="body2" sx={{ color: 'white', p: 2, borderRadius: 1, mt: 2, border: "1px solid rgba(255,255,255,0.3)" }}>
                <strong>Why 5 cards but only need 3?</strong> That's the beauty of threshold cryptography!
                You can choose any combination of 3 executives - Alice+Bob+Carol, Bob+Carol+Dave, Alice+Carol+Eve, etc.
                Each combination will give you different coefficients but the same mathematical principle applies.
                It provides both security (no single point of failure) and flexibility (multiple valid combinations).
              </Typography>
            </CardContent>
          </Card>

          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', textAlign: 'center', m: 4, fontWeight: 'bold' }}>
            Select Your Team of 3 Executives
          </Typography>

          <Box sx={{ mb: 3, p: 2, border: '1px solid rgba(255,255,255)', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
              Your Choice: Pick any 3 executives you want to work with! Each combination will give you a different mathematical path, but all lead to the same $1M vault signature.
            </Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center'
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
                    // height: 180,
                    border: exec.selected ? '2px solid #4caf50' : '1px solid',
                    borderColor: exec.selected ? '#4caf50' : 'divider',
                    bgcolor: 'background.paper',
                    transform: animatingCard === exec.id ? 'scale(0.95)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 2,
                      transform: 'scale(1.02)'
                    },
                  }}
                  onClick={() => toggleExecutive(exec.id)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: exec.selected ? '#4caf50' : 'grey.600',
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
                      label={`Share: ${exec.share} (piece of $1M signature)`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`x = ${exec.x}`}
                      size="small"
                      variant="outlined"
                      sx={{ color: 'text.primary' }}
                    />
                  </CardContent>
                </Card>
              </Zoom>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', m: 3 }}>
            <Typography variant="h4" color={selectedExecutives.length === 3 ? 'success.main' : 'text.primary'}>
              Selected: {selectedExecutives.length}/3
            </Typography>
            {selectedExecutives.length < 3 && (
              <Typography variant="body2" color="text.secondary">
                You need exactly 3 executives to proceed
              </Typography>
            )}
          </Box>

          {/* Dynamic Hint for Selected Executives */}
          {selectedExecutives.length === 3 && (
            <Paper sx={{ p: 3, mb: 4, bgcolor: '', border: '1px solid', borderColor: '' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                <Lightbulb sx={{ mr: 1 }} />
                Hint for {selectedExecutives.map(e => e.name).join(', ')}:
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                For your selected executives, you need to calculate Lagrange coefficients using the formula:
              </Typography>
              <Box sx={{ fontFamily: 'monospace', border: '1px solid rgba(255,255,255)', p: 2, borderRadius: 1, mb: 2 }}>
                L<sub>i</sub>(0) = ∏<sub>j≠i</sub> (0 - x<sub>j</sub>) / (x<sub>i</sub> - x<sub>j</sub>)
              </Box>
              <Typography variant="body2" sx={{ color: 'white' }}>
                Where x values are: {selectedExecutives.map(e => `${e.name}=${e.x}`).join(', ')}
              </Typography>
            </Paper>
          )}

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
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }} style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 0px",
          }}>
            <Calculate sx={{ mr: 2 }} />
            Calculate Lagrange Coefficients
          </Typography>

          <Card sx={{ mb: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
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
              <Paper sx={{ p: 3, mb: 4, bgcolor: "primary.main" }}>
                <Typography variant="h6" gutterBottom>
                  Step-by-Step Example for {selectedExecutives.map(e => `${e.name} (x=${e.x})`).join(', ')}:
                </Typography>

                <Box sx={{ display: 'grid', gap: 3 }}>
                  {selectedExecutives.map((exec, index) => {
                    // Calculate the actual coefficient for this executive
                    let numerator = 1;
                    let denominator = 1;

                    selectedExecutives.forEach((otherExec, j) => {
                      if (index !== j) {
                        numerator *= (0 - otherExec.x);
                        denominator *= (exec.x - otherExec.x);
                      }
                    });

                    const coefficient = numerator / denominator;
                    const calc = `L${index + 1}(0) = ∏(0-x_j)/(${exec.x}-x_j) = ${numerator}/${denominator} = ${coefficient.toFixed(2)}`;

                    return { name: exec.name, x: exec.x, calc };
                  }).map((item, index) => (
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
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1.1rem', color: "primary.main" }}>
                          {item.calc}
                        </Typography>
                      </Box>
                    </Fade>
                  ))}
                </Box>
              </Paper>
            </Slide>
          )}

          <Typography variant="h6" gutterBottom style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 0px",
          }}>
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
                      borderRadius: 1,
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}>
                      L<sub>{exec.x}</sub>(0) = {others.map(e => `(0-${e.x})`).join('')} / {others.map(e => `(${exec.x}-${e.x})`).join('')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        label={`Coefficient for ${exec.name}`}
                        value={coefficients[exec.id] || ''}
                        onChange={(e) => setCoefficients(prev => ({ ...prev, [exec.id]: e.target.value }))}
                        type="number"
                        inputProps={{ step: 0.1 }}
                        sx={{ flexGrow: 1 }}
                        placeholder="Enter the Lagrange coefficient"
                      />
                      {showHint && (
                        <Tooltip title={`Answer: ~${hint}`}>
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
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }} style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 0px",
          }}>
            <Star sx={{ mr: 2 }} />
            Combine the Shares
          </Typography>

          <Card sx={{ mb: 4, bgcolor: '' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Final Formula:
              </Typography>
              <Box sx={{
                fontFamily: 'monospace',
                fontSize: '1.4rem',
                textAlign: 'center',
                // bgcolor: 'success.main',
                color: 'white',
                p: 3,
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.3)",
              }}>
                Signature = Σ(share<sub>i</sub> × L<sub>i</sub>(0))
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ p: 4, mb: 4, bgcolor: '' }}>
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
            label="🔓 Enter the $1M Vault Signature"
            placeholder="The magic number to unlock the vault (copy from total above)"
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
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 0px",
          }}>
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
                <LinearProgress sx={{ mt: 2, maxWidth: 400, mx: 'auto', borderRadius: 1 }} />
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
      <Dialog
        open={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <DialogTitle sx={{
          display: "flex",
          alignItems: "center",
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}>
          <School sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Threshold Cryptography Tutorial
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Threshold cryptography is like a high-security vault that requires multiple keys to open.
            In our 3-of-5 scheme, any 3 executives can combine their secret shares to create a valid signature.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
            Key Concepts:
          </Typography>

          <Box sx={{ pl: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight="bold" color="primary.main">
                • Secret Sharing:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                The master key is split into 5 pieces
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight="bold" color="primary.main">
                • Threshold:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                Only 3 pieces are needed to reconstruct it
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight="bold" color="primary.main">
                • Lagrange Interpolation:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                Mathematical method to combine shares
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight="bold" color="primary.main">
                • Security:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                2 or fewer shares reveal nothing about the secret
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{
          p: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}>
          <Button
            onClick={() => setTutorialOpen(false)}
            startIcon={<CheckCircle />}
            variant="contained"
            size="large"
            sx={{ px: 4 }}
          >
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}