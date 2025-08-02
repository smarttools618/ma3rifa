import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

const PaymentForm = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    amount: '100',
    payment_method: 'bank_transfer',
    transaction_id: '',
    notes: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [fileUpload, setFileUpload] = useState(null)
  const [filePreview, setFilePreview] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', text: 'حجم الملف كبير جدًا. الحد الأقصى هو 5 ميجابايت.' })
        return
      }
      
      setFileUpload(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadReceipt = async () => {
    if (!fileUpload) return null
    
    const fileExt = fileUpload.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `receipts/${user.id}/${fileName}`
    
    const { error: uploadError, data } = await supabase.storage
      .from('payments')
      .upload(filePath, fileUpload)
    
    if (uploadError) {
      throw uploadError
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('payments')
      .getPublicUrl(filePath)
    
    return publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Validate form
      if (!formData.name || !formData.phone || !formData.amount) {
        throw new Error('يرجى ملء جميع الحقول المطلوبة')
      }
      
      if (formData.payment_method === 'bank_transfer' && !fileUpload) {
        throw new Error('يرجى إرفاق صورة إيصال التحويل البنكي')
      }

      // Upload receipt if exists
      let receiptUrl = null
      if (fileUpload) {
        receiptUrl = await uploadReceipt()
      }

      // Save payment record
      const { error } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          name: formData.name,
          phone: formData.phone,
          amount: formData.amount,
          payment_method: formData.payment_method,
          transaction_id: formData.transaction_id || null,
          receipt_url: receiptUrl,
          notes: formData.notes || null,
          status: 'pending',
          created_at: new Date().toISOString()
        })

      if (error) throw error

      setMessage({ 
        type: 'success', 
        text: 'تم إرسال معلومات الدفع بنجاح. سيتم مراجعتها وتفعيل اشتراكك في أقرب وقت.' 
      })
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        amount: '100',
        payment_method: 'bank_transfer',
        transaction_id: '',
        notes: ''
      })
      setFileUpload(null)
      setFilePreview(null)
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
      
    } catch (error) {
      console.error('Error submitting payment:', error)
      setMessage({ type: 'error', text: error.message || 'حدث خطأ أثناء إرسال معلومات الدفع. يرجى المحاولة مرة أخرى.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">نموذج الدفع</h1>

        <div className="bg-white shadow rounded-lg glass-card overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">معلومات الدفع</h2>
            <p className="mt-1 text-sm text-gray-600">يرجى ملء النموذج أدناه لإتمام عملية الاشتراك</p>
          </div>
          
          <div className="px-6 py-5">
            {message.text && (
              <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="form-input w-full"
                    placeholder="أدخل الاسم الكامل"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    className="form-input w-full"
                    placeholder="أدخل رقم الهاتف"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    المبلغ (بالريال) *
                  </label>
                  <select
                    name="amount"
                    id="amount"
                    required
                    className="form-input w-full"
                    value={formData.amount}
                    onChange={handleInputChange}
                  >
                    <option value="100">100 ريال (اشتراك 3 أشهر)</option>
                    <option value="180">180 ريال (اشتراك 6 أشهر)</option>
                    <option value="300">300 ريال (اشتراك سنوي)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">
                    طريقة الدفع *
                  </label>
                  <select
                    name="payment_method"
                    id="payment_method"
                    required
                    className="form-input w-full"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                  >
                    <option value="bank_transfer">تحويل بنكي</option>
                    <option value="stcpay">STC Pay</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="transaction_id" className="block text-sm font-medium text-gray-700 mb-1">
                    رقم العملية
                  </label>
                  <input
                    type="text"
                    name="transaction_id"
                    id="transaction_id"
                    className="form-input w-full"
                    placeholder="أدخل رقم العملية (اختياري)"
                    value={formData.transaction_id}
                    onChange={handleInputChange}
                  />
                </div>

                {formData.payment_method === 'bank_transfer' && (
                  <div className="sm:col-span-2">
                    <label htmlFor="receipt" className="block text-sm font-medium text-gray-700 mb-1">
                      صورة الإيصال *
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {filePreview ? (
                          <div>
                            <img src={filePreview} alt="Receipt preview" className="mx-auto h-32 w-auto" />
                            <p className="text-xs text-gray-500 mt-2">{fileUpload.name}</p>
                          </div>
                        ) : (
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-secondary focus-within:outline-none">
                            <span>رفع ملف</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                          </label>
                          <p className="pr-1">أو اسحب وأفلت</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF حتى 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    ملاحظات
                  </label>
                  <textarea
                    name="notes"
                    id="notes"
                    rows="3"
                    className="form-input w-full"
                    placeholder="أي ملاحظات إضافية (اختياري)"
                    value={formData.notes}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الإرسال...
                    </>
                  ) : 'إرسال معلومات الدفع'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-white shadow rounded-lg glass-card overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">تعليمات الدفع</h2>
          </div>
          <div className="px-6 py-5">
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-800 mb-2">التحويل البنكي</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-700 mb-2">يمكنك التحويل إلى الحساب التالي:</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><span className="font-medium">اسم البنك:</span> البنك الأهلي السعودي</li>
                  <li><span className="font-medium">اسم المستفيد:</span> شركة منصة المعرفة التعليمية</li>
                  <li><span className="font-medium">رقم الحساب:</span> 1234567890123456</li>
                  <li><span className="font-medium">رقم الآيبان:</span> SA1234567890123456789012</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">STC Pay</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-700 mb-2">يمكنك الدفع عبر STC Pay على الرقم التالي:</p>
                <p className="text-sm font-medium text-gray-800">0501234567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white shadow rounded-lg glass-card overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">ملاحظات هامة</h2>
          </div>
          <div className="px-6 py-5">
            <ul className="text-sm text-gray-600 space-y-3 list-disc list-inside">
              <li>سيتم مراجعة معلومات الدفع وتفعيل الاشتراك خلال 24 ساعة كحد أقصى</li>
              <li>في حالة وجود أي استفسار يرجى التواصل معنا عبر البريد الإلكتروني: support@basit.edu.sa</li>
              <li>تأكد من إدخال رقم هاتف صحيح حتى نتمكن من التواصل معك في حالة وجود أي مشكلة</li>
              <li>يمكنك متابعة حالة الدفع من خلال صفحة الملف الشخصي</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PaymentForm