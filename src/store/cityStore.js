let citiesCache = null;
let citiesPromise = null;

export const loadCities = async () => {
  if (citiesCache) return citiesCache;

  if (!citiesPromise) {
    citiesPromise = fetch("http://localhost:5000/api/cities")
      .then((res) => res.json())
      .then((data) => {
        citiesCache = Array.isArray(data) ? data : data.cities || [];
        return citiesCache;
      });
  }

  return citiesPromise;
};

export const getCitiesInstant = () => citiesCache;
