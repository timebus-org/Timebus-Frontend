import { FaMapMarkerAlt } from "react-icons/fa";

export default function Field({ placeholder }) {
  return (
    <div className="cab-field">
      <FaMapMarkerAlt />
      <input placeholder={placeholder} />
    </div>
  );
}
