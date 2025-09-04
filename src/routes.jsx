import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Favorites from './pages/Favorites.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import TVShowDetails from './pages/TVShowDetails.jsx'

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/favorites" element={<Favorites />}></Route>
            <Route path="/movie/:id" element={<MovieDetails />}></Route>
            <Route path="/tv/:id" element={<TVShowDetails />}></Route>
        </Routes>
    )
}

export default AppRoutes;