'use client';

import Section from '../components/common/Section';
import { Button } from '../components/common/Button';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-medium text-gray-900" style={{ margin: '20px 0 16px' }}>
              Contact Us
            </h1>
            <p className="text-xl text-gray-600">
              Have questions? We're here to help. Get in touch with our team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf0ec7] focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf0ec7] focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf0ec7] focus:border-transparent"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf0ec7] focus:border-transparent"
                    placeholder="Tell us more about your question or feedback..."
                  />
                </div>

                <Button className="w-full">Send Message</Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in touch</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600">support@builder.io</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Community</h3>
                    <p className="text-gray-600 mb-2">
                      Join our Discord community for real-time help and discussions.
                    </p>
                    <a
                      href="https://discord.gg/builderio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#cf0ec7] hover:underline"
                    >
                      Join Discord →
                    </a>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Documentation</h3>
                    <p className="text-gray-600 mb-2">
                      Check out our comprehensive documentation for detailed guides and API
                      references.
                    </p>
                    <a
                      href="https://www.builder.io/c/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#cf0ec7] hover:underline"
                    >
                      View Docs →
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Office Hours</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Support Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Response Time</h3>
                    <p className="text-gray-600">We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
