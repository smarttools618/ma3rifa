import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabaseClient'
import { motion } from 'framer-motion'

const Dashboard = () => {
  const { user, userDetails } = useAuth()
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('lessons')
  const [activeGrade, setActiveGrade] = useState('')

  useEffect(() => {
    if (userDetails?.grade) {
      setActiveGrade(userDetails.grade)
    }
  }, [userDetails])

  useEffect(() => {
    const fetchPdfs = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('pdfs')
          .select('*')
          .eq('approved', true)

        // Filter by section if activeTab is not 'all'
        if (activeTab !== 'all') {
          query = query.eq('section', activeTab)
        }

        // Filter by grade if activeGrade is set
        if (activeGrade) {
          query = query.eq('grade', activeGrade)
        }

        const { data, error } = await query

        if (error) throw error

        // Check user's plan and limit PDFs accordingly
        const isPaidUser = userDetails?.plan === 'paid'
        const filteredData = isPaidUser 
          ? data 
          : data.slice(0, activeTab === 'all' ? 30 : 10) // 10 per category for free users

        setPdfs(filteredData)
      } catch (error) {
        console.error('Error fetching PDFs:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchPdfs()
    }
  }, [user, activeTab, activeGrade, userDetails])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleGradeChange = (e) => {
    setActiveGrade(e.target.value)
  }

  const getTabClass = (tab) => {
    return `px-4 py-2 rounded-md ${activeTab === tab 
      ? 'bg-primary text-white' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
  }

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
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مرحبًا، {userDetails?.name || 'طالب'}</h1>
          <p className="text-gray-600">
            أنت الآن في الصف {userDetails?.grade || '-'} مع خطة {userDetails?.plan === 'paid' ? 'مدفوعة' : 'مجانية'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 glass-card">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div className="flex space-x-2 space-x-reverse mb-4 sm:mb-0">
              <button 
                onClick={() => handleTabChange('lessons')} 
                className={getTabClass('lessons')}
              >
                الدروس
              </button>
              <button 
                onClick={() => handleTabChange('exercises')} 
                className={getTabClass('exercises')}
              >
                التمارين
              </button>
              <button 
                onClick={() => handleTabChange('summaries')} 
                className={getTabClass('summaries')}
              >
                الملخصات
              </button>
              <button 
                onClick={() => handleTabChange('all')} 
                className={getTabClass('all')}
              >
                الكل
              </button>
            </div>

            <div className="w-full sm:w-auto">
              <select
                value={activeGrade}
                onChange={handleGradeChange}
                className="form-input w-full sm:w-auto"
              >
                <option value="">جميع المستويات</option>
                <option value="1">السنة الأولى</option>
                <option value="2">السنة الثانية</option>
                <option value="3">السنة الثالثة</option>
                <option value="4">السنة الرابعة</option>
                <option value="5">السنة الخامسة</option>
                <option value="6">السنة السادسة</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : pdfs.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {pdfs.map((pdf) => (
                <motion.div 
                  key={pdf.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300"
                  variants={itemVariants}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{pdf.title}</h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${pdf.section === 'lessons' ? 'bg-blue-100 text-blue-800' : pdf.section === 'exercises' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                        {pdf.section === 'lessons' ? 'درس' : pdf.section === 'exercises' ? 'تمرين' : 'ملخص'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">الصف {pdf.grade}</p>
                    <a
                      href={pdf.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
                    >
                      تحميل الملف
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد ملفات</h3>
              <p className="mt-1 text-sm text-gray-500">
                لم يتم العثور على ملفات {activeTab === 'lessons' ? 'دروس' : activeTab === 'exercises' ? 'تمارين' : activeTab === 'summaries' ? 'ملخصات' : ''} للصف المحدد.
              </p>
            </div>
          )}

          {userDetails?.plan !== 'paid' && (
            <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="mr-3">
                  <h3 className="text-sm font-medium text-blue-800">ترقية إلى الخطة المدفوعة</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>أنت حاليًا تستخدم الخطة المجانية التي تتيح لك الوصول إلى 10 ملفات فقط من كل قسم. للوصول إلى جميع الملفات (100 درس، 100 تمرين، 100 ملخص)، يرجى الترقية إلى الخطة المدفوعة.</p>
                  </div>
                  <div className="mt-4">
                    <a href="#" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      ترقية الآن
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard