'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyCPLt6MNgpmvVRAnNSPl-dIeWt_99Tcsus")
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

export function AIInvestmentAdvisor() {
  const [advice, setAdvice] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchAdvice = async () => {
    setIsLoading(true)
    try {
      // Fetch expense data from the API
      const expenseResponse = await fetch('/api/expenses')
      const expenses = await expenseResponse.json()

      // Prepare the prompt for the Gemini API
      const llm_prompt = `
        You are an investment expert. Your job is to provide investment and savings suggestions based on these spends:

        ${JSON.stringify(expenses)}

        You have no other info, just based on these you have to provide suggestions. In India.
      `

      // Generate content using the Gemini API
      const result = await model.generateContent(llm_prompt)
      const llm_response = result.response.text()

      setAdvice(llm_response)
    } catch (error) {
      console.error('Error fetching investment advice:', error)
      setAdvice('Sorry, there was an error generating investment advice. Please try again later.')
    }
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Investment Advisor</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={fetchAdvice} disabled={isLoading}>
          {isLoading ? 'Generating Advice...' : 'Get Investment Advice'}
        </Button>
        {advice && (
          <div className="mt-4 p-4 bg-secondary rounded-lg">
            <h3 className="font-semibold mb-2">Investment Advice:</h3>
            <p className="whitespace-pre-wrap">{advice}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

