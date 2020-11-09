import Big from "bignumber.js"

export  function getAmount(decimals,amt){
    let tokenbits = (new Big(10)).pow(decimals);
    console.log("Decimal",decimals);
    let amount = (new Big(amt)).multipliedBy(tokenbits);
    console.log(amount)
    return amount;
}