
import { Button } from "@/components/ui/button";
import { Bot, MessageCircle, Plane, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F7F6F3]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Plane className="w-12 h-12 text-[#2E95E5]" />
            <h1 className="text-4xl font-bold text-[#37352F]">Airline Service Center</h1>
          </div>
          <p className="text-xl text-[#6B6B6B] mb-8 max-w-2xl mx-auto">
            Get instant help with your flight bookings, refunds, and travel inquiries through our AI-powered customer service bot.
          </p>
          <Link to="/chatbot">
            <Button className="bg-[#2E95E5] hover:bg-[#2680C4] text-white px-8 py-3 text-lg rounded-lg shadow-sm">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chat Support
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 border border-[#E9E9E8] shadow-sm">
            <div className="w-12 h-12 bg-[#2E95E5]/10 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-[#2E95E5]" />
            </div>
            <h3 className="text-lg font-semibold text-[#37352F] mb-2">AI-Powered Support</h3>
            <p className="text-[#6B6B6B]">
              Get instant responses to your questions with our intelligent chatbot that understands your travel needs.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[#E9E9E8] shadow-sm">
            <div className="w-12 h-12 bg-[#2E95E5]/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[#2E95E5]" />
            </div>
            <h3 className="text-lg font-semibold text-[#37352F] mb-2">Secure & Private</h3>
            <p className="text-[#6B6B6B]">
              Your booking information is secure and protected. We only access data necessary to help you.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[#E9E9E8] shadow-sm">
            <div className="w-12 h-12 bg-[#2E95E5]/10 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-[#2E95E5]" />
            </div>
            <h3 className="text-lg font-semibold text-[#37352F] mb-2">24/7 Availability</h3>
            <p className="text-[#6B6B6B]">
              Get help anytime, anywhere. Our chatbot is available round the clock for your convenience.
            </p>
          </div>
        </div>

        {/* What You Can Do Section */}
        <div className="bg-white rounded-lg border border-[#E9E9E8] p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#37352F] mb-6 text-center">What Can I Help You With?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-[#37352F]">Refund Information</h3>
              <ul className="space-y-2 text-[#6B6B6B]">
                <li>• Check refund status and timeline</li>
                <li>• View refund amount and processing details</li>
                <li>• Understand refund policies</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-[#37352F]">Booking Details</h3>
              <ul className="space-y-2 text-[#6B6B6B]">
                <li>• View flight information and times</li>
                <li>• Check seat assignments and meal preferences</li>
                <li>• Review payment and booking confirmations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold text-[#37352F] mb-4">Ready to Get Started?</h2>
          <p className="text-[#6B6B6B] mb-6">
            Simply provide your email address and we'll help you find your booking information.
          </p>
          <Link to="/chatbot">
            <Button className="bg-[#2E95E5] hover:bg-[#2680C4] text-white px-8 py-3 text-lg rounded-lg shadow-sm">
              Launch Customer Service Bot
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
