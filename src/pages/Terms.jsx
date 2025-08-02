import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Terms = () => {
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
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">شروط الاستخدام</h1>
              <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
                يرجى قراءة شروط الاستخدام التالية بعناية قبل استخدام منصتنا
              </p>
            </motion.div>
          </div>
        </section>

        {/* Terms Content */}
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
                  مرحبًا بك في منصة المعرفة ("المنصة"). باستخدامك لهذه المنصة، فإنك توافق على الالتزام بشروط الاستخدام هذه ("الشروط"). إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام المنصة.
                </p>
                <p className="text-gray-600">
                  نحتفظ بالحق في تعديل هذه الشروط في أي وقت. ستكون التغييرات سارية المفعول فور نشرها على المنصة. من خلال استمرارك في استخدام المنصة بعد نشر أي تغييرات، فإنك توافق على الالتزام بالشروط المعدلة.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. حسابات المستخدمين</h2>
                <p className="text-gray-600 mb-3">
                  لاستخدام بعض ميزات المنصة، قد تحتاج إلى إنشاء حساب. أنت مسؤول عن الحفاظ على سرية معلومات حسابك، بما في ذلك كلمة المرور الخاصة بك، وعن جميع الأنشطة التي تحدث تحت حسابك.
                </p>
                <p className="text-gray-600 mb-3">
                  يجب أن تكون جميع المعلومات التي تقدمها عند إنشاء حساب دقيقة وكاملة. إذا اكتشفت أي استخدام غير مصرح به لحسابك، يرجى إخطارنا على الفور.
                </p>
                <p className="text-gray-600">
                  نحتفظ بالحق في إنهاء أو تعليق حسابك في أي وقت، لأي سبب، دون إشعار مسبق.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. الاشتراكات والمدفوعات</h2>
                <p className="text-gray-600 mb-3">
                  تقدم المنصة خطط اشتراك مختلفة للوصول إلى المحتوى التعليمي. تفاصيل الأسعار ومدة الاشتراك متاحة على صفحة الاشتراكات.
                </p>
                <p className="text-gray-600 mb-3">
                  عند شراء اشتراك، فإنك توافق على دفع الرسوم المحددة لخطة الاشتراك التي اخترتها. جميع المدفوعات غير قابلة للاسترداد إلا في الحالات التي ينص عليها القانون أو وفقًا لسياسة الاسترداد الخاصة بنا.
                </p>
                <p className="text-gray-600">
                  نحتفظ بالحق في تغيير أسعار الاشتراك في أي وقت، ولكن سيتم إخطارك بأي تغييرات في الأسعار قبل أن تؤثر عليك.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. حقوق الملكية الفكرية</h2>
                <p className="text-gray-600 mb-3">
                  جميع المحتويات المتاحة على المنصة، بما في ذلك النصوص والرسومات والشعارات والصور ومقاطع الفيديو والمواد التعليمية، هي ملك لنا أو لمرخصينا وتخضع لحماية حقوق الطبع والنشر وغيرها من قوانين الملكية الفكرية.
                </p>
                <p className="text-gray-600 mb-3">
                  يُمنح المستخدمون ترخيصًا محدودًا وغير حصري وغير قابل للتحويل للوصول إلى المحتوى واستخدامه للأغراض التعليمية الشخصية فقط.
                </p>
                <p className="text-gray-600">
                  لا يجوز لك نسخ أو تعديل أو توزيع أو بيع أو تأجير أو إعادة ترخيص أو نقل أو إنشاء أعمال مشتقة من المحتوى المتاح على المنصة دون إذن كتابي صريح منا.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. قواعد السلوك</h2>
                <p className="text-gray-600 mb-3">
                  عند استخدام المنصة، توافق على عدم:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-3 space-y-2 pr-4">
                  <li>انتهاك أي قوانين أو لوائح محلية أو وطنية أو دولية.</li>
                  <li>نشر أو إرسال أي محتوى غير قانوني أو ضار أو تهديدي أو مسيء أو تشهيري أو فاحش أو مخالف للآداب العامة.</li>
                  <li>انتحال شخصية أي فرد أو كيان، أو تحريف انتمائك إلى أي فرد أو كيان.</li>
                  <li>التدخل في أو تعطيل المنصة أو الخوادم أو الشبكات المتصلة بالمنصة.</li>
                  <li>جمع أو تخزين البيانات الشخصية عن المستخدمين الآخرين دون إذنهم.</li>
                  <li>استخدام المنصة لأي غرض غير قانوني أو غير مصرح به.</li>
                </ul>
                <p className="text-gray-600">
                  نحتفظ بالحق في إزالة أي محتوى ينتهك هذه القواعد وتعليق أو إنهاء وصول المستخدم إلى المنصة.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. إخلاء المسؤولية</h2>
                <p className="text-gray-600 mb-3">
                  يتم توفير المنصة "كما هي" و"كما هو متاح" دون أي ضمانات من أي نوع، صريحة أو ضمنية. لا نضمن أن المنصة ستكون خالية من الأخطاء أو غير منقطعة أو آمنة أو خالية من الفيروسات أو غيرها من المكونات الضارة.
                </p>
                <p className="text-gray-600">
                  لا نتحمل أي مسؤولية عن أي خسارة أو ضرر ينشأ عن استخدامك للمنصة أو عدم قدرتك على استخدامها، بما في ذلك على سبيل المثال لا الحصر، الخسائر غير المباشرة أو العرضية أو الخاصة أو التبعية.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">7. التعويض</h2>
                <p className="text-gray-600">
                  توافق على تعويضنا والدفاع عنا وإبراء ذمتنا من وضد أي مطالبات أو خسائر أو مسؤوليات أو نفقات (بما في ذلك أتعاب المحاماة) الناشئة عن انتهاكك لهذه الشروط أو استخدامك للمنصة.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">8. القانون الحاكم</h2>
                <p className="text-gray-600">
                  تخضع هذه الشروط وتفسر وفقًا لقوانين المملكة العربية السعودية، دون اعتبار لمبادئ تنازع القوانين. أي نزاع ينشأ عن أو يتعلق بهذه الشروط سيخضع للاختصاص القضائي الحصري للمحاكم المختصة في المملكة العربية السعودية.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">9. اتصل بنا</h2>
                <p className="text-gray-600">
                  إذا كان لديك أي أسئلة حول شروط الاستخدام هذه، يرجى الاتصال بنا على info@basit.com أو من خلال نموذج الاتصال على موقعنا.
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

export default Terms