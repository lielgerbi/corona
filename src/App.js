import React ,  {useState, useEffect} from "react"
import DatePicker from 'react-date-picker';
import "./app.css"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Clock from './Clock';
// const dotenv = require('dotenv');
// dotenv.config();

function App() {
   const [error, setError] = useState(null);
  //  const [isLoaded, setIsLoaded] = useState(false);
   const [items, setItems] = useState([]);
  const [state, setState] = React.useState('mn');
  const [value, onChange] = useState(new Date());
  const [positive, setPositive] = useState();
  const [negative, setNegative] = useState();
  const [history ] = useState([]);
  
  // const { REACT_APP_FIVE} = process.env.REACT_APP_FIVE;
  // const [isOpen, setIsOpen] = useState(false); 

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

  function saveSerchHistory (serchResult) {
    if (history.length === 5){
      history.shift();
    }
    history.push(serchResult);
  }

  function changedata(data ,currdate )
  {
    onChange(currdate);
    var dateInFormat = formatDate(currdate);
    var serchResult = {};
    setState(data);
    fetch("https://api.covidtracking.com/v1/states/"+state.toLowerCase()+"/"+dateInFormat+".json")
      .then(res => res.json())
      .then(
        (result) => {
          setPositive(result.positive);
          setNegative(result.negative);
          serchResult = {'positive' : positive,
                          'negative' : negative,
                          'date' : dateInFormat , 
                          'state' : state ,
                          'positivePrecent' : (positive*100 )/ negative};
        saveSerchHistory(serchResult);
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
        <Popup trigger={<button> show current time</button>} position="right center">
          <div><Clock /></div>
        </Popup>
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
      
      <h1>serch history</h1>
      <h2 className={'data'}> state  |  date  |  positive  |  negative</h2>
      <div> 
      {history.map(item => {
             return (
                <li className={(item.positivePrecent <5 ? 'five' : item.positivePrecent >10 ?'ten' :'fiveToTen')} value={item.state}> {item.state.toLowerCase()} | {item.date} | {item.positive} | {item.negative} </li>
             )
            })}
      </div>
      {/* <details>
              <summary>
                  First text detail.
              </summary>
              <p>testing</p>
      </details> */}
      </div>
    );
  }
}

export default App