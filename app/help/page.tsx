import { Mail, MessageCircle, Book, FileText, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'account';
}

const faqs: FAQItem[] = [
  {
    question: 'What is Builder Academy?',
    answer:
      'Builder Academy is the official learning platform for Builder.io. We provide comprehensive courses, certifications, and resources to help you master the Builder.io platform.',
    category: 'general',
  },
  {
    question: 'How do I get started with the courses?',
    answer:
      "Start with our 'Builder 101' course series, which covers the fundamentals of using Builder.io. You can find these courses in the Courses section.",
    category: 'general',
  },
  {
    question: 'Is certification free?',
    answer:
      'While our courses are free, certification exams require a fee. The certification demonstrates your expertise in Builder.io and can enhance your professional credentials.',
    category: 'account',
  },
  {
    question: 'How do I integrate Builder.io with my existing project?',
    answer:
      'Check our technical documentation for detailed integration guides for various frameworks including React, Vue, and Angular.',
    category: 'technical',
  },
];

const resources = [
  {
    title: 'Documentation',
    description: 'Comprehensive guides and API references',
    icon: Book,
    url: 'https://www.builder.io/c/docs/introduction',
  },
  {
    title: 'Content API Reference',
    description: 'Detailed API documentation for developers',
    icon: FileText,
    url: 'https://www.builder.io/c/docs/content-api#content-api',
  },
  {
    title: 'Community Forum',
    description: 'Connect with other Builder.io developers',
    icon: MessageCircle,
    url: 'https://forum.builder.io/',
  },
  {
    title: 'Email Support',
    description: 'Get help from our support team',
    icon: Mail,
    url: 'mailto:support@builder.io',
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="max-w-[802px] mt-[61px] mb-12 mx-auto px-4 py-0 max-md:mt-10">
        <h1 className="text-black text-[32px] font-normal mb-6">Help Center</h1>

        {/* Search - For future implementation */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Search help articles..."
            className="w-full px-6 py-3 border border-gray-200 rounded-full text-base"
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {resources.map(resource => (
            <Link
              href={resource.url}
              key={resource.title}
              className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <resource.icon className="w-6 h-6 text-[#a97ff2]" />
              <div>
                <h3 className="font-medium mb-1">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-2xl font-medium mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="border border-gray-200 rounded-lg p-4 group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-gray-600 pl-4">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-medium mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is available to help you with any questions or issues you may have.
          </p>
          <div className="flex gap-4">
            <a
              href="mailto:support@builder.io"
              className="bg-[#a97ff2] text-white px-6 py-2 rounded-full inline-flex items-center gap-2 hover:bg-[#9665d8] transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
            <a
              href="#"
              className="border border-[#a97ff2] text-[#a97ff2] px-6 py-2 rounded-full inline-flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Join Community
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
