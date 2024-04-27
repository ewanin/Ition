import React, { useState, useEffect } from "react";
import axios from "axios";
import defaultMovieImage from "/defaultImg.png";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filters, setFilters] = useState({ language: "", country: "", genre: "",});
  const [languages, setLanguages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get("movies.json").then((response) => {
      setMovies(response.data);
      setFilteredMovies(response.data);

      const uniqueLanguages = [...new Set(response.data.flatMap(movie => movie.movielanguages))];
      setLanguages(uniqueLanguages);
      const uniqueCountries = [...new Set(response.data.flatMap(movie => movie.moviecountries))];
      setCountries(uniqueCountries);
      const uniqueGenres = [...new Set(response.data.flatMap(movie => movie.moviegenres))];
      setGenres(uniqueGenres);

      setLoading(false);
    });
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  useEffect(() => {
    let filtered = movies;
    if (filters.language) {
      filtered = filtered.filter((movie) =>
        movie.movielanguages.includes(filters.language)
      );
    }
    if (filters.country) {
      filtered = filtered.filter((movie) =>
        movie.moviecountries.includes(filters.country)
      );
    }
    if (filters.genre) {
      filtered = filtered.filter((movie) =>
        movie.moviegenres.includes(filters.genre)
      );
    }
    setFilteredMovies(filtered);
  }, [filters, movies]);

  return (
    <div className="container mx-auto p-4 font-inter">
      <h1 className="text-3xl font-bold mb-4 md:text-left text-center">Movie Catalog</h1>
      <div className="flex flex-wrap gap-4 mb-4 md:justify-normal justify-center">
        <select
          name="language"
          id="language"
          className="border rounded-md p-2 cursor-pointer"
          onChange={handleFilterChange}
        >
          <option value="">Select Language</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        <select
          name="country"
          id="country"
          className="border rounded-md p-2 cursor-pointer"
          onChange={handleFilterChange}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <select
          name="genre"
          id="genre"
          className="border rounded-md p-2 cursor-pointer"
          onChange={handleFilterChange}
        >
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="flex flex-wrap gap-4 md:justify-normal justify-center">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="border p-4 rounded-md">
              <div className="animate-pulse bg-gray-200 h-64 w-[225px]"></div>
            </div>
          ))}
        </div>
      ) : (
        filteredMovies.length === 0 ? (
          <p className="text-lg font-semibold text-center">No movies found</p>
        ) : (
          <div className="flex flex-wrap gap-4 md:justify-normal justify-center">
            {filteredMovies.map((movie) => (
              <div key={movie.imdbmovieid} className="border p-4 rounded-md hover:bg-gray-100 w-[225px] cursor-pointer hover:scale-[1.03]">
                <img
                  src={movie.moviemainphotos.length ? movie.moviemainphotos[0] : defaultMovieImage}
                  alt={movie.movietitle || "Movie Poster"}
                  className="mb-2 w-[190px] h-[281px]"
                />
                <h2 className="text-xl font-bold mb-1">{movie.movietitle || "Movie Title Data Not Available"}</h2>

                <div className="mt-2">
                  <p className=" font-semibold">Languages:</p>
                  {movie.movielanguages.length ? (
                    <span>{movie.movielanguages.length > 6 ? movie.movielanguages.slice(0, 6).join(", ") + "..." : movie.movielanguages.join(", ")}</span>
                  ) : (
                    <p>Languages: Data Not Available</p>
                  )}
                </div>

                <div className="mt-2">
                  <p className=" font-semibold">Countries:</p>
                  {movie.moviecountries.length ? (
                    <span>{movie.moviecountries.length > 6 ? movie.moviecountries.slice(0, 6).join(", ") + "..." : movie.moviecountries.join(", ")}</span>
                  ) : (
                    <p>Data Not Available</p>
                  )}
                </div>

                <div className="mt-2">
                  <p className=" font-semibold">Genres:</p>
                  {movie.moviegenres.length ? (
                    <span>{movie.moviegenres.length > 6 ? movie.moviegenres.slice(0, 6).join(", ") + "..." : movie.moviegenres.join(", ")}</span>
                  ) : (
                    <p>Data Not Available</p>
                  )}
                </div>

              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default App;