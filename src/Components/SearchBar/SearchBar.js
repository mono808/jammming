import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            term: localStorage.getItem('myTerm') || ''
        }
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search() {
        this.props.onSearch(this.state.term)
    }

    handleTermChange (event) {
        const val = event.target.value;
        if(typeof(val) === 'string') {
            localStorage.setItem('myTerm', val);
            this.setState({
                term: val
            })
        }
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter artist,track or album" value={this.state.term} id="" type="text" onChange={this.handleTermChange} />
                <button className="SearchButton" onClick={this.search} >SEARCH</button>
            </div>
        )
    };
}

export default SearchBar;