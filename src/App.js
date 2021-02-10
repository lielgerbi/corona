import React ,  {useState, useEffect} from "react"
import DatePicker from 'react-date-picker';
import "./app.css"
import {XCircleIcon , TrashIcon} from '@primer/octicons-react'
import 'bootstrap/dist/css/bootstrap.css';
import { Navbar } from 'react-bootstrap';
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
  const [history, setHistory]  = useState([]);
  const [showHistory , serShowHistory] = useState(false);


  //change foramt of date to api format - yyyymmdd
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
//add to search history current search
debugger;
  function saveSerchHistory (serchResult) {
    // if (history.length === 5){
    //   history.shift();
    // }
    history.push(serchResult);
  }

  //remove search from history search
  function deleteSearch (serchResult) {
    setHistory(history.filter(item=>item!==serchResult));
  }
 
  //update data for current state and date
  function changedata(data ,currdate )
  {
    debugger;
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

        <Navbar sticky="top" bg="light">
        <Navbar.Brand href="#home">CORONA IN USA</Navbar.Brand>
        </Navbar>

        <Popup trigger={<button> show current time</button>} position="right center">
          <div><Clock /></div>
        </Popup>
        <select state={state} onChange={e => setState(e.currentTarget.value) }>

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

      <h1 className={`data`}> Selected state: {state} ,Selected date: {formatDate(value)}
      <button variant="outline-dark" onClick= {() => changedata(state , value)}>Search data</button>
      </h1>
      <div className={`positive`}> positive : {positive}</div>
      <div className={`negative`}> negative : {negative}</div>

      <button onClick= {() => serShowHistory(!showHistory)}>
      <XCircleIcon size={24}/>
      </button>
      
      <h2 className={'data'}> state  |  date  |  positive  |  negative</h2>
      <div className={(showHistory ===true ? 'show': 'hide')}> 
      {history.map(item => {
             return (
                <li className={(item.positivePrecent <5 ? 'five' : item.positivePrecent >10 ?'ten' :'fiveToTen')} value={item.state}> 
                    {item.state.toLowerCase()} | {item.date} | {item.positive} | {item.negative}
                    <button onClick={() => deleteSearch(item)}> <TrashIcon size={16}/></button>
                </li>
             )
            })}
      </div>
      </div>
    );
  }
}

export default App