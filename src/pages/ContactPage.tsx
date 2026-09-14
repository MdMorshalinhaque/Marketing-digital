import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Size & Fit Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    setSubmitted(true);
    showToast('Your message has been received. Our Dhaka team will contact you within 2 hours.', 'success');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const faqs = [
    {
      q: 'What are the delivery timelines inside and outside Dhaka?',
      a: 'Inside Dhaka orders are dispatched via priority express riders within 24 to 48 hours (৳70). Orders outside Dhaka across all 64 districts are fulfilled through Steadfast and Pathao Express within 48 to 72 hours (৳130). Orders above ৳2,500 enjoy free nationwide shipping.',
    },
    {
      q: 'Can I check and inspect the parcel in front of the delivery rider?',
      a: 'Yes! We encourage all customers to inspect the outer packaging and verify the correct garment before handing over payment to the rider. If you notice any damage or missing tags, you can decline the parcel or contact our concierge immediately.',
    },
    {
      q: 'How does the 7-day doorstep size exchange work?',
      a: 'If a garment doesn’t fit your shoulders or chest perfectly, message our WhatsApp support (+880 1711-234567) within 7 days of receiving your order with your order ID and the new size you need. A courier rider will deliver the fresh size and collect the old one directly from your doorstep.',
    },
    {
      q: 'Which payment methods do you accept?',
      a: 'We accept Cash on Delivery (COD) everywhere in Bangladesh, bKash Merchant Payment, Nagad Mobile Financial Services, and all Visa, Mastercard, and American Express cards processed via secure bank-grade SSLCommerz gateways.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
          We're Here For You
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Contact & Visit Our Banani Store
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Have questions regarding order delivery, custom tailoring, or sizing? Our Dhaka team is at your service.
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Flagship Boutique</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Customer Hotline</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            +880 1711-234567 <br />
            +880 2-9876543
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">WhatsApp Concierge</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Instant fit recommendations & order updates on +880 1711-234567
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-stone-900 text-sm">Store Hours</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Open Everyday: 10:00 AM – 10:00 PM (BST)
          </p>
        </div>
      </div>

      {/* Main Form & Map Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-stone-900">Send Us a Message</h3>
            <p className="text-xs text-stone-500 mt-1">
              Fill out this form and our stylist will respond promptly.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">Thank You! Message Sent Successfully</h4>
              <p className="text-xs text-emerald-700">
                We have received your query and will reply via SMS or email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nusrat Jahan"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Phone (BD) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                  >
                    <option value="Size & Fit Inquiry">Size & Fit Inquiry</option>
                    <option value="Order Tracking & Delivery">Order Tracking & Delivery</option>
                    <option value="7-Day Doorstep Exchange">7-Day Doorstep Exchange</option>
                    <option value="Corporate / Bulk Orders">Corporate / Bulk Orders</option>
                    <option value="Store Visit & Styling">Store Visit & Styling</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Your Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our Dhaka concierge team help you today?"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Map & Banani Store Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="relative aspect-[16/10] bg-stone-200">
              <img
                src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80"
                alt="AURA Banani boutique entrance"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <h4 className="font-extrabold text-base">AURA Flagship Atelier</h4>
                  <p className="text-xs text-stone-300">Road 11, Banani, Dhaka</p>
                </div>
              </div>
            </div>
            <div className="p-5 text-xs text-stone-600 space-y-2">
              <p>
                Located right in the heart of Dhaka's premier fashion district. Come experience our fabrics in person, try on garments in our spacious fitting rooms, and consult with our resident stylists.
              </p>
              <div className="pt-2 flex items-center gap-2 text-stone-800 font-bold">
                <MapPin className="w-4 h-4 text-amber-800" />
                <span>Valet parking available at Road 11 entrance.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-4xl mx-auto space-y-6 pt-8 border-t border-stone-200">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Got Questions?
          </span>
          <h3 className="text-2xl font-extrabold text-stone-900">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-stone-900 hover:bg-stone-50 transition"
              >
                <span>{f.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
