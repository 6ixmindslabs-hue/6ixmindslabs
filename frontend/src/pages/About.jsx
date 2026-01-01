import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import Card from '../components/Card';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Internal Modal Component
const MemberModal = ({ member, onClose }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-r from-brand-purple to-brand-pink">
                <img
                  src={member.image}
                  alt={member.alt}
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 id="modal-title" className="text-3xl font-bold mb-2">{member.name}</h2>
              <p className="text-brand-purple font-bold uppercase tracking-wider text-sm mb-4">{member.title}</p>
              <p className="text-gray-600 leading-relaxed">{member.fullBio}</p>
            </div>
          </div>


        </div>
      </motion.div>
    </div>
  );
};

export default function About() {
  const [selectedMember, setSelectedMember] = useState(null);

  const timeline = [
    { year: '2025', title: 'Company Founded', description: 'Started by a team of young engineers with a goal to build real-world tech and train students with practical skills.' },
    { year: '2025', title: 'First Services & Projects', description: 'Delivered 5+ early projects in Web, AI, and IoT for local startups and student clients.' },
    { year: '2025', title: 'Internship Launch', description: 'Started hands-on internship programs and trained 10+ students through project-based learning.' },
    { year: '2025', title: 'Team Growth', description: 'Formed a dedicated 6-member engineering team covering Web, AI, IoT, Embedded, and Marketing.' },
  ];

  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
        const response = await fetch(`${apiUrl}/api/team`);
        const data = await response.json();

        if (data.success) {
          // Sort by order and filter active
          const activeMembers = data.data
            .filter(m => m.active)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(m => ({
              ...m,
              // Map DB fields to Component expectations if needed
              image: m.photo || '', // About.jsx uses 'image', DB uses 'photo'
              alt: m.name + ' - ' + m.role,
              // Fallback for missing new fields if DB entry is old
              responsibilities: m.responsibilities || [],
              techStack: m.techStack || [],
              projects: m.projects || []
            }));
          setTeam(activeMembers);
        }
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const services = [
    {
      title: 'Web Development Services',
      items: ['Full-stack website and web app development', 'Dashboard systems, CRUD apps', 'Admin panels, APIs'],
      icon: '🌐'
    },
    {
      title: 'AI/ML Services',
      items: ['AI model building', 'Classification systems', 'Computer vision models', 'Automation tools for startups'],
      icon: '🤖'
    },
    {
      title: 'IoT & Embedded Services',
      items: ['Sensor-based systems', 'Real-time monitoring solutions', 'Basic electronics + embedded prototyping'],
      icon: '🔌'
    }
  ];

  const whyChooseUs = [
    { title: 'Real Projects, Not Theory', desc: 'We focus on execution and delivery, ensuring practical value in everything we build.' },
    { title: 'Multi-Skill Engineering Team', desc: 'A 6-member team covering Web, AI, IoT, Embedded, and Digital Marketing.' },
    { title: 'Startup Support', desc: 'From idea to prototype to product, we support startups with end-to-end tech services.' },
    { title: 'Practical Student Training', desc: 'Hands-on exposure through actual client projects, turning students into engineers.' },
    { title: 'Clean, Fast Delivery', desc: 'Professional development standards with a focus on quality and timeliness.' }
  ];

  // Helper for placeholders if image fails (using UI-Avatars)
  const handleImageError = (e, name) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200`;
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="About Us"
        description="Learn about 6ixminds Labs, a tech innovation hub built by young engineers specializing in Web, AI, IoT, and more."
        url="/about"
      />
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "6ixminds Labs",
          "employees": team.map(member => ({
            "@type": "Person",
            "name": member.name,
            "jobTitle": member.role,
            "image": `https://6ixmindslabs.com${member.image}`,
            "description": member.microBio
          }))
        })}
      </script>

      <AnimatePresence>
        {selectedMember && (
          <MemberModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-purple-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              About <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">6ixminds Labs</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6 font-light">
              We are a <span className="font-semibold text-brand-purple">2025-born tech lab</span> started by young engineers, building the next generation of tech through real-world execution.
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
              Built by a 6-member engineering team skilled across Full Stack, AI/ML, IoT, Embedded Systems, and Digital Marketing. We focus on <span className="font-medium text-gray-800">real learning</span> and <span className="font-medium text-gray-800">actual project delivery</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section - Two Column Layout */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Two Column Grid for Mission and Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Vision Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >

              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">Our Vision</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-brand-purple to-brand-pink mx-auto rounded-full mb-8"></div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To build India's most trusted engineering ecosystem where young developers learn by creating, startups scale through real tech, and innovation becomes accessible to everyone—from idea to deployment.
              </p>
            </motion.div>

            {/* Mission Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >

              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">Our Mission</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-brand-purple to-brand-pink mx-auto rounded-full mb-8"></div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To turn students into job-ready engineers, provide startups with end-to-end tech services, and make practical engineering accessible through real deployment and modern tools.
              </p>
            </motion.div>
          </div>

          {/* Three Feature Cards Below */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4">🚀</div>
              <h3 className="font-bold text-xl mb-2">For Startups</h3>
              <p className="text-gray-500">End-to-end tech services from MVP to scale.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">🎓</div>
              <h3 className="font-bold text-xl mb-2">For Students</h3>
              <p className="text-gray-500">Hands-on internship training with real projects.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5 }}
              className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-2xl mb-4">💡</div>
              <h3 className="font-bold text-xl mb-2">Innovation</h3>
              <p className="text-gray-500">Building products with modern tools and real deployment.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
            <p className="text-gray-500">Comprehensive technology solutions for the modern world</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full p-8 hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-brand-purple">
                  <div className="text-5xl mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <ul className="space-y-3">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-start text-gray-600">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our <span className="gradient-text">Journey</span></h2>
            <p className="text-gray-500">Tracking our milestones in 2025</p>
          </div>

          <div className="relative">
            {/* Central Line Track (Static background for the line) */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-purple-50 md:-translate-x-1/2 rounded-full"></div>

            {/* Animated Central Line */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute left-4 md:left-1/2 top-0 w-1 bg-gradient-to-b from-purple-200 via-brand-purple to-purple-200 md:-translate-x-1/2 rounded-full origin-top"
            ></motion.div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  className={`relative flex items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Animated Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5, type: "spring", stiffness: 200, damping: 10 }}
                    className="absolute left-4 md:left-1/2 w-4 h-4 bg-white border-4 border-brand-purple rounded-full z-10 md:-translate-x-1/2 shadow-lg shadow-purple-500/20"
                  ></motion.div>

                  {/* Content */}
                  <motion.div
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 w-full md:w-[45%] ml-12 md:ml-0 hover:shadow-xl hover:border-purple-200 transition-shadow duration-300"
                  >
                    <span className="inline-block px-3 py-1 bg-purple-100 text-brand-purple text-sm font-bold rounded-full mb-2">{item.year}</span>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </motion.div>

                  {/* Empty space for the other side */}
                  <div className="hidden md:block w-[45%]"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet The <span className="gradient-text">Team</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Our dedicated 6-member leadership & engineering team driving innovation and execution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.42, ease: "easeOut" }}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                className="group"
              >
                <div
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center cursor-pointer h-full flex flex-col items-center"
                  onClick={() => setSelectedMember(member)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedMember(member)}
                  tabIndex="0"
                  role="button"
                  aria-label={`View profile of ${member.name}`}
                  data-member-role={member.role}
                >
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-r from-brand-purple to-brand-pink group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={member.image}
                        alt={member.alt}
                        onError={(e) => handleImageError(e, member.name)}
                        className="w-full h-full rounded-full object-cover border-4 border-white group-hover:-rotate-1 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-purple mb-4 h-8 flex items-center justify-center">
                    {member.title}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
                    {member.microBio}
                  </p>

                  <div className="mt-auto">
                    <span className="text-brand-purple font-semibold text-sm group-hover:underline flex items-center justify-center gap-1">
                      View Profile
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose <span className="gradient-text">Us?</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${index === 3 || index === 4 ? 'lg:col-span-1 md:col-span-1' : ''}`} // Just simple grit placement
              >
                <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-purple-200 transition-colors h-full">
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-brand-purple to-brand-pink text-white text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to Build the Future?</h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Whether you're a startup looking for tech solutions or a student ready for real-world projects, we're here to help.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/contact" className="px-8 py-4 bg-white text-brand-purple rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                Work With Us
              </Link>
              <Link to="/internships" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
                Join Internship
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
