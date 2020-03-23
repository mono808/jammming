import React from 'react';
import './PlaylistList.css';
import Spotify from '../../utils/Spotify';

class PlaylistList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playlists: [{
                id:1234,
                name: 'init playlist',
                uri: 'asdfaslkdjf'
            }]
        }
    }
    componentDidMount () {
        Spotify.getUserPlaylists()
        .then(playlists => {
            this.setState({
                playlists: playlists
            })
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    render () {
        return (
            <div className="PlaylistList">
                <h2>My Playlists</h2>
                {this.state.playlists.map(playlist => {
                    return <h3 key={playlist.id} className="playlist-entry">{playlist.name}</h3>
                })}
            </div>
        );
    }
}

export default PlaylistList;