import React, { useState, useEffect } from 'react';
import { ADMIN } from '../constant/Value';
import { getLinkUrl, loadProjectToFirestore } from '../services/LandingPageService';

interface NavbarProps {
    role: string;
    handleLogout?: any;
    active?: any;
    toggleMessageOverlay?: any;
}

const Navbar: React.FC<NavbarProps> = ({ role, handleLogout, active, toggleMessageOverlay }) => {
    const [scrolled, setScrolled] = useState(0);
    const [cvUrl, setCvUrl] = useState("");

    const fetchLink = async () => {
        const linkUrl = await getLinkUrl();
        setCvUrl(linkUrl.cv);
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= 25 && window.scrollY < 100) {
                setScrolled(1);
            } else if (window.scrollY >= 100) {
                setScrolled(2);
            } else {
                setScrolled(0);
            }
        };

        fetchLink();
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLoadToFirestore = async () => {
        await loadProjectToFirestore();
    }

    const navbarClass = `fixed w-full px-4 z-50 ${scrolled === 1 ? 'bg-slate-800/25' : scrolled === 2 ? 'bg-slate-800/75' : 'bg-transparent'} flex justify-between transition-transform duration-200`;
    const buttonClass = `text-center text-slate-300/50 p-2 py-2
                        hover:border-b-2 hover:border-white hover:text-white
                        active:bg-gradient-to-r active:from-slate-500 active:to-slate-800 active:scale-100
                        transition-transform duration-200`

    return (
        <nav className={`${navbarClass}`}>
            {/* Left section */}
            <a className="text-white p-2" href="/">
                James's Portfolio
            </a>

            {/* Right section */}
            <div className="flex space-x-4">
                {role === ADMIN ? (
                    <button className={buttonClass} onClick={handleLoadToFirestore}>
                        Load Data
                    </button>
                ) : (<div></div>)}
                <a className={buttonClass} href={cvUrl} target="_blank" rel="noreferrer">
                    James's CV
                </a>
                {role ? (
                    <div className="flex space-x-4">
                        <button
                            className={`${buttonClass}  ${active === "message" ? " border-b-2 border-white text-white" : ""}`}
                            onClick={toggleMessageOverlay}>
                            Message
                        </button>
                        <button className={buttonClass} onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <button className={buttonClass} onClick={() => window.location.href = '/auth'}>
                        Sign In / Sign Up
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;