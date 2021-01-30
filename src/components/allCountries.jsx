import React, { Component } from "react";
import axios from "axios";
import Details from './countryDetails';
export default class Countries extends Component {
  constructor() {
    super();
    this.state = {
      allCountries: [],
      countries: [],
      searchTerm: "",
      noResult: "",
      displayDetails: false,
      displayData: {},
      mappedCountry: {},
      scrollAmount: 0,
    };
    this.checkScroll = this.checkScroll.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
  }
  componentDidMount() {
    this.getAllCountry();
    document.addEventListener("scroll", this.checkScroll);
    // document.addEventListener("wheel", this.checkScroll);
  }
  componentWillUnmount() {
    document.removeEventListener(this.checkScroll);
  }
  // check scroll amount
  checkScroll() {
    let { scrollAmount : x, countries: c, allCountries } = this.state;
    if (window.scrollY > x) {
      this.setState({
        scrollAmount: x + 250,
        countries: allCountries.slice(0, c.length+3),
      })
    }
  }
  // Calling all country on enter key press
  callCountry(e) {
    if (e.keyCode === 13) {
      // Cancel the default action, if needed
      e.preventDefault();
      // Trigger the button element with a click
      this.getAllCountry();
    }
  }
  // Get country data
  getAllCountry() {
    // Using Axios
    // axios.get('https://restcountries.eu/rest/v2/all')
    // .then(country => this.setState({
    //     countries: country.data
    // }))
    // .catch(err => console.error("Some error occured: ", err));
    // Using Axios with parameters
    // const url = "https://restcountries.eu/rest/v2/all";
    // const data = {
    //   method: "GET",
    //   url,
    // };
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    axios
      .get("./countries.json", headers)
      .then((country) => {
        if (!Object.keys(this.state.mappedCountry).length) {
          this.mapCountryName(country);
        }
        const data = this.filterData(country);
        if (data.length) {
          this.setState({
            allCountries: data,
            countries: data.slice(0,9),
            // countries: data,
            noResult: "",
          });
        } else {
          this.setState({
            allCountries: [],
            countries: [],
            noResult: "There is no result for your search query",
          });
        }
        this.setState({ scrollAmount: 0 });
      })
      .catch((err) => console.error("Some error occured: ", err));
    // Using Fetch
    // fetch('https://restcountries.eu/rest/v2/all')
    // .then(data => data.json())
    // .then(country => this.setState({ countries: country }))
    // .catch(err => console.error("Some error occured: ", err));
  }
  // check for null or undefined
  lowerCase(val) {
    if (val && typeof val === "string") {
      return val.toLowerCase();
    } else if (val) {
      return val.toString().toLowerCase();
    }
    return val;
  }
  // filter based on range
  rangeFilter(country, term, symbol, val) {
    if (term === "") return country.data;
    if (symbol === ">") {
      return country.data.filter((item) => item[term] > Number(val));
    } else if (symbol === "<") {
      return country.data.filter((item) => item[term] < Number(val));
    }
  }
  // term based sort
  sortCountries() {}
  // Filter country based on search text
  filterData(country) {
    const { searchTerm } = this.state;
    const text = searchTerm.trim().toLowerCase();
    const term = text.split(" ")[0];
    const symbol = text.split(" ")[1];
    const val = text.split(" ")[2];
    if (text === "") return country.data;
    if ((symbol === ">" || symbol === "<") && Number(val)) {
      return this.rangeFilter(country, term, symbol, val);
    }
    return country.data.filter(
      (item) =>
        this.lowerCase(item.region) === text ||
        this.lowerCase(item.subregion) === text ||
        this.lowerCase(item.currencies[0].code) === text ||
        this.lowerCase(item.currencies[0].name) === text ||
        this.lowerCase(item.currencies[0].symbol) === text ||
        this.lowerCase(item.name) === text ||
        this.lowerCase(item.alpha2Code).includes(text) ||
        this.lowerCase(item.alpha3Code).includes(text) ||
        this.lowerCase(item.capital).includes(text) ||
        this.lowerCase(item.name).includes(text)
    );
  }
  // Get search text
  getSearchText(e) {
    this.setState({
      searchTerm: e.target.value,
    });
  }
  // Clear textfiled input
  clearInput() {
    this.setState(
      {
        searchTerm: "",
        countries: [],
        allCountries: [],
        scrollAmount: 0,
      },
      () => {
        this.getAllCountry();
      }
    );
  }
  // mapping alpha3code with countryname
  mapCountryName(countries) {
    const mappedCountry = {};
    countries.data.forEach((item) => {
      mappedCountry[item.alpha3Code] = item.name;
    });
    this.setState({
      mappedCountry,
    });
  }
  // convert population to lakhs and crore
  convertPopulation(p) {
    const lkh = 100000;
    const cror = 10000000;
    if (p > cror) return `${parseFloat(p / cror).toFixed(2)} crore`;
    if (p > lkh) return `${parseFloat(p / lkh).toFixed(2)} lakh`;
    return p;
  }
  // Creating country details object
  getCountryDetails(details) {
    const data = {};
    const border = details.borders.map(
      (item) => this.state.mappedCountry[item]
    );
    data.name = details.name;
    data.nativeName = details.nativeName;
    data.capital = details.capital;
    data.currencies = details.currencies;
    data.area = details.area;
    data.borders = border;
    data.region = details.region;
    data.subregion = details.subregion;
    data.population = this.convertPopulation(details.population);
    data.timezones = details.timezones[0];
    data.callingCodes = details.callingCodes[0];
    this.setState({
      displayData: data,
      displayDetails: true,
    });
  }
  // Toggle country and country display page
  toggleDisplay() {
    this.setState({
      displayDetails: false,
    });
  }
  // Display country list page
  renderCountryList() {
    const { countries, noResult, searchTerm } = this.state;
    return (
      <div className="allcountries-div">
        <h1>All countries list!</h1>
        <input
          className="search-box"
          type="text"
          placeholder="Search Countries..."
          value={searchTerm}
          onChange={(e) => this.getSearchText(e)}
          onKeyUp={(e) => this.callCountry(e)}
        />
        <i
          className="fa fa-times-circle icon fa-lg"
          aria-hidden="false"
          onClick={() => (searchTerm ? this.clearInput() : null)}
        ></i>
        <button
          id="all_countries_list"
          className="rotate-button get-country"
          onClick={() => this.getAllCountry()}
        >
          Get All Countries!
        </button>
        {countries.length ? <p className="count_P">{`Total count: ${countries.length}`}</p> : null}
        <div className="country-data">
          {countries && countries.length ? (
            countries.map((item) => {
              return (
                <div className="country-item" key={`div${item.alpha3Code}`}>
                  <p key={`p${item.alpha3Code}`}>{item.name}</p>
                  <img
                    className="country-img"
                    key={`img${item.alpha3Code}`}
                    src={item.flag}
                    alt={`flag_image${item.name}`}
                    onClick={() => this.getCountryDetails(item)}
                  />
                  <div className="country-details">
                    <p className="country-capital">Capital: {item.capital}</p>
                    <p className="country-currency">
                      Currency: {item.currencies[0].code}
                      {item.currencies[0].symbol}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <h2>{noResult}</h2>
          )}
        </div>
      </div>
    );
  }
  // Displat country details page
  renderDetails() {
    return (
      <Details
        data={this.state.displayData}
        display={this.state.displayDetails}
        toggleDisplay={this.toggleDisplay}
      />
    );
  }
  render() {
    return (
      <>
        {this.state.displayDetails
          ? this.renderDetails()
          : this.renderCountryList()}
      </>
    );
  }
}
