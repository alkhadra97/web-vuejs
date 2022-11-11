<template>
  <v-card class="pa-5 mt-5 elevation-5" v-if="getSalaryForEmployee">
    <div class="card-header-salary mb-3">
      <span class="salary-contract-header">Salary Package</span>

      <button
        class="contract-view-payslip-btn"
        @click="payslipbtn"
        v-if="
          $store.getters.tokenValue.profileType == 'PROVIDER' ||
          $store.getters.tokenValue.profileType == 'MANAGER'
        "
      >
        Generate Payslip
      </button>
    </div>
    <div class="salary-section">
      <v-col md="4">
        <div class="annual-balance-section">
          <div class="annual-title-section">Basic Salary</div>
          <div
            class="annual-numbers-section"
            v-if="getSalaryForEmployee.Response[0]"
          >
            {{ getSalaryForEmployee.Response[0].Salaries }}.00 JOD
          </div>
          <div class="annual-numbers-section" v-else>N/A</div>
        </div>
      </v-col>
      <v-col md="4">
        <div class="annual-balance-section">
          <div class="annual-title-section">Social Security Salary</div>
          <div
            class="annual-numbers-section"
            v-if="getSalaryForEmployee.Response[0]"
          >
            {{ getSalaryForEmployee.Response[0].Salaries }}.00 JOD
          </div>
          <div class="annual-numbers-section" v-else>N/A</div>
        </div>
      </v-col>
      <v-col md="4">
        <div class="annual-balance-section">
          <div class="annual-title-section">Total Salary</div>
          <div
            class="annual-numbers-section"
            v-if="getSalaryForEmployee.Response[0]"
          >
            {{ getSalaryForEmployee.Response[0].Salaries }}.00 JOD
          </div>
          <div class="annual-numbers-section" v-else>N/A</div>
        </div>
      </v-col>
    </div>
    <div class="bank-section">
      <v-col md="4">
        <div class="annual-balance-section">
          <div class="annual-title-section">Bank Name</div>
          <div class="annual-numbers-section">Bank al Etihad</div>
        </div>
      </v-col>
      <v-col md="4">
        <div class="annual-balance-section">
          <div class="annual-title-section">Account Number</div>
          <div class="annual-numbers-section">N/A</div>
        </div>
      </v-col>
      <v-col md="4">
        <div class="annual-balance-section">
          <div class="annual-title-section">IBAN</div>
          <div class="annual-numbers-section">N/A</div>
        </div>
      </v-col>
    </div>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    employeeUuid: {
      type: String,
    },
  },
  async mounted() {
    await this.actionForGettingSalaryForProvider(this.employeeUuid);
  },
  methods: {
    ...mapActions(["actionForGettingSalaryForProvider"]),
    payslipbtn() {
      this.$router.push("/hrpages/payslip/" + this.employeeUuid);
    },
  },
  computed: {
    ...mapGetters(["getSalaryForEmployee"]),
  },
};
</script>
<style scoped>
.card-header-salary {
  display: flex;
  justify-content: space-between;
}
.contract-view-payslip-btn {
  color: #35b5ac;
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 37px;
}
.salary-contract-header {
  font-weight: 600;
  font-size: 1.5rem;
}
.salary-card {
  border-radius: 10px;
}
.salary-section {
  display: flex;
  border-bottom: solid 0.5px #eeeeee;
  margin: 1em 0.4em;
  padding-bottom: 0.5em;
}
.bank-section {
  display: flex;
}
</style>
