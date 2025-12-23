import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceData {
    title: React.ReactNode;
    shortDescription: React.ReactNode;
    longDescription: string;
}

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: ServiceData | null;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service }) => {
    return (
        <AnimatePresence>
            {isOpen && service && (
                <>
                    {/* Backdrop with a lighter touch */}
                    <motion.div
                        className="fixed inset-0 bg-gray-50/20 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <motion.div
                            className="relative w-full max-w-4xl max-h-[85vh] rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col bg-white/90 backdrop-blur-2xl border border-white/50"
                            initial={{ y: 60, opacity: 0, scale: 0.98 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                scale: 1,
                                transition: {
                                    type: "spring",
                                    damping: 30,
                                    stiffness: 350
                                }
                            }}
                            exit={{
                                y: 40,
                                opacity: 0,
                                scale: 0.98,
                                transition: { duration: 0.2 }
                            }}
                        >

                            {/* Aurora Gradient Blob Background (Subtle) */}
                            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-pink-100/40 rounded-full blur-3xl pointer-events-none mix-blend-multiply opacity-60 animate-blob" />
                            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-emerald-100/40 via-teal-100/40 to-cyan-100/40 rounded-full blur-3xl pointer-events-none mix-blend-multiply opacity-60 animate-blob animation-delay-2000" />

                            {/* Sticky Header with Close Button */}
                            <div className="absolute top-0 right-0 p-6 z-20">
                                <button
                                    onClick={onClose}
                                    className="bg-black/5 hover:bg-black/10 text-gray-900 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 backdrop-blur-sm group"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-90 transition-transform duration-300">
                                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            {/* Scrollable Content Area */}
                            <div className="overflow-y-auto custom-scrollbar flex-1 p-8 md:p-16 relative z-10">
                                <div className="max-w-3xl mx-auto space-y-12">

                                    {/* Header Section */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-px w-8 bg-black"></div>
                                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-black">
                                                Service Detail
                                            </span>
                                        </div>
                                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight text-gray-900">
                                            {service.title}
                                        </h2>
                                    </motion.div>

                                    {/* Core Description */}
                                    <motion.div
                                        className="space-y-8"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.35, duration: 0.5 }}
                                    >
                                        <h3 className="text-xl md:text-2xl font-medium leading-relaxed text-gray-800">
                                            {service.shortDescription}
                                        </h3>

                                        <div className="text-gray-600 leading-loose text-base md:text-lg font-light space-y-6 text-justify">
                                            <p>{service.longDescription}</p>

                                            <p>
                                                私たちは「データ」と「感性」という一見相反する要素をシームレスに統合します。
                                                数値が示す客観的な事実（Structure）と、人の心を動かす予測不可能な揺らぎ（Fluidity）。
                                                この両方を高次元で扱うことで、他社には模倣できない独自のアプローチを実現しています。
                                            </p>
                                            <p>
                                                プロジェクトは常にプロトタイピングから始まります。
                                                机上の空論ではなく、実際のフィードバックループを回しながら、
                                                最短距離で「正解」へと近づいていくアジャイルなプロセスをご体感ください。
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* CTA / Footer Area */}
                                    <motion.div
                                        className="pt-12 flex justify-start border-t border-black/5"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <button
                                            onClick={onClose}
                                            className="group relative px-6 py-3 font-bold text-sm tracking-widest text-black uppercase overflow-hidden"
                                        >
                                            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Back to Overview</span>
                                            <span className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
                                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black group-hover:bg-transparent transition-colors"></span>
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(0,0,0,0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(0,0,0,0.2);
                }
            `}</style>
                </>
            )}
        </AnimatePresence>
    );
};
