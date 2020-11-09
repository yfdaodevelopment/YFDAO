<template>
  <div v-if="$store.state.currentAddress==$store.state.owner">
    <div>
      <div class="my-5 mx-3">
        <p class="ma-0 grey--text" style="font-size: 12px">
          Owner setting Dashboard
        </p>
        <h2 class="ma-0 font-weight-light">MY CONTROLS</h2>
      </div>
    </div>
    <hr class="mx-n5 hr-styles" />
    <div>
      <v-row>
        <v-col cols="12" md="6">
          <changeRateVue />
        </v-col>
           <v-col cols="12" md="6">
          <changeStakingRate/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
         <changeFarmClaimFee/>
        </v-col>
           <v-col cols="12" md="6">
          <changeStakeClaimFee/>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
export default {
  name: "Setting",
  components: {
    changeRateVue: () => import("../components/Farming/changeRate"),
    changeStakingRate:() => import("../components/Staking/changeStakingRate"),
    changeFarmClaimFee:()=> import("../components/Farming/changeClaimFeesFarm"),
    changeStakeClaimFee:()=> import("../components/Staking/changeClaimFessStake"),
  },
  created() {
      this.$store.state.loading=false;
  },
};
</script>
