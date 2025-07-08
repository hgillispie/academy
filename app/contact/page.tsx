'use client';

import { Button } from '../components/common/Button';
import { useState } from 'react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFAQs, setOpenFAQs] = useState<Record<number, boolean>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQs(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqData = [
    {
      question: 'How do I get started with Builder Academy?',
      answer:
        "Getting started is easy! Simply create an account using your email address or Google sign-in. Once registered, you'll have access to all available courses and can start learning immediately.",
    },
    {
      question: 'Are the courses free?',
      answer:
        'Yes, all Builder Academy courses are completely free! We believe in making high-quality web development education accessible to everyone. No hidden fees or subscription costs.',
    },
    {
      question: 'Do I get a certificate upon completion?',
      answer:
        "Yes! Upon successfully completing a course and passing all quizzes, you'll receive a digital certificate that you can share on your LinkedIn profile, resume, or portfolio.",
    },
    {
      question: 'How long does it take to complete a course?',
      answer:
        'Course duration varies depending on the topic and your learning pace. Most courses can be completed in 2-6 hours, but you can learn at your own speed and take breaks whenever needed.',
    },
    {
      question: 'Can I access courses offline?',
      answer:
        'Currently, courses require an internet connection to access. However, you can bookmark important resources and take notes that you can access offline.',
    },
    {
      question: 'What if I need help with course content?',
      answer:
        "If you're stuck on course material, you can use this contact form to reach out to our support team. We typically respond within 24 hours with helpful guidance.",
    },
    {
      question: 'Can I suggest new course topics?',
      answer:
        "Absolutely! We love hearing from our community about what topics they'd like to learn. Use the contact form above to suggest new course ideas, and we'll consider them for future releases.",
    },
    {
      question: 'Is there a mobile app?',
      answer:
        "While we don't have a dedicated mobile app yet, our platform is fully responsive and works great on mobile browsers. You can access all courses and features from your phone or tablet.",
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-8">
              Your message has been sent successfully. We'll get back to you as soon as possible.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', subject: '', message: '' });
              }}
              variant="primary"
            >
              Send Another Message
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about Builder Academy? We're here to help! Send us a message and we'll
            get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-6 h-6 text-[#cf0ec7] mt-1 mr-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">support@builder.io</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 text-[#cf0ec7] mt-1 mr-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Office</h3>
                  <p className="text-gray-600">San Francisco, CA</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 text-[#cf0ec7] mt-1 mr-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Response Time</h3>
                  <p className="text-gray-600">Within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">How do I reset my password?</h4>
                  <p className="text-gray-600 text-sm">
                    Visit the sign-in page and click "Forgot Password" to reset your password.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">How do I access my courses?</h4>
                  <p className="text-gray-600 text-sm">
                    Once logged in, navigate to the Courses page to view all available courses.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Can I download course materials?</h4>
                  <p className="text-gray-600 text-sm">
                    Course materials and resources are available within each course module.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#cf0ec7] focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#cf0ec7] focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#cf0ec7] focus:border-transparent"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#cf0ec7] focus:border-transparent resize-vertical"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <Button type="submit" disabled={isSubmitting} variant="primary" className="w-full">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
