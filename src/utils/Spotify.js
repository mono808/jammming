let accessToken;
let userId;
const redirectURI = 'http://localhost:3000';
//let redirectURI = 'https://monojammming.surge.sh';
const clientId = '460c145073f640c5be9bb368c9a690bb';



const Spotify = {
    getAccessToken () {
        if(accessToken) {
            console.log('accessToken: ' + accessToken);
            return accessToken;
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            console.log('extract accessToken from url');
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //this cleares the parameters allowing us to grab a new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            console.log('accessToken: ' + accessToken);
            return accessToken;
        }
        
        if(!accessToken) {
            console.log('accessToken not set, redirecting to authorize url');
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },
    getCurrentUserId() {
        this.getAccessToken();
        if(!accessToken) return;
        if(userId) {
            console.log('userId: '+ userId);
            return new Promise((resolve,reject)=> {
                resolve(userId);
            })
        }

        let headers = {
            Authorization: `Bearer ${accessToken}`
        };

        return fetch('https://api.spotify.com/v1/me',{headers: headers}
        )
        .then(response => response.json())
        .then(data => {
            // console.log('userId response');
            // console.log(data);
            userId = data.id;
            console.log('userId: '+ userId);
            return userId;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    },
    
    search (term) {
        this.getAccessToken();
        if(!accessToken) return;

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        .then(response => {
            if (!response.ok) {
                throw new Error('Search response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data.tracks.items.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist : track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                    preview_url: track.preview_url
                }
            })
        })
        .catch((error) => {
            console.error('There has been a problem with your search fetch:', error);
        });
    },

    savePlaylist(playlistName, trackURIs) {
        if(!playlistName || !trackURIs) return;
        let headers = {
            Authorization: `Bearer ${accessToken}`
        };
        //if(!accessToken) this.getAccessToken();
        this.getCurrentUserId()
        // create playlist on spotify -> returns playlistId
        .then(userId => {
            headers['Content-Type'] = 'application/json';
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        name: playlistName
                    })
                }   
            )
        })
        .then(response => response.json())
        .then((data) => {
            let playlistId = data.id;
            return playlistId;
        })
        // add tracks to playlist
        .then(playlistId => {
            return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    uris: trackURIs
                })
            }
            )
        })
        .then(response => response.json())
        .then(data => {
            console.log('playlist add tracks response:');
            console.log(data);
        })
    },

    getUserPlaylists: async function () {
        let userId = await this.getCurrentUserId();
        let response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        console.log(response);
        let data = await response.json();
        let playlists = data.items.map(playlist => {
            return {
                id: playlist.id,
                name: playlist.name,
                uri: playlist.uri
            }
        })
        console.log(playlists);
        return playlists;
    }
};

export default Spotify;