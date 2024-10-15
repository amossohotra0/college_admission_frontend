'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Award, Bell, GraduationCap, Star, Globe, Briefcase, ShieldCheck, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import LandingHeader from '@/components/layout/LandingHeader';
import Image from 'next/image';
// Import principal image
import principalImage from '../../../public/images/staff/principal-removebg-preview.png';
import hecImage from '../../../public/images/partners/hec.png';
import biseImage from '../../../public/images/partners/bise.webp';
import puImage from '../../../public/images/partners/pu.jpg';
import logo from '../../../public/images/logo/logo.png';

export default function LandingPage() {
  const [currentPartner, setCurrentPartner] = useState(0);
  const partners = [
    { name: 'Higher Education Commission', image: hecImage },
    { name: 'Board of Intermediate & Secondary Education', image: biseImage },
    { name: 'Punjab University', image: puImage },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPartner((prev) => (prev + 1) % partners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [partners.length]);
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      
      {/* News Ticker */}
      <div className="bg-green-800 text-white py-2 overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-ticker">
          <div className="flex items-center space-x-4 mx-4">
            <Bell size={16} className="flex-shrink-0" />
            <span className="font-medium">Admissions Open for Fall 2023</span>
          </div>
          <div className="flex items-center space-x-4 mx-4">
            <Calendar size={16} className="flex-shrink-0" />
            <span className="font-medium">Upcoming Science Exhibition on May 15, 2023</span>
          </div>
          <div className="flex items-center space-x-4 mx-4">
            <Award size={16} className="flex-shrink-0" />
            <span className="font-medium">Congratulations to our students for winning the National Science Competition</span>
          </div>
          <div className="flex items-center space-x-4 mx-4">
            <Bell size={16} className="flex-shrink-0" />
            <span className="font-medium">Admissions Open for Fall 2023</span>
          </div>
          <div className="flex items-center space-x-4 mx-4">
            <Calendar size={16} className="flex-shrink-0" />
            <span className="font-medium">Upcoming Science Exhibition on May 15, 2023</span>
          </div>
          <div className="flex items-center space-x-4 mx-4">
            <Award size={16} className="flex-shrink-0" />
            <span className="font-medium">Congratulations to our students for winning the National Science Competition</span>
          </div>
        </div>
      </div>

      {/* Hero Section - Modern Split Design */}
      <section id="top" className="relative overflow-hidden bg-gradient-to-r from-green-900 to-green-800">
        <div className="absolute inset-0 bg-[url('/images/campus-pattern.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-20 md:py-28 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Government Graduate College of Science
              </h1>
              <p className="text-green-100 text-lg md:text-xl max-w-lg">
                A premier institution in Lahore offering quality education in science disciplines since 1912. Join us for academic excellence and innovation.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/auth/login" className="px-6 py-3 rounded-md text-white bg-green-600 hover:bg-green-700 font-medium shadow-lg transition-all hover:shadow-xl">
                  Login
                </Link>
                <Link href="/auth/register" className="px-6 py-3 rounded-md text-green-800 bg-white hover:bg-green-50 font-medium shadow-lg transition-all hover:shadow-xl">
                  Register
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative h-96">
              <div className="absolute top-0 right-0 w-full h-full bg-white/10 rounded-lg overflow-hidden shadow-2xl transform rotate-3">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20"></div>
              </div>
              <div className="absolute top-6 right-6 w-full h-full bg-white/10 rounded-lg overflow-hidden shadow-2xl transform -rotate-3">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative mx-auto animate-flip">
                    <Image 
                      src={logo}
                      alt="College Logo" 
                      width={220}
                      height={220}
                      className="object-contain" 
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}></div>
      </section>

      {/* Programs Highlight Section */}
      <section id="programs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-green-700 font-semibold tracking-wider uppercase">Our Programs</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">Academic Excellence</p>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our comprehensive range of undergraduate and graduate programs designed to prepare you for success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'BS Physics', icon: Star, count: 'Bachelor of Science', color: 'bg-green-600' },
              { title: 'BS Chemistry', icon: Briefcase, count: 'Bachelor of Science', color: 'bg-green-700' },
              { title: 'BS Mathematics', icon: GraduationCap, count: 'Bachelor of Science', color: 'bg-green-800' },
            ].map((program, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-green-200">
                <div className={`${program.color} h-2`}></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`${program.color} rounded-full p-2 mr-4`}>
                      <program.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{program.title}</h3>
                  </div>
                  <p className="text-gray-500 mb-4">{program.count}</p>
                  <Link href="/programs" className="text-green-700 hover:text-green-900 font-medium flex items-center">
                    View Details <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/programs" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800">
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-green-700 font-semibold tracking-wider uppercase">Why Choose Us</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">Our Strengths</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, title: 'Science Excellence', text: 'Specialized programs in Physics, Chemistry, Mathematics, and more.' },
              { icon: Users, title: 'Experienced Faculty', text: 'Learn from PhDs and experienced educators in scientific fields.' },
              { icon: Award, title: 'Research Opportunities', text: 'Access to laboratories and research projects with faculty guidance.' },
              { icon: Globe, title: 'Distinguished Alumni', text: 'Notable graduates serving in education, research, and government sectors.' },
            ].map(({ icon: Icon, title, text }, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-lg hover:border-green-100">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-700 mb-4 mx-auto">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{title}</h3>
                <p className="text-gray-600 text-center">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-green-700 font-semibold tracking-wider uppercase">About Us</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">Our Mission</p>
          </div>
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <div className="md:w-1/3 flex justify-center mb-8 md:mb-0">
              <div className="w-56 h-64 overflow-hidden relative transition-all duration-500 hover:shadow-2xl hover:shadow-green-100 hover:scale-105">
                {/* Using imported image variable with animation */}
                <Image 
                  src={principalImage} 
                  alt="College Principal" 
                  width={224}
                  height={256}
                  className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
                  priority
                />
              </div>
            </div>
            <div className="md:w-2/3 text-center md:text-left">
              <p className="text-gray-600 text-lg leading-relaxed">
                "Government Graduate College of Science, Lahore is one of the oldest and most prestigious institutions in Pakistan. Established in 1912, we have a rich heritage of academic excellence in scientific education. Our mission is to provide quality education in science disciplines, promote research culture, and prepare students to meet the challenges of the modern world through innovative teaching methods and practical learning."
              </p>
              <p className="mt-4 text-gray-600 italic">
                — Zahid Rafiq Bhatti, Principal, Government Graduate College of Science
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-green-700 font-semibold tracking-wider uppercase">Testimonials</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">What Our Students Say</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The Physics department's laboratory facilities and dedicated professors helped me build a strong foundation for my research career.",
                name: "Ahmed K.",
                program: "BS Physics, 2020"
              },
              {
                quote: "My time at GGC Science prepared me exceptionally well for my PhD studies abroad. The faculty's mentorship was invaluable.",
                name: "Fatima R.",
                program: "BS Chemistry, 2019"
              },
              {
                quote: "The rigorous mathematics program and supportive environment helped me develop critical thinking skills that serve me daily in my career.",
                name: "Hassan M.",
                program: "BS Mathematics, 2021"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-green-200 transition-all">
                <div className="flex-1">
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                  <div className="mt-4">
                    <p className="font-semibold text-green-700">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.program}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section id="announcements" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-green-700 font-semibold tracking-wider uppercase">Announcements</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">Latest Updates</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Fall 2023 Admissions Now Open",
                date: "June 15, 2023",
                description: "Applications for BS programs in Physics, Chemistry, Mathematics, Botany, and Zoology are now being accepted for the Fall 2023 semester.",
                link: "/auth/register",
                linkText: "Apply Now"
              },
              {
                title: "Science Exhibition 2023",
                date: "May 28, 2023",
                description: "Join us for our annual Science Exhibition showcasing student research projects and innovations across all departments.",
                link: "/programs",
                linkText: "Learn More"
              }
            ].map((announcement, i) => (
              <div key={i} className="bg-green-50 p-6 rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-lg hover:border-green-200">
                <div className="flex items-center mb-4">
                  <Bell className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">{announcement.title}</h3>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{announcement.date}</span>
                </div>
                <p className="text-gray-600 mb-4">{announcement.description}</p>
                <Link href={announcement.link} className="text-green-700 hover:text-green-900 font-medium flex items-center">
                  {announcement.linkText} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Ready to start your journey?
            </h2>
            <p className="mt-2 text-xl text-green-100">
              Apply for admission today and take the first step toward your future.
            </p>
          </div>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-800 bg-white hover:bg-green-50 shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-green-700"
            >
              View Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-green-700 font-semibold tracking-wider uppercase">Contact Us</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">Get In Touch</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:border-green-200 transition-all">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-700 mb-4 mx-auto">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">Lahore, Punjab, Pakistan</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:border-green-200 transition-all">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-700 mb-4 mx-auto">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+1 (123) 456-7890</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:border-green-200 transition-all">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-700 mb-4 mx-auto">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">info@ggcs.edu.pk</p>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliated Institutions Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-green-700 font-semibold tracking-wider uppercase">Our Affiliations</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">Affiliated Institutions</p>
          </div>
          
          <div className="relative overflow-hidden py-10">
            {/* Partners Slider */}
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-3xl mx-auto h-40 overflow-hidden">
                <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" 
                     style={{ transform: `translateX(-${currentPartner * 100}%)` }}>
                  {partners.map((partner, index) => (
                    <div key={index} className="flex-shrink-0 w-full flex justify-center items-center px-4">
                      <div className="flex flex-col items-center">
                        <div className="h-24 flex items-center justify-center">
                          <Image 
                            src={partner.image} 
                            alt={partner.name}
                            height={96}
                            width={96}
                            className="max-h-24 object-contain"
                          />
                        </div>
                        <p className="mt-4 text-gray-700 font-medium text-center text-lg">{partner.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Slider Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {partners.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${index === currentPartner ? 'bg-green-700' : 'bg-gray-300'}`}
                  onClick={() => setCurrentPartner(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <div className="text-center mt-8 text-gray-600">
            <p>Affiliated with the Punjab Higher Education Department and recognized by the Higher Education Commission of Pakistan</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-green-200 hover:text-white">Our History</a></li>
                <li><a href="#about" className="text-green-200 hover:text-white">Administration</a></li>
                <li><a href="#about" className="text-green-200 hover:text-white">Faculty</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Academics</h3>
              <ul className="space-y-2">
                <li><a href="#programs" className="text-green-200 hover:text-white">BS Physics</a></li>
                <li><a href="#programs" className="text-green-200 hover:text-white">BS Chemistry</a></li>
                <li><a href="#programs" className="text-green-200 hover:text-white">BS Mathematics</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Student Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-green-200 hover:text-white">Library</a></li>
                <li><a href="#" className="text-green-200 hover:text-white">Laboratories</a></li>
                <li><a href="#" className="text-green-200 hover:text-white">Student Societies</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#contact" className="text-green-200 hover:text-white">Contact Us</a></li>
                <li><a href="#announcements" className="text-green-200 hover:text-white">Announcements</a></li>
                <li><a href="#" className="text-green-200 hover:text-white">Location Map</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-green-800">
            <p className="text-green-300 text-center">
              &copy; {new Date().getFullYear()} Government Graduate College of Science, Lahore. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}