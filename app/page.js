'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setExpenses(data);
    }
    setLoading(false);
  }

  async function handleAddExpense(e) {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    setSubmitting(true);
    setError('');

    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          title: title.trim(),
          amount: parseFloat(amount),
          category,
          date,
        },
      ])
      .select();

    if (error) {
      setError(error.message);
    } else {
      setExpenses((prev) => [data[0], ...prev]);
      setTitle('');
      setAmount('');
      setCategory(CATEGORIES[0]);
      setDate(new Date().toISOString().slice(0, 10));
    }
    setSubmitting(false);
  }

  async function handleDelete(id) {
    const previous = expenses;
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));

    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) {
      setError(error.message);
      setExpenses(previous); // revert on failure
    }
  }

  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">Expense Tracker</h1>
      <p className="text-gray-500 mb-8">Keep tabs on your daily spending.</p>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Add expense form */}
      <form
        onSubmit={handleAddExpense}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Expense</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Groceries"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors"
        >
          {submitting ? 'Adding...' : 'Add Expense'}
        </button>
      </form>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 flex items-center justify-between">
        <span className="text-gray-600 font-medium">Total Spent</span>
        <span className="text-2xl font-bold text-gray-800">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Expense list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 px-6 pt-6">
          Expenses
        </h2>

        {loading ? (
          <p className="text-gray-500 px-6 py-6">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-500 px-6 py-6">No expenses yet. Add your first one above.</p>
        ) : (
          <ul className="divide-y divide-gray-100 mt-2">
            {expenses.map((exp) => (
              <li
                key={exp.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="font-medium text-gray-800">{exp.title}</p>
                  <p className="text-xs text-gray-500">
                    {exp.category} &middot;{' '}
                    {new Date(exp.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-800">
                    ${Number(exp.amount).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
