const clientId = 'Your_Spotify_ClientId'; // Pls replace with your Spotify Client ID
const clientSecret = 'Your_Spotify_ClientSecret'; // pls replace with your Spotify Client Secret
let accessToken = '';

document.getElementById('recommend-button').addEventListener('click', () => {
    const songInput = document.getElementById('song-input').value;
    getRecommendations(songInput);
});

async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    accessToken = data.access_token;
}

async function searchSong(query) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    const data = await response.json();
    return data.tracks.items[0];
}

async function getRecommendations(songName) {
    if (!accessToken) {
        await getAccessToken();
    }
    const song = await searchSong(songName);
    if (!song) {
        alert('Song not found');
        return;
    }
    const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${song.id}&limit=10`, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    const data = await response.json();
    displayRecommendations(data.tracks);
}

function displayRecommendations(tracks) {
    const recommendationsContainer = document.getElementById('recommendations');
    recommendationsContainer.innerHTML = '';
    tracks.forEach(track => {
        const recommendationDiv = document.createElement('div');
        recommendationDiv.classList.add('recommendation');
        recommendationDiv.innerHTML = `<strong>${track.name}</strong> by ${track.artists.map(artist => artist.name).join(', ')}`;
        recommendationsContainer.appendChild(recommendationDiv);
    });
}
