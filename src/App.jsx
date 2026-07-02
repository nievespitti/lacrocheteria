import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Galeria from './pages/Galeria'
import SobreNosotras from './pages/SobreNosotras'
import Contacto from './pages/Contacto'
import Disenador from './pages/Disenador'
import Aprender from './pages/Aprender'
import Leccion from './pages/Leccion'
import Login from './pages/Login'
import Registro from './pages/Registro'

function App() {
  return (
    <AuthProvider>
      <div className="site-wrapper">
        <Header />
        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/sobre-nosotras" element={<SobreNosotras />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/disenador" element={<Disenador />} />
            <Route path="/aprender" element={<Aprender />} />
            <Route path="/aprender/:nivelId/:leccionId" element={<Leccion />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
