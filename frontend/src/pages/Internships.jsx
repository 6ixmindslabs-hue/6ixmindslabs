import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
// import internships from '../data/internships.json'; // REMOVED

export default function Internships() {
  const { slug } = useParams();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('2Weeks');

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

  useEffect(() => {
    fetchInternships();
  }, []);

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchInternships = async () => {
    try {
      const response = await fetch(`${API_URL}/api/internships`);
      const data = await response.json();
      if (data.success) {
        setInternships(data.data);
      } else {
        console.error('Failed to fetch internships');
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (slug) {
    const internship = internships.find(i => i.slug === slug);

    if (!internship) {
      return (
        <div className="min-h-screen py-20 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Internship Program not found</h2>
          <Link to="/internships">
            <Button variant="primary">Back to Programs</Button>
          </Link>
        </div>
      );
    }

    // Default rich structure handling if missing from DB (backward compatibility or default structure)
    // The DB schema is flatter than the original JSON which had nested durationOptions.
    // We might need to adjust the DB map or frontend logic. 
    // The current DB schema has flat fields: title, domain, duration, price, description, skills, projects.
    // The original JSON had 'durationOptions' with '2Weeks' and '1Month' keys.
    // If we want to maintain that rich structure, we should have used a JSONB column or separate tables.
    // However, looking at the admin panel, we mapped everything to flat fields.
    // Let's adapt the frontend to work with the flat fields found in the DB for now, 
    // OR mock the durationOptions if the DB data is simple.

    // START ADAPTER LOGIC because DB is simpler than original JSON structure
    // We will assume the DB 'price' and 'duration' are the defaults.
    // And we'll construct a mock 'durationOptions' object to satisfy the existing JSX.
    const durationOptions = {
      '2Weeks': {
        durationLabel: internship.duration || '2 Weeks',
        price: internship.price || 2000,
        learningOutcome: internship.description,
        whatTheyCanLearn: internship.skills || [],
        projectCapacity: "Build **1 Major Project**",
        exampleProjects: internship.projects || []
      },
      '1Month': {
        durationLabel: '1 Month',
        price: (internship.price || 2000) * 2,
        learningOutcome: internship.description + " (Extended)",
        whatTheyCanLearn: internship.skills || [],
        projectCapacity: "Build **2 Major Projects**",
        exampleProjects: internship.projects || []
      }
    };

    const selectedOption = durationOptions[selectedDuration] || durationOptions['2Weeks'];
    // END ADAPTER LOGIC

    return (
      <div className="min-h-screen bg-white">
        <SEO
          title={`${internship.title} Internship`}
          description={`Join our ${internship.title} internship program. Learn practical skills and build real projects.`}
          url={`/internships/${internship.slug}`}
        />
        <section className="relative py-20 px-4 bg-gradient-to-br from-purple-50 to-white">
          <div className="max-w-5xl mx-auto">
            <Link to="/internships" className="inline-flex items-center text-gray-600 hover:text-brand-purple mb-8 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Programs
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="inline-block px-4 py-1 bg-brand-purple/10 text-brand-purple rounded-full text-sm font-semibold">
                  {internship.domain}
                </span>
                <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                  ₹{selectedOption.price}
                </span>
                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                  {selectedOption.durationLabel}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6">{internship.title}</h1>
              <p className="text-xl text-gray-600 max-w-3xl mb-8">
                {selectedOption.learningOutcome}
              </p>

              {/* Duration Selector */}
              <div className="flex gap-4 mb-8 bg-gray-100 p-1 rounded-lg inline-flex">
                {Object.keys(durationOptions).map((key) => {
                  const opt = durationOptions[key];
                  const isActive = selectedDuration === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDuration(key)}
                      className={`px-6 py-2 rounded-md font-medium transition-all ${isActive
                        ? 'bg-white text-brand-purple shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {opt.durationLabel}
                    </button>
                  );
                })}
              </div>

              <div>
                <Link to="/contact">
                  <Button variant="primary" className="px-8 py-3 text-lg">Apply Now</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-12">
              <motion.div
                key={selectedDuration}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">What You Will Learn</h2>
                  <div className="grid gap-3">
                    {selectedOption.whatTheyCanLearn.map((item, idx) => (
                      <div key={idx} className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <svg className="w-5 h-5 text-brand-purple mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-gray-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Project Capacity & Examples</h2>
                  <Card className="p-6 border-l-4 border-l-brand-purple mb-6 bg-yellow-50/50">
                    <h3 className="font-bold text-lg mb-2">What you can build:</h3>
                    <div className="markdown-prose text-gray-700" dangerouslySetInnerHTML={{ __html: selectedOption.projectCapacity.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </Card>

                  <h3 className="font-semibold text-lg mb-4">Example Projects:</h3>
                  <div className="grid gap-4">
                    {selectedOption.exampleProjects.map((project, idx) => (
                      <div key={idx} className="flex items-start bg-gray-50 p-4 rounded-lg">
                        <div className="bg-white p-2 rounded-full shadow-sm mr-4 text-brand-purple">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{project}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-8">
              <Card className="p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Program Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-bold">{selectedOption.durationLabel}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Price</span>
                    <span className="font-bold text-green-600">₹{selectedOption.price}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Certificate</span>
                    <span className="font-bold text-brand-purple">Yes</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-gray-500 mb-4">
                      *Limited seats available for the {selectedOption.durationLabel} batch.
                    </p>
                    <Link to="/contact">
                      <Button variant="primary" className="w-full">Secure Your Spot</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const faqs = [
    {
      question: 'Who can apply for the internship?',
      answer: 'Any student or recent graduate interested in hands-on learning can apply. No prior experience required for most programs.'
    },
    {
      question: 'Is the internship online or offline?',
      answer: 'We offer both online and offline options. Online interns get recorded sessions and live support. Offline interns work at our Erode office.'
    },
    {
      question: 'Will I get a certificate?',
      answer: 'Yes! All interns receive a verified certificate upon successful completion of the program and projects.'
    },
    {
      question: 'What is the duration?',
      answer: 'We offer two intensive options: 2 Weeks (₹2,000) and 1 Month (₹4,000). Both are designed to give you practical, industry-level experience.'
    },
  ];

  const timeline = [
    { step: 1, title: 'Apply', description: 'Submit your application and payment' },
    { step: 2, title: 'Onboarding', description: 'Receive course materials and schedule' },
    { step: 3, title: 'Learn', description: '2 weeks of hands-on training' },
    { step: 4, title: 'Build', description: 'Complete real-world projects' },
    { step: 5, title: 'Certificate', description: 'Get your verified certificate' },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Internship Programs"
        description="Join 6ixminds Labs internship programs: 2 Weeks to 1 Month intensive training."
        url="/internships"
      />
      <section className="relative py-20 px-4 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="animated-gradient-text">Internship Programs</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Intensive programs (2 Weeks / 1 Month) with real projects, practical skills, and industry certification
            </p>
            <div className="flex gap-4 justify-center items-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-purple">₹2,000</div>
                <div className="text-sm text-gray-500">2 Weeks</div>
              </div>
              <div className="text-gray-300">|</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-purple">₹4,000</div>
                <div className="text-sm text-gray-500">1 Month</div>
              </div>
              <div className="text-gray-300">|</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-purple">100%</div>
                <div className="text-sm text-gray-500">Practical</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your <span className="gradient-text">Domain</span>
            </h2>
            <p className="text-gray-600">Select the technology track that interests you most</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {internships.map((internship, index) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="p-8 h-full gradient-border">
                  <div className="relative mb-6">
                    <div className="absolute -top-4 -right-4 bg-gradient-to-r from-brand-purple to-brand-pink text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse-glow">
                      From ₹{internship.price}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{internship.title}</h3>
                  <p className="text-brand-purple font-semibold mb-4">{internship.domain}</p>
                  <p className="text-gray-600 mb-6">{internship.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Skills You'll Learn:</h4>
                    <div className="flex flex-wrap gap-2">
                      {internship.skills.map(skill => (
                        <span key={skill} className="text-xs bg-purple-50 text-brand-purple px-3 py-1 rounded-full font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Projects:</h4>
                    <ul className="space-y-2">
                      {/* Ensure projects object handling is safe */}
                      {Array.isArray(internship.projects) && internship.projects.map((project, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to={`/internships/${internship.slug}`}>
                    <Button variant="primary" className="w-full">View Details & Apply</Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Learning <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-gray-600">From application to certification in 5 simple steps</p>
          </motion.div>

          <div className="relative">
            {/* Background Track */}
            <div className="hidden md:block absolute top-[2.5rem] left-0 right-0 h-1 bg-gray-100 z-0"></div>

            {/* Filling Line */}
            <div className="hidden md:block absolute top-[2.5rem] left-0 right-0 h-1 z-0 overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                whileInView={{ x: '0%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-full h-full bg-gradient-to-r from-brand-purple to-brand-pink"
              >
                {/* Infinite Shimmer/Beam Effect */}
                <motion.div
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 0.5 }}
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                  className="text-center group"
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 rounded-full bg-white border-4 border-gray-100 group-hover:border-purple-200 flex items-center justify-center font-bold text-2xl mb-4 shadow-lg relative z-10 transition-colors duration-300"
                    >
                      {/* Active Fill Background */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.5, duration: 0.4 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink opacity-10"
                      ></motion.div>

                      <span className="text-gray-900 relative z-20 group-hover:scale-110 transition-transform">
                        {item.step}
                      </span>

                      {/* Ripple Effect on Hover */}
                      <div className="absolute inset-0 rounded-full border-2 border-brand-purple opacity-0 group-hover:animate-ping"></div>
                    </motion.div>

                    <h3 className="font-bold text-lg mb-2 group-hover:text-brand-purple transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed px-2">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  interactive={false}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                    <motion.svg
                      animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-6 h-6 text-brand-purple"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedFAQ === index ? 'auto' : 0,
                      opacity: expandedFAQ === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-600 mt-4">{faq.answer}</p>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-pink text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Level Up Your Skills?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join our next batch and start building real projects today
            </p>
            <Link to="/contact">
              <Button className="bg-white text-brand-purple hover:bg-gray-100">
                Apply Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
