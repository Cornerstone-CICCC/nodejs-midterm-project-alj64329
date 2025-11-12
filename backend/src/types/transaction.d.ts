export type TransactionType= "expense" | "income"

export interface Transaction{
    id:string,
    userId: string,
    type: TransactionType,
    name: string,
    category:ExpenseType| null,
    amount: number,
    date: Date
}

export type ExpenseType = "housing" | "transportation" | "entertainment" |"insurance"|"groceries"|"phone"|"clothing"|"others"