interface WrapperProps {
    children: React.ReactNode;
}

export function Wrapper({ children }: WrapperProps) {
    return (
        <div className="max-w-7xl mx-auto p-4">
            {children}
        </div>
    );
}
