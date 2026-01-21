import { useState } from "react";
import axios from "axios";

export default function AddBus() {
  const [form, setForm] = useState({
    name: "", busType: "", from: "", to: "", date: "",
    departureTime: "", arrivalTime: "", price: "", seats: ""
  });

  const submit = async(e)=>{
    e.preventDefault();
    await axios.post("http://localhost:5000/api/bus/add", form);
    alert("Bus listed successfully!");
  };

  return (
    <div style={{maxWidth:500,margin:"50px auto"}}>
      <h2>Add Bus Listing</h2>
      {Object.keys(form).map(key=>(
        <input key={key}
          placeholder={key} style={input}
          onChange={(e)=> setForm({...form,[key]:e.target.value})}/>
      ))}
      <button onClick={submit} style={btn}>Add Bus</button>
    </div>
  );
}

const input={width:"100%",padding:10,margin:"6px 0"};
const btn={padding:"10px 20px",background:"#1976d2",color:"#fff",border:"none"};
