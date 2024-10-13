import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import { ethers } from 'ethers';
import AnimatedCursor from './AnimatedCursor';
import ParallaxBackground from './ParallaxBackground';
import TypingEffect from './TypingEffect';
import BrowseSkills from './components/BrowseSkills';
import ListSkill from './components/ListSkill';
import ServiceRequests from './components/ServiceRequests';
import Governance from './components/Governance';
import Profile from './components/Profile';
import HowItWorks from './components/HowItWorks';
import './App.css';

import SkillExchangeABI from './abis/SkillExchange.json';
import SkillExchangeGovernanceABI from './abis/SkillExchangeGovernance.json';

const SKILL_EXCHANGE_ADDRESS = '0x211F663efD099cF2aDCd42B038f54Fd16Db5f694';
const SKILL_EXCHANGE_GOVERNANCE_ADDRESS = '0xAFF737C672C7eBE8Abf8fA7f137b7f4D4bd91ABd';

console.log("SKILL_EXCHANGE_ADDRESS:", SKILL_EXCHANGE_ADDRESS);
console.log("SKILL_EXCHANGE_GOVERNANCE_ADDRESS:", SKILL_EXCHANGE_GOVERNANCE_ADDRESS);
console.log("SkillExchangeABI:", SkillExchangeABI);
console.log("SkillExchangeGovernanceABI:", SkillExchangeGovernanceABI);

function App() {
  const [account, setAccount] = useState(null);
  const [skillExchangeContract, setSkillExchangeContract] = useState(null);
  const [governanceContract, setGovernanceContract] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [animated, setAnimated] = useState(false);
  const [balance, setBalance] = useState('0');
  const [newSkill, setNewSkill] = useState({ title: '', description: '', price: '', isBarterOnly: false });

  useEffect(() => {
    setAnimated(true);
    initializeEthers();
  }, []);

  const initializeEthers = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accounts = await provider.listAccounts();

        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts found. Please connect your wallet.");
        }

        console.log("Connected account:", accounts[0]);

        const skillExchange = new ethers.Contract(SKILL_EXCHANGE_ADDRESS, SkillExchangeABI.abi, signer);
        const governance = new ethers.Contract(SKILL_EXCHANGE_GOVERNANCE_ADDRESS, SkillExchangeGovernanceABI.abi, signer);

        setSkillExchangeContract(skillExchange);
        setGovernanceContract(governance);
        setAccount(accounts[0]);

        // Fetch balance
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance)); // Format balance to ETH
        console.log("Balance:", balance.toString());

        console.log("Ethers initialized successfully");
      } catch (error) {
        console.error("Failed to initialize ethers:", error);
        setSnackbar({ open: true, message: `Failed to initialize ethers: ${error.message}`, severity: 'error' });
      }
    } else {
      console.error("Ethereum object not found, do you have MetaMask installed?");
      setSnackbar({ open: true, message: 'MetaMask not detected. Please install MetaMask and refresh the page.', severity: 'error' });
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        // Fetch balance
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance)); // Format balance to ETH

        setSnackbar({ open: true, message: 'Wallet connected successfully!', severity: 'success' });
        await initializeEthers(); // Call to initialize ethers after connecting
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setSnackbar({ open: true, message: 'Failed to connect wallet: ' + error.message, severity: 'error' });
      }
    } else {
      setSnackbar({ open: true, message: 'Please install MetaMask!', severity: 'warning' });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchSkills = async () => {
    // Fetch skills logic here
  };

  const listSkill = async () => {
    try {
      const tx = await skillExchangeContract.listSkill(newSkill.title, newSkill.description, ethers.parseEther(newSkill.price), newSkill.isBarterOnly);
      await tx.wait();
      showSnackbar('Skill listed successfully', 'success');
      fetchSkills(); // Ensure this function is defined
      setNewSkill({ title: '', description: '', price: '', isBarterOnly: false }); // Reset the form
    } catch (error) {
      console.error('Failed to list skill:', error);
      showSnackbar(`Failed to list skill: ${error.message}`, 'error');
    }
  };

  const createProposal = async (description) => {
    if (!governanceContract) return;
    try {
      const tx = await governanceContract.createProposal(description);
      await tx.wait();
      setSnackbar({ open: true, message: 'Proposal created successfully!', severity: 'success' });
    } catch (error) {
      console.error("Error creating proposal:", error);
      setSnackbar({ open: true, message: 'Error creating proposal', severity: 'error' });
    }
  };

  const createServiceRequest = async (title, description) => {
    if (!skillExchangeContract) return;
    try {
      const tx = await skillExchangeContract.createRequest(title, description);
      await tx.wait();
      setSnackbar({ open: true, message: 'Service request created successfully!', severity: 'success' });
    } catch (error) {
      console.error("Error creating service request:", error);
      setSnackbar({ open: true, message: 'Error creating service request', severity: 'error' });
    }
  };

  return (
    <Router>
      <div className="app">
        <AnimatedCursor />
        <ParallaxBackground />
        <header className="header">
          <Link to="/" className="logo">Skill Exchange</Link>
          <nav>
            <Link to="/browse-skills">Browse Skills</Link>
            <Link to="/list-skill">List a Skill</Link>
            <Link to="/service-requests">Service Requests</Link>
            <Link to="/governance">Governance</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/how-it-works">How It Works</Link>
          </nav>
          <div className="wallet-info">
            <button className="connect-btn" onClick={connectWallet}>
              {account && typeof account === 'string' ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
            </button>
            {account && (
              <div>
                <span className="balance">Balance: {parseFloat(balance).toFixed(4)} ETH</span>
                {/* Ensure account is a string before rendering */}
                <span className="wallet-address">Address: {typeof account === 'string' ? account : 'Invalid account'}</span>
              </div>
            )}
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={
              <>
                <section className="hero">
                  <div className="container">
                    <div className="hero-content">
                      <h1 className={`hero-title ${animated ? 'animated' : ''}`}>
                        <TypingEffect text="Driving growth with skills." speed={50} />
                      </h1>
                      <p className="hero-subtitle">We connect amazing talent with amazing opportunities.</p>
                      <div className="cta-buttons">
                        <Link to="/browse-skills" className="btn primary-btn">Browse Skills</Link>
                        <Link to="/list-skill" className="btn secondary-btn">List a Skill <span className="arrow">→</span></Link>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="features">
                  <div className="container">
                    <h2>Our Process</h2>
                    <div className="feature-grid">
                      <div className="feature-item">
                        <h3>01. Connect Wallet</h3>
                        <p>Start by connecting your wallet to access the Skill Exchange platform.</p>
                      </div>
                      <div className="feature-item">
                        <h3>02. Browse or List</h3>
                        <p>Browse available skills or list your own to offer your expertise.</p>
                      </div>
                      <div className="feature-item">
                        <h3>03. Make Requests</h3>
                        <p>Create service requests for skills you need or respond to others' requests.</p>
                      </div>
                      <div className="feature-item">
                        <h3>04. Exchange Skills</h3>
                        <p>Connect with others, exchange skills, and grow your network.</p>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            } />
            <Route path="/browse-skills" element={<BrowseSkills skillExchangeContract={skillExchangeContract} />} />
            <Route path="/list-skill" element={<ListSkill listSkill={listSkill} skillExchangeContract={skillExchangeContract} />} />
            <Route 
              path="/service-requests" 
              element={
                <ServiceRequests 
                  skillExchangeContract={skillExchangeContract} 
                  account={account}
                  createServiceRequest={createServiceRequest}
                />
              } 
            />
            <Route path="/governance" element={<Governance createProposal={createProposal} governanceContract={governanceContract} />} />
            <Route path="/profile" element={<Profile account={account} skillExchangeContract={skillExchangeContract} />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
          </Routes>
        </main>

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </Router>
  );
}

export default App;