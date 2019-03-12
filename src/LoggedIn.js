import React, { Component } from 'react';
import logo from './logo.svg';
import firebase from './firebase.js';
import axios from 'axios'
import './App.css';

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
    axios.get('http://ec2-184-73-40-153.compute-1.amazonaws.com:9292/')
      .then(response => this.setState({songList: response.data, loaded: true}));
    axios.get('http://ec2-184-73-40-153.compute-1.amazonaws.com:9292/genres')
      .then(response => this.setState({genreList: response.data, loaded: true}))
      .then(
      console.log(this.currentUser)
    )
    fetch('http://ec2-184-73-40-153.compute-1.amazonaws.com:9292/save-user', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: this.currentUser.name,
        userId: this.currentUser.uid,
        userEmail: this.currentUser.email
      })
    })
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
    axios.get(`http://ec2-184-73-40-153.compute-1.amazonaws.com:9292/artist/by/genre?genre=${object.genre}`)
      .then(response => {
        this.setState({currentGenre: object.genre, artistList: response.data, artistsLoaded: true});
        console.log(this.state.artistList)
        })
      
    
  }
  redirectArtist = (object) => {
    this.props.history.push({
      pathname: '/Artist',
      state: {
        genre: this.state.currentGenre,
        artist: object.artist,
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
        
        <div>
        <table id ="notes-table" className="table table-striped table-dark">
          <thead>
            <tr>
              <th scope="col">Index</th>
              <th scope="col">Genre</th>
            </tr>
          </thead>
          {this.state.loaded ? this.renderGenres() : null}
        </table>
          {this.state.loaded ? this.renderArtists() : null}
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
      <table id ="artists-table" className="table table-striped table-dark">

              <thead>
                <tr>
                  <th scope="col">{this.state.currentGenre}</th>
                </tr>
              </thead>
      <tbody>
      {
        artistList.map(function(object,index) {
          return (
              <tr value={object} onClick={() => this.redirectArtist(object)}>
                <td>{object.artist}</td>
                
              </tr>
          )
        }, this)
      }
    </tbody>
    </table>
    )
  }
}

export default LoggedIn;
