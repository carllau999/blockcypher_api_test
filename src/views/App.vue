<template>
   <div id="app">
      <img src=".././assets/blockcypher.png" width="100px" height="100px">
      <h1 class="mt-3">BlockCypher API</h1>
      <div class="container">
         <section>
            <template>
               <div class="main">
                  <el-button type="primary" @click="handleBalance(address1)" style="display:inline-block; margin: 4%;">Get User1 Balance</el-button>
                  <el-button type="primary" @click="handleBalance(address2)" style="display:inline-block; margin: 4%;">Get User2 Balance</el-button>
                  <div class="text"> Input funding amount </div>
                  <el-input-number v-model="amount" :min="1" style="display: inline-block;"></el-input-number>
                  <el-button type="primary" @click="handleFunding(address1)" style="display: inline-block;">Fund User1</el-button>
                  <el-button type="primary" @click="handleFunding(address2)" style="display: inline-block;">Fund User2</el-button>
               </div>
               <div class="text" style="margin:4%;">Payment from User1 to User2</div>
               <el-input-number v-model="transaction_amount" :min="1" style="display: inline-block;"></el-input-number>
               <el-button type="primary" @click="handlePayment(address1, address2)" style="display: inline-block;">Transaction from User1 to User2</el-button>
               <div class="text" style="margin-top: 1%;margin-bottom: -4%;">User 1: <br></div>
               <iframe src="https://live.blockcypher.com/widget/bcy/BwiPnFVCGTFZxqyqZ3fWAnKhoM7LKy5Zh6/balance/" style="overflow:hidden; margin:4%;" frameborder="0"></iframe>
               <div class="text" style="margin-top: -3%;" >User 2: <br></div>
               <iframe src="https://live.blockcypher.com/widget/bcy/Bwq4KRuLWTuLBpN3x2KVjCpAZKeJBsMZQg/balance/" style="overflow:hidden;" frameborder="0"></iframe>
            </template>
         </section>
         <section>
            <el-dialog title="Summary" :visible.sync="balanceVisible" :close-on-click-modal="false" >
               <div>
                  Address: {{address}} <br>
                  Total Sent: {{sent}} <br>
                  Unconfirmed Balance: {{unconfirmed_balance}}<br>
                  Confirmed Balance: {{balance}}<br>
                  Final Balance: {{ final_balance }}
               </div>
               <div slot="footer" class="dialog-footer">
                  <el-button @click.native="balanceVisible = false">Close</el-button>
               </div>
            </el-dialog>
         </section>
      </div>
   </div>
</template>

<script>
import {getBalance, fundAccount, makePayment} from './index.js'
import axios from 'axios'

export default {
  name: 'app',
  methods: {
  handleBalance: function(addr) {
    this.loading = true // initializes loading
    getBalance(addr).then(res => {
      // check if api call succesful
      if(res == undefined || res == null || res.hasOwnProperty('errors')){
        this.$notify.error({
          title: 'Error',
          message: 'Funding Unsuccessful'
        })
        this.$notify.info({
          title: 'Message',
          message: res.errors.response.data.errors[0].error, // shows error message from api
          offset: 80
        });
      }
      else{
        // sets dynamically displayed text
        this.unconfirmed_balance = res.unconfirmed_balance
        this.sent = res.total_sent
        this.address = addr
        this.balance = res.balance
        this.final_balance = res.final_balance
        
        this.balanceVisible = true; // displays pop up
      }
      this.loading = false
    })
    
   },
   handleFunding: function(addr){
    this.loading = true
    // check if api call succesful
    fundAccount(addr, this.amount).then(res => {
      if(res == undefined || res == null || res.hasOwnProperty('errors')){
        this.$notify.error({
          title: 'Error',
          message: 'Funding Unsuccessful'
        })
        this.$notify.info({
          title: 'Message',
          message: res.errors.response.data.errors[0].error, // shows error message from api
          offset: 80
        });
      }
      else{
        // generate notifications
        this.$notify({
            title: 'Success',
            message: 'Succesfully Funded!',
            type: 'success'
          });
        this.$notify.info({
            title: 'tx_ref',
            message: res.tx_ref,
            offset: 80
          });
      }
      this.loading = false
    })
   },
   handlePayment: function(addr, addr2){
    this.loading = true
    makePayment(addr, addr2, this.transaction_amount).then(res => {
      // Checks if transaction was successful
      if(res == undefined || res == null || res.hasOwnProperty('errors')){
        this.$notify.error({
          title: 'Error',
          message: 'Transaction Unsuccessful!'
        })
        this.$notify.info({
          title: 'Message',
          message: res.errors.response.data.errors[0].error, // shows error message from api
          offset: 80
        });
      }
      else{
        // generate notificatons
        this.$notify({
            title: 'Success',
            message: 'Transaction Succesful!',
            type: 'success'
          });
        this.$notify.info({
          title: 'hash',
          message: res,
          offset: 80
        });
      }

      this.loading = false
    })
   }
 },
  data () {
    return {
      amount: 1, // amount to be funded
      transaction_amount: 1, // amount used for transaction
      sent: '',
      loading: false,
      balanceVisible: false,
      address: '',
      address1: 'BwiPnFVCGTFZxqyqZ3fWAnKhoM7LKy5Zh6', // address of user1
      address2: 'Bwq4KRuLWTuLBpN3x2KVjCpAZKeJBsMZQg', // address of user2
      unconfirmed_balance: '',
      balance: '',
      final_balance: ''

    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
main{
  text-align: center;

}
text{
  text-align: center;
}
h1, h2 {
  font-weight: normal;
}

h5 {
   margin-bottom: 0px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

</style>
