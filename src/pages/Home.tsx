import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, ShieldCheck, FileText, Quote, Twitter, Linkedin, Github, ChevronLeft, ChevronRight, Upload, Search, Sparkles, Download, BarChart2, PieChart, LineChart, TrendingUp, Share2, LogIn, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';

function Home() {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [isHoveringLogin, setIsHoveringLogin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const testimonials = [
    {
      role: 'Recent Computer Science Graduate',
      company: 'Class of 2023',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
      quote: 'As a fresh graduate, I was struggling to make my resume stand out. TailorMyCV helped me highlight my internship experiences and projects perfectly. Landed my first tech job within a month!',
    },
    {
      role: 'Senior Project Manager',
      company: '15+ Years Experience',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
      quote: 'After 15 years in tech, I needed a resume that reflected my leadership journey. The AI suggestions helped me quantify my achievements and highlight strategic initiatives.',
    },
    {
      role: 'Business Student',
      company: 'Final Year Student',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      quote: 'Used TailorMyCV for my summer internship applications. The ATS optimization really works - got interviews at 3 top consulting firms!',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'analytics', 'testimonials'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero Section with proper spacing */}
      <div className="relative bg-black pt-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #BCE784 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-5xl lg:text-6xl font-semibold mb-6 leading-tight">
                Perfect CVs for Any Job with{' '}
                <span className="bg-gradient-to-b from-[#e8f4d9] via-[#d4eab0] to-[#BCE784] text-transparent bg-clip-text">
                  AI-Powered Resume Builder
                </span>
              </h1>
              <p className="text-xl mb-8 text-[#BCE784]">
                Craft ATS-optimized resumes powered by AI in minutes
              </p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-[#BCE784] hover:bg-[#BCE784]/90 text-black font-bold py-4 px-8 rounded-lg transition-colors transform hover:scale-105"
              >
                Build Your Resume
              </button>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="bg-[#BCE784]/10 backdrop-blur-lg rounded-lg p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4"
                  alt="Professional Resume"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="bg-white text-black py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-semibold text-center mb-14">Powerful Features for Your Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center p-8 rounded-lg hover:bg-black/5 transition-colors">
              <Brain className="w-12 h-12 mx-auto mb-6 text-[#BCE784]" />
              <h3 className="text-xl font-semibold mb-4">AI-Tailored Resumes</h3>
              <p className="text-gray-600">Smart suggestions tailored to your industry and role</p>
            </div>
            <div className="text-center p-8 rounded-lg hover:bg-black/5 transition-colors">
              <ShieldCheck className="w-12 h-12 mx-auto mb-6 text-[#BCE784]" />
              <h3 className="text-xl font-semibold mb-4">ATS Readiness</h3>
              <p className="text-gray-600">Guaranteed to pass applicant tracking systems</p>
            </div>
            <div className="text-center p-8 rounded-lg hover:bg-black/5 transition-colors">
              <FileText className="w-12 h-12 mx-auto mb-6 text-[#BCE784]" />
              <h3 className="text-xl font-semibold mb-4">Cover Letter Generation</h3>
              <p className="text-gray-600">AI-powered cover letters tailored to specific job postings</p>
            </div>
            <div className="text-center p-8 rounded-lg hover:bg-black/5 transition-colors">
              <Share2 className="w-12 h-12 mx-auto mb-6 text-[#BCE784]" />
              <h3 className="text-xl font-semibold mb-4">LinkedIn Post Generator</h3>
              <p className="text-gray-600">Create engaging job search updates for your network</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div id="analytics" className="bg-black text-white py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #BCE784 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-semibold mb-4 gradient-text">Detailed Resume Analytics</h2>
            <p className="text-xl text-gray-400">Gain deep insights into your resume's performance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BarChart2 className="w-8 h-8" />,
                title: "Skill Analysis",
                description: "Compare your skills against job requirements with detailed match scoring",
                color: "from-[#BCE784] to-[#9fb76a]"
              },
              {
                icon: <PieChart className="w-8 h-8" />,
                title: "Experience Impact",
                description: "Measure the impact of your experience with quantitative metrics",
                color: "from-[#BCE784] to-[#9fb76a]"
              },
              {
                icon: <LineChart className="w-8 h-8" />,
                title: "Industry Trends",
                description: "Track industry-specific keyword trends and requirements",
                color: "from-[#BCE784] to-[#9fb76a]"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Success Prediction",
                description: "AI-powered success rate prediction for job applications",
                color: "from-[#BCE784] to-[#9fb76a]"
              }
            ].map((feature, index) => (
              <div key={index} className="relative group">
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 left-[calc(100%-2rem)] w-[calc(100%+4rem)] h-px bg-gradient-to-r from-[#BCE784]/50 to-[#BCE784]/50 -translate-y-1/2 -z-10" />
                )}
                
                <div className="relative z-20 bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group-hover:transform group-hover:scale-105">
                  <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#BCE784] to-[#9fb76a] flex items-center justify-center text-black font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="mb-4 bg-gradient-to-br from-[#BCE784] to-[#9fb76a] w-16 h-16 rounded-xl flex items-center justify-center text-black">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white/5 rounded-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-[#BCE784]">Real-time Analytics Dashboard</h3>
                <p className="text-gray-400">Track your resume's performance with our comprehensive analytics dashboard. Get insights into:</p>
                <ul className="space-y-4">
                  {[
                    "Keyword optimization scores",
                    "Industry-specific requirements match",
                    "Experience impact analysis",
                    "Skills gap identification",
                    "Application success predictions"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-[#BCE784]"></div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="mt-8 bg-[#BCE784] hover:bg-[#BCE784]/90 text-black font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <span>View Demo Dashboard</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
                  alt="Analytics Dashboard"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="bg-black text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #BCE784 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-semibold mb-4 gradient-text">How It Works</h2>
            <p className="text-xl text-gray-400">Four simple steps to create your perfect resume</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Upload className="w-8 h-8" />,
                title: "Upload Resume",
                description: "Upload your existing resume or start from scratch with our templates",
                color: "from-[#BCE784] to-[#9fb76a]"
              },
              {
                icon: <Search className="w-8 h-8" />,
                title: "Add Job Details",
                description: "Paste the job listing URL or enter key requirements manually",
                color: "from-[#BCE784] to-[#9fb76a]"
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "AI Analysis",
                description: "Our AI analyzes and optimizes your resume for ATS compatibility",
                color: "from-[#BCE784] to-[#9fb76a]"
              },
              {
                icon: <Download className="w-8 h-8" />,
                title: "Download & Apply",
                description: "Get your perfectly tailored resume ready for submission",
                color: "from-[#BCE784] to-[#9fb76a]"
              }
            ].map((step, index) => (
              <div key={index} className="relative group">
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 left-[calc(100%-2rem)] w-[calc(100%+4rem)] h-px bg-gradient-to-r from-[#BCE784]/50 to-[#BCE784]/50 -translate-y-1/2 -z-10" />
                )}
                
                <div className="relative z-20 bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group-hover:transform group-hover:scale-105">
                  <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#BCE784] to-[#9fb76a] flex items-center justify-center text-black font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="mb-4 bg-gradient-to-br from-[#BCE784] to-[#9fb76a] w-16 h-16 rounded-xl flex items-center justify-center text-black">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#BCE784] hover:bg-[#BCE784]/90 text-black font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div id="testimonials" className="bg-[#BCE784] py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-semibold mb-4 text-black">
              What Our Users Say
            </h2>
            <p className="text-xl text-black/70">
              Join thousands of professionals who trust TailorMyCV
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="flex justify-center space-x-2 mb-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-black w-8' 
                      : 'bg-black/30 hover:bg-black/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <div className="bg-black rounded-2xl p-8 md:p-12 shadow-2xl transform transition-all duration-500">
              <Quote className="w-12 h-12 text-[#BCE784] mb-8 opacity-50" />
              
              <p className="text-2xl md:text-3xl text-white mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].role}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-[#BCE784]/20"
                    />
                    <div className="absolute inset-0 rounded-full shadow-inner"></div>
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-white text-lg">
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div className="text-[#BCE784]">
                      {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={prevTestimonial}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors group"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-6 h-6 text-white group-hover:text-[#BCE784]" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors group"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-6 h-6 text-white group-hover:text-[#BCE784]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;