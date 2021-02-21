import { useState, useEffect } from "react";
import "./App.css";
import {
  FormControl,
  Card,
  CardContent,
  MenuItem,
  Select,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData } from "./util";
import "leaflet/dist/leaflet.css";
import LineGraph from "./LineGraph";

// "https://disease.sh/v3/covid-19/countries"

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("World Wide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((resp) => resp.json())
      .then((data) => {
        setCountryInfo(data);
      });
  });

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((resp) => resp.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    // "https://disease.sh/v3/covid-19/countries/[countryCode>>country.value]"=> for individule country
    // "https://disease.sh/v3/covid-19/all"=> for world-Wide

    const url =
      countryCode === "World Wide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h2>COVID-19 TRACKER</h2>
          <FormControl className="app__dropdown">
            <Select
              varient="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="World Wide">World Wide </MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name} </MenuItem>
              ))}

              {/*loop through all the countries*/}
              {/*   <MenuItem value="worldwide">World Wide</MenuItem>
          <MenuItem value="worldwide">World Wide</MenuItem>
          <MenuItem value="worldwide">World Wide</MenuItem>
<MenuItem value="worldwide">World Wide</MenuItem>*/}
            </Select>
          </FormControl>
        </div>

        {/*Header*/}

        <div className="app__stats">
          <InfoBox
            title="CronaVirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered"
            total={countryInfo.todayRecovered}
            cases={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            total={countryInfo.todayDeaths}
            cases={countryInfo.deaths}
          />
        </div>

        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Lives Cases By Country</h3>
          <Table countries={tableData} />
        </CardContent>
      </Card>
      {/*table*/}
      {/*graph */}

      {/*map */}
    </div>
  );
}

export default App;
