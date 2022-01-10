<template>
  <div>
    <div class="tab-pane p-3 fade show active">
      <div class="row">
        <div class="col-md-12">
          <h3>Here is a list of your invoices</h3>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Invoice #</th>
                <th scope="col">Invoice Name</th>
                <th scope="col">Status</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="invoice in invoices" :key="invoice.id">
                <tr>
                  <th scope="row">{{ invoice.id }}</th>
                  <td>{{ invoice.name }}</td>
                  <td v-if="invoice.paid == 0">Unpaid</td>
                  <td v-else>Paid</td>
                  <td><div><button class="btn-primary" @click="ComponentOne(invoice.id)"> View </button>
                  <template><SingleInvoice v-if="showComponent"/></template></div></td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SingleInvoice from './SingleInvoice'

export default {
  
  name: "ViewInvoices",
  components: {SingleInvoice},
  data() {
    return {
      showComponent: false,
      invoices: [],
      user:"",
      invoice_id:''
    };
  },
methods: {
  
    ComponentOne (inv_id) {
      this.showComponent = !this.showComponent;
      if(this.showComponent){
        
       this.user_id=this.$route.params.user_id
       this.name=this.$route.params.name
       this.company=this.$route.params.company
       
    
        this.$router.push({ name: 'SingleInvoice', params: { invoice_id: inv_id, user_id:this.user_id,name:this.name, company_name:this.company} })
      }}
    },
mounted() {

    const user = {
        user_id:this.$route.params.user_id,
        name:this.$route.params.name,
        company:this.$route.params.company,
    };
    const id=user.user_id;
    axios
      .get(`http://localhost:3000/invoice/user/${id}`,{withCredentials: true})
      .then(res => {
        if (res.data.status == true) {
          console.log(res.data.invoices);
          this.invoices = res.data.invoices;
          console.log(this.invoices);
        }
      });
  }
};
</script>
