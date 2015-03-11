import React from "react"
import Kefir from "kefir"



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

var inputStream = Kefir.emitter()

var resultsStream = inputStream
                        .map(e => e.target.value)
                        .skipDuplicates()
                        .map(v => {
                            return artists.filter(artist => artist.name.indexOf(v) !== -1)
                        })
                        .toProperty(artists)



/////////////////////////
// SearchBox Component //
/////////////////////////

class SearchBox extends React.Component {
    constructor(props) {
        super(props)

        // couldn't figure a way to put them statically
        this.propTypes = {
            inputStream: React.PropTypes.instanceOf(Kefir.Emitter)
        }
    }
    render() {
        return <input type="search"
                      placeholder="Recherchez..."
                      onChange={e => this.props.inputStream.emit(e)} />
    }
}



/////////////////////////////
// SearchResults Component //
/////////////////////////////

class SearchResults extends React.Component {
    constructor(props) {
        super(props)

        this.propTypes = {
            resultsStream: React.PropTypes.instanceOf(Kefir.Emitter)
        }
    }

    render() {
        return (
            <ul>
                {this.state.results.map(item => <SearchResultItem key={item.name} item={item} />)}
            </ul>
        )
    }

    componentWillMount() {
        this.props.resultsStream.onValue(results => this.setState({results: results}))
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
    <SearchBox inputStream={inputStream} />,
    document.getElementById('search')
)

React.render(
    <SearchResults resultsStream={resultsStream} />,
    document.getElementById('results')
)
