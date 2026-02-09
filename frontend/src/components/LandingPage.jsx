// src/components/LandingPage.jsx
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import view1 from '../assets/view-1.png';
import view2 from '../assets/view-2.png';
import view3 from '../assets/view-3.png';
import view4 from '../assets/view-4.png';

const LandingPage = () => {
  const { loginWithRedirect } = useAuth0();
  const [openFaq, setOpenFaq] = useState(null);

  const handleGetStarted = () => {
    loginWithRedirect();
  };

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "AI-Powered Resume Parsing",
      description: "Upload your resume and our AI automatically extracts and organizes all your professional information into structured sections."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Advanced Analytics Dashboard",
      description: "Track resume views, engagement metrics, and understand how recruiters interact with your profile in real-time."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      ),
      title: "Shareable Profile Links",
      description: "Create a unique, professional URL for your resume that you can share anywhere - LinkedIn, email, or job applications."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: "Job Description Matcher",
      description: "Compare your resume against job descriptions to see skill matches and get AI-powered suggestions for improvement."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      title: "Easy Profile Management",
      description: "Edit your information anytime with an intuitive interface. Changes are reflected instantly across all shared links."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Role-Based Optimization",
      description: "Select target roles and optimize your profile to match specific career paths and industry requirements."
    }
  ];

  const faqs = [
    {
      question: "How does RESLY.AI work?",
      answer: "Simply upload your resume (PDF or DOCX), and our AI automatically extracts and organizes your information. You can then review, edit, and generate a shareable link to your professional profile."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. Your data is encrypted and stored securely. We never sell or share your personal information with third parties. Your resume is only accessible via your unique shareable link."
    },
    {
      question: "Can I update my resume after creating it?",
      answer: "Yes! You can edit your profile anytime from the dashboard. Any changes you make are immediately reflected in your shareable link."
    },
    {
      question: "What file formats are supported?",
      answer: "We currently support PDF (.pdf) and Microsoft Word (.docx, .doc) formats. For best results, use a standard, well-formatted resume."
    },
    {
      question: "How does the JD Matcher work?",
      answer: "Upload or paste a job description, and our AI analyzes it against your resume to show skill matches, missing keywords, and provides personalized recommendations to improve your fit for the role."
    },
    {
      question: "Can I see who views my resume?",
      answer: "You can track total views, average time spent, engagement metrics, and traffic sources through our Analytics Dashboard. However, we don't collect personally identifiable information about individual viewers."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">RESLY.AI</span>
            </div>
            
            <button onClick={handleGetStarted} className="btn btn-primary">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Resume Into <span className="gradient-text">Opportunities</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              AI-powered resume platform that creates shareable professional profiles, tracks analytics, and matches you with the perfect roles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Get Started Free
              </button>
              {/* <button className="btn btn-secondary btn-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to showcase your professional profile</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

            {/* Heading */}
            <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">See It In Action</h2>
            <p className="text-gray-600 text-lg">
                A futuristic, interactive tour of your dashboard
            </p>
            </div>

            {/* Horizontal Scroll Carousel */}
            <div className="flex gap-10 overflow-x-auto snap-x snap-mandatory pb-6 hide-scrollbar">
            
            {[
                {
                title: "Professional Profile View",
                desc: "A clean and elegant display of your professional information.",
                img: view1,
                },
                {
                title: "Resume Management",
                desc: "Manage, export, and share your resume with ease.",
                img: view2,
                },
                {
                title: "Analytics Dashboard",
                desc: "Track engagement metrics and understand viewer behavior.",
                img: view3,
                },
                {
                title: "JD Matcher",
                desc: "Advanced AI to match job descriptions with your profile.",
                img: view4,
                },
            ].map((item, index) => (
                <div
                key={index}
                className="snap-start min-w-[80%] md:min-w-[55%] bg-white rounded-3xl p-10 relative shadow-lg 
                            hover:shadow-2xl transition-all duration-300 border border-gray-200"
                >

                {/* Text Section */}
                <div className="mb-10">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {item.title}
                    </h3>
                    <p className="text-gray-600">{item.desc}</p>
                </div>

                {/* Floating Image */}
                <div className="relative h-72">
                    <img
                    src={item.img}
                    alt={item.title}
                    className="absolute right-0 top-0 w-auto h-full object-cover rounded-xl 
                                shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform"
                    />
                </div>

                </div>
            ))}
            </div>
        </div>
        </section>

      {/* <section className="w-full bg-gradient-to-br from-[#f0f7ff] to-[#e8f3ff] py-24 px-6 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-[#cfe8ff] rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#b3e8f7] rounded-full blur-3xl opacity-30"></div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-8">
            <div>
              <p className="text-gray-700 mb-4 font-semibold tracking-wide">Works on</p>
              <div className="flex flex-wrap gap-3">
                {["Workday", "Greenhouse", "Lever", "+19 more"].map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 bg-white/60 backdrop-blur-lg border border-white/40 shadow-md rounded-full text-gray-800 text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="backdrop-blur-xl bg-white/60 shadow-2xl rounded-2xl border border-white/50 p-6">
              <div className="flex items-center gap-2 pb-5">
                <span className="w-3 h-3 bg-red-300 rounded-full"></span>
                <span className="w-3 h-3 bg-yellow-300 rounded-full"></span>
                <span className="w-3 h-3 bg-green-300 rounded-full"></span>
              </div>
              <div className="h-7 bg-white/50 backdrop-blur-lg rounded mb-6"></div>
              <p className="text-xl font-semibold text-gray-900 mb-4">Airbnb — Software Engineer</p>
              <div className="space-y-3">
                <div className="h-3 bg-gray-300/50 rounded w-2/3"></div>
                <div className="h-3 bg-[#43c7e8] rounded w-1/2"></div>
                <div className="h-3 bg-[#43c7e8] rounded w-3/4"></div>
                <div className="h-3 bg-[#43c7e8] rounded w-2/5"></div>
                <div className="h-3 bg-[#43c7e8] rounded w-3/5"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <span className="p-3 rounded-xl bg-white/60 backdrop-blur-lg shadow border border-white/40 text-lg">
                ⚡
              </span>
              <p className="text-gray-800 font-semibold text-lg">Autofill Applications</p>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6 drop-shadow-sm">
              Autofill repetitive job<br />application questions
            </h1>
            <p className="text-gray-700 text-lg mb-10 leading-relaxed">
              Install the Resly Copilot extension to autofill job applications &
              identify missing keywords in your resume.
            </p>
            <div className="flex gap-5 mb-8">
              <button className="px-10 py-3 text-lg bg-gradient-to-r from-[#0ba5ec] to-[#0894d4] text-white rounded-2xl shadow-xl hover:opacity-90 transition border border-white/40">
                Add to Chrome
              </button>
              {/* <button className="px-10 py-3 text-lg bg-white/60 backdrop-blur-lg border border-[#0ba5ec] text-[#0ba5ec] rounded-2xl hover:bg-white/80 transition">
                Learn More
              </button>
            </div>
            {/* <div className="flex items-center gap-3 text-gray-700">
              <span className="text-yellow-400 text-xl">★★★★★</span>
              <p className="text-sm">200,000,000+ applications submitted</p>
            </div>
          </div>
        </div>
      </section>*/}


      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about RESLY.AI</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of professionals showcasing their skills with RESLY.AI</p>
          <button onClick={handleGetStarted} className="btn bg-white text-blue-600 hover:bg-gray-100 btn-lg">
            Create Your Profile Now
          </button>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">RESLY.AI</span>
              </div>
              <p className="text-sm text-gray-400">Transform your resume into opportunities with AI-powered professional profiles.</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#docs" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© 2026 RESLY.AI. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#twitter" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#linkedin" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default LandingPage;