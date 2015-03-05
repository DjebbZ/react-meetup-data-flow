import React from "react"
import {EventEmitter} from "events"



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



///////////////////////////////////////////////////////
// Communication between non parent-child components //
///////////////////////////////////////////////////////

var bus = new EventEmitter()



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
            ).isRequired,
            bus: React.PropTypes.instanceOf(EventEmitter)
        }

        // Binding "this" is necessary
        this.changeHandler = this.changeHandler.bind(this)
    }

    render() {
        return (
            <SearchBox query={this.state.query} onChange={this.changeHandler} />
        )
    }

    filterResults() {
        // naive search
        return this.props.list.filter((res) => res.name.indexOf(this.state.query) !== -1)
    }

    changeHandler(e) {
        this.setState({query: e.target.value}, () => {
            this.props.bus.emit("results", this.filterResults())
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
            ).isRequired,
            bus: React.PropTypes.instanceOf(EventEmitter)
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
        if (typeof this.props.bus !== "undefined") {
            this.props.bus.on("results", (results) => {
                this.setState({results: results})
            })
        }
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
    <SearchWrapper list={artists} bus={bus} />,
    document.getElementById('search')
)

React.render(
    <SearchResults results={artists} bus={bus} />,
    document.getElementById('results')
)
