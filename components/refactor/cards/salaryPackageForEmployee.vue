<template>
  <v-card class="pa-4 mb-3 elevation-5s" style="width: 100%">
    <v-card color="#91AEC4" height="40" class="mb-5">
      <div class="d-flex justify-space-around">
        <p class="salary_card_title">Salary Package</p>
        <!-- <v-icon>mdi-pencil</v-icon> -->
      </div>
    </v-card>

    <v-row>
      <v-col md="6" class="py-1">
        <div class="annual-title-section">Basic Salary</div>
      </v-col>
      <!-- <v-col md="6" v-if="getSalaryForEmployee.Response[0]">
              {{ getSalaryForEmployee.Response[0].Salaries }}.00 JOD
            </v-col> -->
      <v-col md="6" class="py-1"> 300.00 JOD </v-col>
    </v-row>
    <v-row>
      <v-col md="6" class="py-1">
        <div>Bank Name</div>
      </v-col>
      <v-col md="6" class="py-1">
        <div>Etihad</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6" class="py-1">
        <div>Account Number</div>
      </v-col>
      <v-col md="6" class="py-1">
        <div>N/A</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6" class="py-1">
        <div>Social Security Salary</div>
      </v-col>
      <v-col md="6" class="py-1">
        <div>21</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6" class="py-1">
        <div>Total Salary</div>
      </v-col>
      <v-col md="6" class="py-1">
        <div>279.00 JOD</div>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    employeeId: {
      type: String,
    },
  },

  computed: {
    ...mapGetters(["getterForSalariesData"]),
  },
  methods: {
    ...mapActions(["actionForGetSalariesDataApi"]),
    payslipbtn() {
      this.$router.push("/hrpages/payslip/" + this.employeeId);
    },
    async renderData() {
      await this.actionForGetSalariesDataApi();
    },
  },
  async mounted() {
    await this.renderData();
    console.log(
      this.getterForSalariesData,
      "this.getterForSalariesDatathis.getterForSalariesDatathis.getterForSalariesDatathis.getterForSalariesData"
    );
  },
};
</script>
<style scoped></style>
