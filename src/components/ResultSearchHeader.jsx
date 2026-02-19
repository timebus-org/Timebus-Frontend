import { useNavigate } from "react-router-dom";
import "./ResultSearchHeader.css";

export default function ResultSearchHeader({ from, to, date }) {
  const navigate = useNavigate();

  return (
    <div className="result-header">
      <div className="result-route">
        <div>
          <span className="label">From</span>
          <h3>{from?.name}</h3>
        </div>

        <div className="arrow">→</div>

        <div>
          <span className="label">To</span>
          <h3>{to?.name}</h3>
        </div>

        <div className="date-block">
          <span className="label">Date</span>
          <h4>{date}</h4>
        </div>
      </div>

      <button className="modify-btn" onClick={() => navigate("/")}>
        Modify Search
      </button>
    </div>
  );
}
