/* src/features/ai/AIAssistant.jsx */
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, TrendingDown, CreditCard } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

const AIAssistant = () => {
  const { expenses, insights } = useExpenses();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm your Leak Detector AI. Ask me anything about your spending!" }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Pre-defined AI Logic based on user data
  const handleQuery = (query) => {
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    
    setTimeout(() => {
      let response = "I'm analyzing your data...";
      
      if (query.includes('Where did most of my money go')) {
        const totals = expenses.reduce((acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
          return acc;
        }, {});
        const topCategory = Object.keys(totals).sort((a,b) => totals[b] - totals[a])[0];
        response = `This month, your biggest drain is **${topCategory || 'nothing yet'}**. You've spent ₹${totals[topCategory] || 0} there!`;
      } 
      else if (query.includes('Which subscriptions should I cancel')) {
        const subs = expenses.filter(e => e.category === 'subscription');
        if (subs.length === 0) response = "You have no active subscriptions draining your account right now. Great job!";
        else response = `You have ${subs.length} active subscriptions costing ₹${subs.reduce((sum, s) => sum + s.amount, 0)}/month. I recommend reviewing **${subs[0].description}** first—are you still using it?`;
      }
      else if (query.includes('Which card should I use')) {
        response = "For Blinkit and Amazon, use your **SBI Cashback Card** for 5% off. For Swiggy/Zomato, use the **HDFC Millennia** or Swiggy HDFC card if you have it!";
      }

      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 600);
  };

  const suggestions = [
    "Where did most of my money go?",
    "Which subscriptions should I cancel?",
    "Which card should I use for Amazon?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center hover:scale-110 transition-transform animate-bounce relative group"
        >
          <Sparkles className="absolute top-0 right-0 w-4 h-4 text-yellow-300 animate-pulse" />
          <Bot className="w-7 h-7 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-full"><Bot className="w-5 h-5 text-white" /></div>
              <div>
                <h3 className="text-white font-bold text-sm">Finny AI</h3>
                <p className="text-blue-200 text-[10px]">Your Personal Advisor</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
          </div>

          {/* Chat History */}
          <div className="h-80 p-4 overflow-y-auto bg-slate-900/50 space-y-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'ai' ? 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Smart Suggestions */}
          <div className="p-3 bg-slate-800 border-t border-slate-700 overflow-x-auto whitespace-nowrap flex gap-2 custom-scrollbar">
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                onClick={() => handleQuery(s)}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-full transition-colors border border-slate-600"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;