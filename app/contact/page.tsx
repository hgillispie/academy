'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';

const FAQAccordion = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index) ? prev.filter(item => item !== index) : [...prev, index],
    );
  };

  const faqData = [
    {
      question: 'How do I get started with Builder Academy?',
      answer:
        'Simply create an account and browse our available courses. Each course is designed to be beginner-friendly with step-by-step instructions and hands-on exercises.',
    },
    {
      question: 'What topics are covered in the courses?',
      answer:
        'Our courses cover web development, visual development with Builder.io, React, Next.js, and modern frontend technologies. We regularly add new content based on industry trends.',
    },
    {
      question: 'Are the courses free?',
      answer:
        'Yes, Builder Academy courses are completely free! Our goal is to help developers learn and grow in the Builder.io ecosystem.',
    },
    {
      question: 'How long does it take to complete a course?',
      answer:
        'Course duration varies depending on the topic and your pace. Most courses take between 2-8 hours to complete, and you can learn at your own speed.',
    },
    {
      question: 'Do I get a certificate when I complete a course?',
      answer:
        "Yes, you'll receive a certificate of completion for each course you finish. These certificates can be shared on your professional profiles.",
    },
    {
      question: 'Can I access course materials offline?',
      answer:
        'Currently, courses are web-based and require an internet connection. However, you can bookmark important resources for quick reference.',
    },
    {
      question: 'How can I get help if I&apos;m stuck on a lesson?',
      answer:
        'You can reach out through our contact form, join our Discord community for peer support, or check our help documentation for common solutions.',
    },
  ];

  return (
    <div className="space-y-4">
      {faqData.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">{item.question}</h3>
            <span
              className={`transform transition-transform ${openItems.includes(index) ? 'rotate-180' : ''}`}
            >
              ▼
            </span>
          </button>
          {openItems.includes(index) && (
            <div className="px-6 pb-4">
              <p className="text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600">
          We're here to help! Get in touch with our team for any questions or support.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#cf0ec7] focus:border-transparent"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#cf0ec7] focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#cf0ec7] focus:border-transparent"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#cf0ec7] focus:border-transparent"
                placeholder="Tell us more about your question or request..."
              />
            </div>

            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in touch</h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-[#cf0ec7] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📧</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">support@builder.io</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-[#cf0ec7] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">💬</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Discord Community</h3>
                  <p className="text-gray-600">Join our community for real-time help</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-[#cf0ec7] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📚</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Documentation</h3>
                  <p className="text-gray-600">Check our docs for quick answers</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg p-6 text-white"
            style={{ backgroundColor: 'rgba(118, 45, 156, 1)' }}
          >
            <h3 className="text-xl font-semibold mb-2">Need immediate help?</h3>
            <p className="mb-4">
              For urgent issues or technical support, visit our Help page for comprehensive guides
              and FAQs.
            </p>
            <Button variant="secondary" className="bg-white text-[#cf0ec7] hover:bg-gray-100">
              Visit Help Center
            </Button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">
            Find quick answers to common questions about Builder Academy
          </p>
        </div>
        <FAQAccordion />
      </div>
    </div>
  );
}
