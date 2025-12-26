import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

export default function Services() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const services = [
    {
      title: 'Web & App Development',
      description: 'Modern, responsive web and app development for startups and small businesses. We build actual deployable applications with clean UI, fast performance, and scalable backend systems.',
      idealFor: 'Founders, early-stage startups, prototypes, student projects, small businesses.',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      features: [
        'Custom websites that match your brand',
        'Progressive Web Apps (PWAs) for mobile-like experience',
        'E-commerce and dashboard systems',
        'API development with secure, scalable logic',
        'CMS integrations for easy content management',
        'Cloud deployment & hosting setup'
      ],
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      title: 'AI & Automation Services',
      description: 'AI-based tools and automation solutions to help startups work smarter. We build ML models, data classifiers, computer vision prototypes, and workflow automations.',
      idealFor: 'Startups, founders testing ideas, student innovations, automation needs.',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      features: [
        'Computer vision models (detection, tracking)',
        'NLP tools like text classification',
        'Automation bots for repetitive workflows',
        'AI-powered analytics dashboards',
        'Model deployment & integration into apps'
      ],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'IoT & Embedded Systems',
      description: 'Smart device solutions with sensors, embedded firmware, and cloud connectivity. Ideal for prototypes, college projects, and startup hardware MVPs.',
      idealFor: 'Hardware founders, engineering students, prototype builders.',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      features: [
        'Sensor integration & PCB-level prototyping',
        'Wireless connectivity (Wi-Fi, BLE, MQTT)',
        'Firmware development for ESP32/Arduino',
        'Edge computing models',
        'Cloud-based monitoring dashboards'
      ],
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const whyChooseUs = [
    { title: 'Fast Delivery', desc: 'Through a skilled 6-member engineering team', icon: '🚀' },
    { title: 'Affordable', desc: 'Cost-effective solutions for startups', icon: '💰' },
    { title: 'Multi-Skilled', desc: 'Expertise in Web, AI, and IoT', icon: '🛠️' },
    { title: 'Hands-on', desc: 'Real engineering, not just theory', icon: '👨‍💻' },
    { title: 'Registered', desc: 'MSME registered (Tamil Nadu)', icon: '📜' },
    { title: 'Experienced', desc: 'Real project execution experience', icon: '🏆' }
  ];

  const process = [
    { title: 'Discovery', desc: 'Understand goals and refine requirements', icon: '🔍' },
    { title: 'Design', desc: 'UI/UX, architecture, and planning', icon: '🎨' },
    { title: 'Development', desc: 'Agile builds with weekly updates', icon: '💻' },
    { title: 'Testing', desc: 'Quality checks & revisions', icon: '🧪' },
    { title: 'Deployment', desc: 'Production-ready build', icon: '🚀' },
    { title: 'Support', desc: 'Post-launch support and improvements', icon: '🛡️' }
  ];



  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Our Services"
        description="Explore 6ixminds Labs services: Web Development, AI & Automation, and IoT Solutions."
        url="/services"
      />
      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-purple-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-purple-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8 font-light">
              Premium technology solutions for startups, students, and businesses. We execute <span className="font-semibold text-brand-purple">real ideas</span> into deployed products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <div className="group relative h-full bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-2">

                  {/* Top Gradient Line */}
                  <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${service.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>

                  <div className="p-8 flex-grow flex flex-col relative z-10">
                    {/* Icon & Label Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} p-3 text-white shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}>
                        <div className="transform scale-75">
                          {service.icon}
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-400 border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                        0{index + 1}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-brand-purple transition-colors duration-300">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                      {service.description}
                    </p>

                    {/* Ideal For Box */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100 group-hover:border-purple-100 group-hover:bg-purple-50/30 transition-colors">
                      <span className={`text-[10px] font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${service.gradient} mb-2 block`}>
                        Ideal For
                      </span>
                      <p className="text-sm font-medium text-gray-700 leading-snug">
                        {service.idealFor}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                          <span className={`mr-3 mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity text-white shadow-sm`}>
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Button - Pushed to bottom */}
                    <div className="mt-auto pt-6 border-t border-gray-50">
                      <Link to="/contact" className="group/btn flex items-center justify-between w-full p-2 pl-5 pr-2 bg-gray-900 hover:bg-black rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                        <span className="text-sm font-bold text-white">Get Started</span>
                        <span className={`w-10 h-10 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center text-white shadow-md transform group-hover/btn:rotate-45 transition-transform duration-300`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </Link>
                    </div>

                  </div>

                  {/* Decorative background blob */}
                  <div className={`absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-r ${service.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose <span className="text-brand-purple">Us?</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We combine technical expertise with startup speed to deliver real value.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">How We <span className="text-brand-purple">Work</span></h2>
            <p className="text-gray-500">A transparent, agile process to bring your ideas to life</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center group"
              >
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-100 -z-10"></div>
                )}
                <div className="w-16 h-16 mx-auto bg-white border-2 border-brand-purple rounded-full flex items-center justify-center text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  {step.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 px-2">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-brand-purple to-brand-pink text-white text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Have an idea or need a tech team?</h2>
            <p className="text-xl mb-10 opacity-90">Let’s build something together.</p>
            <Link to="/contact" className="px-10 py-4 bg-white text-brand-purple rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}