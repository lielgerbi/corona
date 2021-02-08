import React ,  {useState, useEffect} from "react"
import DatePicker from 'react-date-picker';

function App() {
   const [error, setError] = useState(null);
  //  const [isLoaded, setIsLoaded] = useState(false);
   const [items, setItems] = useState([]);
  const [state, setState] = React.useState('mn');
  const [value, onChange] = useState(new Date());
  const [positive, setPositive] = useState();
  const [negative, setNegative] = useState();

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
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
        <select state={state} onChange={e => setState(e.currentTarget.value)}>
            {items.map(item => {
             return (
                <option value={item.state}> {item.name} </option>
             )
            })}
        </select>
        <DatePicker
        onChange={onChange}
        value={value}
      />

      <h1>{state}</h1>
      <div> positive : {positive} negative : {negative}</div>
      </div>
    );
  }
}

export default App