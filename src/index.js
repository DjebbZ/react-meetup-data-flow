import React, {PropTypes} from "react"
import csp from "js-csp"
import {map, compose} from "transducers.js"
import "babel/polyfill"



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



///////////////////////////////////////
// Channel used to communicate input //
///////////////////////////////////////

// Individual operations as functions

function filterArtists(search) {
    // naive search
    return artists.filter((res) => res.name.indexOf(search) !== -1)
}

var eventToValue = map(e => e.target.value)
var trim = map(s => s.trim())
var searchToResults = map(s => filterArtists(s))

// Let's compose these operations
var searchArtists = compose(eventToValue, trim, searchToResults)

// Create a channel that automatically transfers search results
var chan = csp.chan(1, searchArtists, err => console.error("Transformation not OK", err))




/////////////////////////////////////////////////
// Main Search Component Wrapper               //
// Wraps stateless component and handles logic //
/////////////////////////////////////////////////

class SearchWrapper extends React.Component {
    constructor(props) {
        super(props)

        // couldn't figure a way to put them statically
        this.propTypes = {
            // didn't find the type of a channel :/
            chan: PropTypes.instanceOf(Object)
        }

        // Binding "this" is necessary
        this.changeHandler = this.changeHandler.bind(this)
    }

    render() {
        return (
            <SearchBox onChange={this.changeHandler} />
        )
    }


    changeHandler(e) {
        var _this = this;
        csp.go(function* () {
            console.log("Going to put event")
            yield csp.put(_this.props.chan, e)
            console.log("Put done !")
        })
    }
}



/////////////////////////
// SearchBox Component //
/////////////////////////

class SearchBox extends React.Component {
    constructor(props) {
        super(props)

        this.propTypes = {
            onChange: PropTypes.func.isRequired
        }
    }
    render() {
        return <input type="search" placeholder="Recherchez..." onChange={this.props.onChange} />
    }
}



/////////////////////////////
// SearchResults Component //
/////////////////////////////

class SearchResults extends React.Component {
    constructor(props) {
        super(props)

        this.propTypes = {
            results: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string,
                    birth: PropTypes.string
                })
            ).isRequired,
            chan: PropTypes.instanceOf(Object)
        }

        this.state = {
            results: this.props.results
        }
    }

    render() {
        return (
            <ul>
                {this.state.results.map((item) => <SearchResultItem key={item.name} item={item} />)}
            </ul>
        )
    }

    componentDidMount() {
        var _this = this;
        csp.go(function* () {
            while (true) {
                console.log("entering go routine")
                var results = yield csp.take(_this.props.chan)
                console.log("took from chan", results)
                _this.setState({results: results})
            }
        })
    }
}



////////////////////////////////
// SearchResultItem Component //
////////////////////////////////

class SearchResultItem extends React.Component {
    constructor(props) {
        super(props)

        this.propTypes = {
            item: PropTypes.shape({
                name: PropTypes.string,
                birth: PropTypes.string
            }).isRequired
        }
    }
    render() {
        var {name, birth} = this.props.item
        return <li>{name}, born in {birth}</li>
    }
}



React.render(
    <SearchWrapper chan={chan} />,
    document.getElementById('search')
)

React.render(
    <SearchResults results={artists} chan={chan}/>,
    document.getElementById('results')
)
