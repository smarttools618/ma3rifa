import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const PricingCard = ({ plan, price, features, isPrimary }) => {
  const { user } = useAuth()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`glass-card p-6 rounded-xl ${isPrimary ? 'border-primary border-2' : 'border-gray-200'}`}
    >
      <div className="text-center mb-6">
        <h3 className={`text-2xl font-bold mb-2 ${isPrimary ? 'text-primary' : 'text-gray-800'}`}>{plan}</h3>
        <div className="flex justify-center items-baseline">
          <span className="text-4xl font-bold">{price}</span>
          {price !== 'مجاني' && <span className="text-gray-500 mr-1">د.ت</span>}
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ml-2 ${isPrimary ? 'text-primary' : 'text-green-500'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="text-center">
        {user ? (
          <Link
            to="/dashboard"
            className={`block w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              isPrimary
                ? 'bg-primary text-white hover:bg-opacity-90'
                : 'bg-white text-primary border border-primary hover:bg-primary hover:text-white'
            }`}
          >
            الذهاب إلى لوحة التحكم
          </Link>
        ) : (
          <Link
            to="/signup"
            className={`block w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              isPrimary
                ? 'bg-primary text-white hover:bg-opacity-90'
                : 'bg-white text-primary border border-primary hover:bg-primary hover:text-white'
            }`}
          >
            اشترك الآن
          </Link>
        )}
      </div>
    </motion.div>
  )
}

export default PricingCard