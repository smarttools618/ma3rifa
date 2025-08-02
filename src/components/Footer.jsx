import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">منصة المعرفة</h3>
            <p className="text-gray-600 mb-4">
              منصة تعليمية توفر دروس وتمارين وملخصات للطلاب من السنة الأولى إلى السنة السادسة.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">الرئيسية</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">من نحن</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">اتصل بنا</Link>
              </li>
              <li>
                <Link to="/#pricing" className="text-gray-600 hover:text-primary transition-colors">الأسعار</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-primary transition-colors">تسجيل الدخول</Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-600 hover:text-primary transition-colors">إنشاء حساب</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">تواصل معنا</h3>
            <p className="text-gray-600 mb-2">البريد الإلكتروني: info@manassat-almarifa.com</p>
            <p className="text-gray-600 mb-2">الهاتف: +216 XX XXX XXX</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex justify-center mb-4 space-x-4 rtl:space-x-reverse">
            <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors">شروط الاستخدام</Link>
            <span className="text-gray-400">|</span>
            <Link to="/privacy" className="text-gray-600 hover:text-primary transition-colors">سياسة الخصوصية</Link>
            <span className="text-gray-400">|</span>
            <Link to="/refund-policy" className="text-gray-600 hover:text-primary transition-colors">سياسة الاسترداد</Link>
          </div>
          <p className="text-center text-gray-600">
            جميع الحقوق محفوظة &copy; {currentYear} منصة المعرفة
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer