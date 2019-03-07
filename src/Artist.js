import React, { Component } from 'react';

class Artist extends Component {
    constructor(props) {
      super(props);
      this.state = {
        artist: this.props.location.state.artist,
        password: '',
        signed_in: false
      }
    }

    render() {
        return (<div>{this.state.artist}</div>);

    }

}

export default Artist;