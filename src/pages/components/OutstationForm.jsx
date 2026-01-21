import Field from "./Field";
import DateTimeRow from "./DateTimeRow";

export default function OutstationForm({ showStops }) {
  return (
    <>
      <Field placeholder="Enter Pickup City" />
      <Field placeholder="Enter Drop City" />

      {showStops && (
        <div className="add-stops">
          + Add Stops <span>New</span>
        </div>
      )}

      <DateTimeRow />
    </>
  );
}
