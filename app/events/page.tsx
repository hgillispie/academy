'use client';

import { useState } from 'react';
import { CalendarDays, MapPin, ExternalLink } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'webinar' | 'workshop' | 'conference';
  registrationUrl: string;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Building Dynamic Websites with Builder.io',
    description:
      "Learn how to create dynamic, visually stunning websites using Builder.io's powerful visual editor and component library.",
    date: '2024-04-15T10:00:00Z',
    location: 'Online',
    type: 'webinar',
    registrationUrl: '#',
  },
  {
    id: '2',
    title: 'Advanced Component Workshop',
    description:
      'Deep dive into creating custom components, understanding data models, and implementing advanced features in Builder.io.',
    date: '2024-04-22T14:00:00Z',
    location: 'San Francisco, CA',
    type: 'workshop',
    registrationUrl: '#',
  },
  {
    id: '3',
    title: 'Builder.io Community Conference 2024',
    description:
      'Join the Builder.io community for a day of learning, networking, and exploring the future of visual development.',
    date: '2024-05-10T09:00:00Z',
    location: 'Virtual Event',
    type: 'conference',
    registrationUrl: '#',
  },
];

export default function EventsPage() {
  const [filter, setFilter] = useState<'all' | 'webinar' | 'workshop' | 'conference'>('all');

  const filteredEvents = filter === 'all' ? events : events.filter(event => event.type === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="max-w-[802px] mt-[61px] mb-0 mx-auto px-4 py-0 max-md:mt-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-black text-[32px] font-normal">Upcoming Events</h1>

          <div className="flex gap-2">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as typeof filter)}
              className="px-4 py-2 border border-gray-200 rounded-full text-sm"
            >
              <option value="all">All Events</option>
              <option value="webinar">Webinars</option>
              <option value="workshop">Workshops</option>
              <option value="conference">Conferences</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-medium">{event.title}</h2>
                <span
                  className={`
                  px-3 py-1 rounded-full text-sm capitalize
                  ${event.type === 'webinar' ? 'bg-blue-100 text-blue-800' : ''}
                  ${event.type === 'workshop' ? 'bg-purple-100 text-purple-800' : ''}
                  ${event.type === 'conference' ? 'bg-green-100 text-green-800' : ''}
                `}
                >
                  {event.type}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{event.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <a
                  href={event.registrationUrl}
                  className="bg-[#a97ff2] text-white px-6 py-2 rounded-full inline-flex items-center gap-2 hover:bg-[#9665d8] transition-colors"
                >
                  Register Now
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No events found for the selected filter.
          </div>
        )}
      </main>
    </div>
  );
}
