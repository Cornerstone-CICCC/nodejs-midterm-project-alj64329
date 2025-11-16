import type { Transaction } from "./util"

export const renderHighlight= async()=>{
    const data = await getRecentTransaction();
    const count = numRecentTransaction(data);
    const balance = recentBalance(data);
    const highlightContainer =document.querySelector(".highlight-container")
    if(!highlightContainer) return
    highlightContainer.innerHTML=""

    renderRecentTransaction(count)
    renderRecentBalance(balance)
}

  //get recent transaction
  export const getRecentTransaction = async()=>{
    const res = await fetch(`http://localhost:3500/transactions/recent`,{
      method:"Get",
      credentials:"include"
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

  export const renderRecentTransaction =(count:number)=>{
    const div = document.createElement('div')
    div.className="highlight-border"

    div.innerHTML=`
    <div class="fw-bold">Recent Transaction</div>
    <div class="counter-text">${count}</div>
    `
    document.querySelector(".highlight-container")?.append(div)
  }

  export const renderRecentBalance = (balance:number)=>{
    const div = document.createElement('div')
    div.className="highlight-border"
    div.innerHTML =`
    <div class="fw-bold">Recent Balance</div>
    <div class="balance-text">$ ${balance.toFixed(2)}</div>
    `
    document.querySelector(".highlight-container")?.append(div)
  }