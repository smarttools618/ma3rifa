import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const AssistantDashboard = () => {
  const { user } = useAuth()
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    section: 'lessons',
    grade: '1',
    download_url: ''
  })
  const [actionLoading, setActionLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPdfs()
  }, [activeTab])

  const fetchPdfs = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('pdfs')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

      if (activeTab !== 'all') {
        query = query.eq('status', activeTab)
      }

      const { data, error } = await query

      if (error) throw error
      setPdfs(data || [])
    } catch (error) {
      console.error('Error fetching PDFs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredPdfs = pdfs.filter(pdf => {
    return pdf.title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const openAddModal = () => {
    setFormData({
      title: '',
      section: 'lessons',
      grade: '1',
      download_url: ''
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setActionLoading(true)

    try {
      const { error } = await supabase
        .from('pdfs')
        .insert({
          title: formData.title,
          section: formData.section,
          grade: formData.grade,
          download_url: formData.download_url,
          status: 'pending', // Initial status is pending for review
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      // Refresh data and close modal
      await fetchPdfs()
      closeModal()
    } catch (error) {
      console.error('Error saving PDF:', error)
      alert('حدث خطأ أثناء حفظ ملف PDF. يرجى المحاولة مرة أخرى.')
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
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المساعد</h1>
          <p className="mt-1 text-sm text-gray-600">إدارة ملفات PDF وإضافة محتوى جديد للمنصة</p>
        </div>
        <button
          onClick={openAddModal}
          className="mt-4 md:mt-0 btn-primary text-sm px-4 py-2 flex items-center"
        >
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          إضافة ملف جديد
        </button>
      </div>

      <div className="bg-white shadow rounded-lg glass-card overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('pending')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              قيد الانتظار
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'approved' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              تمت الموافقة
            </button>
            <button
              onClick={() => setActiveTab('refine')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'refine' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              بحاجة للتعديل
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              الكل
            </button>
          </nav>
        </div>

        <div className="px-4 py-3 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="بحث عن ملف..."
              className="form-input w-full md:w-64"
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
        ) : filteredPdfs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العنوان
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    القسم
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المستوى الدراسي
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الإضافة
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPdfs.map((pdf) => (
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
                      {pdf.admin_feedback && pdf.status === 'refine' && (
                        <div className="mt-1 text-xs text-gray-500 max-w-xs">
                          <span className="font-semibold">ملاحظات: </span>
                          {pdf.admin_feedback}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(pdf.created_at).toLocaleDateString('ar-EG')}
                      </div>
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد ملفات</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'all' ? 'لم تقم بإضافة أي ملفات بعد.' : 
               activeTab === 'pending' ? 'لا توجد ملفات قيد الانتظار.' :
               activeTab === 'approved' ? 'لا توجد ملفات تمت الموافقة عليها.' :
               'لا توجد ملفات بحاجة للتعديل.'}
            </p>
            <div className="mt-6">
              <button
                onClick={openAddModal}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                إضافة ملف جديد
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg glass-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="mr-5">
              <p className="text-sm font-medium text-gray-500">إجمالي الملفات</p>
              <p className="text-lg font-semibold text-gray-900">{pdfs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg glass-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="mr-5">
              <p className="text-sm font-medium text-gray-500">قيد الانتظار</p>
              <p className="text-lg font-semibold text-gray-900">
                {pdfs.filter(pdf => pdf.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg glass-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="mr-5">
              <p className="text-sm font-medium text-gray-500">تمت الموافقة</p>
              <p className="text-lg font-semibold text-gray-900">
                {pdfs.filter(pdf => pdf.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg glass-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="mr-5">
              <p className="text-sm font-medium text-gray-500">بحاجة للتعديل</p>
              <p className="text-lg font-semibold text-gray-900">
                {pdfs.filter(pdf => pdf.status === 'refine').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="bg-white shadow rounded-lg glass-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">إرشادات إضافة المحتوى</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">متطلبات الملفات</h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>يجب أن تكون جميع الملفات بصيغة PDF</li>
              <li>الحجم الأقصى للملف هو 10 ميجابايت</li>
              <li>يجب أن تكون الملفات واضحة وسهلة القراءة</li>
              <li>يجب أن تكون الملفات خالية من أي حقوق نشر محفوظة</li>
              <li>يجب أن تكون المعلومات دقيقة ومطابقة للمناهج الدراسية</li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">عملية المراجعة</h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>تتم مراجعة جميع الملفات من قبل فريق الإدارة</li>
              <li>قد تستغرق عملية المراجعة ما بين 24-48 ساعة</li>
              <li>في حالة طلب تعديلات، يرجى الاطلاع على الملاحظات وإعادة رفع الملف</li>
              <li>الملفات المعتمدة ستظهر مباشرة للمستخدمين في المنصة</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add PDF Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-right sm:w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        إضافة ملف PDF جديد
                      </h3>
                      <div className="mt-6 space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            عنوان الملف *
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            className="form-input w-full"
                            placeholder="أدخل عنوان الملف"
                            value={formData.title}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div>
                          <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                            القسم *
                          </label>
                          <select
                            name="section"
                            id="section"
                            required
                            className="form-input w-full"
                            value={formData.section}
                            onChange={handleInputChange}
                          >
                            <option value="lessons">الدروس</option>
                            <option value="exercises">التمارين</option>
                            <option value="summaries">الملخصات</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                            المستوى الدراسي *
                          </label>
                          <select
                            name="grade"
                            id="grade"
                            required
                            className="form-input w-full"
                            value={formData.grade}
                            onChange={handleInputChange}
                          >
                            <option value="1">السنة الأولى</option>
                            <option value="2">السنة الثانية</option>
                            <option value="3">السنة الثالثة</option>
                            <option value="4">السنة الرابعة</option>
                            <option value="5">السنة الخامسة</option>
                            <option value="6">السنة السادسة</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="download_url" className="block text-sm font-medium text-gray-700 mb-1">
                            رابط التحميل *
                          </label>
                          <input
                            type="url"
                            name="download_url"
                            id="download_url"
                            required
                            className="form-input w-full"
                            placeholder="أدخل رابط تحميل الملف"
                            value={formData.download_url}
                            onChange={handleInputChange}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            يجب أن يكون رابط مباشر لتحميل ملف PDF
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
                    ) : 'إضافة الملف'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeModal}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default AssistantDashboard