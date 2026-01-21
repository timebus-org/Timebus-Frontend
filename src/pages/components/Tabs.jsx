export default function Tabs({ tripType, setTripType }) {
  return (
    <div className="cab-tabs">
      <label>
        <input type="radio" checked={tripType==="oneway"} onChange={()=>setTripType("oneway")} />
        Outstation One-way
      </label>

      <label>
        <input type="radio" checked={tripType==="round"} onChange={()=>setTripType("round")} />
        Outstation Round Trip
      </label>

      <label>
        <input type="radio" checked={tripType==="airport"} onChange={()=>setTripType("airport")} />
        Airport Transfer
      </label>

      <label>
        <input type="radio" checked={tripType==="hourly"} onChange={()=>setTripType("hourly")} />
        Hourly Rental
      </label>
    </div>
  );
}
