"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("Product");
    const [hoveredItem, setHoveredItem] = useState(null);
    
    const navItems = [
        { text: "Home", href: "/" },
        { text: "AI Agents", href: "/chat/arena" },
        { text: "Ghibli Ai", href: "/chat/ai" },
        // { text: "Journey", href: "#Journey" }
    ];
    
    return (
        <LayoutGroup>
            <motion.nav 
                className="fixed z-50 top-0 left-0 right-0 w-full py-4 px-6 md:px-12 backdrop-blur-md ring-1 ring-stone-900/20 shadow-lg rounded-full my-4 mx-auto max-w-7xl flex items-center justify-between"
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
                <div className="hidden md:flex items-center space-x-8">
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
                    {/* <Link href='/'> */}
                    <motion.button
                        disabled
                        className="bg-stone-700/70 text-white/70 px-6 py-3 rounded-full font-medium relative cursor-pointer"
                    >
                        <span className="relative z-10">My Ghibli </span>
                        <span className='text-white text-xs px-2 py-[px] rounded-full bg-green-500  absolute w-fit -right-1 -top-2 flex items-center justify-center'>Live Soon</span>
                    </motion.button>
                    {/* </Link> */}
                </div>
                
                {/* Mobile Menu Button */}
                <div className="md:hidden">
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
                            <motion.button
                                className="bg-stone-700 text-white px-6 py-4 rounded-full font-medium mt-6 relative overflow-hidden"
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
                                <motion.span 
                                    className="absolute inset-0 bg-black/20"
                                    initial={{ scale: 0, borderRadius: "100%" }}
                                    whileHover={{ scale: 1.5, borderRadius: "100%" }}
                                    transition={{ duration: 0.6 }}
                                    style={{ originX: 0.5, originY: 0.5 }}
                                />
                                <span className="relative z-10">My Ghibli </span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </LayoutGroup>
    );
};

const NavItem = ({ text, href, isActive, isHovered, onHoverStart, onHoverEnd, onClick }) => {
    return (
        <motion.div
            className="relative flex items-center cursor-pointer py-2"
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            layout
        >
            <Link href={href}
                className="flex flex-col items-center relative">
                    <motion.span 
                        className={`text-${isActive ? 'gray-900 font-semibold' : 'gray-700 font-medium'} relative z-10`}
                        animate={{ 
                            y: isActive ? -2 : 0,
                            scale: isActive ? 1.05 : 1
                        }}
                        transition={{ duration: 0.3 }}
                    >{text}</motion.span>
            </Link>
        </motion.div>
    );
};

const MobileNavItem = ({ text, href, isActive, index, onClick }) => {
    return (
        <motion.div
            className={`flex items-center justify-between w-full py-3 border-b border-gray-100 ${isActive ? 'border-purple-200' : ''}`}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
                opacity: 1, 
                x: 0,
                transition: { 
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 300,
                    damping: 24 
                } 
            }}
            layout
        >
            <Link href={href}
                className="flex items-center w-full relative">
                    {isActive && (
                        <motion.div 
                            className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-pink-500 rounded-full mr-3"
                            layoutId="mobileActiveIndicator"
                            initial={{ height: 0 }}
                            animate={{ 
                                height: "100%",
                                transition: { type: "spring", stiffness: 300, damping: 22 }
                            }}
                        />
                    )}
                    <motion.span 
                        className={`text-lg ${isActive ? 'font-semibold text-purple-700' : 'font-medium text-gray-800'}`}
                        animate={{ 
                            x: isActive ? 3 : 0,
                            transition: { type: "spring", stiffness: 300, damping: 22 }
                        }}
                    >
                        {text}
                    </motion.span>
                    
                    {/* Background pulse effect for active item */}
                    {isActive && (
                        <motion.div 
                            className="absolute inset-0 bg-purple-100 rounded-md -z-10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ 
                                opacity: [0, 0.2, 0],
                                scale: [0.9, 1.05, 0.9],
                                transition: {
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "loop"
                                }
                            }}
                        />
                    )}
            </Link>
            
            {/* Right arrow with animation */}
            <motion.svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                animate={{ 
                    x: isActive ? [0, 5, 0] : 0,
                    rotate: isActive ? 90 : 0,
                    color: isActive ? "#7C3AED" : "currentColor"
                }}
                transition={{ 
                    x: { 
                        duration: 1.5, 
                        repeat: isActive ? Infinity : 0,
                        repeatType: "loop",
                        ease: "easeInOut",
                        repeatDelay: 0.5
                    },
                    rotate: { duration: 0.3 }
                }}
            >
                <path 
                    d="M9 18l6-6-6-6" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                />
            </motion.svg>
        </motion.div>
    );
};

export default Navbar;