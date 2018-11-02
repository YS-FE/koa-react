import React from 'react';
import {getTheater} from '../../../api';
import './index.scss';

export default class Theater extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      movies: []
    };

    getTheater().then( data => {
      this.setState({
        movies: data.subjects
      });
    });
  }


  render() {
    return (
      <div className="theater-movies">
        {
          this.state.movies.map((movie, index) => {
            return (
              <div className="movie-item" key={index}>
                <div className="movie-item-inner">
                  <img src={movie.images.medium} alt=""/>
                </div>
              </div>
            )
          })
        }
      </div>
    );
  }
}
