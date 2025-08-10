import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Tab,
  Tabs,
  Paper,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Security,
  Casino,
  Schedule,
  Hub,
  ArrowBack,
  Share,
  BookmarkBorder,
  AccountBalance,
  CurrencyBitcoin,
  VerifiedUser,
  SportsEsports,
  EmojiEvents,
  Link,
  HowToVote,
  CardGiftcard,
  Info,
  Radar,
  NetworkCheck,
  Shield,
  Speed,
  Warning,
  Business,
  Language,
  Star,
} from '@mui/icons-material';

interface BlogSectionProps {
  onReturnToHub: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function BlogSection({ onReturnToHub }: BlogSectionProps) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onReturnToHub}
            sx={{ mr: 3 }}
          >
            Back
          </Button>
          <Typography variant="h3" component="h1" sx={{ flexGrow: 1 }}>
            Cryptography Deep Dive
          </Typography>
          {/* <Box sx={{ display: 'flex', gap: 1 }}>
            <Button startIcon={<Share />} variant="outlined" size="small">
              Share
            </Button>
            <Button startIcon={<BookmarkBorder />} variant="outlined" size="small">
              Save
            </Button>
          </Box> */}
        </Box>

        {/* Author Info */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>CA</Avatar>
            <Box>
              <Typography variant="h6">Crypto Arena</Typography>
              <Typography variant="body2" color="text.secondary">
                Educational content on advanced cryptographic technologies • 5 min read
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab 
              label="Threshold Cryptography" 
              icon={<Security />} 
              iconPosition="start"
            />
            <Tab 
              label="VRF & Blocklock" 
              icon={<Casino />} 
              iconPosition="start"
            />
            <Tab 
              label="dCipher Networks" 
              icon={<Hub />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <ThresholdCryptographyArticle />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <VRFAndBlocklockArticle />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <DCipherNetworkArticle />
        </TabPanel>
      </Container>
    </Box>
  );
}

// Threshold Cryptography Article
function ThresholdCryptographyArticle() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Threshold Cryptography: Shared Secrets in the Digital Age
      </Typography>

      <CardMedia
        component="div"
        sx={{
          height: 300,
          bgcolor: 'primary.main',
          backgroundImage: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
          borderRadius: 2,
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <Security sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h5">
            Distributed Trust Through Mathematics
          </Typography>
        </Box>
      </CardMedia>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        What is Threshold Cryptography?
      </Typography>

      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
        Threshold cryptography is a revolutionary approach to securing sensitive information by distributing 
        cryptographic keys among multiple parties. Instead of a single point of failure, it creates a system 
        where a minimum number of participants (the "threshold") must collaborate to perform cryptographic operations.
      </Typography>

      <Card sx={{ my: 4, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
            Key Concept: (t, n) Threshold Schemes
          </Typography>
          <Typography variant="body2">
            In a (t, n) threshold scheme:
            <br />• <strong>n</strong> = Total number of participants who hold key shares
            <br />• <strong>t</strong> = Minimum number needed to reconstruct the secret
            <br />• Any t participants can collaborate to use the key
            <br />• Any t-1 or fewer participants learn nothing about the secret
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Real-World Applications
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
              <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
              Banking & Finance
            </Typography>
            <Typography variant="body2" paragraph>
              Major banks use threshold cryptography for high-value transactions. Instead of one person 
              controlling the signing key, multiple executives must approve transfers above certain amounts.
            </Typography>
            <Chip label="JPMorgan Chase" size="small" sx={{ mr: 1 }} />
            <Chip label="Goldman Sachs" size="small" sx={{ mr: 1 }} />
            <Chip label="SWIFT Network" size="small" />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'warning.main' }}>
              <CurrencyBitcoin sx={{ mr: 1, verticalAlign: 'middle' }} />
              Cryptocurrency Wallets
            </Typography>
            <Typography variant="body2" paragraph>
              Multi-signature wallets protect billions in cryptocurrency. Popular implementations require 
              2-of-3 or 3-of-5 signatures for transactions, preventing single points of failure.
            </Typography>
            <Chip label="Gnosis Safe" size="small" sx={{ mr: 1 }} />
            <Chip label="BitGo" size="small" sx={{ mr: 1 }} />
            <Chip label="Casa" size="small" />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
              <VerifiedUser sx={{ mr: 1, verticalAlign: 'middle' }} />
              Certificate Authorities
            </Typography>
            <Typography variant="body2" paragraph>
              Root certificate authorities use threshold schemes to protect the master keys that secure 
              the entire internet's PKI infrastructure.
            </Typography>
            <Chip label="DigiCert" size="small" sx={{ mr: 1 }} />
            <Chip label="Let's Encrypt" size="small" sx={{ mr: 1 }} />
            <Chip label="Cloudflare" size="small" />
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h5" gutterBottom>
        Mathematical Foundation: Shamir's Secret Sharing
      </Typography>

      <Card sx={{ my: 3, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="body1" paragraph>
            The mathematical foundation relies on polynomial interpolation. A polynomial of degree t-1 
            requires exactly t points to be uniquely determined.
          </Typography>
          
          <Box sx={{ 
            bgcolor: 'grey.900', 
            p: 3, 
            borderRadius: 1, 
            fontFamily: 'monospace',
            mb: 2
          }}>
            <Typography variant="body2" sx={{ color: 'primary.light' }}>
              f(x) = a₀ + a₁x + a₂x² + ... + aₜ₋₁x^(t-1)
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              where a₀ is the secret, and each participant gets (xᵢ, f(xᵢ))
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            The security comes from the mathematical fact that t-1 points on a polynomial 
            reveal no information about the polynomial's value at any other point.
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Why It Matters Today
      </Typography>

      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
        As our digital infrastructure becomes more critical, single points of failure become 
        unacceptable risks. Threshold cryptography provides mathematical guarantees that no 
        single entity—whether malicious or compromised—can abuse cryptographic powers.
      </Typography>

      <Card sx={{ mt: 4, bgcolor: 'primary.dark' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
            Key Takeaway
          </Typography>
          <Typography variant="body1" sx={{ color: 'white' }}>
            Threshold cryptography transforms "trust" from a binary concept into a mathematical 
            one, enabling secure collaboration without requiring complete trust in any single party.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

// VRF and Blocklock Article
function VRFAndBlocklockArticle() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        VRF & Blocklock: Randomness and Time in Cryptography
      </Typography>

      <CardMedia
        component="div"
        sx={{
          height: 300,
          bgcolor: 'warning.main',
          backgroundImage: 'linear-gradient(45deg, #ff9800 30%, #ffc107 90%)',
          borderRadius: 2,
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
            <Casino sx={{ fontSize: 60 }} />
            <Schedule sx={{ fontSize: 60 }} />
          </Box>
          <Typography variant="h5">
            Verifiable Randomness & Time-Locked Secrets
          </Typography>
        </Box>
      </CardMedia>

      <Typography variant="h5" gutterBottom>
        Verifiable Random Functions (VRF)
      </Typography>

      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
        VRFs solve one of the hardest problems in distributed systems: generating randomness that 
        everyone can verify but no one can predict or manipulate. Unlike simple random number generators, 
        VRFs provide cryptographic proofs that the randomness was generated correctly.
      </Typography>

      <Card sx={{ my: 4, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="warning">
            <Casino sx={{ mr: 1, verticalAlign: 'middle' }} />
            VRF Properties
          </Typography>
          <Typography variant="body2">
            • <strong>Pseudorandomness:</strong> Output appears random to anyone without the secret key
            <br />• <strong>Verifiability:</strong> Anyone can verify the output matches the input and proof
            <br />• <strong>Uniqueness:</strong> Only one valid output exists for each input
            <br />• <strong>Unpredictability:</strong> Cannot be predicted before generation
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        VRF Use Cases in Action
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
              <SportsEsports sx={{ mr: 1, verticalAlign: 'middle' }} />
              Blockchain Gaming
            </Typography>
            <Typography variant="body2" paragraph>
              Games like Axie Infinity and CryptoKitties use VRF for fair breeding mechanics 
              and loot box openings. Players can verify that rare items are truly random.
            </Typography>
            <Chip label="Chainlink VRF" size="small" sx={{ mr: 1 }} />
            <Chip label="Axie Infinity" size="small" sx={{ mr: 1 }} />
            <Chip label="Aavegotchi" size="small" />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              <EmojiEvents sx={{ mr: 1, verticalAlign: 'middle' }} />
              Lottery Systems
            </Typography>
            <Typography variant="body2" paragraph>
              National lotteries and DeFi protocols use VRF to ensure fair winner selection. 
              Every participant can verify the drawing was conducted fairly.
            </Typography>
            <Chip label="PoolTogether" size="small" sx={{ mr: 1 }} />
            <Chip label="Algorand" size="small" sx={{ mr: 1 }} />
            <Chip label="Avalanche" size="small" />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
              <Link sx={{ mr: 1, verticalAlign: 'middle' }} />
              Consensus Mechanisms
            </Typography>
            <Typography variant="body2" paragraph>
              Proof-of-Stake blockchains use VRF for leader election, ensuring no validator 
              can predict when they'll be chosen to propose blocks.
            </Typography>
            <Chip label="Cardano" size="small" sx={{ mr: 1 }} />
            <Chip label="Polkadot" size="small" sx={{ mr: 1 }} />
            <Chip label="Ethereum 2.0" size="small" />
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>
        Blocklock Time-Release Encryption
      </Typography>

      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
        Blocklock encryption allows you to encrypt data that can only be decrypted after a specific 
        point in time, determined by blockchain block height. This creates trustless time-delayed 
        revelations without requiring any trusted third parties.
      </Typography>

      <Card sx={{ my: 4, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="secondary">
            <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
            How Blocklock Works
          </Typography>
          <Typography variant="body2">
            1. <strong>Encrypt:</strong> Data is encrypted with a key derived from future blockchain state
            <br />2. <strong>Time-lock:</strong> Key cannot be computed until specific block is mined
            <br />3. <strong>Automatic Release:</strong> Anyone can decrypt once target block exists
            <br />4. <strong>Verifiable:</strong> All participants can verify the timing mechanism
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Blocklock Applications
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'info.main' }}>
              <EmojiEvents sx={{ mr: 1, verticalAlign: 'middle' }} />
              Auction Systems
            </Typography>
            <Typography variant="body2" paragraph>
              Sealed-bid auctions where bids are revealed simultaneously after bidding ends, 
              preventing bid sniping and ensuring fair price discovery.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'warning.main' }}>
              <HowToVote sx={{ mr: 1, verticalAlign: 'middle' }} />
              Voting Systems
            </Typography>
            <Typography variant="body2" paragraph>
              Votes can be encrypted during voting period and automatically revealed after 
              voting closes, ensuring privacy during voting and transparency afterward.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
              <CardGiftcard sx={{ mr: 1, verticalAlign: 'middle' }} />
              Digital Will & Testament
            </Typography>
            <Typography variant="body2" paragraph>
              Important information can be time-locked to be revealed only after specific 
              conditions are met, enabling trustless inheritance mechanisms.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ mt: 4, bgcolor: 'warning.dark' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
            Key Insight
          </Typography>
          <Typography variant="body1" sx={{ color: 'white' }}>
            VRF and Blocklock solve fundamental problems of trust in randomness and time, 
            enabling new classes of applications that were impossible with traditional cryptography.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

// dCipher Network Article
function DCipherNetworkArticle() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        dCipher Networks: Resilient Communication Infrastructure
      </Typography>

      <CardMedia
        component="div"
        sx={{
          height: 300,
          bgcolor: 'secondary.main',
          backgroundImage: 'linear-gradient(45deg, #f50057 30%, #ff4081 90%)',
          borderRadius: 2,
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <Hub sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h5">
            Decentralized & Attack-Resistant Networks
          </Typography>
        </Box>
      </CardMedia>

      <Typography variant="h5" gutterBottom>
        What are dCipher Networks?
      </Typography>

      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
        dCipher networks represent the next evolution in secure communication infrastructure. 
        Unlike traditional networks that rely on centralized points of control, dCipher creates 
        resilient, distributed networks that can withstand sophisticated attacks while maintaining 
        privacy and performance.
      </Typography>

      <Card sx={{ my: 4, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="secondary">
            <Hub sx={{ mr: 1, verticalAlign: 'middle' }} />
            Core Principles
          </Typography>
          <Typography variant="body2">
            • <strong>Decentralization:</strong> No single point of failure or control
            <br />• <strong>Fault Tolerance:</strong> Network survives node failures and attacks
            <br />• <strong>Privacy:</strong> End-to-end encryption with metadata protection
            <br />• <strong>Scalability:</strong> Performance improves with network growth
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Technical Architecture
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'info.main' }}>
              <NetworkCheck sx={{ mr: 1, verticalAlign: 'middle' }} />
              Mesh Topology
            </Typography>
            <Typography variant="body2" paragraph>
              Each node connects to multiple others, creating redundant paths for message routing. 
              If any path is compromised, traffic automatically reroutes through healthy connections.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'warning.main' }}>
              <Shield sx={{ mr: 1, verticalAlign: 'middle' }} />
              Onion Routing
            </Typography>
            <Typography variant="body2" paragraph>
              Messages are encrypted in multiple layers, with each node only knowing the previous 
              and next hop. This prevents any single node from seeing the full communication path.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
              <Speed sx={{ mr: 1, verticalAlign: 'middle' }} />
              Adaptive Protocols
            </Typography>
            <Typography variant="body2" paragraph>
              Network protocols automatically adapt to changing conditions, optimizing for 
              latency, bandwidth, and security based on real-time network state.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h5" gutterBottom>
        Attack Resistance
      </Typography>

      <Card sx={{ my: 4, bgcolor: 'error.dark' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
            Threats dCipher Networks Defend Against
          </Typography>
          <Box sx={{ color: 'white' }}>
            <Typography variant="body2" paragraph>
              <strong>DDoS Attacks:</strong> Distributed architecture makes it impossible to overwhelm 
              the entire network by targeting individual nodes.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Network Partitioning:</strong> Multiple redundant paths ensure communication 
              continues even if parts of the network are isolated.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Traffic Analysis:</strong> Onion routing and traffic padding make it extremely 
              difficult to determine who is communicating with whom.
            </Typography>
            <Typography variant="body2">
              <strong>State-Level Censorship:</strong> Decentralized nature makes it practically 
              impossible for any authority to shut down the entire network.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Real-World Applications
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
              Secure Messaging
            </Typography>
            <Typography variant="body2" paragraph>
              Applications like Signal and Element are exploring dCipher-based architectures 
              for truly censorship-resistant communication that governments cannot block.
            </Typography>
            <Chip label="Signal Protocol" size="small" sx={{ mr: 1 }} />
            <Chip label="Matrix Network" size="small" sx={{ mr: 1 }} />
            <Chip label="Session Messenger" size="small" />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'warning.main' }}>
              <Language sx={{ mr: 1, verticalAlign: 'middle' }} />
              Internet Freedom
            </Typography>
            <Typography variant="body2" paragraph>
              In regions with internet censorship, dCipher networks provide uncensorable 
              access to information and communication channels.
            </Typography>
            <Chip label="Tor Network" size="small" sx={{ mr: 1 }} />
            <Chip label="I2P" size="small" sx={{ mr: 1 }} />
            <Chip label="Freenet" size="small" />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
              <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
              Enterprise Security
            </Typography>
            <Typography variant="body2" paragraph>
              Corporations use dCipher principles for internal communications that must 
              remain secure even if parts of their infrastructure are compromised.
            </Typography>
            <Chip label="Zero Trust" size="small" sx={{ mr: 1 }} />
            <Chip label="SASE" size="small" sx={{ mr: 1 }} />
            <Chip label="SD-WAN" size="small" />
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h5" gutterBottom>
        The Future of Communication
      </Typography>

      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
        As digital communication becomes more critical to society, the resilience and privacy 
        guarantees provided by dCipher networks become essential infrastructure. These systems 
        represent a fundamental shift from hoping networks won't be attacked to mathematically 
        guaranteeing they can survive attacks.
      </Typography>

      <Card sx={{ mt: 4, bgcolor: 'secondary.dark' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
            Vision for Tomorrow
          </Typography>
          <Typography variant="body1" sx={{ color: 'white' }}>
            dCipher networks promise a future where communication infrastructure is as robust 
            and uncensorable as the internet itself was meant to be—truly decentralized, 
            private, and resilient.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
