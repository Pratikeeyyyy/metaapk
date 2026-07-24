import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-3xl">💰</span>
          <span className="text-white font-bold text-xl">ExpenseShare</span>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <Link
              to="/app"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-gray-300 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-orange-500/20 px-4 py-2 rounded-full mb-6">
            <span className="text-orange-300 text-sm font-semibold">
              🚀 Powered by Sepolia Blockchain
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Split Expenses With
            <span className="text-orange-400"> Friends</span>
            <br />
            On The <span className="text-purple-400">Blockchain</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Track, split, and settle expenses with friends transparently. Every
            transaction is recorded on the Ethereum blockchain.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!user && (
              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition transform hover:scale-105 inline-flex items-center gap-2"
              >
                <span>Start Splitting</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            )}
            <a
              href="#features"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition border border-white/20"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <p className="text-3xl font-bold text-orange-400">100%</p>
            <p className="text-gray-400 text-sm mt-1">Transparent</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <p className="text-3xl font-bold text-purple-400">0</p>
            <p className="text-gray-400 text-sm mt-1">Hidden Fees</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <p className="text-3xl font-bold text-green-400">Instant</p>
            <p className="text-gray-400 text-sm mt-1">Settlements</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <p className="text-3xl font-bold text-blue-400">NFT</p>
            <p className="text-gray-400 text-sm mt-1">Receipts</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Why Choose <span className="text-orange-400">ExpenseShare</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-orange-400/50 transition group">
            <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition">
              <span className="text-3xl">🔗</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Blockchain Powered
            </h3>
            <p className="text-gray-400 leading-relaxed">
              All transactions are recorded on the Ethereum Sepolia testnet,
              ensuring complete transparency and immutability.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition group">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Multi-Participant
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Split expenses with multiple friends. Add participants with their
              wallet addresses and track who owes what.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-green-400/50 transition group">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition">
              <span className="text-3xl">🖼️</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">NFT Receipts</h3>
            <p className="text-gray-400 leading-relaxed">
              Mint beautiful NFTs as proof of payment. Each expense becomes a
              unique, tradable digital collectible.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition group">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500/30 transition">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Real-Time Tracking
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Track pending payments, paid expenses, and bad debtors in
              real-time. Stay on top of your financials.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-red-400/50 transition group">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500/30 transition">
              <span className="text-3xl">💳</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Payment Requests
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Send and receive payment requests directly through the app. Settle
              debts with just a few clicks.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-blue-400/50 transition group">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition">
              <span className="text-3xl">🛡️</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Secure & Trustless
            </h3>
            <p className="text-gray-400 leading-relaxed">
              No central authority. Smart contracts handle everything, ensuring
              fairness and trust between all parties.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          How It <span className="text-purple-400">Works</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl border-2 border-orange-400/30">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Connect Wallet
            </h3>
            <p className="text-gray-400">
              Connect your MetaMask wallet to the Sepolia testnet and start
              splitting expenses.
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl border-2 border-purple-400/30">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Add Expense</h3>
            <p className="text-gray-400">
              Enter expense details, add participants, and let the smart
              contract calculate everyone's share.
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl border-2 border-green-400/30">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Settle & Mint</h3>
            <p className="text-gray-400">
              Participants pay their share, mark as paid, and mint an NFT
              receipt as proof of settlement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-orange-500 to-purple-600 rounded-3xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Splitting?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their expenses
            transparently on the blockchain.
          </p>
          {user ? (
            <Link
              to="/app"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition inline-flex items-center gap-2"
            >
              <span>Go to Dashboard</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition inline-flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-2xl">💰</span>
            <span className="text-white font-bold">ExpenseShare</span>
          </div>
          <div className="flex space-x-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition">
              Contact
            </a>
          </div>
          <div className="text-gray-500 text-sm mt-4 md:mt-0">
            © 2024 ExpenseShare. Built on Ethereum Sepolia.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
