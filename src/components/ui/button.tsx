import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'border' | 'underline';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseClasses =
        'flex items-center justify-center text-sm font-bold rounded-full transition-all duration-300';

    const variantClasses = {
        primary: 'bg-gradient-to-r from-[#ff4bc1] to-[#ff4341] text-white h-12',
        border: 'border-2 border-[#ff4bc1] bg-white text-[#ff4bc1] h-[2.625rem]',
        underline:
            'text-[#5d5d5d] underline text-xs font-medium bg-transparent',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const disabledClasses = props.disabled ? 'bg-[#d1d1d1] text-white' : '';

    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClasses} ${className}`;

    return (
        <button className={buttonClasses} {...props}>
            {children}
        </button>
    );
};

export {Button};
