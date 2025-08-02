import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabaseClient'
import { motion } from 'framer-motion'

const AdminAssistants = () => {
  const [activeTab, setActiveTab] = useState('assistants')
  const [assistants, setAssistants] = useState([])
  const [pendingPdfs, setPendingPdfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
  const [selectedAssistant, setSelectedAssistant] = useState(null)
  const [selectedPdf, setSelectedPdf] = useState(null)
  const [newAssistantEmail, setNewAssistantEmail] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'assistants') {
      fetchAssistants()
    } else {
      fetchPendingPdfs()
    }
  }, [activeTab])

  const fetchAssistants = async () => {
    setLoading(true)
    try {
      // Fetch users with role 'assistant'
      const { data: assistantsData, error: assistantsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'assistant')

      if (assistantsError) throw assistantsError

      // For each assistant, count their PDFs
      const assistantsWithCounts = await Promise.all(assistantsData.map(async (assistant) => {
        const { count, error: countError } = await supabase
          .from('pdfs')
          .select('id', { count: 'exact' })
          .eq('created_by', assistant.id)

        if (countError) throw countError

        return {
          ...assistant,
          pdf_count: count || 0
        }
      }))

      setAssistants(assistantsWithCounts || [])
    } catch (error) {
      console.error('Error fetching assistants:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingPdfs = async () => {
    setLoading(true)
    try {
      // Fetch PDFs with status 'pending' or 'refine'
      const { data, error } = await supabase
        .from('pdfs')
        .select(`
          *,
          profiles:created_by (name, email)
        `)
        .in('status', ['pending', 'refine'])
        .order('created_at', { ascending: false })

      if (error) throw error
      setPendingPdfs(data || [])
    } catch (error) {
      console.error('Error fetching pending PDFs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredAssistants = assistants.filter(assistant => {
    return (
      assistant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assistant.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const filteredPendingPdfs = pendingPdfs.filter(pdf => {
    return (
      pdf.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const openAddModal = () => {
    setNewAssistantEmail('')
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const openDetailsModal = (assistant) => {
    setSelectedAssistant(assistant)
    setIsDetailsModalOpen(true)
  }

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedAssistant(null)
  }

  const openPdfModal = (pdf) => {
    setSelectedPdf(pdf)
    setFeedbackMessage('')
    setIsPdfModalOpen(true)
  }

  const closePdfModal = () => {
    setIsPdfModalOpen(false)
    setSelectedPdf(null)
    setFeedbackMessage('')
  }

  const addAssistant = async (e) => {
    e.preventDefault()
    setActionLoading(true)

    try {
      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newAssistantEmail)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      if (existingUser) {
        alert('هذا البريد الإلكتروني مسجل بالفعل.')
        return
      }

      // Create a new user with assistant role
      // Note: In a real app, you would use Supabase Auth Admin API or a server function
      // This is a simplified version for demonstration
      const password = Math.random().toString(36).slice(-8) // Generate random password
      
      const { data, error } = await supabase.auth.signUp({
        email: newAssistantEmail,
        password: password,
        options: {
          data: {
            role: 'assistant'
          }
        }
      })

      if (error) throw error

      alert(`تمت إضافة المساعد بنجاح. سيتم إرسال بريد إلكتروني للتفعيل.`)
      closeAddModal()
      fetchAssistants()
    } catch (error) {
      console.error('Error adding assistant:', error)
      alert('حدث خطأ أثناء إضافة المساعد. يرجى المحاولة مرة أخرى.')
    } finally {
      setActionLoading(false)
    }
  }

  const toggleAssistantStatus = async (assistantId, isActive) => {
    setActionLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !isActive })
        .eq('id', assistantId)

      if (error) throw error

      // Update local state
      setAssistants(assistants.map(assistant => {
        if (assistant.id === assistantId) {
          return { ...assistant, is_active: !isActive }
        }
        return assistant
      }))

      if (selectedAssistant && selectedAssistant.id === assistantId) {
        setSelectedAssistant({ ...selectedAssistant, is_active: !isActive })
      }
    } catch (error) {
      console.error('Error toggling assistant status:', error)
      alert('حدث خطأ أثناء تغيير حالة المساعد. يرجى المحاولة مرة أخرى.')
    } finally {
      setActionLoading(false)
    }
  }

  const deleteAssistant = async (assistantId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المساعد؟ سيتم حذف جميع بياناته وهذا الإجراء لا يمكن التراجع عنه.')) {
      return
    }

    setActionLoading(true)
    try {
      // In a real app, you would use Supabase Auth Admin API or a server function
      // This is a simplified version that only removes the profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', assistantId)

      if (error) throw error

      // Update local state
      setAssistants(assistants.filter(assistant => assistant.id !== assistantId))
      if (selectedAssistant && selectedAssistant.id === assistantId) {
        closeDetailsModal()
      }
    } catch (error) {
      console.error('Error deleting assistant:', error)
      alert('حدث خطأ أثناء حذف المساعد. يرجى المحاولة مرة أخرى.')
    } finally {
      setActionLoading(false)
    }
  }

  const handlePdfAction = async (action) => {
    if (!selectedPdf) return
    
    setActionLoading(true)
    try {
      let updateData = {}
      
      if (action === 'approve') {
        updateData = { status: 'approved' }
      } else if (action === 'decline') {
        updateData = { status: 'declined' }
      } else if (action === 'refine') {
        if (!feedbackMessage.trim()) {
          alert('يرجى إدخال ملاحظات للمساعد.')
          setActionLoading(false)
          return
        }
        updateData = { 
          status: 'refine',
          admin_feedback: feedbackMessage 
        }
      }
      
      const { error } = await supabase
        .from('pdfs')
        .update(updateData)
        .eq('id', selectedPdf.id)

      if (error) throw error

      // Update local state
      setPendingPdfs(pendingPdfs.filter(pdf => pdf.id !== selectedPdf.id))
      closePdfModal()
    } catch (error) {
      console.error('Error updating PDF status:', error)
      alert('حدث خطأ أثناء تحديث حالة الملف. يرجى المحاولة مرة أخرى.')
    } finally {
      setActionLoading(false)
    }
  }

  const getSectionName = (section) => {
    const sections = {
      'lessons': 'الدروس',
      'exercises': 'التمارين',
      'summaries': 'الملخصات'
    }
    return sections[section] || section
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
    return grades[grade] || grade
  }

  const getStatusName = (status) => {
    const statuses = {
      'pending': 'قيد الانتظار',
      'approved': 'تمت الموافقة',
      'declined': 'مرفوض',
      'refine': 'بحاجة للتعديل'
    }
    return statuses[status] || status
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'declined': 'bg-red-100 text-red-800',
      'refine': 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">إدارة المساعدين</h1>
        <p className="mt-1 text-sm text-gray-600">إدارة المساعدين وملفات PDF المقدمة منهم</p>
      </div>

      <div className="bg-white shadow rounded-lg glass-card overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('assistants')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'assistants' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              المساعدين
            </button>
            <button
              onClick={() => setActiveTab('pdfs')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'pdfs' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              ملفات PDF المعلقة
            </button>
          </nav>
        </div>

        <div className="px-4 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            {activeTab === 'assistants' && (
              <button
                onClick={openAddModal}
                className="btn-primary text-sm px-4 py-2"
              >
                إضافة مساعد جديد
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder={activeTab === 'assistants' ? "بحث عن مساعد..." : "بحث عن ملف..."}
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
        ) : activeTab === 'assistants' ? (
          // Assistants Tab Content
          filteredAssistants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المساعد
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      البريد الإلكتروني
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عدد الملفات
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
                  {filteredAssistants.map((assistant) => (
                    <tr key={assistant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center">
                            {assistant.name?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{assistant.name || 'مساعد'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{assistant.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{assistant.pdf_count}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${assistant.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {assistant.is_active ? 'نشط' : 'متوقف'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openDetailsModal(assistant)}
                          className="text-primary hover:text-secondary ml-4"
                        >
                          التفاصيل
                        </button>
                        <button
                          onClick={() => toggleAssistantStatus(assistant.id, assistant.is_active)}
                          className={`${assistant.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'} ml-4`}
                          disabled={actionLoading}
                        >
                          {assistant.is_active ? 'إيقاف' : 'تفعيل'}
                        </button>
                        <button
                          onClick={() => deleteAssistant(assistant.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={actionLoading}
                        >
                          حذف
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا يوجد مساعدين</h3>
              <p className="mt-1 text-sm text-gray-500">
                ابدأ بإضافة مساعدين جدد للمنصة.
              </p>
              <div className="mt-6">
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  إضافة مساعد جديد
                </button>
              </div>
            </div>
          )
        ) : (
          // PDFs Tab Content
          filteredPendingPdfs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عنوان الملف
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المساعد
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      القسم
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المستوى
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ الإضافة
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPendingPdfs.map((pdf) => (
                    <tr key={pdf.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{pdf.title}</div>
                            <a 
                              href={pdf.download_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:text-secondary"
                            >
                              عرض الملف
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{pdf.profiles?.name || 'غير معروف'}</div>
                        <div className="text-xs text-gray-500">{pdf.profiles?.email || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${pdf.section === 'lessons' ? 'bg-blue-100 text-blue-800' : 
                            pdf.section === 'exercises' ? 'bg-green-100 text-green-800' : 
                            'bg-purple-100 text-purple-800'}`}
                        >
                          {getSectionName(pdf.section)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getGradeName(pdf.grade)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pdf.status)}`}>
                          {getStatusName(pdf.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(pdf.created_at).toLocaleDateString('ar-EG')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openPdfModal(pdf)}
                          className="text-primary hover:text-secondary"
                        >
                          مراجعة
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد ملفات معلقة</h3>
              <p className="mt-1 text-sm text-gray-500">
                جميع ملفات PDF المقدمة من المساعدين تمت مراجعتها.
              </p>
            </div>
          )
        )}
      </div>

      {/* Add Assistant Modal */}
      {isAddModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeAddModal}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={addAssistant}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-right sm:w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        إضافة مساعد جديد
                      </h3>
                      <div className="mt-6 space-y-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            البريد الإلكتروني *
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="form-input w-full"
                            placeholder="أدخل البريد الإلكتروني للمساعد"
                            value={newAssistantEmail}
                            onChange={(e) => setNewAssistantEmail(e.target.value)}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            سيتم إرسال بريد إلكتروني للمساعد مع تعليمات تسجيل الدخول.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : 'إضافة المساعد'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeAddModal}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assistant Details Modal */}
      {isDetailsModalOpen && selectedAssistant && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeDetailsModal}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-right sm:w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      تفاصيل المساعد
                    </h3>
                    <div className="mt-6 space-y-4">
                      <div className="flex justify-center mb-6">
                        <div className="h-24 w-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl">
                          {selectedAssistant.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">الاسم</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedAssistant.name || 'غير محدد'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">البريد الإلكتروني</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedAssistant.email}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">عدد الملفات المضافة</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedAssistant.pdf_count}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">الحالة</h4>
                          <p className="mt-1">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedAssistant.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {selectedAssistant.is_active ? 'نشط' : 'متوقف'}
                            </span>
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">تاريخ الانضمام</h4>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedAssistant.created_at ? new Date(selectedAssistant.created_at).toLocaleDateString('ar-EG') : 'غير معروف'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => toggleAssistantStatus(selectedAssistant.id, selectedAssistant.is_active)}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${selectedAssistant.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm`}
                  disabled={actionLoading}
                >
                  {selectedAssistant.is_active ? 'إيقاف الحساب' : 'تفعيل الحساب'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteAssistant(selectedAssistant.id)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  disabled={actionLoading}
                >
                  حذف المساعد
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDetailsModal}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Review Modal */}
      {isPdfModalOpen && selectedPdf && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closePdfModal}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-right sm:w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      مراجعة ملف PDF
                    </h3>
                    <div className="mt-6 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">عنوان الملف</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedPdf.title}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">المساعد</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedPdf.profiles?.name || 'غير معروف'}</p>
                        <p className="text-xs text-gray-500">{selectedPdf.profiles?.email || ''}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">القسم</h4>
                          <p className="mt-1">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${selectedPdf.section === 'lessons' ? 'bg-blue-100 text-blue-800' : 
                                selectedPdf.section === 'exercises' ? 'bg-green-100 text-green-800' : 
                                'bg-purple-100 text-purple-800'}`}
                            >
                              {getSectionName(selectedPdf.section)}
                            </span>
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">المستوى الدراسي</h4>
                          <p className="mt-1 text-sm text-gray-900">{getGradeName(selectedPdf.grade)}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">رابط التحميل</h4>
                        <div className="mt-1">
                          <a 
                            href={selectedPdf.download_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-secondary"
                          >
                            عرض الملف
                          </a>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">تاريخ الإضافة</h4>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedPdf.created_at).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">الحالة</h4>
                        <p className="mt-1">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedPdf.status)}`}>
                            {getStatusName(selectedPdf.status)}
                          </span>
                        </p>
                      </div>
                      {selectedPdf.status === 'refine' && selectedPdf.admin_feedback && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">ملاحظات سابقة</h4>
                          <p className="mt-1 text-sm text-gray-900 p-2 bg-gray-50 rounded border border-gray-200">
                            {selectedPdf.admin_feedback}
                          </p>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">ملاحظات للمساعد (اختياري)</h4>
                        <textarea
                          className="form-input w-full mt-1"
                          rows="3"
                          placeholder="أدخل ملاحظات للمساعد حول هذا الملف..."
                          value={feedbackMessage}
                          onChange={(e) => setFeedbackMessage(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handlePdfAction('approve')}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  disabled={actionLoading}
                >
                  موافقة
                </button>
                <button
                  type="button"
                  onClick={() => handlePdfAction('refine')}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  disabled={actionLoading}
                >
                  طلب تعديل
                </button>
                <button
                  type="button"
                  onClick={() => handlePdfAction('decline')}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  disabled={actionLoading}
                >
                  رفض
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closePdfModal}
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

export default AdminAssistants