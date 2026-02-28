import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import './Login.css'; /* Reuse same auth styles */

export default function Register() {
    const { register, isAuthenticated, loading } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!loading && isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await register(formData);
            toast.success('Account created successfully!');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <div className="auth-brand-icon">S</div>
                    <h1>Create Account</h1>
                    <p>Register as an admin or teacher</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-name">Full Name</label>
                        <input
                            id="reg-name"
                            className="form-input"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-email">Email</label>
                        <input
                            id="reg-email"
                            className="form-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-password">Password</label>
                        <input
                            id="reg-password"
                            className="form-input"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min 6 characters"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-role">Role</label>
                        <select
                            id="reg-role"
                            className="form-select"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="admin">Admin</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>

                    <button className="btn btn-primary" type="submit" disabled={submitting}>
                        {submitting ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
