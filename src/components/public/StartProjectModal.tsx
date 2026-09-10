import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  MessageCircle,
  CheckCircle,
  Palette,
  Video,
  Printer,
  Globe,
  Clock,
  Send,
} from 'lucide-react';

interface StartProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (title: string) => void;
}

export const StartProjectModal: React.FC<StartProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [service, setService] = useState('Brand & Identity');
  const [clientName, setClientName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'Normal' | 'Express 24h'>('Normal');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmitSuccess) {
      onSubmitSuccess(clientName || 'New Project');
    }
  };

  const handleWhatsAppSend = () => {
    const text = `*New Project Enquiry — Gizmo Design*%0A%0A*Service:* ${encodeURIComponent(
      service
    )}%0A*Client:* ${encodeURIComponent(clientName || 'Prospective Client')}%0A*Org:* ${encodeURIComponent(
      organization || 'N/A'
    )}%0A*Phone:* ${encodeURIComponent(phone || 'N/A')}%0A*Urgency:* ${encodeURIComponent(
      urgency
    )}%0A*Brief:* ${encodeURIComponent(description || 'Creative Consultation Request')}`;

    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-950 rounded-xl hover:bg-zinc-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-700 mb-1.5">
                <Sparkles className="w-3 h-3 text-[#FF5738]" />
                <span>Direct Studio Commission</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                Start Your Creative Project
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Tell us about your brand, campaign, or flex print specifications.
              </p>
            </div>

            {/* Service Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Select Discipline</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Brand & Identity', icon: Palette },
                  { name: 'Motion & Video Graphics', icon: Video },
                  { name: 'Large-Format Flex & Print', icon: Printer },
                  { name: 'Digital & Product UI', icon: Globe },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = service === item.name;
                  return (
                    <div
                      key={item.name}
                      onClick={() => setService(item.name)}
                      className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer flex items-center gap-2 transition ${
                        isSelected
                          ? 'border-[#FF5738] bg-orange-50/50 text-[#FF5738]'
                          : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Client info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammed Rafeeq"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 outline-none focus:border-[#FF5738] transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Builders / Darul Hasaniyyah"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 outline-none focus:border-[#FF5738] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">WhatsApp Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 outline-none focus:border-[#FF5738] transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Urgency</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgency('Normal')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      urgency === 'Normal'
                        ? 'border-zinc-950 bg-zinc-950 text-white'
                        : 'border-zinc-200 text-zinc-600'
                    }`}
                  >
                    Standard SLA
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('Express 24h')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      urgency === 'Express 24h'
                        ? 'border-[#FF5738] bg-[#FF5738] text-white'
                        : 'border-zinc-200 text-zinc-600'
                    }`}
                  >
                    Express 24h
                  </button>
                </div>
              </div>
            </div>

            {/* Brief Description */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Project Brief / Dimensions</label>
              <textarea
                rows={3}
                placeholder="Describe your design needs, dimensions (e.g. 40x20 ft hoarding), key copy, or motion style..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 outline-none focus:border-[#FF5738] transition resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleWhatsAppSend}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Submit via WhatsApp Instant</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-[#FF5738] text-white text-xs font-extrabold transition flex items-center justify-center gap-1.5"
              >
                <span>Submit Online</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-zinc-950">Brief Received Successfully!</h3>
            <p className="text-xs text-zinc-600 max-w-sm mx-auto">
              Our Senior Creative Director will review your project requirements and message you directly on WhatsApp ({phone || 'provided phone'}).
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-[#FF5738] transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
