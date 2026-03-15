import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SeatLayoutModal.css";

export default function SeatLayoutPro({ bus, from, to, date, onClose }) {

const navigate = useNavigate();

const [seats,setSeats] = useState([]);
const [boardingPoints,setBP] = useState([]);
const [droppingPoints,setDP] = useState([]);

const [selectedSeats,setSelectedSeats] = useState([]);
const [selectedBP,setSelectedBP] = useState(null);
const [selectedDP,setSelectedDP] = useState(null);

const [step,setStep] = useState(1);
const [gstPercent,setGstPercent] = useState(0);
const [loading,setLoading] = useState(true);


/* dynamic seat size for mobile */
const seatSize = window.innerWidth < 768 ? 30 : 36;

const gap = 8;
const aisleGap = 40;


useEffect(()=>{

if(!bus?.id) return;

const originalOverflow = document.body.style.overflow;
document.body.style.overflow = "hidden";

let mounted = true;

const fetchTripDetails = async ()=>{

try{

setLoading(true);

const res = await axios.get(
`${import.meta.env.VITE_API_URL}/api/trips/trip-details/${bus.id}`
);

if(!mounted) return;

const data = res?.data || {};

const mappedSeats = (data.seats || []).map(s=>({

id:`${s.column}-${s.row}-${s.name}`,
seatNumber:s.name,

price:parseFloat(s.fare || s.baseFare || 0),

booked:s.available === "false" || s.available === false,

ladies:s.ladiesSeat === "true",

row:Number(s.row),
column:Number(s.column),

zIndex:Number(s.zIndex || 0),

length:Number(s.length || 1),
width:Number(s.width || 1)

}));

setSeats(mappedSeats);

setBP(Array.isArray(data.boardingTimes) ? data.boardingTimes : []);
setDP(Array.isArray(data.droppingTimes) ? data.droppingTimes : []);

setGstPercent(Number(data.gst || 5));

}catch(err){

console.error("Trip load error",err);

}finally{

if(mounted) setLoading(false);

}

};

fetchTripDetails();

return ()=>{

mounted=false;
document.body.style.overflow = originalOverflow;

};

},[bus?.id]);



/* deck grouping */

const layout = useMemo(()=>{

const grid={};

seats.forEach(seat=>{
if(!grid[seat.zIndex]) grid[seat.zIndex] = true;
});

return grid;

},[seats]);



/* seat toggle */

const toggleSeat = (seat)=>{

if(!seat || seat.booked) return;

setSelectedSeats(prev=>{

const exists = prev.some(s=>s.id === seat.id);

if(exists){

return prev.filter(s=>s.id !== seat.id);

}

return [...prev,seat];

});

};



/* price calculation */

const seatTotal = selectedSeats.reduce((sum,s)=>sum + s.price,0);

const gstAmount = ((seatTotal * gstPercent)/100).toFixed(2);

const grandTotal = (seatTotal + parseFloat(gstAmount)).toFixed(2);



const isBoardingRequired = boardingPoints.length > 0;
const isDroppingRequired = droppingPoints.length > 0;

const canContinue =
selectedSeats.length > 0 &&
(!isBoardingRequired || selectedBP) &&
(!isDroppingRequired || selectedDP);



const handleContinue = ()=>{

if(!selectedSeats.length)
return alert("Please select seat");

if(isBoardingRequired && !selectedBP)
return alert("Select boarding point");

if(isDroppingRequired && !selectedDP)
return alert("Select dropping point");


navigate("/passenger-info",{

state:{
tripData:{
availableTripId:bus.id,
source:bus.source,
destination:bus.destination,
travels:bus.travels
},

bus,
from,
to,
date,

selectedSeats:selectedSeats.map(s=>({
seatName:s.seatNumber,
fare:s.price
})),

boardingPoint:selectedBP,
droppingPoint:selectedDP,

seatFare:seatTotal,
gst:gstAmount,
totalPrice:grandTotal
}

});

};



if(loading){

return(
<div className="seat-modal-pro">
Loading seat layout...
</div>
);

}



return(

<div className="seat-modal-pro">

<div className="seat-modal-header">

<div>
<h2>{bus?.travels}</h2>
<p>{from?.name} → {to?.name} | {date}</p>
</div>

<button className="close-btn" onClick={onClose}>✕</button>

</div>



<div className="seat-modal-body">

{/* STEP 1 */}

{step === 1 && (

<div className="main-layout">

<div className="seat-section">
<div className="seat-legend">

<div className="legend-item">
<span className="legend-box available"></span>
Available
</div>

<div className="legend-item">
<span className="legend-box selected"></span>
Selected
</div>

<div className="legend-item">
<span className="legend-box booked"></span>
Booked
</div>

<div className="legend-item">
<span className="legend-box ladies"></span>
Ladies
</div>

</div>
{Object.keys(layout)
.sort((a,b)=>a-b)
.map(z=>{

const deckSeats = seats.filter(s=>s.zIndex == z);

const maxColumn = Math.max(...deckSeats.map(s=>s.column),0);
const maxRow = Math.max(...deckSeats.map(s=>s.row),0);
const minRow = Math.min(...deckSeats.map(s=>s.row));
const aisleColumn = Math.floor(maxColumn/2);

/* canvas size */

const canvasWidth =
(maxColumn + 1) * (seatSize + gap) + aisleGap;

const canvasHeight =
(maxRow + 1) * (seatSize + gap);

return(

<div key={z} className="deck-box">

<div className="deck-header">

<span className="deck-title">
{z === "0" ? "Lower Deck" : "Upper Deck"}
</span>

<div className="deck-right">



</div>

</div>



<div
className="deck-canvas"
style={{
width: canvasWidth + seatSize + gap,
height: canvasHeight,
position: "relative",
paddingLeft: seatSize + gap
}}
>
{/* DRIVER CABIN */}
<div
className="driver-cabin"
style={{
position:"absolute",
top:-40,
left:"50%",
transform:"translateX(-50%)"
}}
>
<div className="driver-wheel"></div>

</div>
<div
className="front-indicator"
style={{
position:"absolute",
top:(minRow*(seatSize+gap)) - 16,
left:"50%",
transform:"translateX(-50%)"
}}
>
FRONT
</div>
{deckSeats.map(seat=>{

/* correct grid layout based on row + column */

let left =
(seat.column * (seatSize + gap));

/* create aisle space exactly at center */

if(seat.column >= aisleColumn){
left += aisleGap;
}

const deckOffset = seat.zIndex * 6; // small shift between decks

const top =
seat.row * (seatSize + gap * 6);

const selected =
selectedSeats.some(s=>s.id === seat.id);

return(

<div
key={seat.id}

className={`seat-pro
${seat.booked ? "booked":""}
${seat.ladies ? "ladies":""}
${seat.length>1 || seat.width>1 ? "sleeper":"seater"}
${selected ? "selected":""}
`}

style={{

position:"absolute",

left,
top,

width: seat.width * seatSize + (seat.width - 1) * gap,

height: seat.length * seatSize + (seat.length - 1) * gap

}}
onClick={()=>toggleSeat(seat)}

>

<div className="seat-number">{seat.seatNumber}</div>
<div className="seat-price">₹{seat.price}</div>

</div>

);

})}

</div>

</div>

);

})}

</div>



<div className="summary-section">

<h3>Booking Summary</h3>

<p>
<strong>Selected Seats:</strong><br/>
{selectedSeats.length
? selectedSeats.map(s=>s.seatNumber).join(", ")
: "None"}
</p>

<hr/>

<p>Seat Fare: ₹{seatTotal}</p>
<p>GST ({gstPercent}%): ₹{gstAmount}</p>

<h2>Total: ₹{grandTotal}</h2>

<button
className="continue-btn"
disabled={!selectedSeats.length}
onClick={()=>setStep(2)}
>
Continue
</button>

</div>

</div>

)}



{/* STEP 2 */}

{step === 2 && (

<div className="points-container">

<div className="points-block boarding">

<h3>Boarding Point</h3>

<div className="points-list">

{boardingPoints.length === 0 &&
<p>No boarding points required</p>}

{boardingPoints.map(bp=>(

<div
key={bp.bpId}

className={`point-item ${
selectedBP?.bpId === bp.bpId ? "active":""
}`}

onClick={()=>setSelectedBP(bp)}

>

<span className="bullet"/>

<div>

<strong>{bp.bpName}</strong>

{bp.bpTime && <small>{bp.bpTime}</small>}

</div>

</div>

))}

</div>

</div>



<div className="points-gap"></div>



<div className="points-block dropping">

<h3>Dropping Point</h3>

<div className="points-list">

{droppingPoints.length === 0 &&
<p>No dropping points required</p>}

{droppingPoints.map(dp=>(

<div
key={dp.bpId}

className={`point-item ${
selectedDP?.bpId === dp.bpId ? "active":""
}`}

onClick={()=>setSelectedDP(dp)}

>

<span className="bullet"/>

<div>

<strong>{dp.bpName}</strong>

{dp.bpTime && <small>{dp.bpTime}</small>}

</div>

</div>

))}

</div>

</div>



<div className="points-footer">

<button onClick={()=>setStep(1)}>
← Back to Seat Selection
</button>

<button
className="continue-btn"
disabled={!canContinue}
onClick={handleContinue}
>
Continue
</button>

</div>

</div>

)}

</div>

</div>

);

}
