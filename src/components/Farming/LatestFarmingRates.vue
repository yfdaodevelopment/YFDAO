<template>
  <v-card class="mx-auto mt-2" height="175px" outlined>
    <v-card-title class="pa-3" :class="{ 'card-title-bg-light': !$vuetify.theme.dark, 'card-title-bg-dark':  $vuetify.theme.dark }">
      <Share2Icon size="0.8x" class="custom-class mr-1"></Share2Icon><span class="font-weight-light" style="font-size: 17px;"> LATEST FARMING RATES</span>
    </v-card-title>
    <hr class="hr-styles" />
    <v-card-text class="font-weight-light" style="font-size: 18px">
      <v-row>
        <v-col cols="8" class="pl-2 pb-0">
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
        <v-col cols="4" class="pl-2 pb-0">
          <p class="ml-3 mt-2">{{rate}}% APY</p>
        </v-col>
      </v-row>
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
    data: () => ({
      search:"",
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
      this.selected=this.items[0]
      console.log("hererrererre:",this.selected)
      this.rate= await this.$store.state.DAO.methods.tokens(this.selected.address).call();
      this.rate=this.rate.rate;


    },
  }
</script>