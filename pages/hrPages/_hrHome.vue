<template>
  <!-- <div v-else class="load"></div> -->
  <v-container>
    <v-tabs v-model="tabs">
      <v-tabs-slider circle color="GlobalStyles.primary1"> </v-tabs-slider>
      <v-tab class="tabs-font GlobalStyles.primary1--text font-weight-bold"
        >My HR</v-tab
      >
      <v-tab-item>
        <div class="mt-5 mx-5">
          <!-- <v-btn @click="goSalarySlip"> slip </v-btn> -->
          <v-row class="justify-center">
            <MainScreen :employeeId="$route.params.hrHome" :ciamId="ciamId" />
          </v-row>
          <v-row>
            <v-col md="12">
              <TogglingTables
                :employeeId="$route.params.hrHome"
                :ciamId="ciamId"
              />
            </v-col>
          </v-row>
        </div>
      </v-tab-item>
      <v-tab class="tabs-font GlobalStyles.primary1--text font-weight-bold"
        >Profile</v-tab
      >

      <v-tab-item>
        <EmployeeProfile :employeeId="$route.params.hrHome" :ciamId="ciamId" />
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import TogglingTables from "../../components/refactor/bottomSection/togglingTables.vue";
import MainScreen from "../../components/refactor/myHrUpperSection/mainScreen.vue";
import EmployeeProfile from "../../components/refactor/cards/employeeProfile.vue";

// import requestBuilder from "../../requestBuilder";

export default {
  name: "HrHome",
  layout: "dashboard",
  components: {
    TogglingTables,
    MainScreen,
    EmployeeProfile,
  },

  data() {
    return {
      //////////////////////////
      ///quick action buttons at bottom
      ciamId: null,
      direction: "top",
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: "slide-y-reverse-transition",
    };
  },

  computed: {
    ...mapGetters(["getterForEmployeesInformation"]),
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),
    async renderData() {
      await this.actionForEmployeeDataApi({
        employee_id: [this.$route.params.hrHome],
      });
      if (this.getterForEmployeesInformation.row.employees) {
        this.ciamId =
          this.getterForEmployeesInformation.row.employees.ciamMtUserId;
        1;
      }
    },
  },
  mounted() {
    try {
      // this.actionForEmployeeDataApi({
      //   employee_id: [this.$route.params.hrHome],
      // });
      this.renderData();
    } catch (e) {
      console.log(e);
    }
  },
  watch: {
    top(val) {
      this.bottom = !val;
    },
    right(val) {
      this.left = !val;
    },
    bottom(val) {
      this.top = !val;
    },
    left(val) {
      this.right = !val;
    },
  },
};
</script>

<style scoped>
.speed-dial-position {
  bottom: 16em;
}
.tabs-font {
  font-size: 1.152rem;
}
.hr-title {
  margin-top: 1em;
  margin-left: 2.9em;
  font-style: normal;
  font-weight: normal;
  font-size: 32px;
  line-height: 37px;
  border-bottom: 1px solid #e0dede;
  width: 20%;
}

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
  border: solid 10px #009688;
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
