interface PayoutCongratsModalProps {
  isOpen: boolean
  onClose: () => void
  partnerName: string
  payout: {
    id: string
    amount: number
    paidAt?: string
    transactionReference?: string
    paymentMethod?: string
  } | null
}

export default function PayoutCongratsModal({
  isOpen,
  onClose,
  partnerName,
  payout
}: PayoutCongratsModalProps) {
  if (!isOpen || !payout) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs font-mono animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border-3 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#0f172a] text-center space-y-5">
        
        {/* Confetti & Trophy Badge */}
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-[#86efac] border-3 border-slate-900 rounded-2xl flex items-center justify-center mx-auto text-4xl shadow-[4px_4px_0px_0px_#000] rotate-[-3deg] hover:rotate-0 transition-transform">
            🏆
          </div>
          <span className="absolute -top-2 -right-3 text-2xl">🎉</span>
          <span className="absolute -bottom-1 -left-3 text-2xl">✨</span>
        </div>

        {/* Heading */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-[#fef08a] border-2 border-slate-900 rounded-full text-slate-900 inline-block shadow-[1px_1px_0px_0px_#000]">
            PAYOUT DISBURSED
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 mt-2">
            Congratulations!
          </h2>
          <p className="text-xs font-bold text-slate-600 mt-1">
            {partnerName}, your commission has been credited!
          </p>
        </div>

        {/* Big Amount Card */}
        <div className="p-4 bg-[#f0fdf4] border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
            Amount Transferred
          </span>
          <p className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight mt-0.5">
            ₹{payout.amount.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] font-black text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded border border-emerald-400 mt-1.5 inline-block">
            ✓ Status: Settled & Disbursed
          </span>
        </div>

        {/* Transaction Reference Details */}
        <div className="bg-[#f8fafc] border-2 border-slate-900 rounded-xl p-3 text-xs space-y-2 text-left">
          {payout.transactionReference && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Bank UTR / Ref No:</span>
              <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 border border-slate-300 rounded text-[11px]">
                {payout.transactionReference}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Payment Method:</span>
            <span className="font-bold text-slate-800">{payout.paymentMethod || 'UPI / Bank Transfer'}</span>
          </div>
          {payout.paidAt && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Disbursement Date:</span>
              <span className="font-bold text-slate-800">
                {new Date(payout.paidAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          )}
        </div>

        {/* Motivational Encouragement */}
        <p className="text-xs text-slate-700 font-medium leading-relaxed">
          Outstanding work! Your commission has been verified and successfully transferred to your registered account. Keep pitching schools and organizations to unlock even higher earnings!
        </p>

        {/* Action Button */}
        <div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#86efac] border-2 border-slate-900 rounded-xl font-black text-xs uppercase tracking-wider text-slate-900 shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
          >
            🚀 Awesome! Continue to Dashboard
          </button>
        </div>

      </div>
    </div>
  )
}
