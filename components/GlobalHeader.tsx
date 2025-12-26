import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { recruitPositions } from '../data/recruitPositions';
import { RecruitModal } from './RecruitModal';
import { RecruitPosition } from '../types';

export const GlobalHeader: React.FC = () => {
    const [selectedPosition, setSelectedPosition] = useState<RecruitPosition | null>(null);

    return (
        <>
            <header>
                <div className="logo">
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>AIMA</Link>
                </div>
                <nav className="nav-links">
                    <Link to="/#about">About</Link>
                    <Link to="/#works">Works</Link>
                    <button type="button" onClick={() => setSelectedPosition(recruitPositions[0])}>
                        Recruit
                    </button>
                    <Link to="/#contact">Contact</Link>
                </nav>
            </header>
            <RecruitModal
                isOpen={!!selectedPosition}
                onClose={() => setSelectedPosition(null)}
                position={selectedPosition}
                positions={recruitPositions}
                onSelect={(position) => setSelectedPosition(position)}
            />
        </>
    );
};
