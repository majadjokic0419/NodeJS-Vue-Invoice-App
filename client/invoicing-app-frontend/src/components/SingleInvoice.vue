<template>
  <div class="single-page">
    <Header/>
    <!--  display invoice data -->
    <div class="invoice">
      <!-- display invoice name here -->
      <div class="container">
        <div class="row">
            <div class="col-md-12">
              <h3>Invoice  #{{ this.$route.params.invoice_id }}</h3>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Transaction Name</th>
                    <th scope="col">Price ($)</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="txn in transactions" :key="txn.id">
                    <tr >
                      <th>{{ txn.id }}</th>
                      <td>{{ txn.name }}</td>
                      <td>{{ txn.price }} </td>
                    </tr>
                  </template>
                </tbody>
                <tfoot>
                  <td></td>
                  <td style="text-align: right">Total :</td>
                  <td><strong>$ {{ total_price }}</strong></td>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import Header from "./Header";
import axios from "axios";
export default {
  name: "SingleInvoice",
  components: {
    Header
  },
  data() {
    return {
      invoice_id:"",
      invoice: {},
      transactions: [],
      user: "",
      total_price: 0,
      company:""
    };
  },
 
  mounted() {
    // make request to fetch invoice data
     
     let user_id=this.$route.params.user_id
     let company=this.$route.params.company;
    
    
    let invoice_id = this.$route.params.invoice_id;
    axios
      .get(`http://localhost:3000/invoice/user/${user_id}/${invoice_id}`,{withCredentials: true} )
      .then(res => {
        if (res.data.status == true) {
          this.transactions = res.data.transactions;
          let total = 0;
          this.transactions.forEach(element => {
            total += parseInt(element.price);
          });
          this.total_price = total;
          this.company=company;
        }
      });
  }
};
</script>
<style scoped>
h1,
h2 {
  font-weight: normal;
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
  color: #426cb9;
}
.single-page {
  background-color: #ffffffe5;
}
.invoice{
  margin-top: 20px;
}
</style>