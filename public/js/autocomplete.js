async function getSearchResults(term) {
  const response = await fetch("http://localhost:3000/search/" + term);
  const myJson = await response.json();
  const result = myJson;
  const searchResultsContaner = SearchResultContainer();
  result.map(person =>
    searchResultsContaner.appendChild(
      SearchResult({ text: person.Name, link: "../people/" + person.id })
    )
  );
  searchResults.firstChild &&
    searchResults.removeChild(searchResults.firstChild);
  searchResults.appendChild(searchResultsContaner);
}

var searchBox = document.querySelector("#searchbox");
var searchResults = document.querySelector("#search-results");
searchBox.addEventListener("input", autoComplete);

function autoComplete(e) {
  let text = e.target.value;
  if (text.length > 0) {
    getSearchResults(text);
  }
}

function SearchResultContainer(props) {
  return document.createElement("ul");
}

function SearchResult(props) {
  let el = document.createElement("li");
  let link = document.createElement("a");
  link.textContent = props.text;
  link.href = props.link;
  el.appendChild(link);
  return el;
}

function SearchSuggestions(props) {
  let el = document.createElement("datalist");
  el.id = "search-suggestions";
  for (let option of ["Alber", "Aaron", "Alf", "Bonald"]) {
    let optEl = document.createElement("option");
    optEl.textContent = option;
    el.appendChild(optEl);
  }
  return el;
}

// autoComplete({target:{value:"j"}})