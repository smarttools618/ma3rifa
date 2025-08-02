import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import SuccessMessage from '../components/SuccessMessage'
import ErrorMessage from '../components/ErrorMessage'
import { supabase } from '../services/supabaseClient'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('يرجى ملء جميع الحقول المطلوبة')
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('يرجى إدخال بريد إلكتروني صحيح')
      }

      // Submit to Supabase
      const { error: supabaseError } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || 'استفسار عام',
          message: formData.message,
          created_at: new Date().toISOString()
        }])

      if (supabaseError) throw supabaseError

      // Reset form and show success
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      setSuccess(true)
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
      
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-primary">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">اتصل بنا</h1>
              <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
                نحن هنا للإجابة على جميع استفساراتك ومساعدتك في كل ما تحتاجه
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info & Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:w-1/3"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">معلومات الاتصال</h2>
                
                <div className="glass-card p-6 rounded-xl mb-6">
                  <div className="flex items-start mb-6">
                    <div className="bg-primary p-3 rounded-full text-white mr-4">
                      <FaPhone className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">الهاتف</h3>
                      <p className="text-gray-600">+966 12 345 6789</p>
                      <p className="text-gray-600">+966 12 345 6780</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-6">
                    <div className="bg-primary p-3 rounded-full text-white mr-4">
                      <FaEnvelope className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">البريد الإلكتروني</h3>
                      <p className="text-gray-600">info@basit.com</p>
                      <p className="text-gray-600">support@basit.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary p-3 rounded-full text-white mr-4">
                      <FaMapMarkerAlt className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">العنوان</h3>
                      <p className="text-gray-600">شارع الملك فهد، الرياض</p>
                      <p className="text-gray-600">المملكة العربية السعودية</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-xl">
                  <h3 className="font-bold text-gray-800 mb-3">ساعات العمل</h3>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">الأحد - الخميس:</span>
                    <span className="text-gray-800">9:00 ص - 5:00 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الجمعة - السبت:</span>
                    <span className="text-gray-800">مغلق</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:w-2/3"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">أرسل لنا رسالة</h2>
                
                {success && (
                  <SuccessMessage 
                    message="تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا." 
                    onDismiss={() => setSuccess(false)} 
                  />
                )}
                
                {error && (
                  <ErrorMessage 
                    message={error} 
                    onRetry={() => setError(null)} 
                  />
                )}
                
                <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 mb-2">الاسم <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-2">البريد الإلكتروني <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 mb-2">رقم الهاتف</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-gray-700 mb-2">الموضوع</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="form-input w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 mb-2">الرسالة <span className="text-red-500">*</span></label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className="form-input w-full rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary py-3 px-8 rounded-lg font-medium transition-all duration-300 inline-flex items-center justify-center"
                  >
                    {loading ? <LoadingSpinner size="small" text="جاري الإرسال..." /> : 'إرسال الرسالة'}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-gray-800 mb-8 text-center"
            >
              موقعنا
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden shadow-lg h-96"
            >
              {/* Placeholder for map - in a real app, you would integrate Google Maps or similar */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-lg">خريطة الموقع ستظهر هنا</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">الأسئلة الشائعة</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                إليك بعض الإجابات على الأسئلة الشائعة التي قد تكون لديك
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl mb-4"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">كم من الوقت يستغرق الرد على استفساري؟</h3>
                <p className="text-gray-600">
                  نحن نسعى جاهدين للرد على جميع الاستفسارات في غضون 24 ساعة خلال أيام العمل. قد تستغرق الاستفسارات المعقدة وقتًا أطول للرد.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl mb-4"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">هل يمكنني زيارة مكتبكم شخصيًا؟</h3>
                <p className="text-gray-600">
                  نعم، يمكنك زيارة مكتبنا خلال ساعات العمل الرسمية. نوصي بتحديد موعد مسبق لضمان توفر الموظف المناسب لمساعدتك.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl mb-4"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">كيف يمكنني الإبلاغ عن مشكلة فنية؟</h3>
                <p className="text-gray-600">
                  يمكنك الإبلاغ عن المشاكل الفنية من خلال نموذج الاتصال أعلاه، أو عن طريق إرسال بريد إلكتروني مباشرة إلى support@basit.com مع وصف تفصيلي للمشكلة.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">هل تقدمون خدمة العملاء على مدار الساعة؟</h3>
                <p className="text-gray-600">
                  حاليًا، خدمة العملاء متاحة فقط خلال ساعات العمل الرسمية. نعمل على توسيع ساعات الدعم في المستقبل لتلبية احتياجات عملائنا بشكل أفضل.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default Contact