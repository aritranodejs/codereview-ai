import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { githubService } from '../services/github';

const Landing = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            // Initiate real GitHub OAuth flow
            githubService.initiateOAuth();
        }
    };

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero py-16">
                <div className="container text-center">
                    <div className="animate-fadeInUp">
                        <h1 className="mb-6">
                            Automate Your Code Reviews
                            <br />
                            <span className="text-gradient">Directly on GitHub</span>
                        </h1>
                        <p className="hero-subtitle text-secondary mb-8" style={{ maxWidth: '700px', margin: '0 auto 3rem' }}>
                            Save 30-60 minutes per PR with AI-powered reviews that comment inline, catch bugs, and approve safe changes automatically. Integrated seamlessly into your GitHub workflow.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
                                <span>🔗 Connect GitHub</span>
                            </button>
                            <a href="#features" className="btn btn-secondary btn-lg">
                                See How It Works
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-16" style={{ background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <h2 className="text-center mb-4">Why Teams Love CodeReview AI</h2>
                    <p className="text-center text-secondary mb-12">Real workflow integration that saves hours every week</p>

                    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        <div className="card card-hover">
                            <div className="text-gradient" style={{ fontSize: '3rem' }}>⚡</div>
                            <h3 className="mt-4 mb-2">Automatic PR Analysis</h3>
                            <p className="text-secondary">Every pull request is analyzed automatically. No manual copy-paste. Real integration via GitHub webhooks.</p>
                        </div>

                        <div className="card card-hover">
                            <div className="text-gradient" style={{ fontSize: '3rem' }}>💬</div>
                            <h3 className="mt-4 mb-2">Inline Code Comments</h3>
                            <p className="text-secondary">Issues are commented directly on the problematic lines in your PR, just like a human reviewer would.</p>
                        </div>

                        <div className="card card-hover">
                            <div className="text-gradient" style={{ fontSize: '3rem' }}>🔒</div>
                            <h3 className="mt-4 mb-2">Security & Bug Detection</h3>
                            <p className="text-secondary">Catch SQL injection, XSS, hardcoded secrets, null pointer bugs, and more before they reach production.</p>
                        </div>

                        <div className="card card-hover">
                            <div className="text-gradient" style={{ fontSize: '3rem' }}>✅</div>
                            <h3 className="mt-4 mb-2">Auto-Approve Safe PRs</h3>
                            <p className="text-secondary">Clean PRs get automatically approved, while risky ones are flagged for human review. Save 10+ hours/week.</p>
                        </div>

                        <div className="card card-hover">
                            <div className="text-gradient" style={{ fontSize: '3rem' }}>📊</div>
                            <h3 className="mt-4 mb-2">Repository Health Tracking</h3>
                            <p className="text-secondary">Monitor code quality trends, issue patterns, and team performance over time with beautiful analytics.</p>
                        </div>

                        <div className="card card-hover">
                            <div className="text-gradient" style={{ fontSize: '3rem' }}>🚀</div>
                            <h3 className="mt-4 mb-2">Ship Faster</h3>
                            <p className="text-secondary">Reduce code review bottlenecks. Junior devs get instant feedback. Senior devs review only critical issues.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-16">
                <div className="container">
                    <h2 className="text-center mb-12">Measured Impact</h2>
                    <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-gradient font-bold" style={{ fontSize: '4rem' }}>45min</div>
                            <p className="text-secondary mt-2">Average time saved per PR</p>
                        </div>
                        <div>
                            <div className="text-gradient font-bold" style={{ fontSize: '4rem' }}>63%</div>
                            <p className="text-secondary mt-2">Reduction in bugs reaching production</p>
                        </div>
                        <div>
                            <div className="text-gradient font-bold" style={{ fontSize: '4rem' }}>2hrs</div>
                            <p className="text-secondary mt-2">From PR open to merge (vs 8hrs)</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-16" style={{ background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <h2 className="text-center mb-4">Simple, Value-Based Pricing</h2>
                    <p className="text-center text-secondary mb-12">Save $2,000+ per developer in review time. Pay a fraction of that.</p>

                    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', maxWidth: '1100px', margin: '0 auto' }}>
                        <div className="card text-center p-8">
                            <h3 className="mb-2">Starter</h3>
                            <div className="text-gradient font-bold my-6" style={{ fontSize: '3rem' }}>
                                $39<span className="text-secondary" style={{ fontSize: '1.2rem' }}>/mo</span>
                            </div>
                            <p className="text-secondary mb-6">Per developer</p>
                            <ul className="text-left mb-8" style={{ listStyle: 'none' }}>
                                <li className="mb-3">✓ Up to 100 PRs/month</li>
                                <li className="mb-3">✓ All core analysis features</li>
                                <li className="mb-3">✓ Inline PR comments</li>
                                <li className="mb-3">✓ 5 connected repositories</li>
                                <li className="mb-3">✓ Email support</li>
                            </ul>
                            <button onClick={handleGetStarted} className="btn btn-secondary w-full">
                                Start Free Trial
                            </button>
                        </div>

                        <div className="card text-center p-8" style={{ position: 'relative', border: '2px solid var(--primary)' }}>
                            <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', padding: '4px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '600' }}>
                                POPULAR
                            </div>
                            <h3 className="mb-2">Professional</h3>
                            <div className="text-gradient font-bold my-6" style={{ fontSize: '3rem' }}>
                                $79<span className="text-secondary" style={{ fontSize: '1.2rem' }}>/mo</span>
                            </div>
                            <p className="text-secondary mb-6">Per developer</p>
                            <ul className="text-left mb-8" style={{ listStyle: 'none' }}>
                                <li className="mb-3">✓ Unlimited PRs</li>
                                <li className="mb-3">✓ Everything in Starter</li>
                                <li className="mb-3">✓ Auto-approve safe PRs</li>
                                <li className="mb-3">✓ Unlimited repositories</li>
                                <li className="mb-3">✓ Custom coding standards</li>
                                <li className="mb-3">✓ Team analytics</li>
                                <li className="mb-3">✓ Priority support</li>
                            </ul>
                            <button onClick={handleGetStarted} className="btn btn-primary w-full">
                                Start Free Trial
                            </button>
                        </div>

                        <div className="card text-center p-8">
                            <h3 className="mb-2">Enterprise</h3>
                            <div className="text-gradient font-bold my-6" style={{ fontSize: '3rem' }}>
                                Custom
                            </div>
                            <p className="text-secondary mb-6">For large teams</p>
                            <ul className="text-left mb-8" style={{ listStyle: 'none' }}>
                                <li className="mb-3">✓ Everything in Pro</li>
                                <li className="mb-3">✓ On-premise deployment</li>
                                <li className="mb-3">✓ Custom AI training</li>
                                <li className="mb-3">✓ SSO & advanced security</li>
                                <li className="mb-3">✓ Dedicated support</li>
                                <li className="mb-3">✓ SLA guarantees</li>
                            </ul>
                            <button onClick={handleGetStarted} className="btn btn-secondary w-full">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16">
                <div className="container text-center">
                    <h2 className="mb-6">Ready to Ship Better Code Faster?</h2>
                    <p className="text-secondary mb-8" style={{ fontSize: '1.2rem' }}>
                        Join hundreds of teams already using CodeReview AI
                    </p>
                    <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
                        🔗 Connect GitHub & Start Free Trial
                    </button>
                    <p className="text-muted mt-4">No credit card required • 14-day free trial • Cancel anytime</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8" style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                <div className="container text-center">
                    <p className="text-muted">© 2025 CodeReview AI • Helping developers ship better code</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
