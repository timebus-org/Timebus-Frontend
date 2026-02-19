import React, { useState, useEffect, useRef } from "react";

export default function CitySelect({ label, onCitySelect }) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const containerRef = useRef();

  useEffect(() => {
    if (!query) {
      setCities([]);
      return;
    }
    fetch(`/api/cities`)
      .then((res) => res.json())
      .then((data) => {
        // Simple filter on frontend (for production can do backend filter)
        const filtered = data.filter((c) =>
          c.name.toLowerCase().startsWith(query.toLowerCase())
        );
        setCities(filtered);
      });
  }, [query]);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClick(e) {
      if (!containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function onSelect(city) {
    setSelectedCity(city);
    setQuery(city.name);
    setShowDropdown(false);
    onCitySelect(city.key); // send city key to parent
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <label>{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedCity(null);
          setShowDropdown(true);
          onCitySelect(null);
        }}
        onFocus={() => setShowDropdown(true)}
        autoComplete="off"
        placeholder="Start typing city"
        required
      />
      {showDropdown && cities.length > 0 && (
        <ul
          style={{
            position: "absolute",
            backgroundColor: "white",
            border: "1px solid #ccc",
            width: "100%",
            maxHeight: "150px",
            overflowY: "auto",
            margin: 0,
            padding: 0,
            listStyle: "none",
            zIndex: 10,
          }}
        >
          {cities.map((city) => (
            <li
              key={city.id}
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => onSelect(city)}
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
