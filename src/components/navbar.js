"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const walletIcons = {
  MetaMask: '/wallet-icons/metamask.png',
  Phantom: '/wallet-icons/phantom.png',
  BitGet: '/wallet-icons/bitget.png'
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("Product");
    const [hoveredItem, setHoveredItem] = useState(null);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [walletBalance, setWalletBalance] = useState('0');
    const [connectedWallet, setConnectedWallet] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const navItems = [
        // { text: "Home", href: "/" },
        // { text: "AI Agents", href: "/chat/arena" },
        // { text: "Ghibli Ai", href: "/chat/ai" },
        // { text: "Journey", href: "#Journey" }
    ];

    useEffect(() => {
        // Check if wallet was previously connected
        const savedWalletData = localStorage.getItem('walletData');
        if (savedWalletData) {
            const { address, type } = JSON.parse(savedWalletData);
            setWalletAddress(address);
            setConnectedWallet(type);
            setWalletConnected(true);
            
            // Reconnect to wallet if possible
            reconnectWallet(type);
        }
    }, []);

    const reconnectWallet = async (walletType) => {
        try {
            switch (walletType) {
                case 'MetaMask':
                    if (window.ethereum) {
                        await connectMetaMask();
                    }
                    break;
                case 'Phantom':
                    if (window.solana) {
                        await connectPhantom();
                    }
                    break;
                case 'BitGet':
                    if (window.bitkeep) {
                        await connectBitGet();
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error("Error reconnecting wallet:", error);
            disconnectWallet();
        }
    };

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const connectMetaMask = async () => {
        try {
            if (window.ethereum) {
                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const address = accounts[0];
                
                // Get balance
                const balance = await window.ethereum.request({
                    method: 'eth_getBalance',
                    params: [address, 'latest']
                });
                
                const ethBalance = parseInt(balance, 16) / 10**18;
                
                setWalletAddress(address);
                setWalletBalance(ethBalance.toFixed(4));
                setConnectedWallet('MetaMask');
                setWalletConnected(true);
                
                // Save connection info
                localStorage.setItem('walletData', JSON.stringify({
                    address: address,
                    type: 'MetaMask'
                }));
                
                // Listen for account changes
                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length === 0) {
                        disconnectWallet();
                    } else {
                        setWalletAddress(accounts[0]);
                    }
                });
            } else {
                window.open('https://metamask.io/download/', '_blank');
            }
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
        }
        setIsWalletModalOpen(false);
    };
    
    const connectPhantom = async () => {
        try {
            if (window.solana && window.solana.isPhantom) {
                const resp = await window.solana.connect();
                const address = resp.publicKey.toString();
                
                setWalletAddress(address);
                setConnectedWallet('Phantom');
                setWalletConnected(true);
                
                // Save connection info
                localStorage.setItem('walletData', JSON.stringify({
                    address: address,
                    type: 'Phantom'
                }));
                
                // Get SOL balance
                try {
                    const connection = new window.solanaWeb3.Connection(
                        "https://api.mainnet-beta.solana.com",
                        "confirmed"
                    );
                    const balance = await connection.getBalance(resp.publicKey);
                    setWalletBalance((balance / 10**9).toFixed(4));
                } catch (err) {
                    console.error("Error getting Solana balance:", err);
                    setWalletBalance('--');
                }
            } else {
                window.open('https://phantom.app/download', '_blank');
            }
        } catch (error) {
            console.error("Error connecting to Phantom:", error);
        }
        setIsWalletModalOpen(false);
    };
    
    const connectBitGet = async () => {
        try {
            if (window.bitkeep && window.bitkeep.ethereum) {
                const provider = window.bitkeep.ethereum;
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                const address = accounts[0];
                
                setWalletAddress(address);
                setConnectedWallet('BitGet');
                setWalletConnected(true);
                
                // Save connection info
                localStorage.setItem('walletData', JSON.stringify({
                    address: address,
                    type: 'BitGet'
                }));
                
                // Get balance
                const balance = await provider.request({
                    method: 'eth_getBalance',
                    params: [address, 'latest']
                });
                
                const ethBalance = parseInt(balance, 16) / 10**18;
                setWalletBalance(ethBalance.toFixed(4));
            } else {
                window.open('https://web3.bitget.com/en/wallet-download', '_blank');
            }
        } catch (error) {
            console.error("Error connecting to BitGet:", error);
        }
        setIsWalletModalOpen(false);
    };
    
    const disconnectWallet = () => {
        setWalletConnected(false);
        setWalletAddress('');
        setWalletBalance('0');
        setConnectedWallet(null);
        localStorage.removeItem('walletData');
        setIsDropdownOpen(false);
    };
    
    return (
        <LayoutGroup>
            <motion.nav 
                className="fixed z-50 top-0 left-0 right-0 w-full py-3 px-2 md:px-12 backdrop-blur-md ring-1 ring-stone-900/20 shadow-lg rounded-full my-4 mx-auto max-w-7xl flex items-center justify-between"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                layout
            >
                {/* Logo */}
                <div className="flex items-center">
                    <Link href='/'>
                    <div className="flex items-center">
                        <Image
                            src='/logo.png'
                            alt="Logo" 
                            width={150}
                            height={100}
                            className="flex items-center"
                        />
                    </div>
                    </Link>
                </div>
                
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-4">
                    {navItems.map((item) => (
                        <NavItem 
                            key={item.text}
                            text={item.text} 
                            href={item.href}
                            isActive={activeItem === item.text}
                            isHovered={hoveredItem === item.text}
                            onHoverStart={() => setHoveredItem(item.text)}
                            onHoverEnd={() => setHoveredItem(null)}
                            onClick={() => setActiveItem(item.text)}
                        />
                    ))}
                    <Link href='/ai'>
                    <motion.div
                        className="bg-red-500/70 text-white/90 px-6 py-2 rounded-full font-medium relative cursor-pointer"
                    >
                        <span className="relative z-10 text-lg font-medium">My G8Day Ai</span>
                    </motion.div>
                    </Link>
                    
                    {/* Wallet Connect Button - Desktop */}
                    {!walletConnected ? (
                        <motion.button
                            className="bg-gradient-to-r from-red-500/70 to-red-600/70 text-white px-6 py-2 rounded-full font-medium relative overflow-hidden cursor-pointer text-lg"
                            // whileHover={{boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsWalletModalOpen(true)}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <span className="relative z-10 flex items-center">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 12V12.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Connect Wallet
                            </span>
                        </motion.button>
                    ) : (
                        <div className="relative">
                            <motion.button
                                className="bg-gradient-to-r from-red-500/70 to-red-500/50 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 relative"
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                {connectedWallet && (
                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-white p-1">
                                        <Image
                                            src={walletIcons[connectedWallet]}
                                            alt={connectedWallet}
                                            width={20}
                                            height={20}
                                        />
                                    </div>
                                )}
                                <span className='text-lg'>{formatAddress(walletAddress)}</span>
                                <motion.svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </motion.svg>
                            </motion.button>
                            
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-xl p-4 min-w-[220px]"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex items-center justify-between mb-4 border-b pb-3">
                                            <div className="flex items-center gap-2">
                                                {connectedWallet && (
                                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 p-1">
                                                        <Image
                                                            src={walletIcons[connectedWallet]}
                                                            alt={connectedWallet}
                                                            width={20}
                                                            height={20}
                                                        />
                                                    </div>
                                                )}
                                                <span className="font-medium text-gray-800">{connectedWallet}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <div className="text-sm text-gray-500">Wallet Address</div>
                                            <div className="text-gray-800 font-medium truncate">{walletAddress}</div>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <div className="text-sm text-gray-500">Balance</div>
                                            <div className="text-gray-800 font-medium">
                                                {walletBalance} {connectedWallet === 'Phantom' ? 'SOL' : 'ETH'}
                                            </div>
                                        </div>
                                        
                                        <motion.button
                                            className="w-full bg-red-100 text-red-600 px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2"
                                            whileHover={{ scale: 1.02, backgroundColor: '#FEE2E2' }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={disconnectWallet}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Disconnect
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
                
                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center space-x-4">
                    {/* Wallet Button - Mobile */}
                    {!walletConnected ? (
                        <motion.button
                            className="bg-gradient-to-r from-red-500/70 to-red-600/70 text-white p-2 rounded-full"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsWalletModalOpen(true)}
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 12V12.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </motion.button>
                    ) : (
                        <motion.button
                            className="bg-red-500/70 text-white p-2 rounded-full relative"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {connectedWallet && (
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <Image
                                        src={walletIcons[connectedWallet]}
                                        alt={connectedWallet}
                                        width={20}
                                        height={20}
                                    />
                                </div>
                            )}
                        </motion.button>
                    )}
                    
                    <motion.button
                        className="p-2 relative"
                        onClick={() => setIsOpen(!isOpen)}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <motion.path
                                animate={isOpen ? { d: "M18 6L6 18M6 6L18 18" } : { d: "M4 6h16M4 12h16M4 18h16" }}
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                transition={{ duration: 0.3 }}
                            />
                        </svg>
                        {isOpen && (
                            <motion.span
                                className="absolute inset-0 bg-purple-100 rounded-full -z-10"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </motion.button>
                </div>
            </motion.nav>
            
            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="fixed inset-x-0 top-0 backdrop-blur-lg z-40 md:hidden overflow-hidden shadow-lg"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                            height: "auto", 
                            opacity: 1,
                            transition: { 
                                height: { type: "spring", stiffness: 100, damping: 20 },
                                opacity: { duration: 0.3 }
                            }
                        }}
                        exit={{ 
                            height: 0, 
                            opacity: 0,
                            transition: { 
                                height: { duration: 0.4 },
                                opacity: { duration: 0.2 }
                            }
                        }}
                        layout
                    >
                        <div className="pt-24 pb-6 px-6 flex flex-col space-y-6">
                            {navItems.map((item, index) => (
                                <MobileNavItem 
                                    key={item.text}
                                    text={item.text} 
                                    href={item.href}
                                    isActive={activeItem === item.text}
                                    index={index}
                                    onClick={() => {
                                        setActiveItem(item.text);
                                        setIsOpen(false);
                                    }}
                                />
                            ))}
                            
                            <Link href='/ai'>
                            <motion.button
                                className="bg-red-500/70 w-full text-white px-6 py-4 rounded-full font-medium mt-6 relative overflow-hidden"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                    transition: { delay: 0.4, duration: 0.3 } 
                                }}
                            >
                                <span className="relative z-10">My G8Day Ai</span>
                            </motion.button>
                            </Link>
                            
                            {/* Mobile Wallet Info */}
                            {walletConnected && (
                                <motion.div
                                    className="bg-white rounded-2xl shadow-lg p-4 mt-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ 
                                        opacity: 1, 
                                        y: 0,
                                        transition: { delay: 0.5, duration: 0.3 } 
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        {connectedWallet && (
                                            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 p-1">
                                                <Image
                                                    src={walletIcons[connectedWallet]}
                                                    alt={connectedWallet}
                                                    width={20}
                                                    height={20}
                                                />
                                            </div>
                                        )}
                                        <span className="font-medium text-gray-800">{connectedWallet}</span>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <div className="text-sm text-gray-500">Wallet Address</div>
                                        <div className="text-gray-800 font-medium truncate">{formatAddress(walletAddress)}</div>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <div className="text-sm text-gray-500">Balance</div>
                                        <div className="text-gray-800 font-medium">
                                            {walletBalance} {connectedWallet === 'Phantom' ? 'SOL' : 'ETH'}
                                        </div>
                                    </div>
                                    
                                    <motion.button
                                        className="w-full bg-red-100 text-red-600 px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.02, backgroundColor: '#FEE2E2' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={disconnectWallet}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Disconnect
                                    </motion.button>
                                </motion.div>
                            )}
                            
                            {/* Mobile Connect Wallet Button */}
                            {!walletConnected && (
                                <motion.button
                                    className="w-full bg-red-500/70 to-purple-600 text-white px-6 py-4 rounded-full font-medium flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ 
                                        opacity: 1, 
                                        y: 0,
                                        transition: { delay: 0.5, duration: 0.3 } 
                                    }}
                                    onClick={() => {
                                        setIsWalletModalOpen(true);
                                        setIsOpen(false);
                                    }}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 12V12.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Connect Wallet
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Wallet Connect Modal */}
            <AnimatePresence>
                {isWalletModalOpen && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div 
                            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsWalletModalOpen(false)}
                        />
                        
                        <motion.div
                            className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md relative z-10"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Connect Wallet</h3>
                                <motion.button
                                    className="p-2 rounded-full hover:bg-gray-100"
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsWalletModalOpen(false)}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </motion.button>
                            </div>
                            
                            <p className="text-gray-600 mb-6">Select a wallet to connect to our platform:</p>
                            
                            <div className="space-y-3">
                                <WalletOption 
                                    name="MetaMask"
                                    icon={walletIcons.MetaMask}
                                    onClick={connectMetaMask}
                                    description="Connect using MetaMask wallet"
                                />
                                
                                <WalletOption 
                                    name="Phantom"
                                    icon={walletIcons.Phantom}
                                    onClick={connectPhantom}
                                    description="Connect using Phantom wallet"
                                />
                                
                                <WalletOption 
                                    name="BitGet"
                                    icon={walletIcons.BitGet}
                                    onClick={connectBitGet}
                                    description="Connect using BitGet wallet"
                                />
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-6 text-center">
                                By connecting your wallet, you agree to our Terms of Service and Privacy Policy
                            </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </LayoutGroup>
        );
    };

    const NavItem = ({ text, href, isActive, isHovered, onHoverStart, onHoverEnd, onClick }) => (
        <motion.div
            className={`relative cursor-pointer ${isActive ? 'text-blue-600' : 'text-gray-800'}`}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            onClick={onClick}
        >
            <Link href={href}>
                <a className="font-medium text-lg">{text}</a>
            </Link>
            {isHovered && (
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"
                    layoutId="underline"
                />
            )}
        </motion.div>
    );

    const MobileNavItem = ({ text, href, isActive, index, onClick }) => (
        <motion.div
            className={`text-lg font-medium ${isActive ? 'text-blue-600' : 'text-gray-800'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
            exit={{ opacity: 0, y: 20 }}
            onClick={onClick}
        >
            <Link href={href}>
                <a>{text}</a>
            </Link>
        </motion.div>
    );

    const WalletOption = ({ name, icon, onClick, description }) => (
        <motion.button
            className="w-full flex items-center gap-4 p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
        >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-2">
                <Image src={icon} alt={name} width={40} height={40} />
            </div>
            <div className="text-left">
                <div className="font-medium text-gray-800">{name}</div>
                <div className="text-sm text-gray-500">{description}</div>
            </div>
        </motion.button>
    );

    export default Navbar;