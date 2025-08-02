import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Hero = () => {
  const { user } = useAuth()

  return (
    <div className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-primary rounded-full opacity-70 animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-secondary rounded-full opacity-70 animate-ping animation-delay-2000"></div>
        <div className="absolute top-2/3 right-1/3 w-5 h-5 bg-accent rounded-full opacity-70 animate-ping animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-12 md:mb-0"
          >
            <motion.span 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block px-4 py-1 bg-light-color text-primary rounded-full font-medium mb-6"
            >
              المنصة التعليمية الأولى في تونس
            </motion.span>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="block text-gradient mb-2"
              >
                منصة المعرفة
              </motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="block text-gray-800"
              >
                تعلم بطريقة ممتعة
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg"
            >
              نوفر دروس وتمارين وملخصات للطلاب من السنة الأولى إلى السنة السادسة بطريقة سهلة وممتعة تساعدهم على التفوق والنجاح.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 sm:space-x-reverse"
            >
              {user ? (
                <Link to="/dashboard" className="btn-primary text-center text-lg">
                  <span className="font-bold">الذهاب إلى لوحة التحكم</span>
                </Link>
              ) : (
                <Link to="/signup" className="btn-primary text-center text-lg">
                  <span className="font-bold">ابدأ الآن مجاناً</span>
                  <motion.span 
                    className="inline-block mr-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    ←
                  </motion.span>
                </Link>
              )}
              <Link to="/#pricing" className="btn-secondary text-center text-lg">
                <span className="font-bold">عرض الأسعار</span>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-10 flex items-center"
            >
              <div className="flex -space-x-2 space-x-reverse mr-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <img 
                      src={`/src/assets/avatar-${i}.svg`} 
                      alt="مستخدم" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=User+${i}&background=random`;
                      }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-gray-600">
                انضم إلى أكثر من <span className="font-bold text-primary">1000+</span> طالب
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 relative"
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-light-color rounded-full z-0"></div>
              <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-accent opacity-30 rounded-full z-0"></div>
              
              {/* Blob shape behind image */}
              <svg className="absolute top-0 left-0 w-full h-full text-primary opacity-5 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M45.3,-59.1C59.9,-51.9,73.5,-40.5,79.8,-25.8C86.1,-11.1,85.1,6.7,78.7,21.4C72.4,36.1,60.7,47.7,46.6,57.1C32.6,66.5,16.3,73.7,-0.6,74.5C-17.5,75.3,-35,69.7,-48.7,59.4C-62.3,49.1,-72.1,34.1,-76.3,17.3C-80.5,0.5,-79.1,-18.1,-71.2,-32.8C-63.3,-47.5,-49,-58.3,-34.5,-65.3C-20,-72.3,-5,-75.5,8.2,-72.9C21.3,-70.3,30.7,-66.3,45.3,-59.1Z" transform="translate(100 100)" />
              </svg>
              
              {/* Glass card effect */}
              <div className="absolute inset-0 glass rounded-3xl transform rotate-3 scale-95 z-0"></div>
              
              {/* Main image */}
              <motion.div
                className="relative z-10 glass-card p-4 rounded-3xl overflow-hidden"
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 89, 255, 0.25)" }}
                transition={{ duration: 0.3 }}
              >
                <motion.img 
                  src="/src/assets/hero-image.svg" 
                  alt="طلاب يتعلمون" 
                  className="w-full h-auto max-w-lg mx-auto floating"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </motion.div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute top-10 -right-5 bg-white p-3 rounded-lg shadow-lg z-20"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-800">+100 درس</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-10 -left-5 bg-white p-3 rounded-lg shadow-lg z-20"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-800">تحديثات مستمرة</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Hero