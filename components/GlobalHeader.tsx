import React from 'react';
import { Link } from 'react-router-dom';

export const GlobalHeader: React.FC = () => {
    return (
        <header>
            <div className="logo">
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>AIMA</Link>
            </div>
            <nav className="nav-links">
                <Link to="/#about">About</Link>
                <Link to="/#works">Works</Link>
                <Link to="/#contact">Contact</Link>
            </nav>
        </header>
    );
};
