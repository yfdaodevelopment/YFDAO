import BN from "bignumber.js"

export function getbalance(decimals,amt){
    console.log(decimals,amt)
    let balance;
    if(amt>=0){
    balance= new BN(amt).div(10 ** decimals);
    }
    else{
        balance=0;
    }
    return balance;
}