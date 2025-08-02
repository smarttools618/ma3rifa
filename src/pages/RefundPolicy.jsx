import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">سياسة الاسترداد</h1>
              <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
                تفاصيل سياسة استرداد المدفوعات الخاصة بمنصة المعرفة
              </p>
            </motion.div>
          </div>
        </section>

        {/* Refund Policy Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8 rounded-xl max-w-4xl mx-auto"
            >
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1. مقدمة</h2>
                <p className="text-gray-600 mb-3">
                  تهدف سياسة الاسترداد هذه إلى توضيح الشروط والأحكام المتعلقة باسترداد المدفوعات لاشتراكات منصة المعرفة. نحن نسعى جاهدين لتقديم خدمة عالية الجودة ونؤمن بالتعامل العادل مع عملائنا.
                </p>
                <p className="text-gray-600">
                  تنطبق هذه السياسة على جميع المدفوعات التي تتم من خلال منصتنا، بما في ذلك الاشتراكات الشهرية والسنوية والمدفوعات لخدمات إضافية.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. فترة الاسترداد</h2>
                <p className="text-gray-600 mb-3">
                  يمكن للمشتركين طلب استرداد كامل للمبلغ المدفوع خلال 14 يومًا من تاريخ الاشتراك الأولي. بعد انقضاء فترة الـ 14 يومًا، لن نتمكن من تقديم استرداد كامل للمبلغ.
                </p>
                <p className="text-gray-600">
                  بالنسبة للاشتراكات السنوية، يمكن طلب استرداد جزئي بعد فترة الـ 14 يومًا وحتى 30 يومًا من تاريخ الاشتراك، حيث سيتم خصم رسوم الخدمة والاستخدام من المبلغ المسترد.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. شروط الاسترداد</h2>
                <p className="text-gray-600 mb-3">
                  يتم النظر في طلبات الاسترداد في الحالات التالية:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-3 space-y-2 pr-4">
                  <li>عدم قدرة المستخدم على الوصول إلى المحتوى بسبب مشاكل تقنية مستمرة من جانبنا.</li>
                  <li>عدم توفر المحتوى الموعود في خطة الاشتراك.</li>
                  <li>تكرار الدفع عن طريق الخطأ (دفع مرتين لنفس الاشتراك).</li>
                  <li>عدم رضا المستخدم عن الخدمة خلال فترة الضمان (14 يومًا).</li>
                </ul>
                <p className="text-gray-600">
                  لن يتم النظر في طلبات الاسترداد في الحالات التالية:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-3 space-y-2 pr-4">
                  <li>بعد انقضاء فترة الاسترداد المحددة (14 يومًا للاسترداد الكامل، 30 يومًا للاسترداد الجزئي للاشتراكات السنوية).</li>
                  <li>إذا تم استخدام المنصة بشكل مكثف خلال فترة الاشتراك.</li>
                  <li>في حالة انتهاك المستخدم لشروط الاستخدام الخاصة بالمنصة.</li>
                </ul>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. عملية طلب الاسترداد</h2>
                <p className="text-gray-600 mb-3">
                  لطلب استرداد المبلغ، يرجى اتباع الخطوات التالية:
                </p>
                <ol className="list-decimal list-inside text-gray-600 mb-3 space-y-2 pr-4">
                  <li>تسجيل الدخول إلى حسابك على المنصة.</li>
                  <li>الانتقال إلى صفحة "الإعدادات" ثم "الفواتير والمدفوعات".</li>
                  <li>اختيار الاشتراك الذي ترغب في استرداد قيمته.</li>
                  <li>النقر على زر "طلب استرداد" وملء النموذج المطلوب.</li>
                  <li>تقديم سبب طلب الاسترداد بشكل واضح ومفصل.</li>
                </ol>
                <p className="text-gray-600">
                  سنقوم بمراجعة طلبك في غضون 3-5 أيام عمل وسنتواصل معك عبر البريد الإلكتروني المسجل في حسابك.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. طرق الاسترداد</h2>
                <p className="text-gray-600 mb-3">
                  سيتم استرداد المبلغ بنفس طريقة الدفع الأصلية التي استخدمتها عند الاشتراك:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-3 space-y-2 pr-4">
                  <li>بطاقات الائتمان/الخصم: 5-10 أيام عمل للظهور في كشف حسابك.</li>
                  <li>المحافظ الإلكترونية: 3-5 أيام عمل.</li>
                  <li>التحويل البنكي: 7-14 يوم عمل.</li>
                </ul>
                <p className="text-gray-600">
                  في بعض الحالات، قد نقدم رصيدًا في المنصة بدلاً من الاسترداد النقدي، خاصة في حالة العروض الترويجية أو الخصومات الخاصة.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. إلغاء الاشتراك</h2>
                <p className="text-gray-600 mb-3">
                  يمكن للمستخدمين إلغاء اشتراكاتهم في أي وقت من خلال صفحة "الإعدادات" ثم "الفواتير والمدفوعات".
                </p>
                <p className="text-gray-600">
                  إلغاء الاشتراك لا يؤدي تلقائيًا إلى استرداد المبلغ المدفوع. سيظل بإمكانك الوصول إلى المحتوى حتى نهاية فترة الاشتراك الحالية.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">7. اتصل بنا</h2>
                <p className="text-gray-600">
                  إذا كان لديك أي استفسارات حول سياسة الاسترداد، يرجى التواصل مع فريق دعم العملاء على support@basit.com أو من خلال نموذج الاتصال على موقعنا.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mt-12"
            >
              <p className="text-gray-600">
                آخر تحديث: 15 يونيو 2023
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default RefundPolicy