import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import projects from '../data/projects.json';
import internships from '../data/internships.json';

export default function Home() {
  const services = [
    {
      title: 'Web & App Development',
      description: 'Modern, responsive web applications with cutting-edge frameworks',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      features: ['React & Next.js', 'Node.js APIs', 'Cloud Deployment'],
      link: '/services'
    },
    {
      title: 'Embedded & IoT',
      description: 'Smart devices and automation for the connected world',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      features: ['Arduino & ESP32', 'Sensor Integration', 'MQTT & Cloud'],
      link: '/services'
    },
    {
      title: 'AI & Machine Learning',
      description: 'Intelligent solutions powered by artificial intelligence',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      features: ['ML Models', 'NLP & ChatBots', 'Computer Vision'],
      link: '/services'
    },
    {
      title: 'Digital Marketing',
      description: 'Strategic campaigns that drive growth and engagement',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      features: ['SEO & SEM', 'Social Media', 'Content Strategy'],
      link: '/services'
    },
  ];

  const stats = [
    { number: '10+', label: 'Students Trained' },
    { number: '5+', label: 'Projects Delivered' },
    { number: '100%', label: 'Satisfaction Rate' },
    { number: '4', label: 'Core Services' },
  ]; // Stats updated

  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  const featuredInternships = internships.filter(i => i.featured).slice(0, 2);

  return (
    <main className="bg-white">
      <SEO />
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden hero-gradient">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl"
            animate={{ y: [0, 50, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl"
            animate={{ y: [0, -50, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6 px-6 py-2 bg-white rounded-full shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-sm font-semibold gradient-text">Empowering Future Tech Leaders</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transform Your <br />
              <span className="gradient-text-shimmer">Tech Career</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Practical internships, real-world projects, and industry expertise to launch your career in technology
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/internships">
                <Button variant="primary" className="px-8 py-4 text-lg">
                  Explore Internships
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" className="px-8 py-4 text-lg">
                  View Projects
                </Button>
              </Link>
            </div>

            <motion.div
              className="mt-16 flex flex-wrap justify-center gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tech solutions tailored to your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={service.link}>
                  <Card className="p-8 h-full group cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-r from-brand-purple/10 to-brand-pink/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-brand-purple group-hover:text-brand-pink transition-colors">
                        {service.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-brand-purple transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real-world solutions built with cutting-edge technologies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/projects/${project.slug}`}>
                  <Card className="overflow-hidden group cursor-pointer">
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-brand-purple">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-brand-purple transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/projects">
              <Button variant="outline">View All Projects</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Internship <span className="gradient-text">Programs</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Flexible duration intensive programs with real projects and industry certification
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {featuredInternships.map((internship, index) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-8 gradient-border-animated h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="inline-block px-4 py-1 bg-gradient-to-r from-brand-purple/10 to-brand-pink/10 rounded-full text-sm font-semibold text-brand-purple mb-4">
                        {internship.domain}
                      </span>
                      <h3 className="text-2xl font-bold mb-2">{internship.title}</h3>
                      <p className="text-gray-600">{internship.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-3 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Duration: {internship.duration}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-3 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Investment: From ₹{internship.price}
                    </div>
                  </div>

                  <Link to={`/internships/${internship.slug}`}>
                    <Button variant="primary" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/internships">
              <Button variant="outline">View All Programs</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-pink opacity-10"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="gradient-text">Start Your Journey?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Join hundreds of students who have transformed their careers through our programs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="primary" className="px-8 py-4 text-lg">
                  Get in Touch
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" className="px-8 py-4 text-lg">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}