import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import About from './components/About';
import Branches from './components/Branches';
import BranchSelection from './components/BranchSelection';
import CustomerMenu from './components/CustomerMenu';
import Contact from './components/Contact';
import Feedback from './components/Feedback';
import OwnerLogin from './components/OwnerLogin';
import Owner from './components/Owner';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Root redirects to /home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Home Route */}
          <Route path="home" element={<Home />} />

          {/* Owner Login Secret Route (direct top-level route) */}
          <Route path="Yaba7qK29700rest" element={<OwnerLogin />} />
          <Route path="home/Yaba7qK29700rest" element={<OwnerLogin />} />

          {/* Customer Menu Flow */}
          <Route path="menu" element={<CustomerMenu />} />
          <Route path="menu/:branchId" element={<CustomerMenu />} />

          <Route path="branches" element={<Branches />} />
          <Route path="gallery" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold text-dark-900">Gallery Page</h1></div>} />
          <Route path="about" element={<About />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="contact" element={<Contact />} />

          {/* Fallback to /home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>

        {/* Owner Dashboard (Admin Panel) - Standalone without customer navbar / footer */}
        <Route path="owner" element={<Owner />} />
      </Routes>
    </Router>
  );
}

export default App;
