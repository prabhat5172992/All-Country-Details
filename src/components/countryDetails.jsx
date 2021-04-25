import React, { Component } from "react";
export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayData: props.data,
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.displayData) {
      return {
        displayData: props.data,
      };
    }
    return null;
  }
  // Make first letter caps
  captiliseFirst(str) {
    return str.substring(0,1).toUpperCase()+str.substring(1,str.length)
  }
  render() {
    const { displayData: cData } = this.state;
    const currency = cData.currencies[0];
    return (
      <>
        <h1>Country Details</h1>
        <button
          className="rotate-button get-country back"
          onClick={() => this.props.toggleDisplay()}
        >
          Back to countries
        </button>
        <div className="country_Details">
          <p>{`Name: ${cData.name}`}</p>
          <p>{`Native Name: ${cData.nativeName}`}</p>
          <p>{`Capital: ${cData.capital}`}</p>
          <p>{`Total area: ${cData.area || 'Not present'} ${cData.area ? 'km²' : ''}`}</p>
          <div className="">
            Currencies:
            {Object.keys(currency).map((item) => {
              return <p key={item} className="detailsP">{`${this.captiliseFirst(item)}: ${currency[item]}`}</p>;
            })}
          </div>
            <p>{`Region: ${cData.region}`}</p>
            <p>{`Sub Region: ${cData.subregion}`}</p>
            <p>{`Population: ${cData.population || 0}`}</p>
            <p>{`Timezones: ${cData.timezones}`}</p>
            <p>{`Calling code: ${cData.callingCodes}`}</p>
            <div> Borders: 
                {cData.borders.length ? cData.borders.map(item => {
                    return <p key={item}  className="detailsP">{item}</p>
                }): ' No borders'}
            </div>
        </div>
      </>
    );
  }
}
