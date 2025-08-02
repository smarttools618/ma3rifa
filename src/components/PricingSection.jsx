import { motion } from 'framer-motion'
import PricingCard from './PricingCard'

const PricingSection = () => {
  const freePlanFeatures = [
    '10 دروس',
    '10 تمارين',
    '10 ملخصات',
    'إمكانية تحميل الملفات',
    'دعم فني محدود',
  ]

  const paidPlanFeatures = [
    '100 درس',
    '100 تمرين',
    '100 ملخص',
    'إمكانية تحميل الملفات',
    'دعم فني على مدار الساعة',
    'محتوى حصري',
    'تحديثات مستمرة',
  ]

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">خطط الأسعار</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اختر الخطة المناسبة لك واستمتع بمحتوى تعليمي متميز
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard 
            plan="الخطة المجانية" 
            price="مجاني" 
            features={freePlanFeatures} 
            isPrimary={false} 
          />
          
          <PricingCard 
            plan="الخطة المدفوعة" 
            price="10" 
            features={paidPlanFeatures} 
            isPrimary={true} 
          />
        </div>
      </div>
    </section>
  )
}

export default PricingSection