import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const UpgradePlan = () => {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('quarterly')

  const plans = {
    quarterly: {
      name: 'الاشتراك الربع سنوي',
      price: '100',
      duration: '3 أشهر',
      features: [
        'الوصول الكامل إلى جميع الدروس',
        'الوصول الكامل إلى جميع التمارين',
        'الوصول الكامل إلى جميع الملخصات',
        'تحميل غير محدود للملفات',
        'دعم فني على مدار الساعة'
      ]
    },
    biannual: {
      name: 'الاشتراك النصف سنوي',
      price: '180',
      duration: '6 أشهر',
      features: [
        'الوصول الكامل إلى جميع الدروس',
        'الوصول الكامل إلى جميع التمارين',
        'الوصول الكامل إلى جميع الملخصات',
        'تحميل غير محدود للملفات',
        'دعم فني على مدار الساعة',
        'خصم 10% على سعر الاشتراك الربع سنوي'
      ]
    },
    annual: {
      name: 'الاشتراك السنوي',
      price: '300',
      duration: '12 شهر',
      features: [
        'الوصول الكامل إلى جميع الدروس',
        'الوصول الكامل إلى جميع التمارين',
        'الوصول الكامل إلى جميع الملخصات',
        'تحميل غير محدود للملفات',
        'دعم فني على مدار الساعة',
        'خصم 25% على سعر الاشتراك الربع سنوي',
        'أولوية في الحصول على المحتوى الجديد'
      ]
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">ترقية الاشتراك</h1>
          <p className="text-lg text-gray-600">اختر الخطة المناسبة لك واستمتع بالوصول الكامل إلى جميع المحتويات التعليمية</p>
        </motion.div>

        {/* Plan Selection */}
        <motion.div 
          className="bg-white shadow rounded-lg glass-card overflow-hidden mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-medium text-gray-900">اختر خطة الاشتراك</h2>
          </div>
          
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(plans).map(([planId, plan], index) => (
                <motion.div 
                  key={planId}
                  variants={itemVariants}
                  className={`border rounded-lg p-6 cursor-pointer transition-all duration-300 ${selectedPlan === planId ? 'border-primary bg-primary bg-opacity-5 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow'}`}
                  onClick={() => setSelectedPlan(planId)}
                >
                  <div className="flex items-center mb-4">
                    <div className={`w-5 h-5 rounded-full border ${selectedPlan === planId ? 'border-primary' : 'border-gray-300'} flex items-center justify-center mr-3`}>
                      {selectedPlan === planId && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 mr-1">ريال</span>
                    <span className="text-sm text-gray-500 block mt-1">لمدة {plan.duration}</span>
                  </div>
                  
                  <ul className="text-sm text-gray-600 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Payment Options */}
        <motion.div 
          className="bg-white shadow rounded-lg glass-card overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-medium text-gray-900">طرق الدفع المتاحة</h2>
          </div>
          
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <svg className="h-8 w-8 text-blue-500 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">تحويل بنكي</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">يمكنك التحويل إلى حسابنا البنكي وإرفاق صورة الإيصال</p>
              </div>
              
              <div className="border rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <svg className="h-8 w-8 text-green-500 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">STC Pay</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">يمكنك الدفع عبر تطبيق STC Pay على رقم الجوال المخصص</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Proceed to Payment */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            to="/payment-form" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
          >
            المتابعة إلى الدفع
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          
          <p className="mt-4 text-sm text-gray-500">
            بالضغط على "المتابعة إلى الدفع"، أنت توافق على 
            <a href="#" className="text-primary hover:text-secondary">شروط الخدمة</a> و
            <a href="#" className="text-primary hover:text-secondary">سياسة الخصوصية</a>
          </p>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">الأسئلة الشائعة</h2>
          
          <div className="bg-white shadow rounded-lg glass-card overflow-hidden">
            <div className="divide-y divide-gray-200">
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 mb-2">كيف يتم تفعيل الاشتراك؟</h3>
                <p className="text-gray-600">بعد إتمام عملية الدفع، سيتم مراجعة المعلومات وتفعيل الاشتراك خلال 24 ساعة كحد أقصى.</p>
              </div>
              
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 mb-2">هل يمكنني إلغاء الاشتراك؟</h3>
                <p className="text-gray-600">نعم، يمكنك إلغاء الاشتراك في أي وقت، ولكن لا يتم استرداد المبلغ المدفوع.</p>
              </div>
              
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 mb-2">هل يمكنني تغيير خطة الاشتراك؟</h3>
                <p className="text-gray-600">نعم، يمكنك ترقية خطة الاشتراك في أي وقت، وسيتم احتساب المبلغ المتبقي من الاشتراك الحالي.</p>
              </div>
              
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 mb-2">ماذا يحدث بعد انتهاء فترة الاشتراك؟</h3>
                <p className="text-gray-600">بعد انتهاء فترة الاشتراك، سيتم تحويل حسابك تلقائيًا إلى الخطة المجانية، ويمكنك تجديد الاشتراك في أي وقت.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default UpgradePlan