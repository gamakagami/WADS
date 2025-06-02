import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaRegBuilding,
  FaBullseye,
  FaHandshake,
  FaHospital,
  FaUserMd,
  FaExternalLinkAlt,
  FaTicketAlt,
  FaUserCog,
  FaBell,
  FaPlusCircle,
  FaTachometerAlt,
  FaComments,
  FaRobot,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

function Homepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Modern Header with Floating Effect */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-b-2 border-[#155095]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/logo.png"
                alt="Semesta Medika Logo"
                className="h-12 w-12 rounded-xl bg-white shadow"
              />
              <div>
                <h1 className="text-[#155095] font-bold text-xl">
                  PT Semesta Medika Makmur
                </h1>
                <p className="text-gray-600 text-xs">
                  Medical Equipment Solutions
                </p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="https://www.semestamedika.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#155095] hover:text-blue-600 font-medium transition-colors px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100"
              >
                <FaExternalLinkAlt className="text-lg" />
                <span className="hidden sm:inline">Main Website</span>
              </a>
              <NavLink
                to="/login"
                className="px-6 py-2 rounded-full font-semibold shadow-md bg-white text-[#155095] border border-[#155095] hover:bg-[#155095] hover:text-white transition-all"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-gradient-to-r from-[#155095] to-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Sign Up
              </NavLink>
            </nav>
            <button
              className="md:hidden p-2 text-[#155095]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center gap-1">
                <div className="w-full h-0.5 bg-current"></div>
                <div className="w-full h-0.5 bg-current"></div>
                <div className="w-full h-0.5 bg-current"></div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Diagonal Design */}
      <section
        id="home"
        className="pt-24 min-h-screen relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#155095] via-blue-600 to-blue-700"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center min-h-[70vh]">
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                  24/7 Support • Fast Resolution • Expert Team
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Support
                  <span className="block text-blue-200">When You</span>
                  <span className="block">Need It</span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Your dedicated helpdesk and ticketing system for all medical
                  equipment support needs. <br />
                  <span className="font-bold text-white">
                    Get expert assistance, track issues, and resolve problems
                    quickly.
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/tickets"
                  className="bg-white text-[#155095] px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                >
                  Create Ticket
                </a>
                <a
                  href="/dashboard"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#155095] transition-all"
                >
                  View Dashboard
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 rounded-3xl transform rotate-6"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/20 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-bold text-white">24/7</div>
                    <div className="text-blue-200 text-sm">
                      Support Available
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-bold text-white">2hrs</div>
                    <div className="text-blue-200 text-sm">Avg Response</div>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-bold text-white">98%</div>
                    <div className="text-blue-200 text-sm">Resolution Rate</div>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-bold text-white">500+</div>
                    <div className="text-blue-200 text-sm">Issues Resolved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with Cards Layout */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#155095] mb-4">
              About Our Company
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#155095] to-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading the way in medical equipment solutions with expertise,
              reliability, and innovation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100 flex flex-col items-center">
                <FaRegBuilding className="text-4xl text-[#155095] mb-4" />
                <h3 className="text-2xl font-bold text-[#155095] mb-4">
                  Established 2019
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong>PT SEMESTA MEDIKA MAKMUR</strong> was founded with a
                  vision to transform Indonesia&apos;s healthcare equipment
                  landscape.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100 flex flex-col items-center">
                <FaHospital className="text-4xl text-[#155095] mb-4" />
                <h3 className="text-2xl font-bold text-[#155095] mb-4">
                  Market Focus
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Our main market</strong> covers Indonesia&apos;s
                  health products, supplying primarily to medium and high-end
                  hospitals.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100 flex flex-col items-center">
                <FaUserMd className="text-4xl text-[#155095] mb-4" />
                <h3 className="text-2xl font-bold text-[#155095] mb-4">
                  Industry Expertise
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong>As newcomers</strong> backed by 20+ years of hospital
                  industry experience through our sister companies.
                </p>
              </div>
            </div>
          </div>

          {/* Vision & Mission in Side-by-Side Layout */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#155095] to-blue-600 rounded-3xl opacity-10"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-blue-100 flex flex-col items-start">
                <div className="flex items-center gap-4 mb-6">
                  <FaBullseye className="text-3xl text-[#155095]" />
                  <h3 className="text-3xl font-bold text-[#155095]">
                    Our Vision
                  </h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To be a trustworthy professional supplier for health equipment
                  in Indonesia. To be a well-reliable working partner to supply
                  all hospital equipment to all hospitals.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-[#155095] rounded-3xl opacity-10"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-blue-100 flex flex-col items-start">
                <div className="flex items-center gap-4 mb-6">
                  <FaHandshake className="text-3xl text-[#155095]" />
                  <h3 className="text-3xl font-bold text-[#155095]">
                    Our Mission
                  </h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  We present good products, sales service and after-sales
                  service, and educate our health market to implement
                  cost-effective, high-quality and latest technology to our
                  customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#155095] mb-4">
              How We Support You
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#155095] to-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive support system designed for medical equipment
              professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100">
                <FaTicketAlt className="text-5xl text-[#155095] mb-6" />
                <h3 className="text-2xl font-bold text-[#155095] mb-4">
                  Smart Ticketing
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Create and track tickets</strong> with our intelligent
                  system that prioritizes based on urgency and equipment type.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100">
                <FaUserCog className="text-5xl text-[#155095] mb-6" />
                <h3 className="text-2xl font-bold text-[#155095] mb-4">
                  Expert Team
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Specialized technicians</strong> with 20+ years
                  experience in hospital equipment and medical device support.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100">
                <FaBell className="text-5xl text-[#155095] mb-6" />
                <h3 className="text-2xl font-bold text-[#155095] mb-4">
                  Real-time Updates
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Stay informed</strong> with instant notifications and
                  real-time status updates on all your support requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#155095] mb-4">
              Quick Actions
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#155095] to-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">
              Get started with our support system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <a href="/tickets" className="group block">
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100 text-center">
                <FaPlusCircle className="text-4xl text-red-500 mb-6 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-[#155095] mb-3">
                  Create Ticket
                </h3>
                <p className="text-gray-600 text-sm">
                  Report an issue or request support
                </p>
              </div>
            </a>

            <a href="/dashboard" className="group block">
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100 text-center">
                <FaTachometerAlt className="text-4xl text-green-600 mb-6 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-[#155095] mb-3">
                  Dashboard
                </h3>
                <p className="text-gray-600 text-sm">
                  View your tickets and status
                </p>
              </div>
            </a>

            <a href="/forum" className="group block">
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100 text-center">
                <FaComments className="text-4xl text-purple-600 mb-6 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-[#155095] mb-3">
                  Community
                </h3>
                <p className="text-gray-600 text-sm">
                  Join discussions and get help
                </p>
              </div>
            </a>

            <a href="/chatbot" className="group block">
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100 text-center">
                <FaRobot className="text-4xl text-blue-600 mb-6 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-[#155095] mb-3">
                  AI Assistant
                </h3>
                <p className="text-gray-600 text-sm">
                  Get instant help from our chatbot
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Support Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#155095] mb-4">
              Our Support Performance
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#155095] to-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">
              Committed to excellence in customer support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#155095] to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-white">2h</span>
              </div>
              <h3 className="text-xl font-bold text-[#155095] mb-2">
                Response Time
              </h3>
              <p className="text-gray-600">Average first response</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-white">98%</span>
              </div>
              <h3 className="text-xl font-bold text-[#155095] mb-2">
                Resolution Rate
              </h3>
              <p className="text-gray-600">Successfully resolved tickets</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-white">4.9</span>
              </div>
              <h3 className="text-xl font-bold text-[#155095] mb-2">
                Satisfaction
              </h3>
              <p className="text-gray-600">Average customer rating</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold text-white">24/7</span>
              </div>
              <h3 className="text-xl font-bold text-[#155095] mb-2">
                Availability
              </h3>
              <p className="text-gray-600">Round-the-clock support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section with Split Layout */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-[#155095] to-blue-700 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 transform skew-x-12"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Need Immediate Help?
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-xl text-blue-100">
              Multiple ways to reach our support team
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Support Channels
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <FaPhoneAlt className="text-2xl text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        Emergency Hotline
                      </div>
                      <div className="text-blue-100">021-29517888 (24/7)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <FaEnvelope className="text-2xl text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        Support Email
                      </div>
                      <div className="text-blue-100">
                        support@semestamedikamakmur.com
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <FaComments className="text-2xl text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Live Chat</div>
                      <div className="text-blue-100">Forum & AI Assistant</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">🎫</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        Ticket System
                      </div>
                      <div className="text-blue-100">
                        Track and manage all requests
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Office Location
                </h3>
                <div className="text-blue-100 space-y-2">
                  <p className="font-semibold text-white">
                    PT Semesta Medika Makmur
                  </p>
                  <p>Jl. Kamal Raya Outer Ring Road</p>
                  <p>Mutiara Taman Palem Blok A2 No 28</p>
                  <p>RT 006 RW 014, Kel. Cengkareng Timur</p>
                  <p>Kec. Cengkareng, Jakarta Barat 11730</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Business Hours
                </h3>
                <div className="text-blue-100 space-y-2">
                  <div className="flex justify-between">
                    <span>Support Tickets:</span>
                    <span className="text-white font-semibold">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone Support:</span>
                    <span className="text-white font-semibold">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Office Hours:</span>
                    <span className="text-white font-semibold">
                      Mon-Fri 8AM-6PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src="/src/assets/logo.png"
                  alt="SMM Support Portal Logo"
                  className="h-12 w-12 rounded-xl bg-white shadow"
                />
                <div>
                  <div className="font-bold text-lg">SMM Support Portal</div>
                  <div className="text-gray-400 text-sm">
                    Always here to help
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted helpdesk for all medical equipment support needs.
                Fast, reliable, and professional service.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Support</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center gap-2">
                  <FaTicketAlt className="text-blue-400" />
                  <a
                    href="/tickets"
                    className="hover:text-white transition-colors"
                  >
                    Create Ticket
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FaTachometerAlt className="text-green-400" />
                  <a
                    href="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    My Dashboard
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FaComments className="text-purple-400" />
                  <a
                    href="/forum"
                    className="hover:text-white transition-colors"
                  >
                    Community Forum
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FaRobot className="text-blue-300" />
                  <a
                    href="/chatbot"
                    className="hover:text-white transition-colors"
                  >
                    AI Assistant
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Account</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="/login"
                    className="hover:text-white transition-colors"
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a
                    href="/signup"
                    className="hover:text-white transition-colors"
                  >
                    Sign Up
                  </a>
                </li>
                <li>
                  <a
                    href="/settings"
                    className="hover:text-white transition-colors"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="/notifications"
                    className="hover:text-white transition-colors"
                  >
                    Notifications
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Emergency Contact</h4>
              <div className="space-y-4 text-gray-400">
                <div>
                  <div className="text-white font-semibold">24/7 Hotline</div>
                  <div>021-29517888</div>
                </div>
                <div>
                  <div className="text-white font-semibold">
                    Emergency Email
                  </div>
                  <div>emergency@semestamedikamakmur.com</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                © {new Date().getFullYear()} PT Semesta Medika Makmur Support
                Portal. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  SLA Agreement
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;
