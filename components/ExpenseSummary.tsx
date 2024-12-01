import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Expense } from '../types/expense';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

export function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">Total: ₹{totalExpenses.toFixed(2)}</p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">By Category:</h3>
          {Object.entries(expensesByCategory).map(([category, amount]) => (
            <p key={category}>
              {category}: ₹{amount.toFixed(2)}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

