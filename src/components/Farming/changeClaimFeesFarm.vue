<template>
  <v-card class="mx-auto mt-2" height="auto" outlined>
    <v-card-title class="pa-3" :class="{ 'card-title-bg-light': !$vuetify.theme.dark, 'card-title-bg-dark':  $vuetify.theme.dark }">
      <Share2Icon size="0.8x" class="custom-class mr-1"></Share2Icon><span class="font-weight-light" style="font-size: 17px;"> CHANGE FARMING REWARDS CLAIM FEE</span>
    </v-card-title>
     <h5 class="mb-2 mt-2" style="text-align:center">Current fees: {{currentFee}} ETH</h5>
    <hr class="hr-styles" />
    <v-card-text class="font-weight-light" style="font-size: 18px;text-align:center">
     
      <v-row justify="center pr-3">
        <v-col cols="6"  class="pl-2 pb-0">
            <v-text-field clearable v-model="newRate" dense label="Enter Fee rate in ETH" class=""  outlined></v-text-field>
     </v-col>

        </v-row>
        <v-row justify="center">
          <v-col cols="6">
          <v-btn @click="changeRate" color="#0097A7" style="color:white" depressed>Submit</v-btn>
          </v-col>
          </v-row>
    
        <!-- <v-col cols="4" class="pl-2 pb-0">
          <p class="ml-3 mt-2">{{rate}}% APY</p>
        </v-col> -->
    
    </v-card-text>
  </v-card>
</template>

<script>
import { Share2Icon } from "vue-feather-icons";
import utils from '../../utils/abi';
  export default {
    components: {
      Share2Icon
    },
    name:"changeRate",
    data: () => ({
      search:"",
      newRate:0,
      currentFee:0,
      items: utils.items,
      selected:undefined
    }),
    computed:{
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
        async updateFees(){
            try{
      this.currentFee= await this.$store.state.DAO.methods.yieldCollectionFee().call();
     
      this.currentFee=parseFloat(await window.web3.utils.fromWei(this.currentFee,"ether")).toFixed(4);
     }
     catch(err){
         console.log(err);
        
     }
        },
    async changeRate(){
      try {
        if(this.newRate>0){
            this.$store.state.loading=true;
            let rate=await window.web3.utils.toWei(this.newRate,'ether');
        let done=await this.$store.state.DAO.methods.setYieldCollectionFee(rate).send({from:this.$store.state.currentAddress})
        await this.updateFees();
         this.$store.state.color = "green";
          this.$store.state.text = "Transaction completed successfully";
          this.$store.state.snackbar = true;
        }
        else{
           this.$store.state.color = "";
           this.$store.state.text = "Amount should be more than 0";
          this.$store.state.snackbar = true;
        }
      } catch (error) {
        console.log(error)
        this.$store.state.color = "red";
           this.$store.state.text = "Transaction failed, something went wrong";
          this.$store.state.snackbar = true;
      }
      finally{
        this.$store.state.loading=false;
        
      }
    },
     
    },
    async created() {
     await this.updateFees();
    },
  }
</script>