//Add const to modify text based on selected computer
const compsElem = document.getElementById("computers");
const priceElem = document.getElementById("price");
const descElem = document.getElementById("description");
const specsElem = document.getElementById("specs");

//Make elements for working and banking
const payElem = document.getElementById("currPay");
const balanceElem = document.getElementById("currBalance");

//Make element for image
const imgElem = document.getElementById("previewImg");

//Make element for payback button
const paybackButtonElem = document.getElementById("paybackBtn");
paybackButtonElem.style.visibility="hidden";

//Initializing empty array for computers
let computers = [];


//Making a constructor and defining initial user configs as 0
let me = new user(0, 0, 0);
function user (currPay, currBalance, loan) {
    this.currPay = currPay;
    this.currBalance = currBalance
    this.loan = loan;
}

//Fetching data from Heroku
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => computers = data)
    .then(computers => addComputers(computers));

//Adding computers into array and initalizing webpage with the first computer in the list as shown
const addComputers = (computers) => {
    //Add computers into array
    computers.forEach(x => addComputer(x));

    //Load initial elements
    priceElem.innerText = computers[0].price;
    descElem.innerText = computers[0].description;

    specsElem.innerText = computers[0].specs;
    for (var i = 0; i < computers[0].specs.length; i++){
        specsElem.innerText+='-'+selectedComputer.specs[i]+'\n';
    }
    imgElem.src = "https://noroff-komputer-store-api.herokuapp.com/assets/images/1.png";
}

//
const addComputer = (computer) => {
    const compElem = document.createElement("option");
    compElem.value = computer.id;
    compElem.appendChild(document.createTextNode(computer.title));
    compsElem.appendChild(compElem);
}

//Handles the changes on website when new computer is selected
const handleComputerChange = e => {
    const selectedComputer = computers[e.target.selectedIndex];
    priceElem.innerText = selectedComputer.price;
    descElem.innerText = selectedComputer.description;
    specsElem.innerText = "";
    for (var i = 0; i < selectedComputer.specs.length; i++){
        specsElem.innerText+='-'+selectedComputer.specs[i]+'\n';
    }
    //specsElem.innerText = selectedComputer.specs;
    imgElem.src = "https://noroff-komputer-store-api.herokuapp.com/"+selectedComputer.image;
}

//Handles the work button by adding currency to pay
function handleWorkBalance() {
    me.currPay += 100;
    payElem.innerText = me.currPay;
}

//Handles the bank button, adding currency to bank and deducting potential loan costs
function handleBankBalance() {
    if(me.loan > 0){
        const payback = parseInt(me.currPay/10);
        me.currPay-=payback;
        me.loan-=payback;
        if(me.loan < 0) {
            me.currBalance+=me.loan;
            me.loan = 0;
        }
        paybackButtonCheck();
    }
    me.currBalance += me.currPay;
    me.currPay = 0;
    balanceElem.innerText = me.currBalance;
    payElem.innerText = me.currPay;

}

//Handles the loan button, giving prompt on how much the user wishes to recieve
function handleLoan() {
    const requestedLoan = prompt("Please enter the amount you request.");
    if(requestedLoan != null) {
        me.loan+=parseInt(requestedLoan);
        me.currBalance+= parseInt(requestedLoan);
        paybackButtonCheck();
        balanceElem.innerText = me.currBalance;
    }
}

//Handles the loan payback button, prompts user on how much they wish to pay back
function handleLoanPayback(){
    const requestPayback = prompt("Your current loan is "+me.loan+". Please enter how much you with to pay back.");
    if(requestPayback != null) {
        me.loan-=parseInt(requestPayback);
        me.currBalance-=parseInt(requestPayback);
        if(me.loan < 0) {
            me.currBalance+=me.loan;
            me.loan = 0;
        }
        paybackButtonCheck();
        balanceElem.innerText = me.currBalance;
    }
}

//Handles purchase of computer, deducts price from bank balance
function handleComputerPurchase(){
    if(me.currBalance-parseInt(priceElem.innerText) < 0) {
        window.alert("You do not have enough currency for that item");
    } else {
        me.currBalance-=parseInt(priceElem.innerText);
        balanceElem.innerText = me.currBalance;
        window.alert("Congratulations on your new computer!");
    }
}

//Handles whenever the payback button is visible or not
function paybackButtonCheck(){
    if(me.loan>0){
        paybackButtonElem.style.visibility="visible";
    } else {
        paybackButtonElem.style.visibility="hidden";
    }
}

//Listener for computer change
compsElem.addEventListener("change", handleComputerChange);