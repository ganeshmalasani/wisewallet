import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCPLt6MNgpmvVRAnNSPl-dIeWt_99Tcsus");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });



import sqlite3 from 'sqlite3';

// Open the SQLite database
const db2 = new sqlite3.Database('./expenses.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database');
  }
});

let select_all_query = `SELECT * FROM expenses;`

let result2=''

db2.all(select_all_query, [], (err, rows) => {
    if (err) {
      console.error('Error retrieving expenses:', err.message);
    } else {
     result2=rows
    }
  });



let llm_prompt = `
you are an investment expert. Your job is to provide investment and savings suggestions based on these spends:

    : ${result2}

    you have no other info, just based on these you have to provide suggestions. in India

`;

const result = await model.generateContent(llm_prompt);
let llm_response=result.response.text()
console.log(llm_response)




