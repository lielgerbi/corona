import React ,  {} from "react"
import { format } from 'date-fns';
function Clock() {
    const [date, setDate] = React.useState(new Date());
  
   //Replaces componentDidMount and componentWillUnmount
   React.useEffect(() => {
    var timerID = setInterval( () => tick(), 1000 );
    return function cleanup() {
        clearInterval(timerID);
      };
   });
  
     function tick() {
      setDate(new Date());
     }
  
     return (
        <div>
          <p>current time:</p>
          <h3>{(format(new Date(), 'dd.MM.yy'))} {date.toLocaleTimeString()}</h3>
        </div>
      );
  }
  export default Clock;