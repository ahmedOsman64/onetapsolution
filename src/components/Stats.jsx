import { useState } from 'react';
import { motion } from 'framer-motion';
import { getStats } from '../services/api';

const Stats = () => {
  const [statsList] = useState(() => {
    const s = getStats();
    return [
      { number: s.projects, suffix: '+', label: 'Projects Done' },
      { number: s.clients, suffix: '+', label: 'Happy Clients' },
      { number: s.services, suffix: '+', label: 'Services Provided' },
      { number: s.satisfaction, suffix: '%', label: 'Satisfaction' }
    ];
  });
  return (
    <section className="py-16 bg-black/50 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsList.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.number}<span className="text-[#04C244]">{stat.suffix}</span>
              </div>
              <p className="text-slate-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
