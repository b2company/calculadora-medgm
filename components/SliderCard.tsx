'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SliderCardProps {
  label: string;
  sublabel?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  unit?: string;
}

export default function SliderCard({
  label,
  sublabel,
  value,
  min,
  max,
  step,
  onChange,
  format,
  unit,
}: SliderCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;

  // Animação suave do valor numérico
  const springValue = useSpring(value, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const displayValue = format ? format(value) : value;

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-sm font-medium text-dark-gray uppercase tracking-wide">
            {label}
          </h3>
          {sublabel && (
            <p className="text-xs text-gray-500 mt-1">{sublabel}</p>
          )}
        </div>
        <div className="text-right">
          <motion.span
            className="text-2xl font-semibold text-black inline-block"
            animate={{
              scale: isDragging ? 1.05 : 1,
              color: isDragging ? '#D6B991' : '#151515'
            }}
            transition={{ duration: 0.2 }}
          >
            {displayValue}
          </motion.span>
          {unit && (
            <span className="text-sm text-gray-500 ml-1">{unit}</span>
          )}
        </div>
      </div>

      <div className="relative pt-1 pb-1">
        {/* Background track */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gold to-[#C5A87E]"
            style={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Range input (invisível mas funcional) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-10"
          style={{ margin: 0 }}
        />

        {/* Thumb decorativo */}
        <motion.div
          className="absolute top-1/2 w-5 h-5 bg-gold rounded-full shadow-lg border-2 border-white pointer-events-none"
          style={{
            left: `${percentage}%`,
            x: '-50%',
            y: '-50%',
          }}
          animate={{
            scale: isDragging ? 1.3 : 1,
            boxShadow: isDragging
              ? '0 0 0 8px rgba(214, 185, 145, 0.2)'
              : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>{format ? format(min) : min}</span>
        <motion.span
          className="text-gray-500"
          animate={{
            opacity: isDragging ? 1 : 0.6,
            color: isDragging ? '#D6B991' : '#6B7280'
          }}
        >
          {isDragging ? 'Arrastando...' : '↔ Arraste para simular'}
        </motion.span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}
