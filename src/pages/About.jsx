import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => {
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
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">من نحن</h1>
              <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
                منصة المعرفة هي منصة تعليمية متخصصة تهدف إلى توفير محتوى تعليمي عالي الجودة للطلاب من السنة الأولى إلى السنة السادسة
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="md:w-1/2"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6">قصتنا</h2>
                <p className="text-gray-600 mb-4">
                  بدأت منصة المعرفة كفكرة بسيطة من مجموعة من المعلمين المتحمسين الذين أرادوا إحداث تغيير في طريقة تعلم الطلاب. لاحظنا أن العديد من الطلاب يواجهون صعوبات في فهم المواد الدراسية، وأردنا توفير حل يساعدهم على التعلم بطريقة أكثر فعالية وممتعة.
                </p>
                <p className="text-gray-600 mb-4">
                  في عام 2020، أطلقنا النسخة الأولى من منصة المعرفة بهدف توفير محتوى تعليمي عالي الجودة للطلاب من السنة الأولى إلى السنة السادسة. ومنذ ذلك الحين، نمت المنصة لتصبح واحدة من المنصات التعليمية الرائدة في المنطقة.
                </p>
                <p className="text-gray-600">
                  اليوم، تخدم منصة المعرفة آلاف الطلاب وتوفر لهم محتوى تعليمي متميز يساعدهم على التفوق في دراستهم.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="md:w-1/2"
              >
                <img 
                  src="/src/assets/about-story.svg" 
                  alt="قصة منصة المعرفة" 
                  className="rounded-lg shadow-lg w-full h-auto" 
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="md:w-1/2"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6">مهمتنا</h2>
                <p className="text-gray-600 mb-4">
                  مهمتنا في منصة المعرفة هي توفير تعليم عالي الجودة وسهل الوصول لجميع الطلاب، بغض النظر عن موقعهم أو ظروفهم. نؤمن بأن التعليم حق للجميع، ونسعى جاهدين لجعله متاحًا للجميع.
                </p>
                <p className="text-gray-600 mb-4">
                  نهدف إلى تبسيط المفاهيم المعقدة وتقديمها بطريقة سهلة الفهم، مما يساعد الطلاب على بناء أساس قوي في مختلف المواد الدراسية. كما نسعى إلى تعزيز حب التعلم لدى الطلاب وتشجيعهم على الاستمرار في التعلم مدى الحياة.
                </p>
                <p className="text-gray-600">
                  نحن ملتزمون بتطوير منصتنا باستمرار وإضافة محتوى جديد ومبتكر يلبي احتياجات الطلاب المتغيرة.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="md:w-1/2"
              >
                <img 
                  src="/src/assets/about-mission.svg" 
                  alt="مهمة منصة المعرفة" 
                  className="rounded-lg shadow-lg w-full h-auto" 
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">فريقنا</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                يتكون فريقنا من معلمين ومطورين متحمسين يعملون معًا لتوفير أفضل تجربة تعليمية للطلاب
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary">
                  <img 
                    src="/src/assets/team-1.svg" 
                    alt="عضو الفريق" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">أحمد محمد</h3>
                <p className="text-primary mb-3">المؤسس والمدير التنفيذي</p>
                <p className="text-gray-600">
                  معلم سابق بخبرة 15 عامًا في مجال التعليم، وحاصل على ماجستير في المناهج وطرق التدريس
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary">
                  <img 
                    src="/src/assets/team-2.svg" 
                    alt="عضو الفريق" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">سارة علي</h3>
                <p className="text-primary mb-3">مديرة المحتوى التعليمي</p>
                <p className="text-gray-600">
                  معلمة بخبرة 10 سنوات في تدريس المرحلة الابتدائية، وحاصلة على دكتوراه في تكنولوجيا التعليم
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary">
                  <img 
                    src="/src/assets/team-3.svg" 
                    alt="عضو الفريق" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">محمد خالد</h3>
                <p className="text-primary mb-3">مدير التكنولوجيا</p>
                <p className="text-gray-600">
                  مطور ويب بخبرة 8 سنوات في تطوير المنصات التعليمية، وحاصل على بكالوريوس في هندسة البرمجيات
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white mb-6"
            >
              هل لديك أسئلة؟
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-white opacity-90 max-w-2xl mx-auto mb-8"
            >
              فريقنا جاهز للإجابة على جميع استفساراتك. تواصل معنا اليوم!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <a 
                href="/contact" 
                className="bg-white text-primary py-3 px-8 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300 inline-block"
              >
                اتصل بنا
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default About