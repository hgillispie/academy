'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../components/common/Button';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <main className="max-w-[802px] mt-[61px] mb-12 mx-auto px-4 py-0 max-md:mt-10">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">Message Sent!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <Button onClick={() => setSubmitted(false)} className="bg-[#a97ff2] hover:bg-[#9665d8]">
              Send Another Message
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="max-w-[802px] mt-[61px] mb-12 mx-auto px-4 py-0 max-md:mt-10">
        <h1 className="text-black text-[32px] font-normal mb-6">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-[#a97ff2] mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-gray-600">support@builder.io</p>
                  <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#a97ff2] mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Office</h3>
                  <p className="text-gray-600">
                    123 Builder Street<br />
                    San Francisco, CA 94105<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6">Send us a Message</h2>
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
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#a97ff2] focus:border-transparent outline-none"
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
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#a97ff2] focus:border-transparent outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#a97ff2] focus:border-transparent outline-none"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
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
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#a97ff2] focus:border-transparent outline-none resize-vertical"
                  placeholder="Tell us how we can help you..."
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#a97ff2] hover:bg-[#9665d8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-medium mb-4">Other Ways to Get Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/help"
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Help Center</h3>
                <p className="text-sm text-gray-600">Browse FAQs and documentation</p>
              </div>
            </a>
            
            <a
              href="https://forum.builder.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Community Forum</h3>
                <p className="text-sm text-gray-600">Connect with other developers</p>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
