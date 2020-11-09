<template>
  <v-card class="mx-auto mt-2" outlined>
    <v-card-title class="pa-3" :class="{ 'card-title-bg-light': !$vuetify.theme.dark, 'card-title-bg-dark':  $vuetify.theme.dark }">
      <Share2Icon size="0.8x" class="custom-class mr-1"></Share2Icon><span class="font-weight-light" style="font-size: 17px;">STAKING RATE</span>
    </v-card-title>
    <hr class="hr-styles" />
    <v-card-text class="font-weight-light my-2" style="font-size: 18px">
      {{this.rate}} %
    </v-card-text>
  </v-card>
</template>

<script>
import { Share2Icon } from 'vue-feather-icons'
import utils from "../../utils/abi"
  export default {
    components: {
      Share2Icon
    },
    data: () => ({
      //
      currentAddress:undefined,
      balance:0,
      rate:0
    }),
    async created() {
       this.currentAddress=this.$store.state.currentAddress;
        this.rate= await this.$store.state.DAO.methods.tokens(utils.breedAddress).call();
        this.rate=this.rate.rate;
    },
    
  }
</script>