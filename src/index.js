import React from "react"
import {EventEmitter} from "events"
import {Dispatcher} from "flux"
import assign from "object-assign"



///////////////////////////////////////////////////////
// Flux Dispatcher                                        //
// Create a singleton Dispatcher                     //
// (should be in its own module, being lazy here...) //
///////////////////////////////////////////////////////

var AppDispatcher = new Dispatcher();



////////////////
// Flux Store //
////////////////

var Store = (() => {
    var originalArtists = [{
        name: "Georges Brassens",
        birth: "1921"
    }, {
        name: "Jimi Hendrix",
        birth: "1942"
    }, {
        name: "Wolfgang Amadeus Mozart",
        birth: "1756"
    }]

    var displayArtists = originalArtists // slice ?

    function filter(query) {
        displayArtists = originalArtists.filter((artist) => artist.name.indexOf(query) !== -1)
    }

    var Store = assign({}, EventEmitter.prototype, {

        getArtists() { return displayArtists },

        emitChange() { this.emit("filter") },

        addFilterListener(callback) { this.on("filter", callback) },

        removeFilterListener(callback) { this.removeListener("filter", callback) }
    })

    AppDispatcher.register((action) => {
        switch(action.actionType) {
            case "FILTER":
                filter(action.query)
                Store.emitChange()
                break

            default: break
        }
    })

    return Store
})()



//////////////////
// Flux Actions //
//////////////////

var Actions = {
    filter: (query) => AppDispatcher.dispatch({
        action: "FILTER",
        query: query
    })
}

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

        // Binding "this" is necessary
        this.changeHandler = this.changeHandler.bind(this)
    }

    render() {
        return (
            <SearchBox onChange={this.changeHandler} />
        )
    }

    changeHandler(e) {
        Actions.filter(e.target.value)
    }
}



/////////////////////////
// SearchBox Component //
/////////////////////////

class SearchBox extends React.Component {
    constructor(props) {
        super(props)

        this.propTypes = {
            onChange: React.PropTypes.func.isRequired
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

        this.state = this.getState()

        this.changeHandler = this.changeHandler.bind(this)
        this.getState = this.getState.bind(this)
    }

    render() {
        return (
            <ul>
                {this.state.results.map((item) => <SearchResultItem key={item.name} item={item} />)}
            </ul>
        )
    }

    componentDidMount() {
        Store.addFilterListener(this.changeHandler)
    }

    componentWillUnmount() {
        Store.removeFilterListener(this.changeHandler)
    }

    getState() {
        return {
            results: Store.getArtists()
        }
    }

    changeHandler() {
        this.setState(this.getState())
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
    <SearchWrapper />,
    document.getElementById('search')
)

React.render(
    <SearchResults />,
    document.getElementById('results')
)
