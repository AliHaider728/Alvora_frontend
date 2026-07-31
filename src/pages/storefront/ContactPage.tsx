import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SeoHead } from '../../components/common/SeoHead';
import { useStore } from '../../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-8">
      <SeoHead title="Contact Us" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h1 className="font-heading font-black text-2xl text-slate-900">Get in Touch with Play Bimboo</h1>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Have questions about toy safety, shipping speeds, or bulk gift orders? Send us a message and our support team will reply within 24 hours!
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-rose-50 text-rose-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900">Store Address</span>
                    <span>{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-sky-50 text-sky-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900">Phone Support</span>
                    <span>{settings.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-50 text-amber-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900">Email Customer Service</span>
                    <span>{settings.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="font-heading font-black text-xl text-slate-900">Send Us a Direct Message</h2>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="font-heading font-bold text-base">Message Sent Successfully!</h3>
                  <p className="text-xs">Thank you for reaching out to Play Bimboo. We'll reply shortly!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Order Tracking or Toy Suggestion"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-rose-500 text-white font-heading font-extrabold text-xs hover:bg-rose-600 shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
