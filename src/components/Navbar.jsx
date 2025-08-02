import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-nav py-2 shadow-lg' : 'py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center group">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent/30 animate-ping"></span>
            <h1 className="text-2xl font-bold relative">
              <span className="text-gradient">منصة المعرفة</span>
            </h1>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-1 ml-6">
            {["الرئيسية", "من نحن", "اتصل بنا", "الأسعار"].map((item, index) => (
              <Link 
                key={index} 
                to={index === 0 ? "/" : index === 3 ? "/#pricing" : `/${item === "من نحن" ? "about" : "contact"}`}
                className="relative px-4 py-2 group"
              >
                <span className="relative z-10 text-gray-700 group-hover:text-primary transition-colors duration-300">{item}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="btn-secondary ml-4 flex items-center gap-2 group"
              >
                <span>لوحة التحكم</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <button 
                onClick={handleSignOut} 
                className="relative px-4 py-2 overflow-hidden group"
              >
                <span className="relative z-10 text-gray-700 group-hover:text-primary transition-colors duration-300">تسجيل الخروج</span>
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-red-500/50 group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="relative px-4 py-2 overflow-hidden group ml-4"
              >
                <span className="relative z-10 text-gray-700 group-hover:text-primary transition-colors duration-300">تسجيل الدخول</span>
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="/signup" 
                className="btn-primary flex items-center gap-2 group"
              >
                <span>إنشاء حساب</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu} 
            className="relative w-10 h-10 flex justify-center items-center rounded-full hover:bg-gray-100/30 transition-colors duration-300 focus:outline-none"
          >
            <motion.div
              animate={isMobileMenuOpen ? "open" : "closed"}
              variants={{
                open: { rotate: 180 },
                closed: { rotate: 0 }
              }}
              transition={{ duration: 0.3 }}
              className="w-6 h-6 flex flex-col justify-center items-center"
            >
              <motion.span
                variants={{
                  open: { rotate: 45, y: 2 },
                  closed: { rotate: 0, y: 0 }
                }}
                className="w-5 h-0.5 bg-primary block mb-1 transition-all"
              />
              <motion.span
                variants={{
                  open: { opacity: 0 },
                  closed: { opacity: 1 }
                }}
                className="w-5 h-0.5 bg-primary block mb-1 transition-all"
              />
              <motion.span
                variants={{
                  open: { rotate: -45, y: -2 },
                  closed: { rotate: 0, y: 0 }
                }}
                className="w-5 h-0.5 bg-primary block transition-all"
              />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-nav py-4 px-6 overflow-hidden shadow-lg"
          >
            <div className="flex flex-col space-y-4">
              {["الرئيسية", "من نحن", "اتصل بنا", "الأسعار"].map((item, index) => (
                <Link 
                  key={index} 
                  to={index === 0 ? "/" : index === 3 ? "/#pricing" : `/${item === "من نحن" ? "about" : "contact"}`}
                  className="relative overflow-hidden group py-3 border-b border-gray-100/20"
                  onClick={toggleMobileMenu}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 group-hover:text-primary transition-colors duration-300">{item}</span>
                    <motion.span
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </motion.span>
                  </div>
                </Link>
              ))}
              
              <div className="pt-2">
                {user ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="flex items-center justify-between py-3 border-b border-gray-100/20 group"
                      onClick={toggleMobileMenu}
                    >
                      <span className="text-primary font-medium">لوحة التحكم</span>
                      <span className="w-5 h-5 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </Link>
                    <button 
                      onClick={() => { handleSignOut(); toggleMobileMenu(); }} 
                      className="w-full flex items-center justify-between py-3 text-right group"
                    >
                      <span className="text-red-500 font-medium">تسجيل الخروج</span>
                      <span className="w-5 h-5 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-4 pt-2">
                    <Link 
                      to="/login" 
                      className="btn-secondary w-full flex items-center justify-center gap-2 py-3"
                      onClick={toggleMobileMenu}
                    >
                      <span>تسجيل الدخول</span>
                    </Link>
                    <Link 
                      to="/signup" 
                      className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                      onClick={toggleMobileMenu}
                    >
                      <span>إنشاء حساب</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar