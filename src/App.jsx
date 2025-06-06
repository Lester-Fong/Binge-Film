import './css/App.css'
import AppRoutes from './routes'
import Navbar from './components/Navbar'
import { MovieProvider } from './contexts/MovieContext'

function App() {
  return (
    <>
      <MovieProvider>
        <Navbar />
        <main className='main-content'>
          <AppRoutes />
        </main>
      </MovieProvider>
    </>
  )
}

export default App
