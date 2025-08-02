import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const PricingCard = ({ plan, price, features, isPrimary }) => {
  const { user } = useAuth()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`glass-card p-8 ${isPrimary ? 'border-primary border-2' : 'border-gray-200'}`}
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {isPrimary && (
        <div className="absolute -top-4 right-0 left-0 mx-auto w-max px-4 py-1 bg-primary text-white rounded-full font-bold text-sm">
          الأكثر شعبية
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className={`text-2xl font-bold mb-3 ${isPrimary ? 'text-gradient' : 'text-gray-800'}`}>{plan}</h3>
        <div className="flex justify-center items-baseline">
          <span className={`text-5xl font-bold ${isPrimary ? 'text-primary' : 'text-gray-800'}`}>{price}</span>
          {price !== 'مجاني' && <span className="text-gray-500 mr-2 text-xl">د.ت / شهرياً</span>}
        </div>
      </div>

      <ul className="space-y-4 mb-10">
        {features.map((feature, index) => (
          <motion.li 
            key={index} 
            className="flex items-center"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1, x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ml-3 ${isPrimary ? 'text-primary' : 'text-green-500'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700 text-lg">{feature}</span>
          </motion.li>
        ))}
      </ul>

      <div className="text-center">
        {user ? (
          <Link
            to="/dashboard"
            className={isPrimary ? 'btn-primary w-full' : 'btn-secondary w-full'}
            aria-label={`الذهاب إلى لوحة التحكم للخطة ${plan}`}
          >
            <span className="text-lg font-bold">الذهاب إلى لوحة التحكم</span>
          </Link>
        ) : (
          <Link
            to={`/signup?plan=${isPrimary ? 'paid' : 'free'}`}
            className={isPrimary ? 'btn-primary w-full' : 'btn-secondary w-full'}
            aria-label={`اشترك الآن في الخطة ${plan}`}
          >
            <span className="text-lg font-bold">{isPrimary ? 'اشترك الآن' : 'ابدأ مجاناً'}</span>
            {isPrimary && (
              <motion.span 
                className="inline-block mr-2"
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ←
              </motion.span>
            )}
          </Link>
        )}
      </div>
      
      {isPrimary && !user && (
        <p className="text-center mt-4 text-sm text-gray-500">لا يوجد التزام، يمكنك الإلغاء في أي وقت</p>
      )}
    </motion.div>
  )
}

export default PricingCard