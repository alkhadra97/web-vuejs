<template>
  <div v-if="getterForProfileLoading === true">
    <salarySlipVue />
  </div>
  <div v-else class="load"></div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import salarySlipVue from "../../../components/refactor/cards/salarySlip.vue";
import { getEmployeesSalariesService } from "../../../util/services/sharedServices";
export default {
  components: { salarySlipVue },
  data() {
    return {
      salaryObj: {},
    };
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),
  },
  computed: {
    ...mapGetters(["getterForProfileLoading"]),
  },
  mounted() {
    try {
      this.actionForEmployeeDataApi({
        employee_id: ["HRS-HRP-JOR-d8b5f446-dda3-41b3-b66d-879cd1ea1e60"],
      });
      // console.log(
      //   this.$route.params.hrPages.payslip,
      //   "$route.params.hrPages.payslip$route.params.hrPages.payslip"
      // );
    } catch (error) {
      console.log(error);
    }
  },
  watch: {},
};
</script>
<style scoped>
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
.load {
  width: 100px;
  height: 100px;
  margin: 110px auto 0;
  border: solid 10px #194569;
  border-radius: 50%;
  border-right-color: transparent;
  border-bottom-color: transparent;
  -webkit-transition: all 0.5s ease-in;
  -webkit-animation-name: rotate;
  -webkit-animation-duration: 1s;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;
  transition: all 0.5s ease-in;
  animation-name: rotate;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
</style>
