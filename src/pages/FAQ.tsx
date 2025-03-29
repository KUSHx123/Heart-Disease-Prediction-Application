import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is heart disease prediction?',
      answer: 'Heart disease prediction is a process that uses artificial intelligence and machine learning algorithms to assess an individual\'s risk of developing cardiovascular disease. Our tool analyzes various health metrics including age, gender, cholesterol levels, blood pressure, and other factors to provide a risk assessment.'
    },
    {
      question: 'How accurate is this prediction tool?',
      answer: 'Our prediction model has been trained on extensive medical datasets and achieves high accuracy rates (>80%). However, it\'s important to note that this tool is meant to be used as a screening aid and not as a replacement for professional medical diagnosis. Always consult with healthcare providers for definitive medical advice.'
    },
    {
      question: 'What data do I need to provide?',
      answer: 'To get a prediction, you\'ll need to provide basic health information including:\n- Age\n- Gender\n- Cholesterol levels\n- Blood pressure\n- Heart rate\n- Blood glucose levels\nAll data should be from recent medical tests for the most accurate results.'
    },
    {
      question: 'Is my health data secure?',
      answer: 'Yes, we take data security very seriously. All health information is encrypted using industry-standard protocols, and we comply with healthcare data protection regulations. We never share your personal health information with third parties without your explicit consent.'
    },
    {
      question: 'How often should I use this tool?',
      answer: 'We recommend using the prediction tool annually or whenever you receive new health metrics from your healthcare provider. However, if you experience significant changes in your health status or risk factors, you may want to use it more frequently.'
    },
    {
      question: 'What should I do if the tool indicates high risk?',
      answer: 'If the tool indicates a high risk of heart disease, we strongly recommend:\n1. Consulting with your healthcare provider\n2. Sharing the prediction results with your doctor\n3. Getting a thorough medical evaluation\n4. Following your doctor\'s advice for prevention and treatment'
    },
    {
      question: 'Can I use this tool for someone else?',
      answer: 'Yes, you can use this tool to assess heart disease risk for others, provided you have accurate health information for them. However, remember that the results should be discussed with a healthcare provider for proper interpretation.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                className="w-full text-left px-6 py-4 focus:outline-none flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-600 whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-blue-800 mb-4">
            If you couldn't find the answer you were looking for, please don't hesitate to reach out to our support team.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-m d hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;