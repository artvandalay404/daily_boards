import { motion } from 'framer-motion'

export default function RevealButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="w-full py-4 rounded-full font-bold text-base transition-shadow mb-6"
      style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dim) 100%)',
        color: 'var(--on-primary)',
        boxShadow: '0 4px 20px -4px var(--primary)',
      }}
    >
      Reveal Answer
    </motion.button>
  )
}
