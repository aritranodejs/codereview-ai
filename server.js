// Simple Express server to handle GitHub OAuth
// This is required because the client secret must NEVER be exposed in the browser

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const CLIENT_ID = 'Ov23liylcmDUvrOceFcF';
const CLIENT_SECRET = '581e23ae7ed6196988b27a543ce7d366bf64e5fe';

// Exchange OAuth code for access token
app.post('/auth/github/callback', async (req, res) => {
    const { code } = req.body;

    try {
        // Exchange code for access token
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
            }),
        });

        const data = await response.json();

        if (data.access_token) {
            res.json({ access_token: data.access_token });
        } else {
            res.status(400).json({ error: 'Failed to get access token', details: data });
        }
    } catch (error) {
        console.error('OAuth error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 OAuth server running on http://localhost:${PORT}`);
});
