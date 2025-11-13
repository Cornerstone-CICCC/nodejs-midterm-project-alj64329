  type TransactionType = "expense" | "income";
  export interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    name: string;
    category: ExpenseType | null;
    amount: number;
    date: string;
  }

  type ExpenseType =
    | "housing"
    | "transportation"
    | "entertainment"
    | "insurance"
    | "groceries"
    | "phone"
    | "clothing"
    | "others";
    
export const renderTransaction = async () => {
    try {
      const res = await fetch(`http://localhost:3500/transactions`, {
        credentials: "include", // include cookies
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        window.location.href = "/";
        return;
      }

      const tableBody = document.querySelector(".table-body") as HTMLDivElement;
      tableBody.innerHTML=""
      if (data.length === 0) {
        const container = document.createElement("div");
        container.style.padding = "1rem 0 0 0";
        container.innerText = "There is no transaction";
        tableBody.style.textAlign = "center";
        tableBody.appendChild(container);
      }
      const sorted = data.sort((a:Transaction,b:Transaction)=>new Date(b.date).getTime()-new Date(a.date).getTime())
      
      sorted.forEach((el: Transaction) => {
        const tr = document.createElement("tr");
        tr.className="position-relative"
        tr.innerHTML = `
        <td>${el.date}</td>
        <td>${el.name}</td>
        <td class=${el.type === "expense" ? "text-danger" : "text-success"}>
          ${el.type === "expense" ? "-" : "+"}$ ${el.amount}
          </td>
        <td><i class="fa-solid fa-ellipsis-vertical edit-btn"></i></td>
        <div class="position-absolute edit-box"> 
          <div class="view-btn text-success d-flex pb-2 gap-1">
          <i class="fa-solid fa-expand"></i>
          View
          </div>
          <div class="editpen-btn text-danger d-flex pb-2 gap-1">
          <i class="fa-solid fa-pen-to-square"></i>
          Edit
          </div>
          <div class="delete-btn text-primary d-flex gap-1">
          <i class="fa-solid fa-trash"></i>
          Delete
          </div>
        </div>
        `;
        tableBody.appendChild(tr);
        const box = tr.querySelector(".edit-box") as HTMLDivElement

        //view event
        tr.querySelector(".view-btn")?.addEventListener("click",async()=>{
          const data = (await getTransaction(el.id)) as Transaction
          renderViewModal(data)

        })
        //modify event
        tr.querySelector(".edit-btn")?.addEventListener("click",(e)=>{
          e.stopImmediatePropagation()
          box.classList.add("active")
        })

        //delete event
        tr.querySelector(".delete-btn")?.addEventListener("click",async()=>{
          const msg = "Are you sure you want to delete this transaction?"
          if(confirm(msg)=== true){
            await deleteTransaction(el.id)
            renderTransaction()
            return
          }
        })

        //update event
        tr.querySelector(".editpen-btn")?.addEventListener("click",async()=>{
          const item = {
            type:el.type,
            name:el.name,
            category:el.category,
            amount:el.amount,
            date:el.date
          }
          modalSet(el.id,item)
          document.querySelector(".modal-overlay")?.classList.add("active")

        })
        
      });
      //Click outside of edit-box will close edit box
      document.addEventListener('click', (e)=>{
          const target = e.target as HTMLElement
          if(!target.closest(".edit-box") && !target.closest(".edit-btn")){
            document.querySelectorAll(".edit-box").forEach((box) => box.classList.remove("active"));
          }
        })
    } catch (err) {
      console.error(err);
    }
  };

  //get transaction by id
  export const getTransaction = async(id:string)=>{
    const res = await fetch(`http://localhost:3500/transactions/${id}`,{
      method:"Get"
    })

    if(!res.ok){
      throw new Error(`Failed to get transaction`)
    }

    const data = await res.json()

    return data
  }
  //Delete transaction
  const deleteTransaction = async(id:string)=>{
    const res = await fetch(`http://localhost:3500/transactions/${id}`,{
      method:"Delete"
    })

    if(!res.ok){
      throw new Error(`Failed to get transaction`);
    }

    return alert("Transaction deleted")
  }

  //update transaction
  const modalSet = (id:string,{type, name, category, amount, date}:Partial<Transaction>) =>{
    const nameInput = document.querySelector("#name") as HTMLInputElement
    const categorySel = document.querySelector("#category") as HTMLSelectElement
    const amountInput = document.querySelector("#amount") as HTMLInputElement
    const dateInput = document.querySelector("#date") as HTMLInputElement

    if(type==="expense"){
      const expenseInput = document.querySelector("#expense") as HTMLInputElement;
      expenseInput.checked = true;
    }else{
      const incomeInput = document.querySelector("#income") as HTMLInputElement;
      incomeInput.checked = true;
    }

    nameInput.value=name ||""
    categorySel.value=category||""
    amountInput.value=amount?.toString()||""
    dateInput.value= date ||""

    //update button 
    const addBtn = document.querySelector(".btn-add") as HTMLButtonElement;
    const updateBtn = document.querySelector(".btn-update") as HTMLButtonElement;

    addBtn.classList.remove("active")
    updateBtn.classList.add("active")
    updateBtn.dataset.id = id
  }

  //search
  export const searchTransaction = async(keyword:string)=>{
    try{
      const res = await fetch(`http://localhost:3500/transactions/search?name=${keyword}`,{
          method:"GET",
          credentials: "include", // include cookies
        });
        const data = await res.json();

        if(!res.ok){
          console.log(data.message)
          return
        }

        return data
    }catch(err){
      console.error(err)
    }
  }

  export const renderViewModal =(data:Transaction)=>{
    const modal = document.querySelector(".view-modal-overlay") as HTMLElement
    const detailContainer = modal.querySelector(".detail-container") as HTMLElement
    modal.classList.add("active")

    detailContainer.innerHTML=""

    detailContainer.innerHTML=`
    <div class="d-flex flex-column p-5 gap-3 text-center">
      <div class="fs-1 fw-bold pb-3">$${data.amount}</div> 
      <div>
        <span class="fw-bold pe-2">
        ${data.type==="expense"?"Payment To":"Payment From"}:</span>
        ${data.name}
      </div>
      ${data.type==="expense"?`<div><span class="fw-bold pe-2"">Expense Category:</span>${data.category}</div>`:""}
      <div><span class="fw-bold pe-2">Payment Date:</span>${data.date}</div>
    </div>
    `
  }