import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  // Social media icons
  const socialLinks = [
    { icon: "facebook", url: "#", color: "#1877F2" },
    { icon: "twitter", url: "#", color: "#1DA1F2" },
    { icon: "instagram", url: "#", color: "#E4405F" },
    { icon: "youtube", url: "#", color: "#FF0000" },
  ]

  // Quick links with icons
  const quickLinks = [
    { name: "الرئيسية", path: "/", icon: "home" },
    { name: "من نحن", path: "/about", icon: "info" },
    { name: "اتصل بنا", path: "/contact", icon: "mail" },
    { name: "الأسعار", path: "/#pricing", icon: "tag" },
    { name: "تسجيل الدخول", path: "/login", icon: "login" },
    { name: "إنشاء حساب", path: "/signup", icon: "user-plus" },
  ]

  // Function to render social icon SVG
  const renderSocialIcon = (icon) => {
    switch(icon) {
      case 'facebook':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
          </svg>
        )
      case 'twitter':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
          </svg>
        )
      case 'instagram':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        )
      case 'youtube':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
        )
      default:
        return null
    }
  }

  // Function to render link icon SVG
  const renderLinkIcon = (icon) => {
    switch(icon) {
      case 'home':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        )
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
      case 'mail':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        )
      case 'tag':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        )
      case 'login':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )
      case 'user-plus':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-gray-100 pt-16 pb-8 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-70"></div>
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-primary/5 blur-2xl"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-accent/5 blur-xl"></div>
      
      <div className="container mx-auto px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">
              <span className="text-gradient">منصة المعرفة</span>
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              منصة تعليمية متكاملة توفر دروس وتمارين وملخصات للطلاب من السنة الأولى إلى السنة السادسة. نهدف إلى تسهيل التعلم وجعله أكثر متعة وفعالية.
            </p>
            
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map((social, index) => (
                <motion.a 
                  key={index}
                  href={social.url}
                  whileHover={{ y: -3 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300`}
                  style={{ backgroundColor: `${social.color}20`, color: social.color }}
                >
                  {renderSocialIcon(social.icon)}
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="md:col-span-1">
            <h3 className="text-lg font-bold text-gray-800 mb-5 relative inline-block">
              روابط سريعة
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link to={link.path} className="flex items-center text-gray-600 hover:text-primary transition-colors group">
                    <span className="mr-2 text-primary opacity-70 group-hover:opacity-100">
                      {renderLinkIcon(link.icon)}
                    </span>
                    <span>{link.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-5 relative inline-block">
              تواصل معنا
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent"></span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="mr-3 mt-1 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <div>
                  <p className="text-gray-800 font-medium mb-1">البريد الإلكتروني:</p>
                  <a href="mailto:info@manassat-almarifa.com" className="text-gray-600 hover:text-primary transition-colors">info@manassat-almarifa.com</a>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="mr-3 mt-1 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </span>
                <div>
                  <p className="text-gray-800 font-medium mb-1">الهاتف:</p>
                  <a href="tel:+21600000000" className="text-gray-600 hover:text-primary transition-colors">+216 XX XXX XXX</a>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="mr-3 mt-1 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </span>
                <div>
                  <p className="text-gray-800 font-medium mb-1">العنوان:</p>
                  <p className="text-gray-600">تونس، الجمهورية التونسية</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 pt-6 border-t border-gray-200/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex justify-center md:justify-start space-x-6 rtl:space-x-reverse">
                <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors text-sm">شروط الاستخدام</Link>
                <Link to="/privacy" className="text-gray-600 hover:text-primary transition-colors text-sm">سياسة الخصوصية</Link>
                <Link to="/refund-policy" className="text-gray-600 hover:text-primary transition-colors text-sm">سياسة الاسترداد</Link>
              </div>
            </div>
            
            <p className="text-center text-gray-600 text-sm">
              <span className="inline-block">
                جميع الحقوق محفوظة &copy; {currentYear}
              </span>
              <span className="mx-1 inline-block text-primary font-medium">منصة المعرفة</span>
              <span className="inline-block">🇹🇳</span>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer