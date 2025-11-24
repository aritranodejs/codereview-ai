import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { githubService } from '../services/github';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const handleAuth = async () => {
            const code = searchParams.get('code');

            if (code) {
                try {
                    // Exchange code for access token and get user data
                    const { access_token, user } = await githubService.handleOAuthCallback(code);

                    // Store auth data
                    localStorage.setItem('github_token', access_token);
                    login(user);

                    // Redirect to dashboard
                    navigate('/dashboard');
                } catch (error) {
                    console.error('Auth error:', error);
                    navigate('/');
                }
            } else {
                navigate('/');
            }
        };

        handleAuth();
    }, [searchParams, login, navigate]);

    return (
        <div className="flex items-center justify-center flex-col" style={{ minHeight: '80vh' }}>
            <div className="animate-spin mb-6" style={{ width: '50px', height: '50px', border: '4px solid var(--bg-card)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p className="text-secondary">Connecting to GitHub...</p>
        </div>
    );
};

export default AuthCallback;
