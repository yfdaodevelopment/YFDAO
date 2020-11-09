<template>
  <v-card class="mx-auto" height="270" outlined>
    <v-card-title class="pa-3" :class="{ 'card-title-bg-light': !$vuetify.theme.dark, 'card-title-bg-dark':  $vuetify.theme.dark }">
      <ZapIcon size="0.8x" class="custom-class mr-1"></ZapIcon><span class="font-weight-light" style="font-size: 17px;">BALANCE</span>
    </v-card-title>
    <hr class="hr-styles" />
    <v-card-text class="font-weight-light my-2 px-7" style="font-size: 18px">
      <v-select
        :items="filterItems"
       
        v-model="selected"
        item-text="name"
        item-value="address"
       itemtype="object"
        @change="changeToken"
        
        dense
        outlined
      >
      
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
      <!-- <v-text-field></v-text-field> -->
        <template  v-slot:selection="{ item, index, select, selected }">
         
          <div class="d-flex">
            <img  :src="item.icon" class="mr-5 rounded-circle" style="max-width: 24px;"></img>
            <label class="mt-1">{{item.name}}</label>
          </div>
        </template>
        <template v-slot:item="{ item }">
          <div class="d-flex">
            <img :src="item.icon" class="mr-5 rounded-circle" style="max-width: 24px"></img>
            <label>{{item.name}}</label>
          </div>
        </template>
      </v-select>
      <p style="font-size:15px" class="ma-0">{{balance}} {{symbol}} <span @click="changeToken" style="position:relative;bottom:2px;cursor:pointer"><v-icon>mdi-refresh</v-icon></span></p>
    </v-card-text>
    <hr class="hr-styles" />
    <v-card-actions style="padding:16px;">
      <v-dialog v-model="dialog" width="500" cl>
        <template v-slot:activator="{ on, attrs }" class="my-auto mb-4">
          <v-btn
            style="font-size: 12px; width: 145px"
            color="#0097A7"
            v-bind="attrs"
            v-on="on"
            class="px-10 ml-2 my-auto mb-2"
            elevation="0"
            dark
          >
            <CheckIcon size="1.2x" class="ml-10"></CheckIcon> <span class="ml-4 pr-10 text-caption">Start Farming</span>
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
                    v-model="selected"
                    dense
                    @change="changeToken"
                    item-text="name"
                    item-value="address"
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
                  <v-btn height="40px" class="ml-1 btn-bg" @click="approve" outlined>Approve</v-btn>
                  <v-tooltip  max-width="200px" transition="scroll-y-transition" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <p class="mr-2 mt-n2"><InfoIcon v-bind="attrs" v-on="on" size="1.1x" class="ml-1" style="color: #ABACAE"></InfoIcon></p>
                    </template>
                    <small>You will need to approve each of your asset to interact with the  farming contract. You only need to do this once for all  assets.</small>
                  </v-tooltip>
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
          <v-card-actions>
            <v-spacer></v-spacer>
            <div class="d-flex flex-wrap">
              <v-btn
                class="mx-2 btn-bg"
                @click.prevent="farm"
                outlined
              >Start
              </v-btn>
              <v-tooltip  max-width="200px" transition="scroll-y-transition" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <p class="mr-2"><InfoIcon v-bind="attrs" v-on="on" size="1.1x" class="ml-n1" style="color: #ABACAE"></InfoIcon></p>
                </template>
                <small>This should only be used if you do not already have an actively farming balance for the selected asset.</small>
              </v-tooltip>
              <v-btn
                class="mx-2"
                color="#00ACC1"
                elevation="0"
               
                @click.prevent="addToFarm"
                style="font-size: 12px;color:white"
              >Add More
              </v-btn>
              <v-tooltip transition="scroll-y-transition" bottom max-width="200px">
                <template v-slot:activator="{ on, attrs }">
                  <p class="mr-2"><InfoIcon v-bind="attrs" v-on="on" size="1.1x" class="ml-n1" style="color: #ABACAE"></InfoIcon></p>
                </template>
                <small>This should only be used if you already have an actively farming balance for the selected  asset and you wish to add more.</small>
              </v-tooltip>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import utils from "../../utils/abi";
import BN from "big-number";
import { getAmount } from "../../utils/amount";
import { getbalance } from "../../utils/balance";
import { CheckIcon, ZapIcon, InfoIcon } from "vue-feather-icons";
export default {
  components: {
    CheckIcon,
    ZapIcon,
    InfoIcon,
  },
  data: () => ({
    search: "",
    dialog: false,
    contract: undefined,
    amount: 0,
    decimals: 0,
    balance: 0,
    symbol: "",
    currentAddress: undefined,
    items: utils.items,
    selected: undefined,
  }),
  computed: {
    sortedItems() {
      return this.items.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
    },
    filterItems() {
      if (this.search != "") {
        return this.sortedItems.filter((item) => {
          return item.name.toLowerCase().includes(this.search.toLowerCase());
        });
      } else {
        return this.sortedItems;
      }
    },
  },
  methods: {
    async changeToken(e) {
      try {
        this.$store.state.loading = true;
        console.log(this.selected);
        this.contract = await new window.web3.eth.Contract(
          utils.ERC20Token,
          this.selected
        );
        this.decimals = parseInt(await this.contract.methods.decimals().call());
        let balance = await this.contract.methods
          .balanceOf(this.currentAddress)
          .call();
        
        balance = getbalance(this.decimals, balance.toString());
        this.balance = balance;
        let symb;
      
        if(this.selected=="0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"){
          symb= "MKR"
          
        }else{
          symb=await this.contract.methods.symbol().call();
        }
        this.symbol = symb
        this.$store.state.loading = false;
      } catch (err) {
        console.log("error here:", err);
      } finally {
        this.$store.state.loading = false;
      }
    },
    async approve() {
      let balance = await this.contract.methods
        .balanceOf(this.currentAddress)
        .call();
      balance = getbalance(this.decimals, balance);
      this.balance = balance;
      if (this.amount == 0) {
        this.$store.state.text = "Amount should be more than 0";
        this.$store.state.snackbar = true;
      } else if (this.balance < this.amount) {
        this.$store.state.color = "red";
        this.$store.state.text = `You don't have enough ${this.symbol} tokens to stake the specified amount.`;
        this.$store.state.snackbar = true;
        return;
      } else if (this.balance >= this.amount) {
        try {
          this.$store.state.loading = true;
           let amount;
          if(this.decimals<18){
          amount = await getAmount(this.decimals, this.amount);
          }
          else{
            amount= window.web3.utils.toWei(this.amount.toString(),'ether');
          }
          
          console.log(amount)
          

          let done = await this.contract.methods
            .approve(utils.daoAddress, amount.toString())
            .send({ from: this.currentAddress });
          this.$store.state.color = "green";
          this.$store.state.text = "Transaction completed successfully";
          this.$store.state.snackbar = true;
        } catch (err) {
          console.log(err);

          this.$store.state.color = "red";
          this.$store.state.text = "Transaction failed, something went wrong";
          this.$store.state.snackbar = true;
        } finally {
          this.$store.state.loading = false;
        }
      }
    },
    async farm() {
      if(this.amount<=0){
        this.$store.state.color = "";
        this.$store.state.text = "Amount should be more than 0";
        this.$store.state.snackbar = true;
        return;
      }
      let allowance = await this.contract.methods
        .allowance(this.currentAddress, utils.daoAddress)
        .call();

      // allowance = await window.web3.utils.fromWei(
      //   allowance.toString(),
      //   "ether"
      // );

      let amount;
          if(parseInt(this.decimals)<18){
           
          amount = await getAmount(this.decimals, this.amount.toString());
          amount=await window.web3.utils.toBN(amount);
        
          //amount= await window.web3.utils.toHex(amount);
          }
          else if(parseInt(this.decimals)>=18){
            amount= await window.web3.utils.toWei(this.amount.toString(),'ether')
          }

      let activeFarmDeposit = await this.$store.state.DAO.methods
        .activeFarmDeposit(this.selected, this.currentAddress)
        .call();
      activeFarmDeposit = (
        await getAmount(this.decimals, activeFarmDeposit)
      ).toString();
   
      if (parseInt(activeFarmDeposit) > 0) {
        this.$store.state.text =
          "You already have active farm,instead use 'add more'  to increase your active farm";
        this.$store.state.color = "red";
        this.$store.state.snackbar = true;
      } else if (this.amount == 0) {
        this.$store.state.color = "";
        this.$store.state.text = "Amount should be more than 0";
        this.$store.state.snackbar = true;
      } else if (allowance < amount) {
        this.$store.state.color = "";
        this.$store.state.text =
          "Please approve the specified amount to farm the tokens. Use 'Approve' button to do it";
        this.$store.state.snackbar = true;
      } else if (this.balance < this.amount) {
        this.$store.state.color = "red";
        this.$store.state.text = `you don't have enough ${this.symbol} tokens`;
        this.$store.state.snackbar = true;
      } else if (allowance >= amount) {
        try {
        
          this.$store.state.loading = true;
          let done = await this.$store.state.DAO.methods
            .FARM(this.selected, amount)
            .send({ from: this.currentAddress });
          let contract = await new window.web3.eth.Contract(
            utils.ERC20Token,
            this.selected
          );
          let balance = await contract.methods
            .balanceOf(this.currentAddress)
            .call();
          balance = getbalance(this.decimals, balance);
          this.balance = balance;
          // await this.$store.dispatch('setFarmDetails');
          this.dialog = false;
          this.$store.state.color = "green";
          this.$store.state.text = "Transaction completed successfully";
          this.$store.state.snackbar = true;
        } catch (err) {
          console.log(err);
         
          this.$store.state.color = "red";
          this.$store.state.text = "Transaction failed, something went wrong";
          this.$store.state.snackbar = true;
        } finally {
          this.$store.state.loading = false;
        }
      }
    },

    async addToFarm() {
      let allowance = await this.contract.methods
        .allowance(this.currentAddress, utils.daoAddress)
        .call();

        allowance=parseFloat(await getbalance(this.decimals,allowance));
        console.log(allowance)
      // alert(allowance);
      // allowance = await window.web3.utils.fromWei(
      //   allowance.toString(),
      //   "ether"
      // );

      // let amt = (await getAmount(this.decimals, this.amount)).toString();

      let activeFarmDeposit = await this.$store.state.DAO.methods
        .activeFarmDeposit(this.selected, this.currentAddress)
        .call();

      activeFarmDeposit = await getAmount(this.decimals, activeFarmDeposit);
     

      if (parseFloat(activeFarmDeposit)==0) {
        this.$store.state.text =
          "You don't have active farm, instead use 'Start'  to activate new farm";
        this.$store.state.color = "red";
        this.$store.state.snackbar = true;
      } else if (parseInt(this.amount) == 0) {
        this.$store.state.color = "";
        this.$store.state.text = "Amount should be more than 0";
        this.$store.state.snackbar = true;
      } else if (allowance < this.amount) {
        this.$store.state.color = "";
        this.$store.state.text =
          "Please approve the specified amount to farm the tokens. Use 'Approve' button to do it";
        this.$store.state.snackbar = true;
      } else if (this.balance < this.amount) {
        this.$store.state.color = "red";
        this.$store.state.text = `you don't have enough ${this.symbol} tokens`;
        this.$store.state.snackbar = true;
      } else if (allowance >= this.amount) {
        try {
          this.$store.state.loading = true;
       
         let amount;
          if(parseInt(this.decimals)<18){
           
          amount = await getAmount(this.decimals, this.amount.toString());
          amount=await window.web3.utils.toBN(amount);
        
          //amount= await window.web3.utils.toHex(amount);
          }
          else if(parseInt(this.decimals)>=18){
            amount= await window.web3.utils.toWei(this.amount.toString(),'ether')
          }
          let done = await this.$store.state.DAO.methods
            .addToFarm(this.selected, amount)
            .send({ from: this.currentAddress });
          let contract = await new window.web3.eth.Contract(
            utils.ERC20Token,
            this.selected
          );
          let balance = await contract.methods
            .balanceOf(this.currentAddress)
            .call();
          balance = getbalance(this.decimals, balance);
          this.balance = balance;
          this.dialog = false;
          this.$store.state.color = "green";
          this.$store.state.text = "Transaction completed successfully";
          this.$store.state.snackbar = true;
        } catch (err) {
          
          console.log("Herrerre :",err);
          this.$store.state.color = "red";
          this.$store.state.text = "Transaction failed, something went wrong";
          this.$store.state.snackbar = true;
        } finally {
          this.$store.state.loading = false;
        }
      }
    },
  },
  async created() {
    try {
      this.selected = this.sortedItems[0].address;
      console.log("selected:",this.selected);
      await this.$store.dispatch("setCurrentAddress");
      this.currentAddress = this.$store.state.currentAddress;
       this.$store.state.currentTokenAddress=this.selected;
      
      
      

      // let yCrvBalance= await state.YCRV.methods.balanceOf(state.currentAddress).call();
      // yCrvBalance=await window.web3.utils.fromWei(yCrvBalance.toString(),'ether');
      this.contract = await new window.web3.eth.Contract(
        utils.ERC20Token,
        this.selected
      );
       await this.$store.dispatch('setFarmDetails');
      this.decimals = parseInt(await this.contract.methods.decimals().call());
      let balance = await this.contract.methods
        .balanceOf(this.currentAddress)
        .call();

      balance = await getbalance(this.decimals, balance);
      this.balance = balance;
      this.symbol = await this.contract.methods.symbol().call();

      // console.log(contract)

      //   var paymentEvent =  await this.$store.state.DAO.events.TokenAdded({fromBlock:0},
      //    async (error, result) => {
      //  if(result){
      //                 console.log(result)
      //  }
      //  else{
      //    console.log(error)
      //  }
      // });
    } catch (err) {
      console.log("Here 372:", err);
    }
  },
};
</script>
