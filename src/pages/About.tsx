import React from 'react';
import { Brain, Shield, Users, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About HeartGuard</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're dedicated to making heart disease prediction accessible and accurate through 
            advanced artificial intelligence and machine learning technologies.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            HeartGuard's mission is to empower individuals and healthcare providers with accurate, 
            AI-driven heart disease risk assessments. We believe that early detection and prevention 
            are key to reducing the global impact of cardiovascular diseases. By combining cutting-edge 
            technology with medical expertise, we aim to make heart health monitoring more accessible 
            and efficient for everyone.
          </p>
        </div>

        {/* Technology Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Technology</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Brain className="h-6 w-6 text-blue-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">Machine Learning Models</h3>
                  <p className="text-gray-600">
                    Powered by advanced algorithms including Random Forest and Support Vector Machines
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Shield className="h-6 w-6 text-blue-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">Data Security</h3>
                  <p className="text-gray-600">
                    Enterprise-grade encryption and privacy protection for all user data
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Expertise</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Users className="h-6 w-6 text-blue-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">Expert Team</h3>
                  <p className="text-gray-600">
                    Collaboration between data scientists, cardiologists, and healthcare professionals
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Award className="h-6 w-6 text-blue-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">Proven Accuracy</h3>
                  <p className="text-gray-600">
                    High precision and recall rates validated through extensive testing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Sarah Johnson',
                role: 'Chief Medical Officer',
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
              },
              {
                name: 'Dr. Michael Chen',
                role: 'Lead Data Scientist',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
              },
              {
                name: 'Dr. Emily Rodriguez',
                role: 'Research Director',
                image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;