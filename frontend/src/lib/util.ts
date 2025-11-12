  type TransactionType = "expense" | "income";
  interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    name: string;
    category: ExpenseType | null;
    amount: number;
    date: Date;
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
      console.log(data);
      const tableBody = document.querySelector(".table-body") as HTMLDivElement;
      tableBody.innerHTML=""
      if (data.length === 0) {
        const container = document.createElement("div");
        container.style.padding = "1rem 0 0 0";
        container.innerText = "There is no transaction";
        tableBody.style.textAlign = "center";
        tableBody.appendChild(container);
      }
      data.forEach((el: Transaction) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${el.date}</td>
        <td>${el.name}</td>
        <td class=${el.type === "expense" ? "text-danger" : "text-success"}>
          ${el.type === "expense" ? "-" : "+"}$ ${el.amount}
          </td>
        <td><i class="fa-solid fa-ellipsis-vertical"></i></td>
        `;
        tableBody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
    }
  };