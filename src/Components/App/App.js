import React from 'react';
//import logo from './logo.svg';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../utils/Spotify';
import PlaylistList from '../PlaylistList/PlaylistList';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      searchTerm: 'Enter song, album or artist',
      searchResults: [],
      playlistName: 'monos tracks',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  handleTermChange(newTerm) {
    if(newTerm !== this.state.searchTerm) {
      this.setState({
        searchTerm: newTerm
      })
    }
  }

  search(term) {
    Spotify.search(term)
    .then(searchResults => {
      console.log(searchResults);
      this.setState({
        searchResults: searchResults
      });
    })
  }

  savePlaylist () {
    const trackURIs = this.state.playlistTracks.map(track => {
      return track.uri
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    })
  }

  findTrackInPlaylist (newTrack) {
    return this.state.playlistTracks.findIndex(track => track.id === newTrack.id)
  }

  addTrack (newTrack) {
    if(this.findTrackInPlaylist(newTrack) === -1) {
      this.setState(state => {
        const newPlaylistTracks = state.playlistTracks.concat(newTrack);
        return {
          playlistTracks: newPlaylistTracks
        }
      })
    }
  }

  removeTrack (rmTrack) {
    const index = this.findTrackInPlaylist(rmTrack);
    if(index >= 0) {
      this.setState(state => {
        const part1 = state.playlistTracks.slice(0,index);
        const part2 = state.playlistTracks.slice(index+1);
        const newPlaylistTracks = part1.concat(part2);
        return {
          playlistTracks: newPlaylistTracks
        }
      })
    }
  }

  updatePlaylistName (newName) {
    if(newName !== this.state.playlistName) {
      this.setState({
        playlistName: newName
      })
    }
  }

  render () {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
              onAdd={this.addTrack} />
            <Playlist playlistTracks={this.state.playlistTracks}
              playlistName={this.state.playlistName}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}/>
          </div>
          <PlaylistList />
        </div>
      </div>
    );
  }
}

export default App;
