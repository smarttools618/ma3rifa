import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabaseClient'
import { motion } from 'framer-motion'

const AdminSubscriptions = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, subscriptions(*)')
        .eq('role', 'user')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase()
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.grade?.toString().includes(searchTerm)
    )
  })

  const openUserModal = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const closeUserModal = () => {
    setSelectedUser(null)
    setIsModalOpen(false)
  }

  const updateSubscription = async (userId, newPlan, hasPaid = false) => {
    setActionLoading(true)
    try {
      // First update the user's plan in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ plan: newPlan })
        .eq('id', userId)

      if (profileError) throw profileError

      // Check if subscription exists
      const { data: existingSub, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

      let expiryDate = null
      if (newPlan === 'paid' && hasPaid) {
        // Set expiry date to 30 days from now
        expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 30)
      }

      if (existingSub) {
        // Update existing subscription
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            plan: newPlan,
            is_paid: hasPaid,
            expiry_date: expiryDate ? expiryDate.toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSub.id)

        if (updateError) throw updateError
      } else if (newPlan === 'paid') {
        // Create new subscription only if paid plan
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            plan: newPlan,
            is_paid: hasPaid,
            expiry_date: expiryDate ? expiryDate.toISOString() : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) throw insertError
      }

      // Refresh data
      await fetchUsers()
      closeUserModal()
    } catch (error) {
      console.error('Error updating subscription:', error)
      alert('حدث خطأ أثناء تحديث الاشتراك. يرجى المحاولة مرة أخرى.')
    } finally {
      setActionLoading(false)
    }
  }

  const markAsPaid = async (userId) => {
    setActionLoading(true)
    try {
      // First update the user's plan in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ plan: 'paid' })
        .eq('id', userId)

      if (profileError) throw profileError

      // Check if subscription exists
      const { data: existingSub, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
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
            user_id: userId,
            plan: 'paid',
            is_paid: true,
            expiry_date: expiryDate.toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) throw insertError
      }

      // Refresh data
      await fetchUsers()
      closeUserModal()
    } catch (error) {
      console.error('Error marking subscription as paid:', error)
      alert('حدث خطأ أثناء تحديث حالة الدفع. يرجى المحاولة مرة أخرى.')
    } finally {
      setActionLoading(false)
    }
  }

  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return '-'
    
    const expiry = new Date(expiryDate)
    const today = new Date()
    
    // Set time to midnight for accurate day calculation
    expiry.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays > 0 ? diffDays : 'منتهي'
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">إدارة الاشتراكات</h1>
        <p className="mt-1 text-sm text-gray-600">عرض وإدارة اشتراكات المستخدمين</p>
      </div>

      <div className="bg-white shadow rounded-lg glass-card overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">قائمة الاشتراكات</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="بحث عن مستخدم..."
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
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المستوى الدراسي
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نوع الخطة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    حالة الدفع
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الأيام المتبقية
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const subscription = user.subscriptions?.[0] || {}
                  const daysRemaining = user.plan === 'paid' ? getDaysRemaining(subscription.expiry_date) : '-'
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{user.name || '-'}</div>
                            <div className="text-sm text-gray-500">{user.email || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getGradeName(user.grade)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.plan === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.plan === 'paid' ? 'مدفوعة' : 'مجانية'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.plan === 'paid' ? (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${subscription.is_paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {subscription.is_paid ? 'تم الدفع' : 'في انتظار الدفع'}
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            غير مطلوب
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.plan === 'paid' ? (
                          <div className="text-sm text-gray-900">
                            {typeof daysRemaining === 'number' ? (
                              <span className={daysRemaining <= 3 ? 'text-red-600 font-bold' : ''}>
                                {daysRemaining} يوم
                              </span>
                            ) : daysRemaining}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openUserModal(user)}
                          className="text-primary hover:text-secondary ml-4"
                        >
                          إدارة الاشتراك
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">لا يوجد مستخدمين</h3>
            <p className="mt-1 text-sm text-gray-500">
              لم يتم العثور على مستخدمين مطابقين لمعايير البحث.
            </p>
          </div>
        )}
      </div>

      {/* Subscription Management Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeUserModal}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-right sm:w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      إدارة اشتراك المستخدم
                    </h3>
                    <div className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">المستخدم:</span>
                          <span className="text-sm text-gray-900">{selectedUser.name || '-'}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">البريد الإلكتروني:</span>
                          <span className="text-sm text-gray-900">{selectedUser.email || '-'}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">المستوى الدراسي:</span>
                          <span className="text-sm text-gray-900">{getGradeName(selectedUser.grade)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">نوع الخطة الحالية:</span>
                          <span className={`text-sm ${selectedUser.plan === 'paid' ? 'text-green-600' : 'text-gray-600'}`}>
                            {selectedUser.plan === 'paid' ? 'مدفوعة' : 'مجانية'}
                          </span>
                        </div>
                        {selectedUser.plan === 'paid' && selectedUser.subscriptions?.[0] && (
                          <>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-gray-500">حالة الدفع:</span>
                              <span className={`text-sm ${selectedUser.subscriptions[0].is_paid ? 'text-green-600' : 'text-yellow-600'}`}>
                                {selectedUser.subscriptions[0].is_paid ? 'تم الدفع' : 'في انتظار الدفع'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-500">تاريخ انتهاء الاشتراك:</span>
                              <span className="text-sm text-gray-900">
                                {selectedUser.subscriptions[0].expiry_date ? 
                                  new Date(selectedUser.subscriptions[0].expiry_date).toLocaleDateString('ar-EG') : 
                                  'غير محدد'}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="mt-6">
                        <h4 className="text-md font-medium text-gray-900 mb-3">تغيير نوع الخطة</h4>
                        <div className="flex space-x-4 space-x-reverse">
                          <button
                            onClick={() => updateSubscription(selectedUser.id, 'free')}
                            className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${selectedUser.plan === 'free' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                            disabled={selectedUser.plan === 'free' || actionLoading}
                          >
                            تحويل إلى خطة مجانية
                          </button>
                          <button
                            onClick={() => updateSubscription(selectedUser.id, 'paid', false)}
                            className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${selectedUser.plan === 'paid' && !selectedUser.subscriptions?.[0]?.is_paid ? 'bg-yellow-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
                            disabled={(selectedUser.plan === 'paid' && !selectedUser.subscriptions?.[0]?.is_paid) || actionLoading}
                          >
                            تحويل إلى خطة مدفوعة (بانتظار الدفع)
                          </button>
                        </div>
                      </div>

                      {(selectedUser.plan === 'free' || (selectedUser.plan === 'paid' && !selectedUser.subscriptions?.[0]?.is_paid)) && (
                        <div className="mt-4">
                          <button
                            onClick={() => markAsPaid(selectedUser.id)}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            disabled={actionLoading}
                          >
                            {actionLoading ? (
                              <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                جاري المعالجة...
                              </div>
                            ) : 'تأكيد الدفع وتفعيل الاشتراك المدفوع'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={closeUserModal}
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

export default AdminSubscriptions