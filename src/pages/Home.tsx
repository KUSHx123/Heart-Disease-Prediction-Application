import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Users, Award } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
          backgroundBlend: 'overlay',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-blue-900 opacity-75"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Predict Heart Disease Risk with AI
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Using advanced machine learning algorithms to help you understand and manage your heart health better.
            </p>
            <button
              onClick={() => navigate('/predict')}
              className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose HeartGuard?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-blue-600 mb-4">
                <Activity className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Advanced AI Technology</h3>
              <p className="text-gray-600 text-center">
                Utilizing state-of-the-art machine learning algorithms for accurate predictions
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-blue-600 mb-4">
                <Users className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Expert Support</h3>
              <p className="text-gray-600 text-center">
                Backed by healthcare professionals and data scientists
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-blue-600 mb-4">
                <Award className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">High Accuracy</h3>
              <p className="text-gray-600 text-center">
                Proven accuracy rates in predicting heart disease risk factors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Heart Health?</h2>
          <p className="text-xl mb-8">Join thousands of users who trust HeartGuard for their heart health predictions.</p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;