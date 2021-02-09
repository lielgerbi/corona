import React ,  {useState, useEffect} from "react"
import DatePicker from 'react-date-picker';
import "./app.css"

function App() {
   const [error, setError] = useState(null);
  //  const [isLoaded, setIsLoaded] = useState(false);
   const [items, setItems] = useState([]);
  const [state, setState] = React.useState('mn');
  const [value, onChange] = useState(new Date());
  const [positive, setPositive] = useState();
  const [negative, setNegative] = useState();

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear() ;
        year = year -1;

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return (year+month+day).toString();
}

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  function changedata(data ,currdate )
  {
    onChange(currdate);
    var dateInFormat = formatDate(currdate);
    setState(data);
    fetch("https://api.covidtracking.com/v1/states/"+state.toLowerCase()+"/"+dateInFormat+".json")
      .then(res => res.json())
      .then(
        (result) => {
          setPositive(result.positive);
          setNegative(result.negative);
        },
        (error) => {
          console.log(error);
          
        }
      )
  }
  useEffect(() => {
    fetch("https://api.covidtracking.com/v1/states/info.json")
      .then(res => res.json())
      .then(
        (result) => {
         // setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          //setIsLoaded(true);
          setError(error);
        }
      )

      fetch("https://api.covidtracking.com/v1/states/mn/current.json")
      .then(res => res.json())
      .then(
        (result) => {
          setPositive(result.positive);
          setNegative(result.negative);
        },
        (error) => {
          console.log(error);
          
        }
      )

  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } 
  // else if (!isLoaded) {
  //   return <div>Loading...</div>;
  // } 
  else {
    return (
      <div>
        <select state={state} onChange={e => changedata(e.currentTarget.value , value)}>
            {items.map(item => {
             return (
                <option value={item.state}> {item.name} </option>
             )
            })}
        </select>
        <DatePicker
        onChange={(value, e) => changedata(state, value)}
        value={value}
         
      />

      <h1 className={`data`}> Selected state: {state} ,Selected date: {formatDate(value)}</h1>
      <div className={`positive`}> positive : {positive}</div>
      <div className={`negative`}> negative : {negative}</div>
      </div>
    );
  }
}

export default App