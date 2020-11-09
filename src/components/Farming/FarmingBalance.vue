<template>
  <v-card class="mx-auto" height="270" outlined>
    <v-card-title class="pa-3" :class="{ 'card-title-bg-light': !$vuetify.theme.dark, 'card-title-bg-dark':  $vuetify.theme.dark }">
      <CommandIcon size="0.8x" class="custom-class mr-1"></CommandIcon><span class="font-weight-light" style="font-size: 17px;">FARMING BALANCE</span>
    </v-card-title>
    <hr class="hr-styles" />
    <v-card-text class="font-weight-light my-2 px-7" style="font-size: 18px; height: 120px">
      <v-select @change="changeToken" :items="filterItems" v-model="selected"  itemtype="object" item-text="name" item-value="address" dense outlined>
         <template  class="pa-0 mx-2" v-slot:prepend-item>
        <div>
           <span v-if="!$vuetify.theme.dark">
          <input v-model="search" class="mx-2 mb-2 px-2" placeholder="search coin" width="20px" style="border:1px solid gray;width:360px;border-radius:10px;"/>
          </span>
          <span v-else-if="$vuetify.theme.dark">
          <input v-model="search" class="mx-2 mb-2 px-2" placeholder="search coin" width="20px" style="border:1px solid gray;width:360px;border-radius:10px;color:white"/>
          </span>
      <!-- <v-text-field height="10px" clear-icon outlined class="mx-1" v-model="searchTerm" placeholder="Search" @input="searchFruits"></v-text-field> -->
        </div>
</template>
        <template v-slot:selection="{ item, index, select,selected }">
          <div class="d-flex">
            <img :src="item.icon" class="mr-5 rounded-circle" style="max-width: 24px" />
            <label class="mt-1">{{item.name}}</label>
          </div>
        </template>
        <template v-slot:item="{item}">
          <div class="d-flex">
            <img :src="item.icon" class="mr-5 rounded-circle" style="max-width: 24px" />
            <label>{{item.name}}</label>
          </div>
        </template>
      </v-select>
      <p style="font-size:15px" class="ma-0">{{balance}} {{symbol}} <span @click="changeToken" style="position:relative;bottom:2px;cursor:pointer"><v-icon>mdi-refresh</v-icon></span></p>
    </v-card-text>
    <hr class="hr-styles" />
    <v-card-actions  style="padding:16px;">
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            style="font-size: 12px; width: 145px"
            color="#00ACC1"
            v-bind="attrs"
          
            v-on="on"
            class="px-10 ml-2"
            elevation="0"
            dark
          >
            <CornerUpRightIcon size="1.2x" class="custom-class ml-3"></CornerUpRightIcon> <span class="ml-4 mr-5 text-caption">Stop Farming</span>
          </v-btn>
        </template>
        <v-card>
          <v-icon
            color="#00ACC1"
            class="ma-2"
            @click="dialog=false"
            style="float:right"
          >mdi-close-circle</v-icon>
          <v-card-text>
            <v-container>
              <div class="d-block mt-10">
                <div class="d-flex">
                  <v-select
                    :items="items"
                    @change="changeToken"
                    v-model="selected"
                    item-text="name"
                    item-value="address"
                    dense
                    outlined
                    label="Select Asset"
                  >
                    <template v-slot:selection="{ item, index, select }">
                      <div class="d-flex">
                        <img :src="item.icon" class="mr-5 rounded-circle" style="max-width: 24px"></img>
                        <label class="mt-1">{{item.name}}</label>
                      </div>
                    </template>
                    <template v-slot:item="{item}">
                      <div class="d-flex">
                        <img :src="item.icon" class="mr-5 rounded-circle" style="max-width: 24px"></img>
                        <label>{{item.name}}</label>
                      </div>
                    </template>
                  </v-select>
                </div>
                <div class="d-flex">
                  <v-text-field
                    clearable
                    v-model.number="amount"
                    label="Amount*"
                    height="40px"
                    type="number"
                    dense
                    required
                    outlined
                  ></v-text-field>
                  <v-btn height="40px" width="100px" class="ml-1 btn-bg" @click="amount = balance" outlined>All</v-btn>
                </div>
              </div>
            </v-container>
          </v-card-text>
          <v-card-actions class="mt-0">
            <v-spacer></v-spacer>
            <div class="d-flex flex-wrap">
              <v-btn
                class="mx-2"
                color="#00ACC1"
                elevation="0"
                @click.prevent="stopFarming"
                style="font-size: 12px;color:white"
              >Stop Farming
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import { CornerUpRightIcon, CommandIcon } from "vue-feather-icons";
import utils from '../../utils/abi';
import { getAmount } from '../../utils/amount';
import { getbalance } from '../../utils/balance';
export default {
  components: {
    CornerUpRightIcon,
    CommandIcon
  },
  data: () => ({
    search:"",
    balance: 0,
    amount:0,
    decimals:0,
    dialog: false,
    contract:undefined,
    currentAddress:undefined,
    symbol:"",
    items: utils.items,
    selected:undefined
  }),
  computed:{
        sortedItems(){
         return this.items.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)); 
        },
        filterItems(){
          if(this.search!=""){
          return this.items.filter(item=>{
            
            return item.name.toLowerCase().includes(this.search.toLowerCase());
            
          })
          }
          else{
            return this.items;
          }
        }
    },
  methods: {
     async changeToken(e){
        try{
       this.$store.state.loading=true;
          this.contract= await new window.web3.eth.Contract(utils.ERC20Token,this.selected);
          this.decimals=await this.contract.methods.decimals().call();
          
    
         let activeFarmDeposit = await this.$store.state.DAO.methods
      .activeFarmDeposit(this.selected, this.currentAddress)
      .call();
      activeFarmDeposit = getbalance(this.decimals,activeFarmDeposit);
      this.balance=activeFarmDeposit;
      this.items.filter(item=>{
        if(item.address==this.selected){
          this.symbol=item.name
        }
      })
       this.$store.state.currentTokenAddress=this.selected;
     await this.$store.dispatch('setFarmDetails')
       this.$store.state.loading=false;
        }
        catch(err){
          console.log(err)
        }
        finally{
           this.$store.state.loading=false;
        }
      },
    async stopFarming(){
 try{
   let amount;
          if(this.balance<=0){
            this.$store.state.text="You don't have any farmed tokens to withdraw";
             this.$store.state.snackbar=true;
            return;
          }
          else if(this.amount==0){
            this.$store.state.color=""
            this.$store.state.text = "Amount should be more than 0";
             this.$store.state.snackbar = true;
            return;
          }
          else if(this.amount>this.balance){
            this.$store.state.color="red";
             this.$store.state.text="Amount exceeds farmed token balance";
             this.$store.state.snackbar=true;
             return;
             
          }
           if(parseInt(this.decimals)<18){
           
         amount = await getAmount(this.decimals, this.amount.toString());
          amount=await window.web3.utils.toBN(amount);
        
          //amount= await window.web3.utils.toHex(amount);
          }
          else if(parseInt(this.decimals)>=18){
            amount= await window.web3.utils.toWei(this.amount.toString(),'ether')
          }
          
          this.$store.state.loading=true
        
          let claim=await this.$store.state.DAO.methods.withdrawFarmedTokens(this.selected,amount).send({from:this.currentAddress});
           let activeFarmDeposit = await this.$store.state.DAO.methods
      .activeFarmDeposit(this.selected, this.currentAddress)
      .call();
      activeFarmDeposit = getbalance(this.decimals,activeFarmDeposit)
      this.balance=activeFarmDeposit;
          this.dialog=false;
          this.$store.state.color="green"
          this.$store.state.text="Transaction completed successfully"
          this.$store.state.snackbar=true;
          
        }catch(err){
          console.log(err);
            this.color="red"
          this.text="Transaction failed, something went wrong"
          this.snackbar=true;
        }
        finally{
          this.$store.state.loading=false;
          this.amount=0;
        }
    }
  },
  async created() {
    try{
    this.selected=this.sortedItems[0].address;
    await this.$store.dispatch("setCurrentAddress");
  //this.$store.state.currentTokenAddress=this.selected.address
    this.currentAddress = this.$store.state.currentAddress;
   
    console.log("address:",this.selected)
this.$store.state.currentTokenAddress=this.selected
  this.contract= await new window.web3.eth.Contract(utils.ERC20Token,this.selected);
  this.decimals=await this.contract.methods.decimals().call();
    
    let activeFarmDeposit = await this.$store.state.DAO.methods
      .activeFarmDeposit(this.selected, this.currentAddress)
      .call();
      activeFarmDeposit = await getbalance(this.decimals,activeFarmDeposit);
      this.balance=activeFarmDeposit;
       this.items.filter(item=>{
        if(item.address==this.selected){
          this.symbol=item.name
        }
      })
    }catch(err){
      console.log("Here 219:",err);
    }
  },
};
</script>
