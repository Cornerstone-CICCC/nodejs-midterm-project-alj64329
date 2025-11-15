import type { Transaction } from "./util"

  //get recent transaction
  export const getRecentTransaction = async()=>{
    const res = await fetch(`http://localhost:3500/transactions/recent`,{
      method:"Get"
    })

    if(!res.ok){
      throw new Error(`Failed to get transaction`)
    }

    const data = await res.json()

    return data
  }

  //get transaction count
  export const numRecentTransaction = (data:Transaction[])=>{
    return data.length
  }

  //get spending of this month
  export const recentSpending = (data:Transaction[])=>{
    return data.filter(t=>t.type === "expense")
    .reduce((acc, curr)=> acc+Number(curr.amount),0)
  }
  //get income of this month
  export const recentIncome = (data:Transaction[])=>{
    return data.filter(t=>t.type === "income")
    .reduce((acc, curr)=> acc+Number(curr.amount),0)
  }
  //get balance of this month
  export const recentBalance = (data:Transaction[])=>{
    const spending = recentSpending(data)
    const income = recentIncome(data)
    return income-spending
  }