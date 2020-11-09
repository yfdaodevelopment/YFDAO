<template>
  <v-card class="mx-auto mt-2" height="auto" outlined>
    <v-card-title class="pa-3" :class="{ 'card-title-bg-light': !$vuetify.theme.dark, 'card-title-bg-dark':  $vuetify.theme.dark }">
      <Share2Icon size="0.8x" class="custom-class mr-1"></Share2Icon><span class="font-weight-light" style="font-size: 17px;"> CHANGE FARMING RATES</span>
    </v-card-title>
     <h5 class="mb-2 mt-2" style="text-align:center">Current rate: {{rate}} % </h5>
   
    <hr class="hr-styles" />
    <v-card-text class="font-weight-light" style="font-size: 18px;text-align:center">
      <v-row justify="center pr-3 mt-2" wrap>
        <v-col cols="6" class="pl-2 pb-0 mt-0 pt-0">
          <v-select
            :items="filterItems"
            v-model="selected"
            item-text="name"
            @change="changeToken"
            item-value="address"
            dense
            outlined
          >
           <template  class="pa-0 mx-2" v-slot:prepend-item>
        <div>
          <span>
          <input v-model="search" class="mx-2 mb-2 px-2" placeholder="search coin" width="20px" style="border:1px solid gray;width:360px;border-radius:10px;"/>
          </span>
      <!-- <v-text-field height="10px" clear-icon outlined class="mx-1" v-model="searchTerm" placeholder="Search" @input="searchFruits"></v-text-field> -->
        </div>
</template>
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
        </v-col>
     
        
        <v-col cols="6"  class="pt-0 mt-0">
            <v-text-field clearable v-model="newRate" dense label="Enter APY rate in %" class=""  outlined></v-text-field>
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
      rate:0,
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

    async changeRate(){
      try {
        if(this.newRate>=0){
            this.$store.state.loading=true;
        let done=await this.$store.state.DAO.methods.changeFarmingRate(this.selected,this.newRate).send({from:this.$store.state.currentAddress})
        await this.changeToken();
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
        this.newRate=0;
        
      }
    },
      async changeToken(){
        try{

          this.$store.state.loading=true;
         
          this.rate= await this.$store.state.DAO.methods.tokens(this.selected).call();
          this.rate=this.rate.rate;
           this.$store.state.loading=false;
        }
        catch(err){

        }
        finally{
           this.$store.state.loading=false;
        }
      }
    },
    async created() {
      this.selected=this.items[0].address
      this.rate= await this.$store.state.DAO.methods.tokens(this.selected).call();
      this.rate=this.rate.rate;

    },
  }
</script>