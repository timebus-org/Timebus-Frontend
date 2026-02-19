import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Results.css";
import { FaStar } from "react-icons/fa";
import SeatLayoutModal from "../components/SeatLayoutModal";
import ResultSearchHeader from "../components/ResultSearchHeader";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const { buses, from, to, date } = location.state || {};
  const tripList = buses?.availableTrips || [];

  const [displayBuses, setDisplayBuses] = useState([]);
  const [sortType, setSortType] = useState("default");
  const [filterType, setFilterType] = useState("all");
  const [selectedBus, setSelectedBus] = useState(null);
  const [filters, setFilters] = useState({
  busType: {
    ac: false,
    nonAc: false,
    sleeper: false,
    seater: false,
    volvo: false,
  },
  features: {
    singleSeat: false,
    highRated: false,
    liveTracking: false,
    freeCancellation: false,
  },
  departureTime: {
    morning: false,
    afternoon: false,
    evening: false,
    night: false,
  },
  boardingPoints: [],
  droppingPoints: [],
});

  useEffect(() => {
    setDisplayBuses(tripList);
  }, [tripList]);

  if (!buses) {
    return (
      <div className="results-wrapper">
        <h2>No search data found</h2>
        <button className="back-btn" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  /* ================= TIME FORMAT ================= */

  const formatTime = (time) => {
    if (!time) return "--";

    const num = Number(time);
    let hours = Math.floor(num / 100);
    let minutes = num % 100;

    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }

    const dateObj = new Date();
    dateObj.setHours(hours);
    dateObj.setMinutes(minutes);

    return dateObj.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
/* ================= DURATION ================= */

const calculateDuration = (departure, arrival) => {
  if (!departure || !arrival) return "--";

  let dep = Number(departure);
  let arr = Number(arrival);

  let depHours = Math.floor(dep / 100);
  let depMinutes = dep % 100;

  let arrHours = Math.floor(arr / 100);
  let arrMinutes = arr % 100;

  let depTotal = depHours * 60 + depMinutes;
  let arrTotal = arrHours * 60 + arrMinutes;

  // If arrival is next day
  if (arrTotal < depTotal) {
    arrTotal += 24 * 60;
  }

  const diff = arrTotal - depTotal;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return `${hours}h ${minutes}m`;
};

  /* ================= FARE ================= */
const applyFilters = (activeFilters = filters) => {
  let filtered = [...tripList];

  /* ================= BUS TYPE ================= */

  const { busType, features, departureTime } = activeFilters;

  if (Object.values(busType).some(Boolean)) {
    filtered = filtered.filter(bus => {
      const type = bus.busType?.toLowerCase() || "";

      return (
        (busType.ac && type.includes("ac")) ||
        (busType.nonAc && !type.includes("ac")) ||
        (busType.sleeper && type.includes("sleeper")) ||
        (busType.seater && type.includes("seater")) ||
        (busType.volvo && type.includes("volvo"))
      );
    });
  }

  /* ================= FEATURES ================= */

  if (features.singleSeat)
    filtered = filtered.filter(bus => bus.availableSingleSeat > 0);

  if (features.highRated)
    filtered = filtered.filter(bus => generateRating(bus).rating >= 4);

  /* ================= DEPARTURE TIME ================= */

  if (Object.values(departureTime).some(Boolean)) {
    filtered = filtered.filter(bus => {
      const hour = Math.floor(Number(bus.departureTime || 0) / 100);

      return (
        (departureTime.morning && hour >= 6 && hour < 12) ||
        (departureTime.afternoon && hour >= 12 && hour < 18) ||
        (departureTime.evening && hour >= 18 && hour < 24) ||
        (departureTime.night && (hour >= 0 && hour < 6))
      );
    });
  }

  /* ================= BOARDING ================= */

  if (activeFilters.boardingPoints.length > 0) {
    filtered = filtered.filter(bus =>
      bus.boardingPoints?.some(p =>
        activeFilters.boardingPoints.includes(p.location)
      )
    );
  }

  /* ================= DROPPING ================= */

  if (activeFilters.droppingPoints.length > 0) {
    filtered = filtered.filter(bus =>
      bus.droppingPoints?.some(p =>
        activeFilters.droppingPoints.includes(p.location)
      )
    );
  }

  setDisplayBuses(filtered);
};
const handleFilterChange = (section, key) => {
  const updated = {
    ...filters,
    [section]: {
      ...filters[section],
      [key]: !filters[section][key],
    },
  };

  setFilters(updated);
  applyFilters(updated);
};
const getCount = (filterLogic) => {
  return tripList.filter(filterLogic).length;
};

  const generateAverageFare = (bus) => {
    let base = 800;
    const type = bus.busType?.toLowerCase() || "";

    if (type.includes("ac") && type.includes("sleeper")) base = 1200;
    else if (type.includes("ac")) base = 1000;
    else if (type.includes("sleeper")) base = 900;

    const seats = Number(bus.availableSeats) || 10;
    return base + seats * 5;
  };

  const getFare = (bus) => {
    if (!bus) return 0;

    if (Array.isArray(bus.fares) && bus.fares.length > 0) {
      const valid = bus.fares
        .map((f) => Number(f))
        .filter((f) => !isNaN(f) && f > 0);
      if (valid.length) return Math.min(...valid);
    }

    if (Array.isArray(bus.fareDetails) && bus.fareDetails.length > 0) {
      const valid = bus.fareDetails
        .map((f) => Number(f.totalFare))
        .filter((f) => !isNaN(f) && f > 0);
      if (valid.length) return Math.min(...valid);
    }

    return generateAverageFare(bus);
  };

  const getStrikePrice = (fare) => {
    return fare + Math.floor(fare * 0.18);
  };

  /* ================= RATING ================= */

  const generateRating = (bus) => {
    const id = bus.availableTripId || bus.id || "bus";

    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash += id.charCodeAt(i);
    }

    const rating = (3.5 + (hash % 14) / 10).toFixed(1);
    const reviews = 100 + (hash % 900);

    return { rating: Number(rating), reviews };
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "#1ba672";
    if (rating >= 3.5) return "#f39c12";
    return "#999";
  };

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return "Superb";
    if (rating >= 4) return "Very Good";
    if (rating >= 3.5) return "Good";
    return "Average";
  };

  /* ================= SORT ================= */

  const handleSort = (type) => {
    setSortType(type);
    let sorted = [...displayBuses];

    if (type === "departure") {
      sorted.sort(
        (a, b) =>
          Number(a.departureTime || 0) -
          Number(b.departureTime || 0)
      );
    }

    if (type === "price") {
      sorted.sort((a, b) => getFare(a) - getFare(b));
    }

    setDisplayBuses(sorted);
  };

  /* ================= FILTER ================= */

  const handleFilter = (type) => {
    setFilterType(type);
    let filtered = [...tripList];

    if (type === "AC")
      filtered = filtered.filter((bus) =>
        bus.busType?.toLowerCase().includes("ac")
      );

    if (type === "Sleeper")
      filtered = filtered.filter((bus) =>
        bus.busType?.toLowerCase().includes("sleeper")
      );

    setDisplayBuses(filtered);
  };

  return (
    <div className="results-wrapper">

      <ResultSearchHeader from={from} to={to} date={date} />

      

    <div className="results-top">
  <h3>{displayBuses.length} Buses Found</h3>

  <div className="results-controls centered-controls">
    <select value={sortType} onChange={(e) => handleSort(e.target.value)}>
      <option value="default">Sort By</option>
      <option value="departure">Departure</option>
      <option value="price">Price</option>
    </select>

    <select value={filterType} onChange={(e) => handleFilter(e.target.value)}>
      <option value="all">All Types</option>
      <option value="AC">AC</option>
      <option value="Sleeper">Sleeper</option>
    </select>
  </div>
</div>




      {displayBuses.map((bus) => {
        const fare = getFare(bus);
        const strike = getStrikePrice(fare);
        const { rating, reviews } = generateRating(bus);
        const seats = Number(bus.availableSeats) || 0;

        return (
          <div
            key={bus.availableTripId || bus.id}
            className="bus-card"
          >
            <div className="bus-row">

              {/* LEFT */}
              <div>
                <h3 className="bus-name">{bus.travels}</h3>
                <p className="bus-type">{bus.busType}</p>

                <div className="rating-wrapper">
                  <div
                    className="rating-box"
                    style={{ backgroundColor: getRatingColor(rating) }}
                  >
                    <FaStar />
                    <span>{rating}</span>
                  </div>

                  <span className="rating-label">
                    {getRatingLabel(rating)}
                  </span>

                  <span className="rating-reviews">
                    ({reviews})
                  </span>
                </div>

                {seats > 0 && (
                  <div className="seats-wrapper">
                    <span
                      className={`seats-text ${
                        seats <= 5
                          ? "seats-low"
                          : seats <= 10
                          ? "seats-medium"
                          : "seats-normal"
                      }`}
                    >
                      {seats <= 5
                        ? `Only ${seats} seats left`
                        : `${seats} seats available`}
                    </span>

                    {bus.availableSingleSeat && (
                      <span className="single-seat">
                        ({bus.availableSingleSeat} Single)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* TIME */}
              <div className="bus-time">
                <strong>{formatTime(bus.departureTime)}</strong>
                <p>Departure</p>
              </div>

              <div className="bus-duration">
                <strong>
  {calculateDuration(bus.departureTime, bus.arrivalTime)}
</strong>

                <p>Duration</p>
              </div>

              <div className="bus-time">
                <strong>{formatTime(bus.arrivalTime)}</strong>
                <p>Arrival</p>
              </div>

              {/* PRICE */}
              <div className="bus-price">
                <div className="price-wrapper">
                  <span className="strike-price">
                    ₹{Math.floor(strike)}
                  </span>

                  <span className="final-fare">
                    ₹{Math.floor(fare)}
                  </span>
                </div>
                <span className="onwards-text">Onwards</span>
              </div>

              <button
                className="select-btn"
                onClick={() => setSelectedBus(bus)}
              >
                Select Seats
              </button>

            </div>
          </div>
        );
      })}

      {selectedBus && (
        <SeatLayoutModal
          bus={selectedBus}
          from={from}
          to={to}
          date={date}
          onClose={() => setSelectedBus(null)}
        />
      )}
    </div>
  );
}
