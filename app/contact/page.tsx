'use client';

import { Button } from '@/components/common/Button';

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
    </div>
  );
}
