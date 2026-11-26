import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import About from './components/About';
import Branches from './components/Branches';
import BranchSelection from './components/BranchSelection';
import CustomerMenu from './components/CustomerMenu';
import Contact from './components/Contact';
import Feedback from './components/Feedback';
import Gallery from './components/Gallery';
import OwnerLogin from './components/OwnerLogin';
import Owner from './components/Owner';
import { UploadProvider } from './context/UploadContext';

function EnforceDocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = 'Yaba Hotels';
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <EnforceDocumentTitle />
      <UploadProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Root redirects to /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* Home Route */}
            <Route path="home" element={<Home />} />

            {/* Customer Menu Flow */}
            <Route path="menu" element={<CustomerMenu />} />
            <Route path="menu/:branchId" element={<CustomerMenu />} />

            <Route path="branches" element={<Branches />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="about" element={<About />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="contact" element={<Contact />} />

            {/* Fallback to /home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>

          {/* Owner Login Secret Route - Standalone without customer navbar / footer */}
          <Route path="Yaba7qK29700rest" element={<OwnerLogin />} />
          <Route path="home/Yaba7qK29700rest" element={<Navigate to="/Yaba7qK29700rest" replace />} />

          {/* Owner Dashboard (Admin Panel) - Standalone without customer navbar / footer */}
          <Route path="owner" element={<Owner />} />
        </Routes>
      </UploadProvider>
    </Router>
  );
}

export default App;
