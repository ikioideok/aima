import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RecruitPosition } from '../types';

interface RecruitModalProps {
    isOpen: boolean;
    onClose: () => void;
    position: RecruitPosition | null;
    positions?: RecruitPosition[];
    onSelect?: (position: RecruitPosition) => void;
}

export const RecruitModal: React.FC<RecruitModalProps> = ({
    isOpen,
    onClose,
    position,
    positions,
    onSelect
}) => {
    return (
        <AnimatePresence>
            {isOpen && position && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-gray-50/20 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={onClose}
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <motion.div
                            className="relative w-full max-w-4xl max-h-[85vh] rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col bg-white/90 backdrop-blur-2xl border border-white/50"
                            initial={{ y: 60, opacity: 0, scale: 0.98 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                scale: 1,
                                transition: { type: "spring", damping: 30, stiffness: 350 }
                            }}
                            exit={{ y: 40, opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                        >
                            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-pink-100/40 rounded-full blur-3xl pointer-events-none mix-blend-multiply opacity-60 animate-blob" />
                            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-emerald-100/40 via-teal-100/40 to-cyan-100/40 rounded-full blur-3xl pointer-events-none mix-blend-multiply opacity-60 animate-blob animation-delay-2000" />

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

                            <div className="overflow-y-auto custom-scrollbar flex-1 p-8 md:p-16 relative z-10">
                                <div className="max-w-3xl mx-auto space-y-12">
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-px w-8 bg-black"></div>
                                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-black">
                                                募集要項
                                            </span>
                                        </div>
                                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight text-gray-900">
                                            {position.title}
                                        </h2>
                                        <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mt-4">
                                            {position.type}
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        className="space-y-8"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.35, duration: 0.5 }}
                                    >
                                        <h3 className="text-xl md:text-2xl font-medium leading-relaxed text-gray-800">
                                            {position.summary}
                                        </h3>

                                        <div className="text-gray-600 leading-loose text-base md:text-lg font-light space-y-6 text-justify">
                                            <p>{position.details.overview}</p>

                                            {positions && positions.length > 1 && onSelect && (
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="h-px w-6 bg-black/30"></div>
                                                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/70">
                                                            職種
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {positions.map((item) => (
                                                            <button
                                                                key={item.title}
                                                                type="button"
                                                                onClick={() => onSelect(item)}
                                                                className={`text-xs uppercase tracking-[0.2em] border px-3 py-1 rounded-full transition ${
                                                                    item.title === position.title
                                                                        ? 'border-black text-black'
                                                                        : 'border-black/10 text-gray-500 hover:border-black/30'
                                                                }`}
                                                            >
                                                                {item.title}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="h-px w-6 bg-black/30"></div>
                                                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/70">
                                                        仕事内容
                                                    </span>
                                                </div>
                                                <ul className="space-y-2">
                                                    {position.details.responsibilities.map((item) => (
                                                        <li key={item}>- {item}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="h-px w-6 bg-black/30"></div>
                                                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/70">
                                                        必須条件
                                                    </span>
                                                </div>
                                                <ul className="space-y-2">
                                                    {position.details.requirements.map((item) => (
                                                        <li key={item}>- {item}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {position.details.niceToHave && position.details.niceToHave.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="h-px w-6 bg-black/30"></div>
                                                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/70">
                                                            歓迎条件
                                                        </span>
                                                    </div>
                                                    <ul className="space-y-2">
                                                        {position.details.niceToHave.map((item) => (
                                                            <li key={item}>- {item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {position.details.stack && position.details.stack.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="h-px w-6 bg-black/30"></div>
                                                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/70">
                                                            使用ツール
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {position.details.stack.map((item) => (
                                                            <span
                                                                key={item}
                                                                className="text-xs uppercase tracking-[0.2em] border border-black/10 px-3 py-1 rounded-full text-gray-600"
                                                            >
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="h-px w-6 bg-black/30"></div>
                                                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/70">
                                                            勤務地
                                                        </span>
                                                    </div>
                                                    <p>{position.details.location}</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="h-px w-6 bg-black/30"></div>
                                                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/70">
                                                            勤務時間
                                                        </span>
                                                    </div>
                                                    <p>{position.details.hours}</p>
                                                </div>
                                            </div>

                                            {(position.details.salary || position.details.benefits) && (
                                                <div className="grid gap-6 md:grid-cols-2">
                                                    {position.details.salary && (
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <div className="h-px w-6 bg-black/30"></div>
                                                                <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/70">
                                                                    年収
                                                                </span>
                                                            </div>
                                                            <p>{position.details.salary}</p>
                                                        </div>
                                                    )}
                                                    {position.details.benefits && (
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <div className="h-px w-6 bg-black/30"></div>
                                                                <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/70">
                                                                    福利厚生
                                                                </span>
                                                            </div>
                                                            <ul className="space-y-2">
                                                                {position.details.benefits.map((item) => (
                                                                    <li key={item}>- {item}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="pt-12 flex justify-between border-t border-black/5"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <button
                                            onClick={onClose}
                                            className="group relative px-6 py-3 font-bold text-sm tracking-widest text-black uppercase overflow-hidden"
                                        >
                                            <span className="relative z-10 group-hover:text-white transition-colors duration-300">一覧に戻る</span>
                                            <span className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
                                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black group-hover:bg-transparent transition-colors"></span>
                                        </button>
                                        <a
                                            className="group relative px-6 py-3 font-bold text-sm tracking-widest text-black uppercase overflow-hidden"
                                            href="/#contact"
                                        >
                                            <span className="relative z-10 group-hover:text-white transition-colors duration-300">応募する</span>
                                            <span className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
                                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black group-hover:bg-transparent transition-colors"></span>
                                        </a>
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
            `}</style>
                </>
            )}
        </AnimatePresence>
    );
};
