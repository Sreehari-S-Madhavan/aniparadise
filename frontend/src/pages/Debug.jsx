
import React from 'react';
import PageTransition from '../components/PageTransition';

export default function Debug() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const nodeEnv = import.meta.env.MODE;

    return (
        <PageTransition>
            <div style={{ padding: '100px 20px', color: '#fff', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--color-primary)' }}>🛠️ Deployment Debug</h1>
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '20px',
                    borderRadius: '12px',
                    maxWidth: '600px',
                    margin: '40px auto',
                    textAlign: 'left',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <p><strong>VITE_API_URL:</strong> <code style={{ color: apiUrl?.includes('localhost') ? '#ff4d4d' : '#4dff88' }}>{apiUrl || 'NOT SET (Defaults to localhost:3001)'}</code></p>
                    <p><strong>Environment Mode:</strong> <code>{nodeEnv}</code></p>

                    <hr style={{ opacity: 0.1, margin: '20px 0' }} />

                    <h3>Troubleshooting:</h3>
                    {(!apiUrl || apiUrl.includes('localhost')) ? (
                        <div style={{ color: '#ffb3b3' }}>
                            <p>❌ <strong>Issue:</strong> Your frontend is built with LOCALHOST.</p>
                            <p>✅ <strong>Fix:</strong> You must add <code>VITE_API_URL</code> to Vercel and <strong>REDEPLOY</strong>.</p>
                        </div>
                    ) : (
                        <div style={{ color: '#b3ffb3' }}>
                            <p>✅ <strong>API URL is set correctly.</strong></p>
                            <p>If you still see "Failed to Fetch", check your <strong>Render Dashboard</strong> for <strong>CORS</strong> errors or if the backend service is active.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
