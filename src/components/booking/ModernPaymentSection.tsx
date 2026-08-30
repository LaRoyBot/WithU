'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, Copy, ShieldCheck, Smartphone, QrCode, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';

interface ModernPaymentSectionProps {
  finalPrice: number;
  serviceName: string;
  paymentMode: 'PAY_NOW' | 'PAY_AFTER';
  onPaymentModeChange: (mode: 'PAY_NOW' | 'PAY_AFTER') => void;
  utrNumber: string;
  onUtrChange: (utr: string) => void;
}

export default function ModernPaymentSection({
  finalPrice,
  serviceName,
  paymentMode,
  onPaymentModeChange,
  utrNumber,
  onUtrChange,
}: ModernPaymentSectionProps) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [activeTab, setActiveTab] = useState<'UPI_APPS' | 'QR_CODE'>('UPI_APPS');

  const upiId = 'paytm.s2x2tge@pty';
  const merchantName = 'Neetha Nursing Service';

  // Standard NPCI UPI URI string format with pre-filled dynamic amount & note
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${finalPrice}&cu=INR&tn=${encodeURIComponent(`Care visit - ${serviceName.slice(0, 20)}`)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* 1. Payment Choice Switcher: Pay Online Now vs. Pay After Visit */}
      <div>
        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
          Payment Preference *
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onPaymentModeChange('PAY_NOW')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              paymentMode === 'PAY_NOW'
                ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg ring-1 ring-purple-500/50'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>⚡</span> Pay Online (UPI)
              </span>
              {paymentMode === 'PAY_NOW' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              )}
            </div>
            <p className="text-[10px] text-emerald-400 font-semibold">
              Instant Confirmation & Discount
            </p>
          </button>

          <button
            type="button"
            onClick={() => onPaymentModeChange('PAY_AFTER')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              paymentMode === 'PAY_AFTER'
                ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg ring-1 ring-purple-500/50'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>💵</span> Pay After Visit
              </span>
              {paymentMode === 'PAY_AFTER' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              Pay Cash or UPI to Nurse
            </p>
          </button>
        </div>
      </div>

      {/* 2. When 'Pay Online Now' is Selected */}
      {paymentMode === 'PAY_NOW' ? (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/30 rounded-2xl p-4 sm:p-5 border border-purple-900/40 shadow-xl space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                ₹
              </span>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Payable</span>
                <span className="text-base font-black font-mono text-emerald-400">₹{finalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Sub-tab: 1-Click UPI vs Dynamic QR */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('UPI_APPS')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'UPI_APPS'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>UPI Apps</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('QR_CODE')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'QR_CODE'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3 h-3" />
                <span>Scan QR</span>
              </button>
            </div>
          </div>

          {/* TAB A: 1-Click Mobile UPI Deep Links */}
          {activeTab === 'UPI_APPS' && (
            <div className="space-y-3">
              <p className="text-[11px] text-slate-300 text-center font-medium">
                Tap to pay directly from your installed UPI app:
              </p>

              {/* Primary 1-Click UPI Action */}
              <a
                href={upiUri}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group active:scale-98"
              >
                <span>⚡ Pay ₹{finalPrice} via Any UPI App</span>
              </a>

              {/* Multi-App Badges Grid */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <a
                  href={`gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${finalPrice}&cu=INR`}
                  className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 transition-all text-center group flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-sm">🟣</span>
                  <span className="text-[10px] font-bold text-slate-300 group-hover:text-blue-400">Google Pay</span>
                </a>

                <a
                  href={`phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${finalPrice}&cu=INR`}
                  className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 transition-all text-center group flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-sm">🔵</span>
                  <span className="text-[10px] font-bold text-slate-300 group-hover:text-purple-400">PhonePe</span>
                </a>

                <a
                  href={`paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${finalPrice}&cu=INR`}
                  className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all text-center group flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-sm">🔷</span>
                  <span className="text-[10px] font-bold text-slate-300 group-hover:text-cyan-400">Paytm UPI</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB B: Ultra-Crisp Dynamic Vector SVG QR Code */}
          {activeTab === 'QR_CODE' && (
            <div className="space-y-3 text-center">
              <div className="bg-white p-3.5 rounded-2xl w-48 mx-auto shadow-2xl border-4 border-purple-500/20 flex flex-col items-center justify-center">
                <QRCodeSVG
                  value={upiUri}
                  size={150}
                  level="H"
                  includeMargin={false}
                />
                <div className="mt-2 text-[9px] font-bold text-slate-600 font-mono tracking-tight flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Amount: ₹{finalPrice}</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400">
                Scan with GPay, PhonePe, Paytm or BHIM to pay prefilled amount.
              </p>
            </div>
          )}

          {/* 3. 1-Tap Copy UPI ID */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="text-left">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Official UPI ID</span>
              <span className="font-mono text-xs text-white font-bold">{upiId}</span>
            </div>

            <button
              type="button"
              onClick={handleCopyUpi}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedUpi ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy UPI</span>
                </>
              )}
            </button>
          </div>

          {/* Optional UTR / Reference Input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              UPI Reference / 12-Digit UTR Number (Optional)
            </label>
            <input
              type="text"
              maxLength={16}
              value={utrNumber}
              onChange={(e) => onUtrChange(e.target.value)}
              placeholder="e.g. 423819283746 (from GPay / PhonePe receipt)"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      ) : (
        /* When 'Pay After Visit' is Selected */
        <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-lg">
            ✓
          </div>
          <h4 className="text-xs font-bold text-white">Doorstep Payment Selected</h4>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            You can pay ₹{finalPrice} via Cash, Google Pay, or PhonePe directly to the certified nurse upon arrival at your home.
          </p>
        </div>
      )}
    </div>
  );
}
