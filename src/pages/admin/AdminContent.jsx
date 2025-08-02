import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabaseClient'
import { motion } from 'framer-motion'

const AdminContent = () => {
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState(['all'])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedPdf, setSelectedPdf] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    section: 'lessons',
    grade: '1',
    download_url: ''
  })
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchPdfs()
  }, [])

  const fetchPdfs = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('pdfs')
        .select('*')
        .order('created_at', { ascending: false })

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

  const toggleFilter = (filter) => {
    if (filter === 'all') {
      setActiveFilters(['all'])
    } else {
      const newFilters = activeFilters.includes('all')
        ? [filter]
        : activeFilters.includes(filter)
          ? activeFilters.filter(f => f !== filter)
          : [...activeFilters, filter]
      
      // If no filters are selected, default to 'all'
      setActiveFilters(newFilters.length === 0 ? ['all'] : newFilters)
    }
  }

  const filteredPdfs = pdfs.filter(pdf => {
    // Apply search filter
    const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Apply section filter
    const matchesSection = activeFilters.includes('all') || activeFilters.includes(pdf.section)
    
    return matchesSearch && matchesSection
  })

  const openAddModal = () => {
    setIsEditMode(false)
    setFormData({
      title: '',
      section: 'lessons',
      grade: '1',
      download_url: ''
    })
    setIsModalOpen(true)
  }

  const openEditModal = (pdf) => {
    setIsEditMode(true)
    setSelectedPdf(pdf)
    setFormData({
      title: pdf.title,
      section: pdf.section,
      grade: pdf.grade,
      download_url: pdf.download_url
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPdf(null)
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
      if (isEditMode && selectedPdf) {
        // Update existing PDF
        const { error } = await supabase
          .from('pdfs')
          .update({
            title: formData.title,
            section: formData.section,
            grade: formData.grade,
            download_url: formData.download_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedPdf.id)

        if (error) throw error
      } else {
        // Add new PDF
        const { error } = await supabase
          .from('pdfs')
          .insert({
            title: formData.title,
            section: formData.section,
            grade: formData.grade,
            download_url: formData.download_url,
            status: 'approved', // Admin-added PDFs are auto-approved
            created_by: 'admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (error) throw error
      }

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

  const deletePdf = async (pdfId) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return
    }

    setActionLoading(true)
    try {
      const { error } = await supabase
        .from('pdfs')
        .delete()
        .eq('id', pdfId)

      if (error) throw error

      // Update local state
      setPdfs(pdfs.filter(pdf => pdf.id !== pdfId))
    } catch (error) {
      console.error('Error deleting PDF:', error)
      alert('حدث خطأ أثناء حذف الملف. يرجى المحاولة مرة أخرى.')
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">إدارة المحتوى</h1>
        <p className="mt-1 text-sm text-gray-600">إضافة وتعديل وحذف ملفات PDF للدروس والتمارين والملخصات</p>
      </div>

      <div className="bg-white shadow rounded-lg glass-card overflow-hidden mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-4 space-x-reverse">
            <h3 className="text-lg leading-6 font-medium text-gray-900">ملفات PDF</h3>
            <div className="text-sm text-gray-500">
              {activeFilters.includes('all') 
                ? `إجمالي: ${pdfs.length}` 
                : `${filteredPdfs.length} من أصل ${pdfs.length}`}
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="btn-primary text-sm px-4 py-2"
          >
            إضافة ملف جديد
          </button>
        </div>

        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-sm font-medium text-gray-700">تصفية حسب:</span>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => toggleFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${activeFilters.includes('all') ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  الكل
                </button>
                <button
                  onClick={() => toggleFilter('lessons')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${activeFilters.includes('lessons') ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  الدروس
                </button>
                <button
                  onClick={() => toggleFilter('exercises')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${activeFilters.includes('exercises') ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  التمارين
                </button>
                <button
                  onClick={() => toggleFilter('summaries')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${activeFilters.includes('summaries') ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  الملخصات
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="بحث عن ملف..."
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
                    تاريخ الإضافة
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجراءات
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
                      <div className="text-sm text-gray-900">
                        {new Date(pdf.created_at).toLocaleDateString('ar-EG')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(pdf)}
                        className="text-primary hover:text-secondary ml-4"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => deletePdf(pdf.id)}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد ملفات</h3>
            <p className="mt-1 text-sm text-gray-500">
              ابدأ بإضافة ملفات PDF جديدة للمنصة.
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

      {/* Add/Edit PDF Modal */}
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
                        {isEditMode ? 'تعديل ملف PDF' : 'إضافة ملف PDF جديد'}
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
                    ) : isEditMode ? 'حفظ التغييرات' : 'إضافة الملف'}
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

export default AdminContent