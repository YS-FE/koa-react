import React from 'react';
import {searchMovie} from '../../../api'
import './index.scss'


export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      movies: []
    };
    this.input = React.createRef();
    this.startSearch = this.startSearch.bind(this);
  }

  startSearch() {
    let value = this.input.current.value.trim();
    searchMovie(value).then(data => {
      this.setState({
        movies: data.subjects
      })
    });
  }

  render () {
    return (
      <div className="search-movies">
        <div className="search-input">
          <input ref={this.input} type="text"/>
          <button onClick={this.startSearch}>搜索</button>
        </div>

        <div className="search-content">
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
      </div>
    )
  }
}