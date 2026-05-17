import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTestimonials } from '../services/api';

const Testimonials = () => {
  const [testimonialsList] = useState(() => getTestimonials());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsList.length);
  }, [testimonialsList.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  if (!testimonialsList.length) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-[#04C244]/10 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            Client <span className="text-gradient">Testimonials</span>
          </motion.h2>
          <p className="text-slate-400">Hear what our satisfied clients have to say about us.</p>
        </div>

        <div className="max-w-4xl mx-auto relative group">
          <div 
            className="relative h-[400px] md:h-[300px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="glass-card p-8 md:p-12 h-full flex flex-col justify-center relative"
              >
                <Quote size={60} className="absolute top-8 right-8 text-[#04C244]/10" />
                
                <div className="flex gap-1 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={20} 
                      className={star <= (testimonialsList[currentIndex].rating || 5) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-700'} 
                    />
                  ))}
                </div>

                <p className="text-xl md:text-2xl text-slate-300 italic mb-10 leading-relaxed">
                  "{testimonialsList[currentIndex].review || testimonialsList[currentIndex].text}"
                </p>

                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#04C244] blur-lg opacity-20 rounded-full"></div>
                    <img 
                      src={testimonialsList[currentIndex].img || testimonialsList[currentIndex].image} 
                      alt={testimonialsList[currentIndex].name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#04C244]/30 relative z-10" 
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{testimonialsList[currentIndex].name}</h4>
                    <p className="text-slate-400">{testimonialsList[currentIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-6 mt-12">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:border-[#04C244] transition-all text-slate-400 hover:text-white"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex gap-3">
              {testimonialsList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-10 bg-[#04C244]' : 'w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:border-[#04C244] transition-all text-slate-400 hover:text-white"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
