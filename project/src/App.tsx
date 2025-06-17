import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Menu from './components/Menu';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingOrderButton from './components/FloatingOrderButton';
import Newsletter from './components/Newsletter';
import LoginModal from './components/Auth/LoginModal';
import OrderPage from './components/Order/OrderPage';
import MyOrders from './components/Customer/MyOrders';
import MyProfile from './components/Customer/MyProfile';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManageMenu from './components/Admin/ManageMenu';
import ManageOrders from './components/Admin/ManageOrders';
import ManageContact from './components/Admin/ManageContact';
import ManageUsers from './components/Admin/ManageUsers';
import AdminLogs from './components/Admin/AdminLogs';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartItem = (id, quantity) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={setCurrentPage} />
            <About />
            <Services />
            <Newsletter />
          </>
        );
      case 'about':
        return <About />;
      case 'services':
        return <Services />;
      case 'menu':
        return (
          <Menu
            cartItems={cartItems}
            addToCart={addToCart}
            updateCartItem={updateCartItem}
          />
        );
      case 'contact':
        return <Contact />;
      case 'order':
        return <OrderPage />;
      case 'my-orders':
        return <MyOrders />;
      case 'my-profile':
        return <MyProfile />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-menu':
        return <ManageMenu />;
      case 'admin-orders':
        return <ManageOrders />;
      case 'admin-contact':
        return <ManageContact />;
      case 'admin-users':
        return <ManageUsers />;
      case 'admin-logs':
        return <AdminLogs />;
      default:
        return (
          <>
            <Hero onNavigate={setCurrentPage} />
            <About />
            <Services />
            <Newsletter />
          </>
        );
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Header 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          onShowLogin={() => setShowLoginModal(true)}
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        />
        <main>
          {renderPage()}
        </main>
        <Footer onNavigate={setCurrentPage} />
        <FloatingOrderButton onNavigate={setCurrentPage} />
        
        {showLoginModal && (
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
          />
        )}
        
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;