import 'dotenv/config';
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(join(__dirname, "public")));

// ─── Spotify Integration ──────────────────────────────────────────────────────

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

async function getSpotifyAccessToken() {
    const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: SPOTIFY_REFRESH_TOKEN,
        }),
    });
    const { access_token } = await res.json();
    return access_token;
}

// Step 1 — visit /api/spotify/login to authorize your Spotify account (one-time setup)
app.get('/api/spotify/login', (_req, res) => {
    if (!SPOTIFY_CLIENT_ID) return res.send('Set SPOTIFY_CLIENT_ID in .env first.');
    const scope = 'user-read-currently-playing user-read-playback-state';
    const redirectUri = `http://127.0.0.1:${port}/api/spotify/callback`;
    res.redirect(
        'https://accounts.spotify.com/authorize' +
        `?response_type=code&client_id=${SPOTIFY_CLIENT_ID}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}`
    );
});

// Step 2 — Spotify redirects here; displays your refresh token to copy into .env
app.get('/api/spotify/callback', async (req, res) => {
    const { code } = req.query;
    const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
    const redirectUri = `http://127.0.0.1:${port}/api/spotify/callback`;
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
        }),
    });
    const data = await tokenRes.json();
    res.send(
        `<html><body style="font-family:monospace;padding:2rem;background:#0a0a0a;color:#e4e4e7">` +
        `<h2 style="color:#22c55e">✓ Authorized!</h2>` +
        `<p>Add this line to your <code style="color:#a3a3a3">.env</code> file:</p>` +
        `<pre style="background:#18181b;padding:1.2rem;border-radius:10px;color:#3b82f6;border:1px solid #27272a">` +
        `SPOTIFY_REFRESH_TOKEN=${data.refresh_token}</pre>` +
        `<p style="color:#71717a;font-size:0.85rem">Then restart the server — your Now Playing widget will appear automatically.</p>` +
        `</body></html>`
    );
});

// Polled by the frontend widget every 30 seconds
app.get('/api/now-playing', async (_req, res) => {
    if (!SPOTIFY_REFRESH_TOKEN) return res.json({ isPlaying: false });
    try {
        const accessToken = await getSpotifyAccessToken();
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.status === 204 || response.status >= 400) return res.json({ isPlaying: false });
        const song = await response.json();
        if (!song?.item) return res.json({ isPlaying: false });
        res.json({
            isPlaying: song.is_playing,
            title: song.item.name,
            artist: song.item.artists.map(a => a.name).join(', '),
            albumArt: song.item.album.images[1]?.url ?? song.item.album.images[0]?.url,
            previewUrl: song.item.preview_url,
            trackUrl: song.item.external_urls.spotify,
            progressMs: song.progress_ms,
            durationMs: song.item.duration_ms,
        });
    } catch {
        res.json({ isPlaying: false });
    }
});

// ─────────────────────────────────────────────────────────────────────────────

app.listen(port, () => {
    console.log(`Portfolio running → http://localhost:${port}`);
});
