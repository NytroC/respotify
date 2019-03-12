import React, { Component } from 'react';
import axios from 'axios'
import './Artist.css';

class Artist extends Component {
    constructor(props) {
      super(props);
      this.state = {
        artist: this.props.location.state.artist,
        albumList:[],
        albumsLoaded: false,
        currentAlbum: "",
        songList: [],
        currentSong: "",
        songsLoaded: false,
        currentSong: "",
        currentSongUrl: "",
        buttonState: "btn _play"
      }
    }
    componentDidMount() {
      axios.get(`http://ec2-184-73-40-153.compute-1.amazonaws.com:9292/albums/for/artist?artist=${this.state.artist}`)
        .then(response => {this.setState({albumList: response.data.map(function(object){ return object.album}), albumsLoaded: true})})
      
    }
    setSong = (song) => {
      axios.get(`http://ec2-184-73-40-153.compute-1.amazonaws.com:9292/song?song=${song}`)
        .then(response => {this.setState({
          currentSong: song,
          currentSongUrl: response.data.url,
          buttonState: "btn _play"
        });
        console.log(response);
      })
    }
    getSongs = (album) => {
      axios.get(`http://ec2-184-73-40-153.compute-1.amazonaws.com:9292/songs/for/album?album=${album}`)
        .then(response => {this.setState({songList: response.data.map(function(object){ return object.song}), songsLoaded: true, currentAlbum: album})})
    }

    renderAlbums = () => {
      const {albumList} = this.state;
      console.log(albumList)
      return (
        <div>
          <table id ="albums-table" className="table table-striped table-dark">
    
                  <thead>
                    <tr>
                      <th scope="col">{this.state.artist}</th>
                    </tr>
                  </thead>
          <tbody>
          {
            albumList.map(function(object,index) {
              return (
                  <tr value={object} onClick={() => this.getSongs(object)}>
                    <td>{object}</td>
                    
                  </tr>
              )
            }, this)
          }
        </tbody>
        </table>
        </div>
      )
    }

    renderSongs = () => {
      const {songList} = this.state;
      console.log(songList)
      return (
        <div>
          <table id ="songs-table" className="table table-striped table-dark">
    
                  <thead>
                    <tr>
                      <th scope="col">{this.state.currentAlbum}</th>
                    </tr>
                  </thead>
          <tbody>
          {
            songList.map(function(object,index) {
              return (
                  <tr value={object} onClick={() => this.setSong(object)}>
                    <td>{object}</td>
                    
                  </tr>
              )
            }, this)
          }
        </tbody>
        </table>
        </div>
      )
    }

    play = () => {
      if (this.refs.player.duration > 0 && !this.refs.player.paused) {
        this.refs.player.pause();
        this.setState({buttonState: "btn _play"})
      } else {
        this.refs.player.play();
        fetch('http://ec2-184-73-40-153.compute-1.amazonaws.com:9292/play', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            artist: this.state.artist,
            album: this.state.currentAlbum,
            song: this.state.currentSong
          })
        });
        this.setState({buttonState: "btn _pause"})
      }
    }

    render() {
        return (
        <div class="music-player">
          <div class="player-main">
            <div class="main-current">
              <div class="current-info">
                <h1>{this.state.currentSong}</h1>
                <p>{this.state.artist}</p>
              </div>
            </div>
            <div class="main-control">
              <div class="btn _previous">
              </div>
              <div class={this.state.buttonState} onClick={() => this.play()}>
              </div>
              <audio ref="player" src={this.state.currentSongUrl}></audio>
              <div class="btn _next">
              </div>
              <div class="btn _timeline">
                <span class="current-time">2:32</span>
                <span class="timescope">
                  <span class="timescope-dot"></span>
                </span>
                <span class="end-time">4:00</span>
              </div>
            </div>
          </div>
          {this.state.albumsLoaded ? this.renderAlbums() : null}
          {this.state.songsLoaded ? this.renderSongs() : null}
        </div>);

    }

}

export default Artist;