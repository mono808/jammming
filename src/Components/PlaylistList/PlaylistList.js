import React from 'react';
import './PlaylistList.css';
// import Spotify from '../../utils/Spotify';

class PlaylistList extends React.Component {

    componentDidMount () {
        this.props.getUserPlaylists();
    }

    componentDidUpdate () {
        this.props.getUserPlaylists();
    }

    render () {
        return (
            <div className="PlaylistList">
                <h2>My Playlists</h2>
                {this.props.playlists.map(playlist => {
                    return <h3 key={playlist.id} className="playlist-entry">{playlist.name}</h3>
                })}
            </div>
        );
    }
}

export default PlaylistList;