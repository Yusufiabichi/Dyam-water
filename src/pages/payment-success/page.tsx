import { useEffect, useMemo, useState } from 'react'
import { Check, Download, Home, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiUrl } from '../../lib/api'

type VerificationStatus = 'loading' | 'success' | 'failed' | 'pending'

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<VerificationStatus>('loading')
  const [transaction, setTransaction] = useState({
    reference: '',
    amount: 0,
    currency: 'NGN',
    date: new Date().toISOString(),
    paymentMethod: 'Paystack',
    transactionId: '',
    description: 'Charity Donation',
    donorName: '',
    email: '',
    phone: '',
    plan: ''
  })

  const reference = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('reference') || params.get('trxref') || ''
  }, [])

  useEffect(() => {
    if (!reference) {
      setStatus('failed')
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(apiUrl(`transactions/verify/${encodeURIComponent(reference)}`))
        if (!res.ok) {
          setStatus('failed')
          return
        }

        const data = await res.json()
        const normalizedStatus = String(data.status || '').toLowerCase()

        if (normalizedStatus === 'success') setStatus('success')
        else if (normalizedStatus === 'failed') setStatus('failed')
        else setStatus('pending')

        setTransaction({
          reference: data.reference || reference,
          amount: Number(data.amount) || 0,
          currency: 'NGN',
          date: data.paid_at || new Date().toISOString(),
          paymentMethod: data.payment_method || 'Paystack',
          transactionId: data.transaction_id || '',
          description: 'Charity Donation',
          donorName: data.full_name || '',
          email: data.email || '',
          phone: data.phone_number || '',
          plan: data.plan || ''
        })
      } catch {
        setStatus('failed')
      }
    }

    verify()
  }, [reference])

  const formatCurrency = (amt: number, currency = 'NGN') => `${currency} ${amt.toLocaleString()}`

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {status === 'loading' ? 'Verifying Payment' : status === 'success' ? 'Payment Successful' : status === 'failed' ? 'Payment Failed' : 'Payment Pending'}
          </h1>
          <p className="text-slate-600 text-lg mb-8">
            {status === 'loading'
              ? 'Please wait while we verify your transaction.'
              : status === 'success'
                ? 'Your transaction has been completed and confirmed.'
                : status === 'failed'
                  ? 'Your transaction could not be completed.'
                  : 'Your transaction is still being processed.'}
          </p>

          <div className="bg-slate-100 rounded-xl p-6 md:p-8 mb-8 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">Transaction ID</p>
                <p className="text-base md:text-lg font-mono text-slate-900 break-all">{transaction.reference || reference || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">Amount</p>
                <p className="text-2xl md:text-3xl font-bold text-emerald-600">{formatCurrency(transaction.amount, transaction.currency)}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">Date & Time</p>
                <p className="text-base text-slate-900">
                  {new Date(transaction.date).toLocaleString('en-NG', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">Payment Method</p>
                <p className="text-base text-slate-900">{transaction.paymentMethod}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">Paystack Transaction</p>
                <p className="text-base text-slate-900 break-all">{transaction.transactionId || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">Sponsor Plan</p>
                <p className="text-base text-slate-900">{transaction.plan || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">Donor Name</p>
                <p className="text-base text-slate-900">{transaction.donorName || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">Email</p>
                <p className="text-base text-slate-900 break-all">{transaction.email || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">Phone</p>
                <p className="text-base text-slate-900">{transaction.phone || 'N/A'}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-slate-600 font-medium mb-1">Description</p>
                <p className="text-base text-slate-900">{transaction.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-slate-900">
              {status === 'success'
                ? 'Your payment has been verified and saved successfully.'
                : status === 'failed'
                  ? 'Payment verification failed. Please try again or contact support.'
                  : 'We are still waiting for payment confirmation.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/transactions/${transaction.reference}/receipt`} className="inline-flex items-center gap-2 justify-center border border-emerald-600 text-emerald-600 rounded-lg h-12 px-6 text-base">
              <Download className="w-4 h-4" />
              Download Receipt
            </Link>

            <Link to="/" className="inline-flex items-center gap-2 justify-center bg-emerald-600 text-white rounded-lg h-12 px-6 text-base">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600 mb-4">Need help with your transaction?</p>
            <Link to="/contact" className="inline-flex items-center gap-2 justify-center text-emerald-600 hover:bg-emerald-50">
              <HelpCircle className="w-4 h-4" />
              Contact Support
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-slate-600 mt-8">
          Keep your transaction ID for your records. It may be needed for inquiries or support.
        </p>
      </div>
    </main>
  )
}
