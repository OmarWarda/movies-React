import { useState, useEffect } from "react";
import StarRating from './StarRating'

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);



const KEY = '3df29d'
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading , setIsLoading] = useState(false)
  const [error , setError] = useState("")
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("")

  // useEffect(function(){
  //   console.log("After Initial render");
  // },[])

  // useEffect(function(){
  //   console.log("After every render");
  // })

  // console.log("During render");

  function handleSelectMovie(id){
    setSelectedId((selectedId) => id === selectedId ? null : id)
  }

  function handleCloseMovie(){
    setSelectedId(null)
  }

  function handleAddWatched(movie){
    setWatched((watched) => [...watched, movie])
  }
  function handleDeleteWatched(id){
    setWatched(watched => watched.filter(movie => movie.imdbID !== id))
  }

  // useEffect works only when the component mounts
  useEffect(function(){
    const controller = new AbortController();
    async function fetchMovies(){
      try{
        setIsLoading(true)
        setError("")
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, 
          {signal: controller.signal});

        if(!res.ok){
          throw new Error("Something went wrong while fetching movies!")
        }
        const data = await res.json();

        if(data.Response === "False"){
          throw new Error ("Movie Not Found")
        }
        setMovies(data.Search);
        // setIsLoading(false)
      }
      catch(err){
        console.error(err.message);
        setError(err.message)
      } finally{
        setIsLoading(false)
      }
      }

      if(query.length < 3){
        setMovies([]);
        setError("")
        return
      }
    fetchMovies()

    return function(){
      controller.abort()
    }
  }, [query])


  // useEffect(function() {
  //   async function fetchMovies() {
  //     const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  //     const data = await res.json();
  //     setMovies(data.Search)
  //   }
  // }, [])
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery}/>
        <NumResults movies={movies}/>
      </NavBar>

      <Main>
        <Box>
        {/* {
        isLoading ? 
          <Loader/>:
          <MovieList movies={movies}></MovieList>
        } */}
        {isLoading && <Loader></Loader>}
        {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie}></MovieList>}
        {error && <ErrorMessage message={error}></ErrorMessage>}
        </Box>
        <Box>
         { 
         selectedId ? 
         <MovieDetails 
            selectedId={selectedId} 
            onCloseMovie={handleCloseMovie} 
            onAddWatched={handleAddWatched}
            watched={watched}/>
          : <>
          <Summary watched={watched}/>
          <WatchedMovies watched={watched} onDeleteMovie={handleDeleteWatched}/>
        </>
          }
        </Box>
      </Main>
    </>
  );
}
function Loader() {
  const spinner = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M11 2v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM11 18v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM4.223 5.637l2.83 2.83c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.83-2.83c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM15.533 16.947l2.83 2.83c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.83-2.83c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM2 13h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1zM18 13h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1zM5.637 19.777l2.83-2.83c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.83 2.83c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM16.947 8.467l2.83-2.83c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.83 2.83c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"></path>
    </svg>
  );
  return <div className="spinner">{spinner}</div>;
}

function ErrorMessage({message}){
  return (
    <p className="error">
      <span >🥵</span> {message}
    </p>
  )
}
function NavBar({children}){
  
  return <nav className="nav-bar">
    <Logo/>
    {children}
    </nav>
}

function Logo(){
  return ( 
  <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
  </div>
  )
}
function Search({query , setQuery}){
  
  return  (
  <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  )
}

function NumResults({movies}){
  return <p className="num-results">
    Found <strong>{movies.length}</strong> results
  </p>
}


function Main({children}){
return (
  <main className="main">
    {children}
</main>)
}
function Box({children}){
  const [isOpen, setIsOpen] = useState(true);

  return <div className="box">
  <button
    className="btn-toggle"
    onClick={() => setIsOpen((open) => !open)}
  >
    {isOpen ? "-" : "+"}
  </button>
  {isOpen && (children)}
</div>
}

// function WatchedList(){
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (<div className="box">
//     <button
//       className="btn-toggle"
//       onClick={() => setIsOpen2((open) => !open)}
//     >
//       {isOpen2 ? "–" : "+"}
//     </button>
//     {isOpen2 && (
//       <>
//         <Summary watched={watched}/>
//         <WatchedMovies watched={watched}/>
//       </>
//     )}
//   </div>)
// }


function MovieList({movies , onSelectMovie}){

  
  return (<ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie}/>
    ))}
  </ul>)
}
function Movie({movie , onSelectMovie}){
 
  return (
  <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>)
}

function MovieDetails({selectedId, onCloseMovie, onAddWatched , watched}){
  const [movie , setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState('')

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  // const isWatched = watched.some((movie) => movie.imdbId === selectedId);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  const {
    Title: title, 
    Year: year, 
    Poster: poster, 
    Runtime: runtime, 
    imdbRating, 
    Plot: plot, 
    Released: released, 
    Actors: actors, 
    Director: director, 
    Genre: genre} = movie

    function handleAdd(){
      const newWatchedMovie = {
        imdbID: selectedId,
        title,
        year,
        poster,
        imdbRating: Number(imdbRating),
        runtime: Number(runtime.split(" ").at(0)),
        userRating
      }
    
      onAddWatched(newWatchedMovie)
      onCloseMovie()
    }
  useEffect(function(){
    async function getMoviesDetails(){
      setIsLoading(true)
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json()
      setMovie(data)
      setIsLoading(false) 
    }
   
    getMoviesDetails()
  },[selectedId])

  useEffect(function(){
    if(!title) return
    document.title = `Movie: ${title}`;
    // Cleanup function
    return function (){
      document.title = "Movies App"
    }
  },[title])
  return (
    <div className="details">
      {isLoading ? <Loader></Loader> : 
      <>
              <header>
        <button className="btn-back" onClick={() => onCloseMovie()}>&larr;</button>
        <img src={poster} alt={`Poster of ${movie} movie`}/>
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>{imdbRating} IMDB rating
          </p>
        </div>
      </header>
      </>
      }


      <section>
      <div className="rating">
              {!isWatched ?   
              <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                        <button className="btn-add" onClick={handleAdd}>
                          + Add to list
                        </button>
                  )}
              </>
              : (
                <p>
                  You rated this movie with {watchedUserRating}<span>⭐️</span>
                </p>
              )}
            </div>
        
        <p><em>{plot}</em></p>
        <p>Starring {actors}</p>
        <p>Directed By {director}</p>
      </section>
    </div>
  )
}


// (
//   <>
//     <StarRating
//       maxRating={10}
//       size={24}
//       onSetRating={setUserRating}
//     />
//     {userRating > 0 && (
//       <button className="btn-add" onClick={handleAdd}>
//         + Add to list
//       </button>
//     )}
//   </>
// )
function Summary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (<div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating.toFixed(2)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating.toFixed(2)}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>)
}

function WatchedMovies({watched, onDeleteMovie}){
  return ( <ul className="list">
    {watched.map((movie) => (
      <WatchedMovie movie={movie} key={movie.imdbID} onDeleteMovie={onDeleteMovie}/>
    ))}
  </ul>)
}

function WatchedMovie({movie, onDeleteMovie}){
  return (<li key={movie.imdbID}>
    <img src={movie.poster} alt={`${movie.title} poster`} />
    <h3>{movie.title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>
      <button className="btn-delete" onClick={() => onDeleteMovie(movie.imdbID)}>X</button>
    </div>
  </li>)
}