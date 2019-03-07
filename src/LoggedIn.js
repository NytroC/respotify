import React, { Component } from 'react';
import logo from './logo.svg';
import firebase from './firebase.js';
import './App.css';
import axios from 'axios'

class LoggedIn extends Component {
  constructor(props) {
    super(props);
    const user = firebase.auth().currentUser;
    this.currentUser = {};

     if (user != null) {
       this.currentUser.name = user.displayName;
       this.currentUser.email = user.email;
       this.currentUser.photoUrl = user.photoURL;
       this.currentUser.emailVerified = user.emailVerified;
       this.currentUser.uid = user.uid;
     }
    
    this.state = {
      loaded: false,
      artistsLoaded: false,
      songList: [],
      currrentArtist: "",
      currentSong: "",
      currentGenre:"",
      genreList:[],
      artistList: [],
      buttonState: "btn _play",
      currentSongUrl: "http://www.nihilus.net/soundtracks/Static%20Memories.mp3"

    };
  }
  componentDidMount() {
    axios.get('http://ec2-54-152-183-53.compute-1.amazonaws.com:9292/')
      .then(response => this.setState({songList: response.data, loaded: true}));
    axios.get('http://ec2-54-152-183-53.compute-1.amazonaws.com:9292/genres')
      .then(response => this.setState({genreList: response.data, loaded: true}));
    axios.post('http://ec2-54-152-183-53.compute-1.amazonaws.com:9292/save-user', {
      userName: this.currentUser.name,
      userId: this.currentUser.uid,
      userEmail: this.currentUser.email
    }).then(
      console.log(this.currentUser)
    )
  }
  setSong = (object) =>{
    this.setState({
      currentSong: object.song,
      currrentArtist: object.artist,
      currentSongUrl: object.url,
      buttonState: "btn _play"
    });
  }
  setGenre = (object) =>{
    axios.get(`http://ec2-54-152-183-53.compute-1.amazonaws.com:9292/artist/by/genre?genre=${object.genre}`)
      .then(response => {
        this.setState({currentGenre: object.genre, artistList: response.data, artistsLoaded: true});
        console.log(this.state.artistList)
        })
      
    
  }
  redirectArtist = (object) => {
    this.props.history.push({
      pathname: '/Artist',
      state: {
        artist: object.artist,
        color: 'green'
      }
    })
  }
  play = () => {
    if (this.refs.player.duration > 0 && !this.refs.player.paused) {
      this.refs.player.pause();
      this.setState({buttonState: "btn _play"})
    } else {
      this.refs.player.play();
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
              <p>{this.state.currrentArtist}</p>
            </div>
          </div>
          <div class="main-control">
            <audio src={this.state.currentSongUrl} ref="player" >
            </audio>
            <div class="btn _previous" >
            </div>
            <div class={this.state.buttonState} onClick={this.play}>
            </div>
            <div class="btn _next">
            </div>
            <div class="btn _timeline">
              <span class="current-time">1:32</span>
              <span class="timescope">
                <span class="timescope-dot"></span>
              </span>
              <span class="end-time">4:00</span>
            </div>
          </div>
        </div>
        <div>
        <table id ="notes-table" className="table table-striped table-dark">
          <thead>
            <tr>
              <th scope="col">Index</th>
              <th scope="col">Artist</th>
              <th scope="col">Album</th>
              <th scope="col">Song</th>
            </tr>
          </thead>
          {this.state.loaded ? this.renderGenres() : null}
          </table>
          <table id ="artists-table" className="table table-striped table-dark">
  
          {this.state.loaded ? this.renderArtists() : null}
          </table>
        </div>
      </div>
    );
  }

  renderGenres = () => {
    const {genreList} = this.state;

    return (
      <tbody>
      {
        genreList.map(function(object,index) {
          return (
              <tr value={object} onClick={() => this.setGenre(object)}>
                <td>{index + 1}</td>
                <td>{object.genre}</td>
                
              </tr>
          )
        }, this)
      }
    </tbody>
    )
  }

  renderArtists = () => {
    const {artistList} = this.state;

    return (
      <tbody>
      {
        artistList.map(function(object,index) {
          return (
              <tr value={object} onClick={() => this.redirectArtist(object)}>
                <td>{index + 1}</td>
                <td>{object.artist}</td>
                
              </tr>
          )
        }, this)
      }
    </tbody>
    )
  }
}

export default LoggedIn;
