import { FaCalendarAlt, FaClock } from "react-icons/fa";

export default function DateTimeRow() {
  return (
    <div className="cab-row">
      <div className="cab-field">
        <FaCalendarAlt />
        <input placeholder="DD-MM-YYYY" />
      </div>
      <div className="cab-field">
        <FaClock />
        <input type="time" />
      </div>
    </div>
  );
}
