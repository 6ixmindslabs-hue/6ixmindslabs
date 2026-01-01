import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
// import projects from '../data/projects.json'; // REMOVED

export default function Projects() {
  const { slug } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

  useEffect(() => {
    fetchProjects();
  }, []);

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (slug) {
    const project = projects.find(p => p.slug === slug);

    if (!project) {
      return (
        <div className="min-h-screen py-20 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Link to="/projects">
            <Button variant="primary">Back to Projects</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <SEO
          title={project.title}
          description={project.description}
          image={project.image}
          url={`/projects/${project.slug}`}
          type="article"
        />
        <section className="relative py-20 px-4 bg-gradient-to-br from-purple-50 to-white">
          <div className="max-w-4xl mx-auto">
            <Link to="/projects" className="inline-flex items-center text-gray-600 hover:text-brand-purple mb-8 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Projects
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-1 bg-brand-purple/10 text-brand-purple rounded-full text-sm font-semibold mb-4">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl mb-10">
                <img src={project.image} alt={project.title} className="w-full h-auto object-cover" />
              </div>

              <div className="grid md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-6">
                  <h3 className="text-2xl font-bold">About the Project</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold mb-4">Project Links</h3>
                    <div className="space-y-3">
                      {project.liveDemo && (
                        <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="block">
                          <Button variant="primary" className="w-full justify-center">
                            Live Demo
                          </Button>
                        </a>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <SEO
        title="Projects"
        description="Check out our featured projects in Web Development, AI, and IoT."
        url="/projects"
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
              Our <span className="animated-gradient-text">Projects</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-world solutions that make an impact
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                  ? 'bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Link to={`/projects/${project.slug}`} className="block h-full">
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 border border-gray-100 transition-all duration-300 flex flex-col h-full relative"
                  >
                    {/* Image Container */}
                    <div className="relative h-60 overflow-hidden">
                      <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/0 transition-colors z-10" />
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      {/* Floating Category Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1.5 text-xs font-bold text-white bg-black/60 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-7 flex flex-col flex-grow relative">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-purple transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2.5 py-1 text-[11px] font-semibold text-gray-600 bg-gray-50 rounded-lg border border-gray-100 group-hover:border-purple-100 transition-colors">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2.5 py-1 text-[11px] font-semibold text-gray-400 bg-gray-50 rounded-lg">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Footer / CTA */}
                      <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-brand-purple transition-colors">View Project</span>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-purple group-hover:text-white transition-all duration-300 shadow-sm">
                          <svg className="w-4 h-4 transform group-hover:-rotate-45 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg">No projects found in this category</p>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Have a Project in Mind?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Let's collaborate to build something extraordinary
            </p>
            <Link to="/contact">
              <Button variant="primary">Start a Project</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
