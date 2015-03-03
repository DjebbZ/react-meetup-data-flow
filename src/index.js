import React from "react";



//////////////////////////////////
// Data used in the application //
//////////////////////////////////

var artists = [{
    name: "Georges Brassens",
    birth: "1921"
}, {
    name: "Jimi Hendrix",
    birth: "1942"
}, {
    name: "Wolfgang Amadeus Mozart",
    birth: "1756"
}]



/////////////////////////////////////////////////
// Main Search Component Wrapper               //
// Wraps stateless component and handles logic //
/////////////////////////////////////////////////

class SearchWrapper extends React.Component {
    constructor(props) {
        super(props)
        this.state = {query: ""}

        // couldn't figure a way to put them statically
        this.propTypes = {
            list: React.PropTypes.arrayOf(
                React.PropTypes.shape({
                    name: React.PropTypes.string,
                    birth: React.PropTypes.string
                })
            ).isRequired
        }

        // Binding "this" is necessary
        this.changeHandler = this.changeHandler.bind(this)
    }

    render() {
        // naive search
        var results = this.props.list.filter((res) => res.name.indexOf(this.state.query) !== -1)

        return (
            <Search query={this.state.query} onChange={this.changeHandler} results={results} />
        )
    }

    changeHandler(e) {
        this.setState({query: e.target.value})
    }
}



///////////////////////////////////////////////////////////////
// Main Search Component                                     //
// Displays a search box and a filtered list of results      //
///////////////////////////////////////////////////////////////

class Search extends React.Component {
    constructor(props) {
        super(props)

        // couldn't figure a way to put them statically
        this.propTypes = {
            results: React.PropTypes.arrayOf(
                React.PropTypes.shape({
                    name: React.PropTypes.string,
                    birth: React.PropTypes.string
                })
            ).isRequired,
            query: React.PropTypes.string.isRequired,
            onChange: React.PropTypes.func.isRequired
        }
    }

    render() {
        var {query, onChange, results} = this.props
        return (
            <div>
                <SearchBox query={query} onChange={onChange} />
                <SearchResults results={results} />
            </div>
        )
    }

    shouldComponentUpdate(nextProps) {
        return this.props.query !== nextProps.query || this.props.results.length !== nextProps.results.length
    }
}



/////////////////////////
// SearchBox Component //
/////////////////////////

class SearchBox extends React.Component {
    constructor(props) {
        super(props)

        this.propTypes = {
            query: React.PropTypes.string.isRequired,
            onChange: React.PropTypes.func.isRequired
        }
    }
    render() {
        return <input type="search" value={this.props.query} placeholder="Recherchez..." onChange={this.props.onChange} />
    }
}



/////////////////////////////
// SearchResults Component //
/////////////////////////////

class SearchResults extends React.Component {
    constructor(props) {
        super(props)

        this.propTypes = {
            results: React.PropTypes.arrayOf(
                React.PropTypes.shape({
                    name: React.PropTypes.string,
                    birth: React.PropTypes.string
                })
            ).isRequired
        }
    }
    render() {
        return (
            <ul>
                {this.props.results.map((item) => <SearchResultItem key={item.name} item={item} />)}
            </ul>
        )
    }
}



////////////////////////////////
// SearchResultItem Component //
////////////////////////////////

class SearchResultItem extends React.Component {
    constructor(props) {
        super(props)

        this.propTypes = {
            item: React.PropTypes.shape({
                name: React.PropTypes.string,
                birth: React.PropTypes.string
            }).isRequired
        }
    }
    render() {
        var {name, birth} = this.props.item
        return <li>{name}, born in {birth}</li>
    }
}



React.render(
    <SearchWrapper list={artists} />,
    document.body
)
