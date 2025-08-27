import React, { useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { useRef } from 'react';
import { Send, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Super fast, dynamic animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        duration: 0.3,
      },
    },
  };

  const slideVariants = {
    hidden: { opacity: 0, x: -40, rotateY: -15 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.4,
      },
    },
  };

  // Contact methods removed per request

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('submitting');

    try {
      const response = await fetch('https://formspree.io/f/mnnbnagl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setFormData({ name: '', email: '', company: '', message: '' });
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setSubmissionStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-6xl md:text-8xl lg:text-9xl mb-4 font-black text-black tracking-tighter"
          >
            CONTACT
            <motion.span 
              className="text-red-500"
              initial={{ opacity: 0, scale: 0, rotate: -90 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -90 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 600, damping: 20 }}
            >
              .
            </motion.span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0, skewX: -20 }}
            animate={isInView ? { scaleX: 1, skewX: 0 } : { scaleX: 0, skewX: -20 }}
            transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
            className="w-24 h-1 bg-red-500 mx-auto mb-6"
          />
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light"
          >
            AIを活用したマーケティングについて、お気軽にご相談ください。<br />
            御社の課題に寄り添い、最適な解決策をご提案いたします。
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={slideVariants}
          >

            {/* Company Information */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
              transition={{ delay: 1, type: "spring", stiffness: 300, damping: 25 }}
              className="mt-12 p-8 bg-gray-50 border border-black/10 text-black relative overflow-hidden"
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-red-500"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
              />
              <motion.h4 
                className="text-xl font-bold tracking-tight mb-4"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                会社情報
              </motion.h4>
              <div className="space-y-3 text-sm leading-relaxed">
                <div>
                  <span className="font-semibold">会社名</span>
                  <div>株式会社AIMA (AIMA Inc.)</div>
                </div>
                <div>
                  <span className="font-semibold">所在地</span>
                  <div>大阪府大阪市北区梅田一丁目2番2号　大阪駅前第2ビル2階5-6号室</div>
                </div>
                <div>
                  <span className="font-semibold">設立</span>
                  <div>2018年</div>
                </div>
                <div>
                  <span className="font-semibold">事業内容</span>
                  <div>AIマーケティング、AI関連メディア運営</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: 15 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 40, rotateY: 15 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 400, damping: 25 }}
            className="relative"
          >
            {/* Form Container */}
            <motion.div
              className="bg-gray-50 p-8 relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Decorative Elements */}
              <motion.div
                className="absolute top-0 right-0 w-24 h-24 bg-red-500"
                initial={{ scale: 0, rotate: 45 }}
                whileInView={{ scale: 1, rotate: 45 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 400, damping: 25 }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-16 h-16 bg-black"
                initial={{ scale: 0, rotate: -45 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1, type: "spring", stiffness: 400, damping: 25 }}
              />
              <AnimatePresence mode="wait">
              {submissionStatus === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-10 flex flex-col items-center"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-black mb-2">送信完了</h3>
                  <p className="text-gray-600">お問い合わせいただきありがとうございます。<br/>内容を確認の上、担当者よりご連絡いたします。</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6 relative z-10"
                  exit={{ opacity: 0, x: -20 }}
                >
                  <motion.div
                    className="flex items-center mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.6 }}
                    >
                      <MessageSquare className="h-6 w-6 text-red-500 mr-3" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-black tracking-tight">
                      お問い合わせフォーム
                    </h3>
                  </motion.div>

                  {[
                    { name: 'name', label: 'お名前 *', type: 'text', placeholder: '山田太郎', required: true },
                    { name: 'email', label: 'メールアドレス *', type: 'email', placeholder: 'contact@example.com', required: true },
                    { name: 'company', label: '会社名', type: 'text', placeholder: '株式会社○○○', required: false }
                  ].map((field, index) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <label className="block text-sm font-medium text-black mb-2 tracking-wide">
                        {field.label}
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <Input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name as keyof typeof formData]}
                          onChange={handleInputChange}
                          className="w-full bg-white border-2 border-black/10 focus:border-red-500 rounded-none text-black placeholder-gray-400 transition-all duration-300"
                          placeholder={field.placeholder}
                          required={field.required}
                          disabled={submissionStatus === 'submitting'}
                        />
                      </motion.div>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ delay: 1.1, type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <label className="block text-sm font-medium text-black mb-2 tracking-wide">
                      お問い合わせ内容 *
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full bg-white border-2 border-black/10 focus:border-red-500 rounded-none text-black placeholder-gray-400 resize-none transition-all duration-300"
                        placeholder="AIマーケティングについてのご相談内容をお聞かせください..."
                        required
                        disabled={submissionStatus === 'submitting'}
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ delay: 1.3, type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-black hover:bg-red-500 text-white px-8 py-4 rounded-none border-0 group relative overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={submissionStatus === 'submitting'}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600"
                        initial={{ x: '-100%', skewX: -20 }}
                        whileHover={{ x: 0, skewX: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                      <motion.span
                        className="relative z-10 flex items-center justify-center gap-3 font-bold tracking-wider"
                        whileHover={{ x: submissionStatus !== 'submitting' ? 5 : 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {submissionStatus === 'submitting' ? '送信中...' : '送信する'}
                        {submissionStatus !== 'submitting' && (
                          <motion.div
                            whileHover={{ rotate: 45, scale: 1.2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          >
                            <Send className="h-5 w-5" />
                          </motion.div>
                        )}
                      </motion.span>
                    </Button>
                    {submissionStatus === 'error' && (
                       <p className="text-red-500 text-sm mt-4 text-center flex items-center justify-center">
                         <AlertTriangle className="h-4 w-4 mr-2" />
                         送信に失敗しました。時間をおいて再度お試しください。
                       </p>
                    )}
                  </motion.div>
                </motion.form>
              )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
