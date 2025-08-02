import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const PDFViewer = ({ url, title }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Reset states when URL changes
    setLoading(true)
    setError(null)
  }, [url])

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    setLoading(false)
    setError('حدث خطأ أثناء تحميل الملف. يرجى المحاولة مرة أخرى.')
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-white shadow-sm p-4 mb-4 rounded-lg flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        
        <div className="flex space-x-2 space-x-reverse">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors duration-300 flex items-center"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            فتح في نافذة جديدة
          </a>
          
          <a 
            href={url} 
            download
            className="px-4 py-2 bg-white border border-primary text-primary rounded-md hover:bg-gray-50 transition-colors duration-300 flex items-center"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            تحميل
          </a>
        </div>
      </div>
      
      <div className="flex-grow relative bg-gray-100 rounded-lg overflow-hidden">
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10"
          >
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">جاري تحميل الملف...</p>
            </div>
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-white z-10"
          >
            <div className="text-center p-6 max-w-sm mx-auto">
              <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors duration-300"
              >
                إعادة المحاولة
              </button>
            </div>
          </motion.div>
        )}
        
        <iframe
          src={url}
          className="w-full h-full min-h-[70vh]"
          title={title}
          onLoad={handleLoad}
          onError={handleError}
        ></iframe>
      </div>
    </div>
  )
}

export default PDFViewer