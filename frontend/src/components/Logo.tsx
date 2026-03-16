import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 24 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Background circle - dark green */}
            <circle cx="32" cy="32" r="30" fill="#1B4D3E" />

            {/* Inner ring - lighter green */}
            <circle cx="32" cy="32" r="26" fill="none" stroke="#4ADE80" strokeWidth="1" opacity="0.6" />

            {/* Globe horizontal line */}
            <line x1="6" y1="32" x2="58" y2="32" stroke="#4ADE80" strokeWidth="1" opacity="0.5" />

            {/* Globe vertical line */}
            <line x1="32" y1="6" x2="32" y2="58" stroke="#4ADE80" strokeWidth="1" opacity="0.5" />

            {/* Globe arc - top */}
            <path d="M14 20 Q32 10 50 20" stroke="#4ADE80" strokeWidth="1.5" fill="none" opacity="0.7" />

            {/* Globe arc - bottom */}
            <path d="M14 44 Q32 54 50 44" stroke="#4ADE80" strokeWidth="1.5" fill="none" opacity="0.7" />

            {/* Main leaf - center */}
            <path
                d="M32 22C32 22 24 28 24 36C24 42 27 46 32 50C37 46 40 42 40 36C40 28 32 22 32 22Z"
                fill="#4ADE80"
            />

            {/* Leaf stem */}
            <line x1="32" y1="50" x2="32" y2="56" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />

            {/* Leaf center vein */}
            <line x1="32" y1="26" x2="32" y2="46" stroke="#1B4D3E" strokeWidth="1.5" strokeLinecap="round" />

            {/* Leaf left vein */}
            <path d="M32 34C28 32 26 34 26 36C26 38 28 39 32 40" stroke="#1B4D3E" strokeWidth="0.8" fill="none" strokeLinecap="round" />

            {/* Leaf right vein */}
            <path d="M32 34C36 32 38 34 38 36C38 38 36 39 32 40" stroke="#1B4D3E" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </svg>
    );
};

export default Logo;

