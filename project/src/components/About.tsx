import React from 'react';
import { Heart, Award, Users, Clock } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'Fresh Ingredients',
      description: 'We source our ingredients locally, supporting Ethiopian farmers and ensuring the freshest flavors in every bite.'
    },
    {
      icon: Award,
      title: 'Authentic Recipes',
      description: 'Our recipes blend traditional techniques with modern culinary innovation to create unique and memorable dishes.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Roha Restaurant is more than a dining place - we\'re a gathering spot that brings the community together.'
    },
    {
      icon: Clock,
      title: 'Made to Order',
      description: 'Every pizza and burger is prepared fresh when you order, ensuring quality and taste in every meal.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-4xl md:text-5xl text-gray-800 mb-6">
              Our Story
            </h2>
            <p className="font-merriweather text-xl text-gray-600 max-w-3xl mx-auto">
              Founded with a passion for bringing bold flavors and honest ingredients to Addis Ababa, 
              Roha Restaurant has become a beloved destination for food lovers across the city.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Story Content */}
            <div className="space-y-6">
              <h3 className="font-poppins font-semibold text-2xl text-gray-800 mb-4">
                From Humble Beginnings to Community Favorite
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                What started as a small family dream in 2018 has grown into one of Addis Ababa's 
                most cherished restaurants. Our founder, inspired by travels across Italy and America, 
                wanted to bring authentic pizza and burger experiences to Ethiopia while incorporating 
                local flavors and ingredients.
              </p>
              
              <p className="text-gray-600 leading-relaxed">
                Today, we're proud to serve over 500 happy customers weekly, using recipes that 
                have been perfected over years of dedication to quality and taste. Every sauce is 
                made in-house, every dough is hand-tossed, and every burger is crafted with care.
              </p>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
                <p className="font-merriweather italic text-gray-700 text-lg">
                  "Our mission is simple: serve food that brings people together, 
                  using ingredients that honor our land and traditions."
                </p>
                <p className="text-gray-600 mt-2 font-semibold">- Roha Restaurant Team</p>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Restaurant interior"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center group"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 transition-colors duration-300">
                  <value.icon className="text-red-600 group-hover:text-white transition-colors duration-300" size={24} />
                </div>
                <h4 className="font-poppins font-semibold text-lg text-gray-800 mb-3">
                  {value.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-20 bg-red-600 rounded-lg p-8 text-white text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="font-poppins font-bold text-3xl mb-2">2500+</h4>
                <p className="text-red-100">Happy Customers</p>
              </div>
              <div>
                <h4 className="font-poppins font-bold text-3xl mb-2">50+</h4>
                <p className="text-red-100">Menu Items</p>
              </div>
              <div>
                <h4 className="font-poppins font-bold text-3xl mb-2">5</h4>
                <p className="text-red-100">Years of Excellence</p>
              </div>
              <div>
                <h4 className="font-poppins font-bold text-3xl mb-2">4.9</h4>
                <p className="text-red-100">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;