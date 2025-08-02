import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Privacy = () => {
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
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">سياسة الخصوصية</h1>
              <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
                نحن نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية
              </p>
            </motion.div>
          </div>
        </section>

        {/* Privacy Content */}
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
                  تصف سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمها عند استخدام منصة المعرفة ("المنصة"). نحن ملتزمون بضمان خصوصية وأمان معلوماتك الشخصية. نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.
                </p>
                <p className="text-gray-600">
                  من خلال استخدام منصتنا، فإنك توافق على جمع واستخدام المعلومات وفقًا لسياسة الخصوصية هذه. نحتفظ بالحق في تعديل هذه السياسة في أي وقت، وسنخطرك بأي تغييرات من خلال نشر السياسة المحدثة على هذه الصفحة.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. المعلومات التي نجمعها</h2>
                <p className="text-gray-600 mb-3">
                  نحن نجمع أنواعًا مختلفة من المعلومات لأغراض مختلفة لتوفير وتحسين خدمتنا لك.
                </p>
                <h3 className="text-xl font-bold text-gray-700 mb-2">2.1 البيانات الشخصية</h3>
                <p className="text-gray-600 mb-3">
                  عند التسجيل في منصتنا، قد نطلب منك تزويدنا ببعض المعلومات الشخصية التي يمكن استخدامها للاتصال بك أو تحديد هويتك ("البيانات الشخصية"). قد تتضمن البيانات الشخصية، على سبيل المثال لا الحصر:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-3 space-y-2 pr-4">
                  <li>الاسم الكامل</li>
                  <li>عنوان البريد الإلكتروني</li>
                  <li>رقم الهاتف</li>
                  <li>العنوان</li>
                  <li>المرحلة الدراسية</li>
                  <li>تفاصيل الدفع (عند شراء اشتراك)</li>
                </ul>
                
                <h3 className="text-xl font-bold text-gray-700 mb-2 mt-6">2.2 بيانات الاستخدام</h3>
                <p className="text-gray-600 mb-3">
                  نحن نجمع أيضًا معلومات حول كيفية استخدام المنصة ("بيانات الاستخدام"). قد تتضمن بيانات الاستخدام معلومات مثل:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-3 space-y-2 pr-4">
                  <li>عنوان بروتوكول الإنترنت لجهاز الكمبيوتر الخاص بك (مثل عنوان IP)</li>
                  <li>نوع المتصفح</li>
                  <li>إصدار المتصفح</li>
                  <li>صفحات منصتنا التي تزورها</li>
                  <li>وقت وتاريخ زيارتك</li>
                  <li>الوقت الذي تقضيه على تلك الصفحات</li>
                  <li>معرفات الجهاز الفريدة وبيانات تشخيصية أخرى</li>
                </ul>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. كيف نستخدم معلوماتك</h2>
                <p className="text-gray-600 mb-3">
                  نستخدم المعلومات التي نجمعها للأغراض التالية:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-3 space-y-2 pr-4">
                  <li>توفير وصيانة منصتنا</li>
                  <li>إخطارك بالتغييرات على منصتنا</li>
                  <li>السماح لك بالمشاركة في الميزات التفاعلية لمنصتنا عندما تختار القيام بذلك</li>
                  <li>تقديم الدعم للعملاء</li>
                  <li>جمع التحليلات أو المعلومات القيمة حتى نتمكن من تحسين منصتنا</li>
                  <li>مراقبة استخدام منصتنا</li>
                  <li>اكتشاف ومنع ومعالجة المشكلات الفنية</li>
                  <li>معالجة المدفوعات وإدارة الاشتراكات</li>
                  <li>إرسال معلومات حول المنتجات والخدمات الجديدة والعروض الخاصة (مع خيار إلغاء الاشتراك)</li>
                </ul>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. تخزين البيانات ونقلها</h2>
                <p className="text-gray-600 mb-3">
                  يتم تخزين معلوماتك ومعالجتها في قواعد بيانات آمنة داخل المملكة العربية السعودية. نحن نتخذ جميع الخطوات المعقولة لضمان معالجة بياناتك بشكل آمن وبما يتوافق مع سياسة الخصوصية هذه.
                </p>
                <p className="text-gray-600">
                  لن ننقل بياناتك الشخصية إلى منظمة أو دولة ما لم تكن هناك ضوابط كافية مطبقة بما في ذلك أمان بياناتك ومعلوماتك الشخصية الأخرى.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. الإفصاح عن البيانات</h2>
                <p className="text-gray-600 mb-3">
                  قد نكشف عن بياناتك الشخصية في الحالات التالية:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-3 space-y-2 pr-4">
                  <li>للامتثال للالتزام القانوني</li>
                  <li>لحماية وللدفاع عن حقوق أو ممتلكات منصتنا</li>
                  <li>لمنع أو التحقيق في أي مخالفات محتملة تتعلق بالمنصة</li>
                  <li>لحماية السلامة الشخصية لمستخدمي المنصة أو الجمهور</li>
                  <li>للحماية من المسؤولية القانونية</li>
                </ul>
                <p className="text-gray-600">
                  لن نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة خارج منصتنا دون موافقتك، باستثناء ما هو موضح في سياسة الخصوصية هذه.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. أمان البيانات</h2>
                <p className="text-gray-600 mb-3">
                  أمان معلوماتك مهم بالنسبة لنا، ولكن تذكر أنه لا توجد طريقة نقل عبر الإنترنت أو طريقة تخزين إلكتروني آمنة بنسبة 100٪. بينما نسعى جاهدين لاستخدام وسائل مقبولة تجاريًا لحماية معلوماتك الشخصية، لا يمكننا ضمان أمانها المطلق.
                </p>
                <p className="text-gray-600">
                  نحن نستخدم مجموعة متنوعة من تدابير الأمان، بما في ذلك التشفير وأدوات المصادقة، لمساعدتنا في حماية معلوماتك.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">7. حقوقك في حماية البيانات</h2>
                <p className="text-gray-600 mb-3">
                  لديك حقوق معينة فيما يتعلق بمعلوماتك الشخصية، بما في ذلك:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-3 space-y-2 pr-4">
                  <li>الحق في الوصول إلى معلوماتك الشخصية التي نحتفظ بها</li>
                  <li>الحق في تصحيح أي معلومات غير دقيقة أو غير كاملة</li>
                  <li>الحق في طلب حذف معلوماتك الشخصية في ظروف معينة</li>
                  <li>الحق في تقييد معالجة معلوماتك الشخصية في ظروف معينة</li>
                  <li>الحق في الاعتراض على معالجة معلوماتك الشخصية في ظروف معينة</li>
                  <li>الحق في نقل البيانات</li>
                </ul>
                <p className="text-gray-600">
                  إذا كنت ترغب في ممارسة أي من هذه الحقوق، يرجى الاتصال بنا باستخدام المعلومات الواردة في نهاية سياسة الخصوصية هذه.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">8. ملفات تعريف الارتباط</h2>
                <p className="text-gray-600 mb-3">
                  نستخدم ملفات تعريف الارتباط وتقنيات تتبع مماثلة لتتبع النشاط على منصتنا وتخزين معلومات معينة. ملفات تعريف الارتباط هي ملفات تحتوي على كمية صغيرة من البيانات التي قد تتضمن معرفًا فريدًا مجهول الهوية. يتم إرسال ملفات تعريف الارتباط إلى متصفحك من موقع ويب وتخزينها على جهازك.
                </p>
                <p className="text-gray-600 mb-3">
                  يمكنك توجيه متصفحك لرفض جميع ملفات تعريف الارتباط أو للإشارة عند إرسال ملف تعريف ارتباط. ومع ذلك، إذا كنت لا تقبل ملفات تعريف الارتباط، فقد لا تتمكن من استخدام بعض أجزاء من منصتنا.
                </p>
                <p className="text-gray-600">
                  نستخدم ملفات تعريف الارتباط للأغراض التالية:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-3 space-y-2 pr-4">
                  <li>لتسجيل الدخول وتذكر تفضيلاتك</li>
                  <li>لفهم وحفظ تفضيلات المستخدم للزيارات المستقبلية</li>
                  <li>لتتبع استخدام المنصة وتحليله</li>
                  <li>لتحسين منصتنا وتجربة المستخدم</li>
                </ul>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">9. خصوصية الأطفال</h2>
                <p className="text-gray-600">
                  منصتنا موجهة للأفراد الذين تبلغ أعمارهم 13 عامًا على الأقل. نحن لا نجمع عن قصد معلومات قابلة للتعريف شخصيًا من الأطفال دون سن 13 عامًا. إذا كنت أحد الوالدين أو الوصي وتعلم أن طفلك قد زودنا بمعلومات شخصية، يرجى الاتصال بنا. إذا علمنا أننا جمعنا معلومات شخصية من الأطفال دون التحقق من موافقة الوالدين، فسنتخذ خطوات لإزالة تلك المعلومات من خوادمنا.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">10. اتصل بنا</h2>
                <p className="text-gray-600">
                  إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على privacy@basit.com أو من خلال نموذج الاتصال على موقعنا.
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
                آخر تحديث: 1 يونيو 2023
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default Privacy