import React, { ReactNode } from 'react';
import { GlobalHeader } from './GlobalHeader';
import { GlobalFooter } from './GlobalFooter';
import '../styles/home-legacy.css';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="legacy-home">
            <GlobalHeader />
            <div className="grid-wrapper">
                {children}
                <GlobalFooter />
            </div>
        </div>
    );
};
