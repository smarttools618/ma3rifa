import { motion } from 'framer-motion'
import PricingCard from './PricingCard'

const PricingSection = () => {
  const freePlanFeatures = [
    'الوصول إلى 10 دروس شهرياً',
    'الوصول إلى 10 تمارين شهرياً',
    'الوصول إلى 10 ملخصات شهرياً',
    'إمكانية تحميل الملفات',
    'دعم فني عبر البريد الإلكتروني',
    'تصفح من جهاز واحد',
  ]

  const paidPlanFeatures = [
    'وصول غير محدود لجميع الدروس',
    'وصول غير محدود لجميع التمارين',
    'وصول غير محدود لجميع الملخصات',
    'إمكانية تحميل جميع الملفات',
    'دعم فني على مدار الساعة',
    'محتوى حصري للمشتركين',
    'تحديثات مستمرة للمحتوى',
    'تصفح من عدة أجهزة',
  ]

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1 bg-light-color text-primary rounded-full font-medium mb-4">
            خطط مرنة لجميع الاحتياجات
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">خطط الأسعار</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            اختر الخطة المناسبة لك واستمتع بمحتوى تعليمي متميز يساعدك على التفوق في دراستك
          </p>
        </motion.div>

        <div className="relative">
          {/* Background decoration */}
          <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary opacity-5 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto relative z-10">
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
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600">
            هل لديك أسئلة حول خططنا؟ <a href="#contact" className="text-primary font-medium hover:underline">تواصل معنا</a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default PricingSection