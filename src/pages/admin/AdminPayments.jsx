import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabaseClient'
import { motion } from 'framer-motion'

const AdminPayments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('payment_receipts')
        .select(`
          *,
          profiles:user_id(id, name, email, grade)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredPayments = payments.filter(payment => {
    const searchLower = searchTerm.toLowerCase()
    return (
      payment.profiles?.name?.toLowerCase().includes(searchLower) ||
      payment.profiles?.email?.toLowerCase().includes(searchLower) ||
      payment.status?.toLowerCase().includes(searchLower)
    )
  })

  const openPaymentModal = (payment) => {
    setSelectedPayment(payment)
    setIsModalOpen(true)
  }

  const closePaymentModal = () => {
    setSelectedPayment(null)
    setIsModalOpen(false)
  }

  const updatePaymentStatus = async (paymentId, status) => {
    setActionLoading(true)
    try {
      // Update payment status
      const { error: paymentError } = await supabase
        .from('payment_receipts')
        .update({ 
          status: status,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', paymentId)

      if (paymentError) throw paymentError

      // If approved, update user subscription
      if (status === 'approved') {
        const payment = payments.find(p => p.id === paymentId)
        if (payment) {
          // Update user's plan to paid
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ plan: 'paid' })
            .eq('id', payment.user_id)

          if (profileError) throw profileError

          // Check if subscription exists
          const { data: existingSub, error: fetchError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', payment.user_id)
            .single()

          if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

          // Set expiry date to 30 days from now
          const expiryDate = new Date()
          expiryDate.setDate(expiryDate.getDate() + 30)

          if (existingSub) {
            // Update existing subscription
            const { error: updateError } = await supabase
              .from('subscriptions')
              .update({
                plan: 'paid',
                is_paid: true,
                expiry_date: expiryDate.toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('id', existingSub.id)

            if (updateError) throw updateError
          } else {
            // Create new subscription
            const { error: insertError } = await supabase
              .from('subscriptions')
              .insert({
                user_id: payment.user_id,
                plan: 'paid',
                is_paid: true,
                expiry_date: expiryDate.toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })

            if (insertError) throw insertError
          }
        }
      }

      // Refresh data
      await fetchPayments()
      closePaymentModal()
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('حدث خطأ أثناء تحديث حالة الدفع. يرجى المحاولة مرة أخرى.')
    } finally {
      setActionLoading(false)
    }
  }

  const sendFeedback = async (paymentId, feedback) => {
    setActionLoading(true)
    try {
      const { error } = await supabase
        .from('payment_receipts')
        .update({ 
          status: 'needs_revision',
          admin_feedback: feedback,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', paymentId)

      if (error) throw error

      // Refresh data
      await fetchPayments()
      closePaymentModal()
    } catch (error) {
      console.error('Error sending feedback:', error)
      alert('حدث خطأ أثناء إرسال الملاحظات. يرجى المحاولة مرة أخرى.')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'needs_revision':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار'
      case 'approved':
        return 'تمت الموافقة'
      case 'rejected':
        return 'مرفوض'
      case 'needs_revision':
        return 'يحتاج مراجعة'
      default:
        return status
    }
  }

  const getGradeName = (grade) => {
    const grades = {
      '1': 'السنة الأولى',
      '2': 'السنة الثانية',
      '3': 'السنة الثالثة',
      '4': 'السنة الرابعة',
      '5': 'السنة الخامسة',
      '6': 'السنة السادسة'
    }
    return grades[grade] || '-'
  }

  const [feedbackText, setFeedbackText] = useState('')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">إدارة إيصالات الدفع</h1>
        <p className="mt-1 text-sm text-gray-600">مراجعة وإدارة إيصالات الدفع المرسلة من المستخدمين</p>
      </div>

      <div className="bg-white shadow rounded-lg glass-card overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">قائمة إيصالات الدفع</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="بحث..."
              className="form-input w-64"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الإرسال
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                          {payment.profiles?.name ? payment.profiles.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{payment.profiles?.name || '-'}</div>
                          <div className="text-sm text-gray-500">{payment.profiles?.email || '-'}</div>
                          <div className="text-xs text-gray-500">{getGradeName(payment.profiles?.grade)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(payment.created_at).toLocaleDateString('ar-EG')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(payment.created_at).toLocaleTimeString('ar-EG')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openPaymentModal(payment)}
                        className="text-primary hover:text-secondary"
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد إيصالات دفع</h3>
            <p className="mt-1 text-sm text-gray-500">
              لم يتم العثور على إيصالات دفع مطابقة لمعايير البحث.
            </p>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {isModalOpen && selectedPayment && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closePaymentModal}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-right sm:w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      تفاصيل إيصال الدفع
                    </h3>
                    <div className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">المستخدم:</span>
                          <span className="text-sm text-gray-900">{selectedPayment.profiles?.name || '-'}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">البريد الإلكتروني:</span>
                          <span className="text-sm text-gray-900">{selectedPayment.profiles?.email || '-'}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">المستوى الدراسي:</span>
                          <span className="text-sm text-gray-900">{getGradeName(selectedPayment.profiles?.grade)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">تاريخ الإرسال:</span>
                          <span className="text-sm text-gray-900">
                            {new Date(selectedPayment.created_at).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">الحالة:</span>
                          <span className={`text-sm font-medium ${selectedPayment.status === 'approved' ? 'text-green-600' : selectedPayment.status === 'rejected' ? 'text-red-600' : selectedPayment.status === 'needs_revision' ? 'text-blue-600' : 'text-yellow-600'}`}>
                            {getStatusText(selectedPayment.status)}
                          </span>
                        </div>
                        {selectedPayment.reviewed_at && (
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-500">تاريخ المراجعة:</span>
                            <span className="text-sm text-gray-900">
                              {new Date(selectedPayment.reviewed_at).toLocaleDateString('ar-EG')}
                            </span>
                          </div>
                        )}
                        {selectedPayment.admin_feedback && (
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-500">ملاحظات المشرف:</span>
                            <span className="text-sm text-gray-900">{selectedPayment.admin_feedback}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <h4 className="text-md font-medium text-gray-900 mb-3">صورة إيصال الدفع</h4>
                        <div className="border rounded-md overflow-hidden">
                          {selectedPayment.receipt_url ? (
                            <img 
                              src={selectedPayment.receipt_url} 
                              alt="إيصال الدفع" 
                              className="w-full h-auto"
                            />
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              لا توجد صورة للإيصال
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedPayment.status === 'pending' && (
                        <div className="mt-6">
                          <div className="flex space-x-4 space-x-reverse">
                            <button
                              onClick={() => updatePaymentStatus(selectedPayment.id, 'approved')}
                              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              disabled={actionLoading}
                            >
                              {actionLoading ? 'جاري المعالجة...' : 'قبول الإيصال'}
                            </button>
                            <button
                              onClick={() => updatePaymentStatus(selectedPayment.id, 'rejected')}
                              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              disabled={actionLoading}
                            >
                              رفض الإيصال
                            </button>
                          </div>

                          <div className="mt-4">
                            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                              إرسال ملاحظات للمستخدم
                            </label>
                            <textarea
                              id="feedback"
                              rows="3"
                              className="form-input w-full"
                              placeholder="أدخل ملاحظاتك هنا..."
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                            ></textarea>
                            <button
                              onClick={() => sendFeedback(selectedPayment.id, feedbackText)}
                              className="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              disabled={actionLoading || !feedbackText.trim()}
                            >
                              إرسال الملاحظات
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default AdminPayments