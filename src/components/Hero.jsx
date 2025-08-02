import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Hero = () => {
  const { user } = useAuth()

  return (
    <div className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-12 md:mb-0"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              <span className="text-primary">منصة المعرفة</span> <br />
              المنصة التعليمية الأولى للأطفال
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              نوفر دروس وتمارين وملخصات للطلاب من السنة الأولى إلى السنة السادسة بطريقة سهلة وممتعة.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
              {user ? (
                <Link to="/dashboard" className="btn-primary text-center">
                  الذهاب إلى لوحة التحكم
                </Link>
              ) : (
                <Link to="/signup" className="btn-primary text-center">
                  ابدأ الآن مجاناً
                </Link>
              )}
              <Link to="/#pricing" className="btn-secondary text-center">
                عرض الأسعار
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 relative"
          >
            <div className="relative">
              <svg className="absolute top-0 left-0 w-full h-full text-primary opacity-5 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M45.3,-59.1C59.9,-51.9,73.5,-40.5,79.8,-25.8C86.1,-11.1,85.1,6.7,78.7,21.4C72.4,36.1,60.7,47.7,46.6,57.1C32.6,66.5,16.3,73.7,-0.6,74.5C-17.5,75.3,-35,69.7,-48.7,59.4C-62.3,49.1,-72.1,34.1,-76.3,17.3C-80.5,0.5,-79.1,-18.1,-71.2,-32.8C-63.3,-47.5,-49,-58.3,-34.5,-65.3C-20,-72.3,-5,-75.5,8.2,-72.9C21.3,-70.3,30.7,-66.3,45.3,-59.1Z" transform="translate(100 100)" />
              </svg>
              
              <motion.img 
                src="/src/assets/hero-image.svg" 
                alt="طلاب يتعلمون" 
                className="relative z-10 w-full h-auto max-w-lg mx-auto"
                initial={{ y: 20 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut" 
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Hero