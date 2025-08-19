'use client';

import { Mail, MessageCircle, Phone, MapPin, Clock, Send, Book } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="max-w-[1200px] mt-[61px] mb-12 mx-auto px-4 py-0 max-md:mt-10">
        <h1 className="text-black text-[32px] font-normal mb-6">Contact Us</h1>
        <p className="text-gray-600 text-lg mb-12 max-w-2xl">
          We'd love to hear from you! Whether you have questions about Builder.io, need technical support, or want to share feedback, our team is here to help.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-medium mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#a97ff2] rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email Support</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Get help with technical issues or general questions
                  </p>
                  <a href="mailto:support@builder.io" className="text-[#a97ff2] hover:text-[#9665d8]">
                    support@builder.io
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#a97ff2] rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Community Forum</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Connect with other developers and get community support
                  </p>
                  <a href="https://forum.builder.io/" className="text-[#a97ff2] hover:text-[#9665d8]">
                    forum.builder.io
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#a97ff2] rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Sales Inquiries</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Interested in enterprise solutions or have questions about pricing?
                  </p>
                  <a href="mailto:sales@builder.io" className="text-[#a97ff2] hover:text-[#9665d8]">
                    sales@builder.io
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#a97ff2] rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Response Time</h3>
                  <p className="text-gray-600 text-sm">
                    We typically respond within 24 hours during business days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h2 className="text-xl font-medium mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a97ff2] focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a97ff2] focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a97ff2] focus:border-transparent"
                    placeholder="What can we help you with?"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a97ff2] focus:border-transparent"
                    placeholder="Please provide as much detail as possible..."
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <MapPin className="w-8 h-8 text-[#a97ff2] mx-auto mb-4" />
            <h3 className="font-medium mb-2">Documentation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Find answers in our comprehensive documentation
            </p>
            <a href="https://www.builder.io/c/docs/introduction" className="text-[#a97ff2] hover:text-[#9665d8] text-sm">
              Browse Docs →
            </a>
          </div>

          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <MessageCircle className="w-8 h-8 text-[#a97ff2] mx-auto mb-4" />
            <h3 className="font-medium mb-2">Community</h3>
            <p className="text-sm text-gray-600 mb-4">
              Join our active community of developers
            </p>
            <a href="https://forum.builder.io/" className="text-[#a97ff2] hover:text-[#9665d8] text-sm">
              Join Community →
            </a>
          </div>

          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <Book className="w-8 h-8 text-[#a97ff2] mx-auto mb-4" />
            <h3 className="font-medium mb-2">Learning</h3>
            <p className="text-sm text-gray-600 mb-4">
              Take courses to master Builder.io
            </p>
            <a href="/courses" className="text-[#a97ff2] hover:text-[#9665d8] text-sm">
              Start Learning →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
