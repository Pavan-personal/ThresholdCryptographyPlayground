import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Zoom,
  Fade,
  LinearProgress,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Casino,
  Shuffle,
  PlayArrow,
  CheckCircle,
  Timer,
  Star,
  School,
  Lightbulb,
  Security,
  Visibility,
  VisibilityOff,
  TrendingUp,
  Psychology,
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

interface Player {
  id: string;
  name: string;
  cards: GameCard[];
  score: number;
  trust: number;
}

export function VRFChallenge({ challenge, onSubmit }: VRFChallengeProps) {
  const [gamePhase, setGamePhase] = useState<'setup' | 'drawing' | 'verification' | 'results'>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [deck, setDeck] = useState<GameCard[]>([]);
  const [drawnCards, setDrawnCards] = useState<GameCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [showProofs, setShowProofs] = useState(false);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [spinnerActive, setSpinnerActive] = useState(false);
  const [animatingCard, setAnimatingCard] = useState<string | null>(null);

  // Initialize game
  useEffect(() => {
    initializeGame();
    const timer = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const initializeGame = useCallback(() => {
    // Create deck
    const suits: Array<'hearts' | 'diamonds' | 'clubs' | 'spades'> = ['hearts', 'diamonds', 'clubs', 'spades'];
    const newDeck: GameCard[] = [];
    
    suits.forEach((suit, suitIndex) => {
      for (let value = 1; value <= 13; value++) {
        newDeck.push({
          id: `${suit}-${value}`,
          value,
          suit,
          color: suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black',
          isRevealed: false,
          isSelected: false,
          vrfProof: generateMockVRFProof(suitIndex * 13 + value)
        });
      }
    });

    // Create players
    const newPlayers: Player[] = [
      { id: 'alice', name: 'Alice', cards: [], score: 0, trust: 95 },
      { id: 'bob', name: 'Bob', cards: [], score: 0, trust: 87 },
      { id: 'charlie', name: 'Charlie', cards: [], score: 0, trust: 92 },
      { id: 'you', name: 'You', cards: [], score: 0, trust: 100 }
    ];

    setDeck(shuffleDeck(newDeck));
    setPlayers(newPlayers);
  }, []);

  const generateMockVRFProof = (seed: number): string => {
    // Mock VRF proof - in reality this would be a cryptographic proof
    const hash = `0x${(seed * 0x1f4d5b2c + 0xabc123).toString(16).padStart(64, '0')}`;
    return hash.substring(0, 16) + '...';
  };

  const shuffleDeck = (cards: GameCard[]): GameCard[] => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const drawRandomCard = async () => {
    if (deck.length === 0) return;
    
    setIsDrawing(true);
    setSpinnerActive(true);
    setGamePhase('drawing');
    
    // Simulate VRF calculation with visual feedback
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const randomIndex = Math.floor(Math.random() * deck.length);
    const drawnCard = { ...deck[randomIndex], isRevealed: true };
    
    setAnimatingCard(drawnCard.id);
    setDrawnCards(prev => [...prev, drawnCard]);
    setDeck(prev => prev.filter((_, index) => index !== randomIndex));
    setGameScore(prev => prev + 10);
    
    setTimeout(() => {
      setAnimatingCard(null);
      setIsDrawing(false);
      setSpinnerActive(false);
      setGamePhase('verification');
    }, 1000);
  };

  const verifyVRF = (cardId: string) => {
    const card = drawnCards.find(c => c.id === cardId);
    if (!card) return;
    
    setSelectedProof(card.vrfProof);
    setGameScore(prev => prev + 20);
    
    // Simulate verification process
    setTimeout(() => {
      alert(`VRF Proof Verified! Card ${card.value} of ${card.suit} was genuinely random.`);
    }, 500);
  };

  const submitResults = () => {
    const answer = {
      drawnCards: drawnCards.map(c => ({ id: c.id, proof: c.vrfProof })),
      verifications: drawnCards.length,
      gameScore
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 2 }}>
      {/* Game Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              <Casino sx={{ mr: 2, fontSize: 40 }} />
              VRF Casino Challenge
            </Typography>
            <Typography variant="h6">
              Master Verifiable Random Functions through card games!
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip 
              icon={<Star />} 
              label={`Score: ${gameScore}`} 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mb: 1, mr: 1 }} 
            />
            <Chip 
              icon={<Timer />} 
              label={`Time: ${formatTime(timeSpent)}`} 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mb: 1 }} 
            />
            <Box>
              <Button
                startIcon={<School />}
                onClick={() => setTutorialOpen(true)}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white', mr: 1 }}
              >
                How VRF Works
              </Button>
              <Button
                startIcon={showProofs ? <VisibilityOff /> : <Visibility />}
                onClick={() => setShowProofs(!showProofs)}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
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
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Psychology sx={{ mr: 1 }} />
              Mission: Prove Fair Randomness
            </Typography>
            <Typography variant="body1">
              You're at a high-stakes casino where trust is everything. Players suspect the card dealing 
              is rigged. Using <strong>Verifiable Random Functions (VRF)</strong>, you must prove that 
              every card draw is genuinely random and verifiable by all players.
            </Typography>
          </Alert>

          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
            Understanding VRF
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <Security sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Unpredictable</Typography>
                  <Typography variant="body2">
                    No one can predict the next random value, not even the generator
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Verifiable</Typography>
                  <Typography variant="body2">
                    Anyone can verify that the random value was generated correctly
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Unique</Typography>
                  <Typography variant="body2">
                    Each input produces exactly one valid random output
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" paragraph>
              Cards remaining in deck: <strong>{deck.length}</strong>
            </Typography>
            <Button
              variant="contained"
              onClick={() => setGamePhase('drawing')}
              startIcon={<PlayArrow />}
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Start Card Drawing
            </Button>
          </Box>
        </Paper>
      </Fade>

      {/* Drawing Phase */}
      <Fade in={gamePhase === 'drawing' || gamePhase === 'verification'}>
        <Paper sx={{ 
          p: 4, 
          mb: 3, 
          display: (gamePhase === 'drawing' || gamePhase === 'verification') ? 'block' : 'none' 
        }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
            <Casino sx={{ mr: 2 }} />
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
              <Typography variant="h6" gutterBottom>
                Drawn Cards (Click to verify VRF proof):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {drawnCards.map((card, index) => (
                  <Zoom 
                    key={card.id} 
                    in={true} 
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <Card
                      sx={{
                        width: 120,
                        height: 160,
                        cursor: 'pointer',
                        border: card.id === animatingCard ? '3px solid gold' : '2px solid #ddd',
                        bgcolor: card.color === 'red' ? '#ffebee' : '#f3e5f5',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.05)',
                          boxShadow: 6
                        }
                      }}
                      onClick={() => verifyVRF(card.id)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            color: card.color === 'red' ? '#d32f2f' : '#1976d2',
                            fontWeight: 'bold',
                            mb: 1
                          }}
                        >
                          {card.value}
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 1 }}>
                          {getSuitIcon(card.suit)}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {card.suit.charAt(0).toUpperCase() + card.suit.slice(1)}
                        </Typography>
                        {showProofs && (
                          <Typography 
                            variant="caption" 
                            display="block" 
                            sx={{ 
                              fontFamily: 'monospace',
                              fontSize: '0.7rem',
                              mt: 1,
                              wordBreak: 'break-all'
                            }}
                          >
                            {card.vrfProof}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
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
        </Paper>
      </Fade>

      {/* Results Phase */}
      <Fade in={gamePhase === 'results'}>
        <Paper sx={{ p: 4, textAlign: 'center', display: gamePhase === 'results' ? 'block' : 'none' }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'success.main' }}>
            <CheckCircle sx={{ mr: 2, fontSize: 48 }} />
            VRF Challenge Complete!
          </Typography>
          
          <Alert severity="success" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Congratulations! You've successfully demonstrated VRF properties:
            </Typography>
            <Box component="ul" sx={{ textAlign: 'left', pl: 2 }}>
              <li>Generated {drawnCards.length} provably random cards</li>
              <li>Each draw was unpredictable before generation</li>
              <li>All draws are verifiable by cryptographic proofs</li>
              <li>Total score: {gameScore} points in {formatTime(timeSpent)}</li>
            </Box>
          </Alert>

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
        <DialogTitle>
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
        <Dialog open={!!selectedProof} onClose={() => setSelectedProof(null)}>
          <DialogTitle>VRF Proof Verification</DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              Cryptographic proof for this random draw:
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.100', fontFamily: 'monospace' }}>
              {selectedProof}
            </Paper>
            <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
              In a real implementation, this proof would be verified against the VRF public key 
              and input parameters to ensure the randomness is genuine.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedProof(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}