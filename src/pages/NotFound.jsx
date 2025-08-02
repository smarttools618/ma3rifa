import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50"
    >
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-primary">404</h1>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mt-4 mb-2">الصفحة غير موجودة</h2>
            <p className="text-gray-600 mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse justify-center">
              <Link
                to="/"
                className="px-5 py-3 bg-primary text-white rounded-md hover:bg-secondary transition-colors duration-300 shadow-md"
              >
                العودة للصفحة الرئيسية
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="px-5 py-3 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-300 shadow-sm"
              >
                العودة للصفحة السابقة
              </button>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12"
        >
          <p className="text-gray-500 text-sm">
            هل تحتاج إلى مساعدة؟ يرجى <a href="mailto:support@basit.edu.sa" className="text-primary hover:text-secondary">التواصل مع فريق الدعم</a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default NotFound