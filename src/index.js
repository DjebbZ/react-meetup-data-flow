import React from "react"
import immstruct from "immstruct"
import component from "omniscient"



// omniscient returns its own Component object by default instead of a React.Element,
// with a JSX version accessible at Component.jsx
// Defaulting to JSX so that we write normal JSX code
component = component.withDefaults({ jsx: true })



//////////////////////////////////////////////////////////////////////
// Data used in the application                                     //
// Looks like normal JS data, but is immutable and provides cursors //
//////////////////////////////////////////////////////////////////////

var data = immstruct({
    search: "",
    artists: [{
        name: "Georges Brassens",
        birth: "1921"
    }, {
        name: "Jimi Hendrix",
        birth: "1942"
    }, {
        name: "Wolfgang Amadeus Mozart",
        birth: "1756"
    }]
})



/////////////////////////////////////////////////////////////////////////////
// Smart wrapper that does all the cursor related manipulation             //
// Updating the cursor is like updating the global data structure directly //
/////////////////////////////////////////////////////////////////////////////

var SearchBoxWrapper = component("SearchBoxWrapper", ({cursor}) => {
    console.log("rendering SearchBoxWrapper")

    function changeHandler(e) {
        console.log("Input changed !")
        cursor.update( _ => e.target.value)
    }

    return <SearchBox search={cursor.deref()} changeHandler={changeHandler} />
})



////////////////////////////////////////////////////////////////////////////////////
// Dumb Component (displays props and handle events via parent's handlers)        //
// Notice that we can use a normal React component inside an Omniscient component //
////////////////////////////////////////////////////////////////////////////////////

var SearchBox = React.createClass({
    render: function() {
        console.log("rendering SearchBox")

        var {search, changeHandler} = this.props

        return (
            <input type="search" value={search} placeholder="Recherchez..."
               onChange={changeHandler} />
        )
    }
})



//////////////////////////////////////////////////////////////
// Smart wrapper that retrieves and filter the artists list //
//////////////////////////////////////////////////////////////

var SearchResultsWrapper = component("SearchResultsWrapper", ({cursor}) => {
    console.log("rendering SearchResultsWrapper")

    // Retrieve search input
    var search = cursor.get("search")

    // Filter artists
    // The immstruct data structure holds Immutable.js data structure,
    // so we need to use its API to get the data
    var results = cursor.get("artists").filter( artist => {
        return artist.get("name").indexOf(search) !== -1
    }).toJS()

    return (
        <SearchResults results={results} />
    )
})



////////////////////////////////////////////////////////////////////////////////////////////
// Dumb Component too                                                                     //
// Written using Omniscient API instead of raw React, just to demonstrate the possibility //
////////////////////////////////////////////////////////////////////////////////////////////

var SearchResults = component("SearchResults", ({results}) => {
    console.log("rendering SearchResults")

    return (
        <ul>
            {results.map( item => {
                var {name, birth} = item
                return <li key={name}>{name}, born in {birth}</li>
            })}
        </ul>
    )
})



////////////////////////////////////////////////////////////////
// "Render loop" : re-render the entire app when data changes //
////////////////////////////////////////////////////////////////

function render() {
    React.render(
        <SearchBoxWrapper cursor={data.cursor("search")} />,
        document.getElementById('search')
    )

    React.render(
        <SearchResultsWrapper cursor={data.cursor()} />,
        document.getElementById('results')
    )
}

render()

data.on("swap", () => {
    console.log("data changed !")
    render()
})
