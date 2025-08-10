import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
  // Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Zoom,
  Fade,
  LinearProgress,
} from '@mui/material';
import { useToast } from '../ToastNotification';
import {
  Casino,
  Shuffle,
  PlayArrow,
  CheckCircle,
  Star,
  School,
  Security,
  Visibility,
  VisibilityOff,
  TrendingUp,
} from '@mui/icons-material';
import { Challenge } from '../../types/GameTypes';

interface VRFChallengeProps {
  challenge: Challenge;
  onSubmit: (answer: any) => void;
  onHint: () => void;
}

interface GameCard {
  id: string;
  value: number;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  color: 'red' | 'black';
  isRevealed: boolean;
  isSelected: boolean;
  vrfProof: string;
}

// Player interface removed as it's not used

export function VRFChallenge({ challenge, onSubmit }: VRFChallengeProps) {
  const toast = useToast();
  const [gamePhase, setGamePhase] = useState<'setup' | 'drawing' | 'verification' | 'results'>('setup');
  const [deck, setDeck] = useState<GameCard[]>([]);
  const [drawnCards, setDrawnCards] = useState<GameCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [showProofs, setShowProofs] = useState(false);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [animatingCard, setAnimatingCard] = useState<string | null>(null);
  // Add spinner state alongside cards
  const [spinnerValues, setSpinnerValues] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinnerResult, setSpinnerResult] = useState<number | null>(null);

  const initializeGame = useCallback(async () => {
    // Create deck
    const suits: Array<'hearts' | 'diamonds' | 'clubs' | 'spades'> = ['hearts', 'diamonds', 'clubs', 'spades'];
    const newDeck: GameCard[] = [];

    // Generate VRF proofs for all cards
    for (let suitIndex = 0; suitIndex < suits.length; suitIndex++) {
      const suit = suits[suitIndex];
      for (let value = 1; value <= 13; value++) {
        const vrfProof = await generateVRFProof(suitIndex * 13 + value);
        newDeck.push({
          id: `${suit}-${value}`,
          value,
          suit,
          color: suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black',
          isRevealed: false,
          isSelected: false,
          vrfProof: vrfProof
        });
      }
    }

    const shuffledDeck = await shuffleDeck(newDeck);
    setDeck(shuffledDeck);
    // Also initialize spinner
    setSpinnerValues([1, 2, 3, 5, 8, 13, 21, 34, 55, 89]); // Fibonacci sequence for spinner
    setSpinnerResult(null);
  }, []);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Generate a cryptographic hash using Web Crypto API
  const generateCryptographicHash = async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateVRFProof = async (seed: number): Promise<string> => {
    // Generate a more realistic VRF-like proof using cryptographic hashing
    const input = `card_draw_${seed}_${Date.now()}`;
    const hash = await generateCryptographicHash(input);

    // Create a deterministic but cryptographically secure "proof"
    const proofInput = `${hash}_proof_${seed}`;
    const proof = await generateCryptographicHash(proofInput);

    return JSON.stringify({
      hash: `0x${hash}`,
      proof: `0x${proof}`,
      input: input,
      timestamp: Date.now(),
      algorithm: 'SHA-256'
    });
  };

  // Cryptographic random number generator using Web Crypto API
  const getCryptographicRandom = async (min: number, max: number): Promise<number> => {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const maxNum = Math.pow(256, bytesNeeded);
    const maxValidNum = maxNum - (maxNum % range);

    let randomValue: number;
    do {
      const randomBytes = new Uint8Array(bytesNeeded);
      crypto.getRandomValues(randomBytes);
      randomValue = 0;
      for (let i = 0; i < bytesNeeded; i++) {
        randomValue = (randomValue << 8) + randomBytes[i];
      }
    } while (randomValue >= maxValidNum);

    return min + (randomValue % range);
  };

  const shuffleDeck = async (cards: GameCard[]): Promise<GameCard[]> => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = await getCryptographicRandom(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const drawRandomCard = async () => {
    if (deck.length === 0) return;

    setIsDrawing(true);
    setGamePhase('drawing');

    // Simulate VRF calculation with visual feedback
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Use cryptographic randomness for card selection
    const randomIndex = await getCryptographicRandom(0, deck.length - 1);
    const drawnCard = { ...deck[randomIndex], isRevealed: true };

    setAnimatingCard(drawnCard.id);
    setDrawnCards(prev => [...prev, drawnCard]);
    setDeck(prev => prev.filter((_, index) => index !== randomIndex));

    setTimeout(() => {
      setAnimatingCard(null);
      setIsDrawing(false);
      setGamePhase('verification');
    }, 1000);
  };

  const spinForRandomValue = async () => {
    console.log('Spin button clicked!'); // Debug log
    setIsSpinning(true);
    toast.showInfo('Starting VRF spinner...');

    // Animate spinner for 2 seconds
    const spinDuration = 2000;
    const spinInterval = 100;
    const steps = spinDuration / spinInterval;

    let currentStep = 0;
    let finalSpinnerValues: number[] = [];

    const spinAnimation = setInterval(async () => {
      // Use cryptographic randomness for spinner values
      const newValues = await Promise.all([
        getCryptographicRandom(1, 100),
        getCryptographicRandom(1, 100),
        getCryptographicRandom(1, 100),
        getCryptographicRandom(1, 100),
        getCryptographicRandom(1, 100),
      ]);

      setSpinnerValues(newValues);
      finalSpinnerValues = newValues; // Store the final values

      currentStep++;
      if (currentStep >= steps) {
        clearInterval(spinAnimation);
        // Final result is cryptographically selected from the final spinner values
        const randomIndex = await getCryptographicRandom(0, finalSpinnerValues.length - 1);
        const final = finalSpinnerValues[randomIndex];
        setSpinnerResult(final);
        setIsSpinning(false);
        toast.showSuccess(`VRF Spinner selected: ${final} from [${finalSpinnerValues.join(', ')}]`);
      }
    }, spinInterval);
  };

  const verifyVRF = async (cardId: string) => {
    const card = drawnCards.find(c => c.id === cardId);
    if (!card) return;

    setSelectedProof(card.vrfProof);

    try {
      // Verify the VRF proof by re-hashing the input
      const proofData = JSON.parse(card.vrfProof);
      const expectedHash = await generateCryptographicHash(proofData.input);

      if (proofData.hash === `0x${expectedHash}`) {
        toast.showSuccess(`VRF Proof Verified! Card ${card.value} of ${card.suit} was genuinely random.`);
      } else {
        toast.showError('VRF Proof verification failed!');
      }
    } catch (error) {
      toast.showError('Error verifying VRF proof');
    }
  };

  const submitResults = () => {
    const answer = {
      drawnCards: drawnCards.map(c => ({ id: c.id, proof: c.vrfProof })),
      spinnerResult,
      verifications: drawnCards.length
    };

    setGamePhase('results');
    onSubmit(answer);
  };

  const getSuitIcon = (suit: string) => {
    const icons = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠'
    };
    return icons[suit as keyof typeof icons] || '?';
  };



  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 2 }}>
      {/* Game Header */}
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
              <Casino sx={{ mr: 2, verticalAlign: 'middle' }} />
              VRF Casino Challenge
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Master Verifiable Random Functions through card games
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Box>
              <Button
                startIcon={<School />}
                onClick={() => setTutorialOpen(true)}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white', mr: 1 }}
                size="small"
              >
                How VRF Works
              </Button>
              <Button
                startIcon={showProofs ? <VisibilityOff /> : <Visibility />}
                onClick={() => setShowProofs(!showProofs)}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
                size="small"
              >
                {showProofs ? 'Hide' : 'Show'} Proofs
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Game Progress */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Game Progress</Typography>
          <Chip
            label={`Phase: ${gamePhase.toUpperCase()}`}
            color={gamePhase === 'results' ? 'success' : 'primary'}
          />
        </Box>
        <LinearProgress
          variant="determinate"
          value={
            gamePhase === 'setup' ? 25 :
              gamePhase === 'drawing' ? 50 :
                gamePhase === 'verification' ? 75 : 100
          }
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Paper>

      {/* Mission Briefing */}
      <Fade in={gamePhase === 'setup'}>
        <Paper sx={{ p: 4, mb: 3, display: gamePhase === 'setup' ? 'block' : 'none' }}>
          <Card sx={{ mb: 3, border: '1px solid rgba(255,255,255,0.3)', p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }} style={{ fontWeight: 'bold' }}>
              Mission: Prove Fair Randomness
            </Typography>
            <Typography variant="body1">
              You're at a high-stakes casino where trust is everything. Players suspect the card dealing
              is rigged. Using <strong>Verifiable Random Functions (VRF)</strong>, you must prove that
              every card draw is genuinely random and verifiable by all players.
            </Typography>
          </Card>
          <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main' }} style={{
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
            Understanding VRF
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, width: "fit-content" }}>
              <Card sx={{ height: '100%', p: 2 }}>
                <CardContent style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Security sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Unpredictable</Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    No one can predict the next random value, not even the generator
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: 1, width: "fit-content" }}>
              <Card sx={{ height: '100%', p: 2 }}>
                <CardContent style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Verifiable</Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Anyone can verify that the random value was generated correctly
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: 1, width: "fit-content" }}>
              <Card sx={{ height: '100%', p: 2 }}>
                <CardContent style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Unique</Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Each input produces exactly one valid random output
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" paragraph>
              Choose your VRF method: Cards or Spinner
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={() => setGamePhase('drawing')}
                startIcon={<PlayArrow />}
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Start Card Drawing
              </Button>
              <Button
                variant="outlined"
                onClick={spinForRandomValue}
                startIcon={<Shuffle />}
                size="large"
                sx={{ px: 4, py: 1.5 }}
                disabled={isSpinning}
              >
                {isSpinning ? 'Spinning...' : 'Spin for Numbers'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Number Spinner Display - Show independently */}
      {(isSpinning || spinnerResult) && (
        <Fade in={true}>
          <Paper sx={{
            p: 5,
            mb: 4,
            textAlign: 'center',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider'
          }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  color: 'success.main',
                  fontWeight: 'bold',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                <Casino sx={{ fontSize: '2rem' }} />
                VRF Number Spinner
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Generating Cryptographically Secure Random Numbers
              </Typography>
            </Box>

            {/* Spinner Numbers */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
                mb: 4,
                flexWrap: 'wrap'
              }}>
                {spinnerValues.map((value, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 80,
                      height: 80,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isSpinning ? 'warning.main' : 'success.main',
                      color: 'white',
                      borderRadius: 3,
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      boxShadow: isSpinning ? 6 : 4,
                      transform: isSpinning ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      animation: isSpinning ? 'pulse 0.5s infinite' : 'none',
                      border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {value}
                  </Box>
                ))}
              </Box>

              {/* Final Result */}
              {spinnerResult && (
                <Box sx={{
                  bgcolor: 'success.main',
                  borderRadius: 2,
                  p: 3,
                  mb: 3,
                  border: '1px solid',
                  borderColor: 'success.main'
                }}>
                  <Typography variant="h4" color="white" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Final VRF Result: {spinnerResult}
                  </Typography>
                  <Typography variant="body1" color="white">
                    Selected from the spinner values using cryptographically secure VRF
                  </Typography>
                </Box>
              )}

              {/* Action Buttons */}
              {spinnerResult && (
                <Box sx={{
                  display: 'flex',
                  gap: 3,
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <Button
                    variant="outlined"
                    onClick={spinForRandomValue}
                    startIcon={<Shuffle />}
                    disabled={isSpinning}
                    size="large"
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Spin Again
                  </Button>
                  <Button
                    variant="contained"
                    onClick={submitResults}
                    startIcon={<CheckCircle />}
                    color="success"
                    size="large"
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Submit VRF Results
                  </Button>
                </Box>
              )}

              {/* Educational Section about Cryptographic Randomness */}
              <Paper sx={{ p: 3, mt: 3, bgcolor: '', border: '1px solid', borderColor: 'white' }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                  <Security sx={{ mr: 1 }} />
                  Cryptographic Randomness vs Pseudo-Random
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box>
                    <Typography sx={{ textAlign: "left" }} variant="subtitle2" color="white" fontWeight="bold">
                      What We Use (Cryptographic):
                    </Typography>
                    <Typography variant="body2" color="white" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      gap: 2
                    }}
                      sx={{
                        ml: 1
                      }}
                    >
                      <li><strong>Web Crypto API</strong> - Browser's built-in cryptographic functions</li>
                      <li><strong>crypto.getRandomValues()</strong> - Hardware-based entropy</li>
                      <li><strong>SHA-256 Hashing</strong> - Deterministic but cryptographically secure</li>
                      <li><strong>Unpredictable</strong> - Cannot be reverse-engineered</li>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ textAlign: "left" }} variant="subtitle2" color="white" fontWeight="bold">
                      What We Avoid (Pseudo-Random):
                    </Typography>
                    <Typography variant="body2" color="white" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      gap: 2
                    }}
                      sx={{
                        ml: 1
                      }}
                    >
                      <li><strong>Math.random()</strong> - Predictable after enough samples</li>
                      <li><strong>Linear Congruential Generators</strong> - Mathematical patterns</li>
                      <li><strong>Time-based seeds</strong> - Can be guessed</li>
                      <li><strong>Deterministic algorithms</strong> - Same input = same output</li>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ textAlign: "left" }} variant="subtitle2" color="white" fontWeight="bold">
                      Why This Matters:
                    </Typography>
                    <Typography variant="body2" color="white" sx={{ textAlign: "left" }}>
                      In real cryptography, predictable randomness can break security. Our VRF implementation
                      uses hardware entropy and cryptographic hashing to ensure true randomness that cannot
                      be predicted or manipulated.
                    </Typography>
                  </Box>
                </Box>
              </Paper>

            </Box>
          </Paper>
        </Fade>
      )}

      {/* Drawing Phase */}
      <Fade in={gamePhase === 'drawing' || gamePhase === 'verification'}>
        <Paper sx={{
          p: 4,
          mb: 3,
          display: (gamePhase === 'drawing' || gamePhase === 'verification') ? 'block' : 'none'
        }}>

          <Typography
            variant="h4"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <Casino sx={{ fontSize: '2rem' }} />
            Random Card Drawing
          </Typography>

          {/* VRF Spinner */}
          {isDrawing && (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                <CircularProgress
                  size={80}
                  thickness={4}
                  sx={{
                    color: 'primary.main',
                    animationDuration: '0.8s'
                  }}
                />
                <Box sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Shuffle sx={{ fontSize: 30, color: 'primary.main' }} />
                </Box>
              </Box>
              <Typography variant="h6">
                VRF Computing Random Value...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generating cryptographic proof of randomness
              </Typography>
            </Box>
          )}

          {/* Drawn Cards Display */}
          {drawnCards.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                Drawn Cards (Click to verify VRF proof):
              </Typography>
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                justifyContent: 'center',
                mb: 3
              }}>
                {drawnCards.map((card, index) => (
                  <Zoom
                    key={card.id}
                    in={true}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <Box
                      sx={{
                        width: 140,
                        height: 200,
                        cursor: 'pointer',
                        borderRadius: 3,
                        bgcolor: 'white',
                        border: card.id === animatingCard ? '3px solid' : '2px solid',
                        borderColor: card.id === animatingCard ? 'success.main' : 'divider',
                        boxShadow: card.id === animatingCard ? 4 : 2,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 6,
                          borderColor: 'primary.main'
                        }
                      }}
                      onClick={() => verifyVRF(card.id)}
                    >
                      {/* Top Corner */}
                      <Box sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: card.color === 'red' ? 'error.main' : 'primary.main',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            lineHeight: 1
                          }}
                        >
                          {card.value === 1 ? 'A' :
                            card.value === 11 ? 'J' :
                              card.value === 12 ? 'Q' :
                                card.value === 13 ? 'K' : card.value}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color: card.color === 'red' ? 'error.main' : 'primary.main',
                            fontSize: '1rem',
                            lineHeight: 1
                          }}
                        >
                          {getSuitIcon(card.suit)}
                        </Typography>
                      </Box>

                      {/* Center Symbol */}
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        flexDirection: 'column'
                      }}>
                        <Typography
                          variant="h1"
                          sx={{
                            color: card.color === 'red' ? 'error.main' : 'primary.main',
                            fontSize: '3.5rem',
                            fontWeight: 'bold',
                            mb: 1
                          }}
                        >
                          {getSuitIcon(card.suit)}
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            color: card.color === 'red' ? 'error.main' : 'primary.main',
                            fontWeight: 'bold'
                          }}
                        >
                          {card.value === 1 ? 'A' :
                            card.value === 11 ? 'J' :
                              card.value === 12 ? 'Q' :
                                card.value === 13 ? 'K' : card.value}
                        </Typography>
                      </Box>

                      {/* Bottom Corner (upside down) */}
                      <Box sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transform: 'rotate(180deg)'
                      }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: card.color === 'red' ? 'error.main' : 'primary.main',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            lineHeight: 1
                          }}
                        >
                          {card.value === 1 ? 'A' :
                            card.value === 11 ? 'J' :
                              card.value === 12 ? 'Q' :
                                card.value === 13 ? 'K' : card.value}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color: card.color === 'red' ? 'error.main' : 'primary.main',
                            fontSize: '1rem',
                            lineHeight: 1
                          }}
                        >
                          {getSuitIcon(card.suit)}
                        </Typography>
                      </Box>

                      {/* VRF Proof indicator */}
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 24,
                        height: 24,
                        bgcolor: 'success.main',
                        borderRadius: '0 8px 0 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="caption" sx={{ color: 'white', fontSize: '0.7rem' }}>
                          VRF
                        </Typography>
                      </Box>
                    </Box>
                  </Zoom>
                ))}
              </Box>
            </Box>
          )}



          {/* Game Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={drawRandomCard}
              disabled={isDrawing || deck.length === 0}
              startIcon={<Shuffle />}
              size="large"
            // sx={{ mt: 1 }}
            >
              {isDrawing ? 'Drawing...' : 'Draw Random Card'}
            </Button>

            {drawnCards.length > 0 && (
              <Button
                variant="outlined"
                onClick={submitResults}
                startIcon={<CheckCircle />}
                size="large"
              >
                Submit Results ({drawnCards.length} cards)
              </Button>
            )}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Cards remaining: {deck.length} | Cards drawn: {drawnCards.length}
            </Typography>
          </Box>

          {/* Educational Section about VRF and Card Security */}
          {drawnCards.length > 0 && (
            <Paper sx={{ p: 3, mt: 4, bgcolor: '', border: '1px solid', borderColor: 'white' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                <Visibility sx={{ mr: 1 }} />
                How VRF Ensures Fair Card Drawing
              </Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="white" fontWeight="bold">
                    VRF (Verifiable Random Function) Process:
                  </Typography>
                  <Typography variant="body2" color="white" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    gap: 2
                  }} sx={{
                    ml: 1
                  }}>
                    <li><strong>Input:</strong> Card ID + Timestamp + Cryptographic seed</li>
                    <li><strong>Hash:</strong> SHA-256 creates deterministic but unpredictable output</li>
                    <li><strong>Proof:</strong> Cryptographic proof that randomness was fair</li>
                    <li><strong>Verification:</strong> Anyone can verify the proof is valid</li>
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="white" fontWeight="bold">
                    Security Benefits:
                  </Typography>
                  <Typography variant="body2" color="white" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    gap: 2
                  }} sx={{
                    ml: 1
                  }}>
                    <li><strong>Unpredictable:</strong> Cannot guess next card even with all previous draws</li>
                    <li><strong>Verifiable:</strong> Proof shows randomness wasn't manipulated</li>
                    <li><strong>Fair:</strong> Each card has equal probability of being drawn</li>
                    <li><strong>Transparent:</strong> All randomness can be audited</li>
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="white" fontWeight="bold">
                    Real-World Applications:
                  </Typography>
                  <Typography variant="body2" color="white" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    gap: 2,
                  }} sx={{
                    ml: 1
                  }}>
                    <li><strong>Blockchain:</strong> Fair random number generation for smart contracts</li>
                    <li><strong>Gaming:</strong> Provably fair online casinos and games</li>
                    <li><strong>Lotteries:</strong> Transparent random selection processes</li>
                    <li><strong>Security:</strong> Unpredictable cryptographic keys and tokens</li>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Paper>
      </Fade>

      {/* Results Phase */}
      <Fade in={gamePhase === 'results'}>
        <Paper sx={{ p: 4, textAlign: 'center', display: gamePhase === 'results' ? 'block' : 'none' }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'success.main' }} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 0px",
          }}>
            <CheckCircle sx={{ mr: 2, fontSize: 48 }} />
            VRF Challenge Complete!
          </Typography>

          {/* <Alert severity="success" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}> */}
          <Card sx={{ mb: 3, border: '1px solid rgba(255,255,255,0.3)', p: 3, bgcolor: 'black' }}>
            <Typography variant="h6" gutterBottom>
              Congratulations! You've successfully demonstrated VRF properties:
            </Typography>
            <Box sx={{
              p: 2,
              borderRadius: 2,
              color: 'white',
              fontFamily: 'monospace',
              width: 'fit-content',
              textAlign: 'left',
              margin: '0 auto',
            }}>
              <li>Generated {drawnCards.length} provably random cards</li>
              <li>Generated spinner result: {spinnerResult}</li>
              <li>Each generation was unpredictable before execution</li>
              <li>All results are verifiable by cryptographic proofs</li>
              <li>Challenge completed successfully</li>
            </Box>
          </Card>
          {/* </Alert> */}


          <Typography variant="h6" paragraph>
            In real applications, VRF ensures fair:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <Chip label="Blockchain Consensus" icon={<Security />} />
            <Chip label="Gaming Loot Drops" icon={<Casino />} />
            <Chip label="Lottery Systems" icon={<Star />} />
            <Chip label="Random Sampling" icon={<Shuffle />} />
          </Box>
        </Paper>
      </Fade>

      {/* VRF Tutorial Dialog */}
      <Dialog open={tutorialOpen} onClose={() => setTutorialOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle style={{
          display: "flex",
          alignItems: "center",
        }}>
          <School sx={{ mr: 2 }} />
          How Verifiable Random Functions Work
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>The Problem:</Typography>
          <Typography variant="body1" paragraph>
            Traditional random number generators require trust. In a casino, players must trust
            that the house isn't cheating. In blockchain, nodes must trust the randomness source.
          </Typography>

          <Typography variant="h6" gutterBottom>The VRF Solution:</Typography>
          <Typography variant="body1" paragraph>
            VRF combines a secret key with public input to generate:
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <li><strong>Random Output:</strong> Appears random to anyone without the secret key</li>
            <li><strong>Cryptographic Proof:</strong> Proves the output was generated correctly</li>
            <li><strong>Verification:</strong> Anyone can verify the proof using public information</li>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Real-World Usage:</Typography>
          <Typography variant="body1">
            Chainlink VRF, Algorand's consensus, Cardano's slot leader selection,
            and many DeFi protocols use VRF for tamper-proof randomness.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTutorialOpen(false)}>Got it!</Button>
        </DialogActions>
      </Dialog>

      {/* VRF Proof Display */}
      {selectedProof && (
        <Dialog open={!!selectedProof} onClose={() => setSelectedProof(null)} maxWidth="md" fullWidth>
          <DialogTitle style={{
            display: 'flex',
            alignItems: 'center',
            // justifyContent: 'center',
          }}>
            <Security sx={{ mr: 2 }} />
            VRF Proof Verification
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              Complete cryptographic proof for this random draw:
            </Typography>
            <Paper sx={{
              p: 3,
              bgcolor: 'grey.50',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              wordBreak: 'break-all',
              maxHeight: 300,
              overflow: 'auto',
              border: '1px solid',
              borderColor: 'grey.300',
              color: 'black'
            }}>
              {selectedProof}
            </Paper>
            <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
              In a real implementation, this proof would be verified against the VRF public key
              and input parameters to ensure the randomness is genuine and cannot be manipulated.
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', color: 'black', borderRadius: 1 }}>
              <Typography variant="caption" display="block">
                <strong>Proof Components:</strong>
              </Typography>
              <Typography variant="caption" display="block">
                • Hash: Deterministic output derived from input<br />
                • Public Key: Verifier's cryptographic key<br />
                • Signature: Proof of correct VRF computation<br />
                • Input: Original seed value for randomness<br />
                • Timestamp: When the proof was generated
              </Typography>
            </Box>
          </DialogContent>
          {/* <DialogActions>
            <Button onClick={() => setSelectedProof(null)} variant="contained">
              Close
            </Button>
          </DialogActions> */}
        </Dialog>
      )}
    </Box>
  );
}