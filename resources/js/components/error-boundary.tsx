import React from 'react';

type ErrorBoundaryProps = {
    fallback: (props: { error: Error; reset: () => void }) => JSX.Element;
    children: React.ReactNode;
    onError?: (error: Error, info: React.ErrorInfo) => void;
};

type ErrorBoundaryState = {
    error: Error | null;
};

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        if (this.props.onError) {
            this.props.onError(error, info);
        }
    }

    reset = () => {
        this.setState({ error: null });
    };

    render() {
        if (this.state.error) {
            return this.props.fallback({ error: this.state.error, reset: this.reset });
        }

        return this.props.children;
    }
}
