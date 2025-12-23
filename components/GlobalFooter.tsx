import React from 'react';
import { Link } from 'react-router-dom';

export const GlobalFooter: React.FC = () => {
    return (
        <div
            className="grid-cell span-4"
            style={{
                borderBottom: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 40px'
            }}
        >
            <span style={{ fontSize: '0.8rem', color: '#999' }}>© 2025 AIMA Inc. All Rights Reserved.</span>
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/privacy" style={{ fontSize: '0.8rem', color: '#999' }}>Privacy Policy</Link>
            </div>
        </div>
    );
};
