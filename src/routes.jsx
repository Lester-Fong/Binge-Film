import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Favorites from './pages/Favorites.jsx'
import MovieDetails from './pages/MovieDetails.jsx'

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/favorites" element={<Favorites />}></Route>
            <Route path="/movie/:id" element={<MovieDetails />}></Route>
        </Routes>
    )
}

export default AppRoutes;