import Vue from 'vue'
import Vuex from 'vuex'
import utils from "../utils/abi"
import BN from "big-number"
import Web3 from "web3"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    BREED:undefined,
    timer:false,
    snackbar:false,
    color:"",
    text:"",
    timout:5000,
    loading:false,
    breedBalance:0,
    DAO:undefined,
    totalStakedGlobal:0,
    totalStakedMe:0,
    myRewards:0,
    totalClaimedGlobal:0,
    totalClaimedMe:0,
    totalFarmClaimedMe:0,
    totalFarmClaimedGlobal:0,
    totalFarmedMe:0,
    totalCircularSupply:0,
    totalBurntAmount:0,
    farmingBalance:0,
    activeFarmDeposit:0,
    farmRate:0,
    yCrvBalance:0,
    YCRV:undefined,
    owner:undefined,
    currentAddress:undefined,
    currentTokenAddress:""
  },
  mutations: {
    setBreed:(state,data)=>{
      state.BREED=data;
    },
    setDAO:(state,data)=>{
      state.DAO=data;
    },
    setYCRV:(state,data)=>{
      state.YCRV=data;
    },
    setAddress:(state,data)=>{
      state.currentAddress=data[0];
      state.owner=data[1];
    },
    setStakeDetails:(state,data)=>{
    
      state.totalStakedGlobal= data.totalStakedGlobal;
      state.breedBalance= parseFloat(data.breedBalance);
      state.totalStakedMe= data.totalStakedMe;
      state.myRewards=data.myRewards;
      state.totalClaimedGlobal=data.totalClaimedGlobal;
      state.totalClaimedMe=data.totalClaimedMe;
      state.totalCircularSupply=data.totalCircularSupply;
      state.totalBurntAmount=data.totalBurntAmount;
    },
    setFarmDetails:(state,data)=>{
     // state.yCrvBalance=parseFloat(data.yCrvBalance);
      state.totalFarmClaimedMe=data.totalFarmClaimedMe;
      state.totalFarmedMe=data.totalFarmedMe;
      state.totalFarmClaimedGlobal=data.totalFarmClaimedGlobal;
      //state.activeFarmDeposit=parseFloat(data.activeFarmDeposit);
      //state.farmRate=data.rate
    }
  },
  actions: {
    setBreedContract: async (context)=>{
    try{
      let contract=await new window.web3.eth.Contract(utils.abiToken,utils.breedAddress)
      context.commit('setBreed',contract);
    }
    catch(err){
      console.log("here at 80:",err)
    }
      
    },
    setDaoContract: async (context)=>{
      try{
      let contract=await new window.web3.eth.Contract(utils.abiDAO,utils.daoAddress)
      context.commit('setDAO',contract);
      }
      catch(err){
        console.log("Here at 90:",err)
      }
    },
    
    setYCRVContract:async(context)=>{
      // let contract=await new window.web3.eth.Contract(utils.ERC20Token,utils.yCrvAddress)
      // context.commit('setYCRV',contract);
    },
    setCurrentAddress:async ({commit,state})=>{
      try{
      let owner=(await state.DAO.methods.owner().call());
      let address=await window.web3.eth.getAccounts();
      let data=[address[0],owner];
      commit('setAddress',data);
      }
      catch(err){
        console.log("Here at 106:",err)
      }
    },

    setStakeDetails:async({commit,state})=>{
      try{
      let breedBalance = await state.BREED.methods
      .balanceOf(state.currentAddress)
      .call();
      breedBalance = await window.web3.utils.fromWei(breedBalance.toString(), "ether");
     

      let totalCircularSupply = await state.BREED.methods
      .currentSupply()
      .call();
      totalCircularSupply = await window.web3.utils.fromWei(totalCircularSupply.toString(), "ether");

      let totalBurntAmount = await state.BREED.methods
      .totalBurnt()
      .call();
      totalBurntAmount = await window.web3.utils.fromWei(totalBurntAmount.toString(), "ether");
     
     

      let totalStakedGlobal = await state.DAO.methods
      .totalLockedStaking()
      .call();
      totalStakedGlobal = await window.web3.utils.fromWei(totalStakedGlobal.toString(), "ether");

      let totalStakedMe=await await state.DAO.methods
      .yourActiveStake(state.currentAddress).call();

      totalStakedMe = await window.web3.utils.fromWei(totalStakedMe.toString(), "ether");

      let myRewards=await await state.DAO.methods.
      pendingReward(state.currentAddress).call();

      myRewards = await window.web3.utils.fromWei(myRewards.toString(), "ether");
 
      
      let totalClaimedGlobal=await await state.DAO.methods.
      totalRewards().call();

      totalClaimedGlobal = await window.web3.utils.fromWei(totalClaimedGlobal.toString(), "ether");

      let totalClaimedMe=await await state.DAO.methods.
      totalStakeRewardsClaimedTillToday(state.currentAddress).call();

      totalClaimedMe = await window.web3.utils.fromWei(totalClaimedMe.toString(), "ether");
      

     let data={
        breedBalance,
        totalStakedGlobal,
        totalStakedMe,
        myRewards,
        totalClaimedGlobal,
        totalClaimedMe,
        totalCircularSupply,
        totalBurntAmount
      }
      commit('setStakeDetails',data);
    }
    catch(err){
     
      console.log("err for stake data:",err)
    }
    },

    setFarmDetails:async({commit,state})=>{
      try{
      
        console.log("web3:",window.web3)
        let network = await window.web3.eth.net.getNetworkType();
        console.log(network);

      let totalFarmClaimedMe= await state.DAO.methods.totalFarmingRewards(state.currentTokenAddress,state.currentAddress).call();
     totalFarmClaimedMe=await window.web3.utils.fromWei(totalFarmClaimedMe.toString(),'ether');
     
      
      let totalFarmedMe= await state.DAO.methods.pendingYield(state.currentTokenAddress,state.currentAddress).call();
      totalFarmedMe=await window.web3.utils.fromWei(totalFarmedMe.toString(),'ether');

      let totalFarmClaimedGlobal= await state.DAO.methods.totalYield().call();
      totalFarmClaimedGlobal=await window.web3.utils.fromWei(totalFarmClaimedGlobal.toString(),'ether');

      // let activeFarmDeposit = await state.DAO.methods
      // .activeFarmDeposit(utils.yCrvAddress, state.currentAddress)
      // .call();
      // activeFarmDeposit = await window.web3.utils.fromWei(activeFarmDeposit.toString(), "ether")

      // let rate=await state.DAO.methods.tokens(utils.yCrvAddress).call()
      // rate=rate.rate

      let data={
       // yCrvBalance,
        totalFarmClaimedMe,
        totalFarmedMe,
        totalFarmClaimedGlobal,
       // activeFarmDeposit,
        //rate
      }
      commit('setFarmDetails',data)
    }
    catch(err){
      console.log("Err for farm data:",err);
    }
    }
  },
  modules: {
  }
})
