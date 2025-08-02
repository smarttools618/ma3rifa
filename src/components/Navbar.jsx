import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-2' : 'py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-primary">منصة المعرفة</h1>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary transition-colors ml-6">الرئيسية</Link>
          <Link to="/about" className="text-gray-700 hover:text-primary transition-colors ml-6">من نحن</Link>
          <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors ml-6">اتصل بنا</Link>
          <Link to="/#pricing" className="text-gray-700 hover:text-primary transition-colors ml-6">الأسعار</Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="btn-secondary ml-4">لوحة التحكم</Link>
              <button onClick={handleSignOut} className="text-gray-700 hover:text-primary transition-colors">تسجيل الخروج</button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-primary transition-colors ml-4">تسجيل الدخول</Link>
              <Link to="/signup" className="btn-primary">إنشاء حساب</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-700 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden glass-nav py-4 px-4"
        >
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors py-2" onClick={toggleMobileMenu}>الرئيسية</Link>
            <Link to="/about" className="text-gray-700 hover:text-primary transition-colors py-2" onClick={toggleMobileMenu}>من نحن</Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors py-2" onClick={toggleMobileMenu}>اتصل بنا</Link>
            <Link to="/#pricing" className="text-gray-700 hover:text-primary transition-colors py-2" onClick={toggleMobileMenu}>الأسعار</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary transition-colors py-2" onClick={toggleMobileMenu}>لوحة التحكم</Link>
                <button onClick={() => { handleSignOut(); toggleMobileMenu(); }} className="text-gray-700 hover:text-primary transition-colors py-2 text-right">تسجيل الخروج</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary transition-colors py-2" onClick={toggleMobileMenu}>تسجيل الدخول</Link>
                <Link to="/signup" className="text-gray-700 hover:text-primary transition-colors py-2" onClick={toggleMobileMenu}>إنشاء حساب</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar