'use client';

import { useState } from 'react';
import { Button } from '../components/common/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus on first error field for accessibility
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstErrorField);
      errorElement?.focus();
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1030px] mx-auto px-6 py-12">
        <h1 className="text-[42px] font-semibold text-black mb-8 text-center">
          Contact Us
        </h1>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#f5f0ff] p-8 rounded-2xl border border-[#a97ff2] mb-8">
            <h2 className="text-2xl font-medium mb-4 text-black">Get in Touch</h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              We're here to help! Whether you have questions about our courses, need technical support,
              or want to provide feedback, we'd love to hear from you.
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-2xl font-medium mb-6 text-black">Send us a Message</h2>

            {submitSuccess && (
              <div
                className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6"
                role="alert"
                aria-live="polite"
              >
                <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a97ff2] focus:border-transparent outline-none transition-colors ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a97ff2] focus:border-transparent outline-none transition-colors ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>


              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  aria-invalid={errors.subject ? 'true' : 'false'}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a97ff2] focus:border-transparent outline-none transition-colors ${
                    errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Brief description of your inquiry"
                />
                {errors.subject && (
                  <p id="subject-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message <span className="text-red-500" aria-label="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'message-error message-help' : 'message-help'}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#a97ff2] focus:border-transparent outline-none transition-colors resize-vertical ${
                    errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Please provide details about your inquiry..."
                />
                <p id="message-help" className="mt-1 text-sm text-gray-500">
                  Minimum 10 characters required
                </p>
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>

                <p className="text-sm text-gray-500">
                  All fields marked with <span className="text-red-500">*</span> are required
                </p>
              </div>
            </form>
          </div>


          <div className="bg-gray-50 p-8 rounded-2xl">
            <h3 className="text-xl font-medium mb-4 text-black">Connect With Us</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">Discord:</span>
                <a 
                  href="https://discord.gg/builder" 
                  className="text-[#a97ff2] hover:text-[#9665d8] transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Join our Discord community
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">GitHub:</span>
                <a 
                  href="https://github.com/builderio/builder" 
                  className="text-[#a97ff2] hover:text-[#9665d8] transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Follow us on GitHub
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">Email:</span>
                <a 
                  href="mailto:support@builder.io" 
                  className="text-[#a97ff2] hover:text-[#9665d8] transition-colors"
                >
                  support@builder.io
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              Want to learn more about Builder.io?
            </p>
            <a 
              href="https://www.builder.io" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button>Visit Builder.io</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
