import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: number;
  text: string;
  done: boolean;
  createdAt: number;
}

type FilterKey = 'all' | 'active' | 'done';

const suggestionSeeds = [
  '今日のタスクを3つ書き出す',
  '次のミーティングで相談したいことをメモ',
  'AI活用のアイデアを1つまとめる',
];

const filterLabels: Record<FilterKey, string> = {
  all: 'すべて',
  active: '進行中',
  done: '完了',
};

export function PlaygroundSection() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  const { completedCount, completionRate, filteredTasks } = useMemo(() => {
    const done = tasks.filter((task) => task.done).length;
    const filtered = tasks.filter((task) => {
      if (filter === 'all') return true;
      return filter === 'done' ? task.done : !task.done;
    });

    return {
      completedCount: done,
      completionRate: tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100),
      filteredTasks: filtered,
    };
  }, [filter, tasks]);

  const remainingCount = tasks.length - completedCount;

  const handleAddTask = (value?: string) => {
    const text = (value ?? input).trim();
    if (!text) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        done: false,
        createdAt: Date.now(),
      },
    ]);
    setInput('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddTask();
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  };

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <section
      id="playground"
      className="relative py-32 bg-slate-950 text-white overflow-hidden"
      aria-labelledby="playground-title"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1f2937,_#020617)] opacity-90"
      />
      <motion.div
        className="absolute -top-16 -right-32 h-72 w-72 rounded-full bg-red-500/30 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr,1.1fr] items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold tracking-widest uppercase text-rose-200/80 bg-rose-500/10 rounded-full border border-rose-500/30">
              Mini App Lab
            </span>
            <h2 id="playground-title" className="text-3xl md:text-4xl font-bold leading-tight">
              <span className="text-rose-200">試してみよう！</span>
              <br />
              AIMAのチームで使える簡易タスクアプリ
            </h2>
            <p className="text-base md:text-lg text-slate-200 leading-relaxed">
              すばやくアイデアを書き出したり、小さなTODOをまとめたりできるミニアプリです。入力して追加、タップで完了。シンプルな体験で、忙しい日でもやるべきことを見える化しましょう。
            </p>
            <div className="grid sm:grid-cols-2 gap-6 text-sm text-slate-200/90">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-2"
              >
                <p className="text-xs uppercase tracking-widest text-slate-300/80">使い方</p>
                <ul className="space-y-2 leading-relaxed">
                  <li>タスクを入力して追加ボタンをクリック</li>
                  <li>完了したらタスク名をタップしてチェック</li>
                  <li>不要なタスクは右端の削除で整理</li>
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-2"
              >
                <p className="text-xs uppercase tracking-widest text-slate-300/80">シーン例</p>
                <ul className="space-y-2 leading-relaxed">
                  <li>朝会の前に共有したいトピックを整理</li>
                  <li>記事制作のタスクを簡単にメモ</li>
                  <li>商談準備のチェックリストを素早く作成</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl shadow-red-500/10"
          >
            <div className="border-b border-white/10 px-8 py-6">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-200/70">タスク数</p>
                  <p className="text-2xl font-bold text-white">{tasks.length}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-200/70">完了済み</p>
                  <p className="text-2xl font-bold text-emerald-300">{completedCount}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-200/70">残り</p>
                  <p className="text-2xl font-bold text-amber-200">{Math.max(remainingCount, 0)}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs uppercase tracking-widest text-slate-200/70">達成率</p>
                  <p className="text-2xl font-bold text-rose-200">{completionRate}%</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm font-medium text-slate-100/90" htmlFor="task-input">
                  タスクを追加
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="task-input"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="例：レポートのドラフトを確認"
                    className="flex-1 rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    aria-label="タスクを入力"
                  />
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center rounded-2xl bg-rose-500 px-5 py-3 font-semibold tracking-wide text-white shadow-lg shadow-rose-500/30 transition-colors hover:bg-rose-400"
                    aria-label="タスクを追加"
                  >
                    追加
                  </motion.button>
                </div>
              </form>

              <div className="flex flex-wrap gap-2 text-xs text-slate-100/80">
                {suggestionSeeds.map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    type="button"
                    onClick={() => handleAddTask(suggestion)}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 transition hover:border-rose-200/60 hover:bg-rose-500/20"
                    aria-label={`${suggestion} を追加`}
                  >
                    + {suggestion}
                  </motion.button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {(Object.keys(filterLabels) as FilterKey[]).map((key) => {
                  const isActive = filter === key;
                  return (
                    <motion.button
                      key={key}
                      type="button"
                      onClick={() => setFilter(key)}
                      whileTap={{ scale: 0.95 }}
                      className={`rounded-full px-3 py-1.5 font-medium transition ${
                        isActive
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                          : 'bg-white/5 text-slate-100/70 hover:bg-white/10'
                      }`}
                      aria-pressed={isActive}
                    >
                      {filterLabels[key]}
                    </motion.button>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40">
                <AnimatePresence initial={false}>
                  {filteredTasks.length > 0 ? (
                    <motion.ul
                      key="task-list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="divide-y divide-white/5"
                    >
                      {filteredTasks.map((task) => (
                        <motion.li
                          key={task.id}
                          layout
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                          className="flex items-center gap-4 px-5 py-4"
                        >
                          <motion.button
                            type="button"
                            onClick={() => toggleTask(task.id)}
                            whileTap={{ scale: 0.9 }}
                            className={`relative flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                              task.done
                                ? 'border-emerald-300 bg-emerald-300/20'
                                : 'border-white/40 hover:border-white/70'
                            }`}
                            aria-pressed={task.done}
                            aria-label={`タスク「${task.text}」を${task.done ? '未完了に戻す' : '完了にする'}`}
                          >
                            {task.done && (
                              <motion.span
                                layoutId="checkmark"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="block h-2 w-2 rounded-full bg-emerald-200"
                              />
                            )}
                          </motion.button>
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium transition ${
                                task.done ? 'text-slate-400 line-through' : 'text-white'
                              }`}
                            >
                              {task.text}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              作成: {new Date(task.createdAt).toLocaleString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <motion.button
                            type="button"
                            onClick={() => removeTask(task.id)}
                            whileTap={{ scale: 0.9 }}
                            className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-200/70 transition hover:bg-red-500/30 hover:text-white"
                            aria-label={`タスク「${task.text}」を削除`}
                          >
                            削除
                          </motion.button>
                        </motion.li>
                      ))}
                    </motion.ul>
                  ) : (
                    <motion.div
                      key="empty-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-6 py-10 text-center text-sm text-slate-300"
                    >
                      <p className="font-medium text-slate-200">まだタスクがありません。</p>
                      <p className="mt-2 text-slate-400">
                        右上のテンプレートや自由入力で、まずは1件追加してみましょう。
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
