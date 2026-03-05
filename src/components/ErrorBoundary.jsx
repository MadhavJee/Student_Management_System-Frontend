import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem',
                    color: 'var(--color-text-secondary)',
                    textAlign: 'center',
                }}>
                    <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                        Something went wrong
                    </h2>
                    <p style={{ fontSize: '0.875rem', marginBottom: '1rem', maxWidth: '400px' }}>
                        This page encountered an error. Please try refreshing.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => this.setState({ hasError: false, error: null })}
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
