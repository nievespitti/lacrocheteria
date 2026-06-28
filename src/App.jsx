import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Galeria from './pages/Galeria'
import SobreNosotras from './pages/SobreNosotras'
import Contacto from './pages/Contacto'
import Disenador from './pages/Disenador'

function App() {
  return (
    <div className="site-wrapper">
      <Header />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/sobre-nosotras" element={<SobreNosotras />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/disenador" element={<Disenador />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
