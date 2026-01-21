import { useState } from "react";
import Field from "./Field";
import DateTimeRow from "./DateTimeRow";

export default function HourlyForm() {
  const [active, setActive] = useState(1);

  return (
    <>
      <Field placeholder="Enter Pickup Location" />
      <DateTimeRow />

      <div className="hourly-packages">
        {[1,2,3,4].map(h => (
          <button
            key={h}
            className={active===h ? "active" : ""}
            onClick={()=>setActive(h)}
          >
            {h} hr ({h*10} km)
          </button>
        ))}
      </div>
    </>
  );
}
