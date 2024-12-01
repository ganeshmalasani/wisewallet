'use client'

import { ExpenseForm } from '../components/ExpenseForm'
import { ExpenseList } from '../components/ExpenseList'
import { ExpenseSummary } from '../components/ExpenseSummary'
import { useExpenses } from '../hooks/useExpenses'
import { MonthlyExpensesChart } from '../components/MonthlyExpensesChart'
import { CategoryExpensesChart } from '../components/CategoryExpensesChart'
import { ChatBot } from '../components/ChatBot'

export default function ExpenseManager() {
  const { expenses, addExpense, deleteExpense } = useExpenses();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Wise Wallet - Expense Tracker</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add New Expense</h2>
          <ExpenseForm onAddExpense={addExpense} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Expense Summary</h2>
          <ExpenseSummary expenses={expenses} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <MonthlyExpensesChart expenses={expenses} />
        <CategoryExpensesChart expenses={expenses} />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Expense List</h2>
        <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
      </div>
      <ChatBot />
    </div>
  )
}

