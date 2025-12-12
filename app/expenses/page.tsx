"use client";

import { useEffect, useMemo, useState } from "react";

type Person = {
  id: string;
  name: string;
};

type Expense = {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // person id
  splitBetween: string[]; // person ids
};

const STORAGE_KEY = "japan-trip-expenses-v1";

export default function ExpensesPage() {
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "Abi" },
    { id: "2", name: "Friend 1" },
    { id: "3", name: "Friend 2" },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [newName, setNewName] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState<string>("1");
  const [splitBetween, setSplitBetween] = useState<string[]>(["1", "2", "3"]);

  // Load from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.people) setPeople(parsed.people);
      if (parsed.expenses) setExpenses(parsed.expenses);
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ people, expenses })
    );
  }, [people, expenses]);

  function addPerson() {
    if (!newName.trim()) return;
    setPeople((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: newName.trim() },
    ]);
    setSplitBetween((prev) => [...prev, people[0]?.id ?? ""]);
    setNewName("");
  }

  function toggleSplit(personId: string) {
    setSplitBetween((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId]
    );
  }

  function addExpense() {
    const amt = parseFloat(amount);
    if (!desc.trim() || isNaN(amt) || amt <= 0 || !paidBy || splitBetween.length === 0) {
      return;
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      description: desc.trim(),
      amount: amt,
      paidBy,
      splitBetween: [...splitBetween],
    };

    setExpenses((prev) => [...prev, expense]);
    setDesc("");
    setAmount("");
  }

  // Compute balances: positive means they should receive money, negative means they owe
  const balances = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of people) {
      map[p.id] = 0;
    }

    for (const e of expenses) {
      const share = e.amount / e.splitBetween.length;

      // payer pays full amount
      map[e.paidBy] += e.amount;

      // everyone who is included owes their share
      for (const personId of e.splitBetween) {
        map[personId] -= share;
      }
    }

    return map;
  }, [people, expenses]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl space-y-8">
        <header>
          <h1 className="text-3xl font-semibold mb-2">Japan Trip Expenses 💸</h1>
          <p className="text-sm text-slate-300">
            Simple Splitwise-style tracker. Everything stays in your browser.
          </p>
        </header>

        {/* People section */}
        <section className="border border-slate-800 rounded-xl p-4 space-y-3">
          <h2 className="text-lg font-medium">People</h2>
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Add name"
              className="flex-1 rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
            />
            <button
              onClick={addPerson}
              className="rounded-md bg-emerald-600 text-sm px-3 py-1 hover:bg-emerald-500"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {people.map((p) => (
              <span
                key={p.id}
                className="px-2 py-1 rounded-full bg-slate-800 border border-slate-600"
              >
                {p.name}
              </span>
            ))}
          </div>
        </section>

        {/* Add expense */}
        <section className="border border-slate-800 rounded-xl p-4 space-y-3">
          <h2 className="text-lg font-medium">Add expense</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Description (e.g. Ramen in Shinjuku)"
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
              />
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
              />
              <label className="text-xs text-slate-300">Paid by</label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
              >
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-300">Split between</span>
              <div className="flex flex-wrap gap-2 text-sm">
                {people.map((p) => {
                  const selected = splitBetween.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleSplit(p.id)}
                      className={`px-2 py-1 rounded-full border ${
                        selected
                          ? "bg-emerald-600 border-emerald-500"
                          : "bg-slate-900 border-slate-700"
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={addExpense}
                className="mt-2 rounded-md bg-indigo-600 text-sm px-3 py-1 hover:bg-indigo-500"
              >
                Add expense
              </button>
            </div>
          </div>
        </section>

        {/* List of expenses */}
        <section className="border border-slate-800 rounded-xl p-4 space-y-2">
          <h2 className="text-lg font-medium">Expenses</h2>
          {expenses.length === 0 && (
            <p className="text-sm text-slate-400">No expenses yet.</p>
          )}
          <ul className="space-y-2 text-sm">
            {expenses.map((e) => {
              const payer = people.find((p) => p.id === e.paidBy)?.name ?? "Unknown";
              const splitNames = e.splitBetween
                .map((id) => people.find((p) => p.id === id)?.name ?? "Unknown")
                .join(", ");
              return (
                <li
                  key={e.id}
                  className="flex justify-between border border-slate-800 rounded-md px-3 py-1"
                >
                  <div>
                    <div className="font-medium">{e.description}</div>
                    <div className="text-xs text-slate-400">
                      {payer} paid ¥{e.amount.toFixed(0)} split between {splitNames}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Balances */}
        <section className="border border-slate-800 rounded-xl p-4 space-y-2">
          <h2 className="text-lg font-medium">Who owes what</h2>
          <ul className="space-y-1 text-sm">
            {people.map((p) => {
              const bal = balances[p.id] ?? 0;
              if (Math.abs(bal) < 0.01) {
                return (
                  <li key={p.id} className="text-slate-400">
                    {p.name} is settled up.
                  </li>
                );
              }
              if (bal > 0) {
                return (
                  <li key={p.id} className="text-emerald-400">
                    {p.name} should receive about ¥{bal.toFixed(0)}.
                  </li>
                );
              }
              return (
                <li key={p.id} className="text-rose-400">
                  {p.name} owes about ¥{Math.abs(bal).toFixed(0)}.
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
