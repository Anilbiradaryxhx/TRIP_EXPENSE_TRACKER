let chart;

document.getElementById("expenseForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const trip = document.getElementById("trip").value;
    const category = document.getElementById("category").value;
    const amount = document.getElementById("amount").value;

    const data = {
        trip,
        category,
        amount
    };

    try {

        const response = await fetch("http://localhost:3000/add-expense", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        const result = await response.text();

        alert(result);

        loadExpenses();

    }
    catch(error){
        console.log(error);
    }

});



async function loadExpenses(){

    try{

        const response = await fetch("http://localhost:3000/expenses");

        const expenses = await response.json();

        const expenseList = document.getElementById("expenseList");

        expenseList.innerHTML = "";

        let total = 0;

        let tripSet = new Set();

        // CATEGORY TOTALS FOR PIE CHART
        let categoryTotals = {};



        expenses.forEach(expense => {

            total += Number(expense.amount);

            tripSet.add(expense.trip_name);


            // CATEGORY WISE TOTALS
            if(categoryTotals[expense.category]){

                categoryTotals[expense.category]
                += Number(expense.amount);

            }
            else{

                categoryTotals[expense.category]
                = Number(expense.amount);

            }



            expenseList.innerHTML += `
            
                <div class="expense-card">

                    <h3>${expense.trip_name}</h3>

                    <p><strong>Category:</strong> ${expense.category}</p>

                    <p><strong>Amount:</strong> ₹${expense.amount}</p>

                </div>
            
            `;

        });



        // DASHBOARD VALUES
        document.getElementById("totalExpense")
        .innerText = `₹${total}`;

        document.getElementById("totalTrips")
        .innerText = tripSet.size;



        // PIE CHART
        const labels = Object.keys(categoryTotals);

        const data = Object.values(categoryTotals);


        // DESTROY OLD CHART
        if(chart){
            chart.destroy();
        }


        const ctx = document
        .getElementById("expenseChart")
        .getContext("2d");


        chart = new Chart(ctx, {
        type: "pie",

    data: {
        labels: labels,

        datasets: [{
            label: "Expenses",
            data: data,
            borderWidth: 1,
            backgroundColor: [
                "#36A2EB",
                "#FF6384",
                "#FF9F40",
                "#FFCD56",
                "#4BC0C0",
                "#9966FF",
                "#FFCE56"
            ]
        }]
    },

    options: {
        responsive: true,

        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "#ffffff", // Makes category names white
                    font: {
                        size: 14
                    },
                    padding: 20
                }
            },
        }
    }
});

    }
    catch(error){
        console.log(error);
    }

}


loadExpenses();