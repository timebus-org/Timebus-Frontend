import { FaBus, FaExchangeAlt, FaSearch } from "react-icons/fa";

export default function ResultsSearchHeader({
  from,
  to,
  date,
  onSwap,
  onSearch,
  onChange
}) {
  return (
    <div className="results-search-header">
      <div className="search-box">
        <div className="search-field">
          <FaBus />
          <div>
            <span>From</span>
            <input
              value={from.name}
              onChange={(e) => onChange("from", e.target.value)}
            />
          </div>
        </div>

        <button className="swap-btn" onClick={onSwap}>
          <FaExchangeAlt />
        </button>

        <div className="search-field">
          <FaBus />
          <div>
            <span>To</span>
            <input
              value={to.name}
              onChange={(e) => onChange("to", e.target.value)}
            />
          </div>
        </div>

        <div className="search-field date-field">
          <span>Date of journey</span>
          <input
            type="date"
            value={date}
            onChange={(e) => onChange("date", e.target.value)}
          />
        </div>

        <button className="search-btn" onClick={onSearch}>
          <FaSearch />
        </button>
      </div>
    </div>
  );
}
