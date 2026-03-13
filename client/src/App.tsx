import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Teams from './pages/Teams';
import Schedule from './pages/Schedule';
import Standings from './pages/Standings';
import Bracket from './pages/Bracket';
import Rules from './pages/Rules';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes (no public navbar/footer) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />

        {/* Public routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/teams" element={<PublicLayout><Teams /></PublicLayout>} />
        <Route path="/schedule" element={<PublicLayout><Schedule /></PublicLayout>} />
        <Route path="/standings" element={<PublicLayout><Standings /></PublicLayout>} />
        <Route path="/bracket" element={<PublicLayout><Bracket /></PublicLayout>} />
        <Route path="/rules" element={<PublicLayout><Rules /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
