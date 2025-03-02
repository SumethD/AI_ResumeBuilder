import React from 'react';
import { Check, X, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

function Pricing() {
  const navigate = useNavigate();
  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for trying the app',
      features: [
        'Basic AI resume builder (1 resume/month)',
        'Basic resume analysis',
        'ATS compatibility check',
        'Export to PDF',
      ],
      notIncluded: [
        'Unlimited AI resume builds',
        'Advanced AI suggestions',
        'Cover letter generation',
        'LinkedIn post generator',
        'Analytics dashboard',
        'Priority support',
      ],
    },
    {
      name: 'Starter',
      price: '11.99',
      description: 'For active job seekers',
      popular: true,
      features: [
        'Everything in Free, plus:',
        'Unlimited AI resume builds',
        'Advanced resume analysis',
        'AI-powered suggestions',
        'Cover letter generation',
        'Basic analytics dashboard',
        '2 LinkedIn posts per month',
      ],
      notIncluded: [
        'Unlimited LinkedIn posts',
        'Priority support',
        'Industry insights',
      ],
    },
    {
      name: 'Professional',
      price: '24.99',
      description: 'Advanced tools for professionals',
      features: [
        'Everything in Starter, plus:',
        'Advanced AI resume optimization',
        'Multiple resume versions',
        'Unlimited LinkedIn posts',
        'Advanced analytics dashboard',
        'Industry insights & trends',
        'Priority support',
      ],
      notIncluded: [],
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-black/90 border-b border-white/10 transition-smooth">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-white hover:text-[#BCE784] transition-smooth button-hover"
                aria-label="Go back to home"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <Logo />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="relative pt-24 pb-12 bg-black">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #BCE784 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-[#BCE784]">Perfect Plan</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select the plan that best fits your career goals. All plans include our AI-powered resume builder.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white/5 rounded-2xl p-8 border-2 card-hover ${
                plan.popular
                  ? 'border-[#BCE784] shadow-lg shadow-[#BCE784]/20'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#BCE784] text-black px-4 py-1 rounded-full text-sm font-semibold transition-smooth">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2 transition-smooth">{plan.name}</h3>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-gray-400 text-2xl transition-smooth">$</span>
                  <span className="text-4xl font-bold text-white transition-smooth">{plan.price}</span>
                  <span className="text-gray-400 ml-2 transition-smooth">/month</span>
                </div>
                <p className="text-gray-400 transition-smooth">{plan.description}</p>
              </div>

              <div className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3 transition-smooth">
                    <Check className="w-5 h-5 text-[#BCE784] flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded?.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3 opacity-50 transition-smooth">
                    <X className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-500">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full mt-8 py-3 px-6 rounded-lg font-semibold button-hover ${
                  plan.popular
                    ? 'bg-[#BCE784] text-black hover:bg-[#BCE784]/90'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {[
              {
                q: "How does the AI resume builder work?",
                a: "Our AI analyzes your experience and the job requirements to create optimized resumes tailored to specific positions. It suggests improvements and formats your content professionally."
              },
              {
                q: "Can I change plans later?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
              },
              {
                q: "Is there a contract or commitment?",
                a: "No, all our plans are month-to-month with no long-term commitment required. You can cancel anytime."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-6 card-hover">
                <h3 className="text-xl font-semibold text-white mb-2 transition-smooth">{faq.q}</h3>
                <p className="text-gray-400 transition-smooth">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Pricing;