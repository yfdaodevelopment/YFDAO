<template>
  <v-card class="mx-auto" height="270" outlined>
    <v-card-title class="pa-3" :class="{ 'card-title-bg-light': !$vuetify.theme.dark, 'card-title-bg-dark':  $vuetify.theme.dark }">
      <CheckIcon size="0.8x" class="custom-class mr-1"></CheckIcon><span class="font-weight-light" style="font-size: 17px;">CLAIMED</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="font-weight-light my-2 px-7" style="font-size: 18px; height: 120px">
      {{ this.$store.state.totalFarmClaimedMe}} YFDAO
    </v-card-text>
    <v-divider></v-divider>
  </v-card>
</template>

<script>
import { CheckIcon } from "vue-feather-icons";
import utils from "../../utils/abi";
  export default {
    components: {
      CheckIcon
    },
    
     computed:{
         sortedItems(){
         return this.items.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)); 
        },
    },
    data: () => ({
      //
     items:utils.items
    }),
    async created() {
     this.$store.state.currentTokenAddress=this.sortedItems[0].address;
      await this.$store.dispatch('setFarmDetails')
       this.currentAddress=this.$store.state.currentAddress;
    },
  }
</script>