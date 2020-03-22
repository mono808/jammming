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
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //this cleares the parameters allowing us to grab a new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            console.log('accessToken: ' + accessToken);
            return accessToken;
        }
        
        if(!accessToken) {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessUrl;
        }
    },
    getCurrentUserId() {
        if(!accessToken) this.getAccessToken();
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
    }
    
    search (term) {
        if(!accessToken) this.getAccessToken();

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
        .then(jsonResponse => {
            console.log(jsonResponse);
            return jsonResponse.tracks.items.map(track => {
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
    getUserPlaylists() {
        this.getCurrentUserId();
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        .then(response => response.json())
        .then((data) => {
            let playlists = data.items.map(playlist => {
                return {
                    id: playlist.id,
                    name: playlist.name,
                    uri: playlist.uri
                }
            })
            console.log(playlists);
            return playlists;
        })
        .catch((error) => {
            console.error('problem while getting user playlists', error);
            return [{id:2342342342,name:'init playlist',uri:'asdflkjaslkdf'}];
        })
    },
};

export default Spotify;