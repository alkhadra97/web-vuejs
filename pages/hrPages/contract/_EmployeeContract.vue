<template>
  <div v-if="$store.getters.getterForContractLoading">
    <v-container>
      <GoBack />
      <div class="contract-header-section">
        <p class="provider-contarct-title">Employee Contract</p>
        <span
          ><button
            class="contract-view-profile-btn"
            @click="viewProviderProfile"
          >
            View Profile
          </button></span
        >
      </div>
      <v-row class="pt-5">
        <v-col md="3" class="profile-user-info">
          <v-col md="12" class="user-profile-content">
            <div class="profile-subtitle">
              <h3>User Profile</h3>
              <v-row>
                <v-col md="12">
                  <small>Name</small>
                  <p>{{ info[0].firstName }} {{ info[0].lastName }}</p>
                  <small>Provider Number</small>
                  <p>{{ info[0].employeeNumber }}</p>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col md="12" class="user-profile-content">
            <div class="profile-subtitle">
              <h3>Personal Info</h3>
              <v-row>
                <v-col md="6">
                  <small>Gender</small>
                  <p>{{ info[0].gender }}</p>

                  <small>Martial Status</small>
                  <p>{{ info[0].maritalStatus }}</p>
                </v-col>
                <v-col md="6">
                  <small>Age</small>
                  <p>{{ formattedAge }} years old</p>
                  <small>Nationality</small>
                  <p>Jordanian</p>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col md="12">
            <div class="profile-subtitle">
              <h3>Contact Info</h3>
              <v-row>
                <v-col md="12">
                  <small>Email</small>
                  <p>{{ info[0].email }}</p>
                  <small>Phone Number</small>
                  <p>{{ info[0].phone }}</p>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-col>
        <v-col md="9" class="white">
          <v-col md="12">
            <div class="profile-subtitle">
              <v-row>
                <v-col md="12">
                  <div class="widget">
                    <div class="widget-head">
                      <span class="title">Profesional Info</span>
                    </div>
                    <v-row class="widget-body">
                      <v-col md="4">
                        <small>Job Title</small>
                        <p>Doctor</p>
                        <small>Work Type</small>
                        <p>Full Time</p>
                      </v-col>
                      <v-col md="4">
                        <small>Branch</small>
                        <p>N/A</p>
                        <small>Work Location</small>
                        <p>N/A</p>
                      </v-col>
                      <v-col md="4">
                        <small>Hiring Date</small>
                        <div class="font-weight-medium" v-if="contractInfo">
                          <p v-if="contractInfo[0]">
                            Date Of Join : {{ contractInfo[0].joiningDate }}
                          </p>
                          <p v-else>Date Of Join : N/A</p>
                        </div>
                        <small>End Of Employee Contract</small>
                        <p>{{ afterOneYear }}</p>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col md="12">
                  <div class="widget">
                    <div class="widget-head">
                      <span class="title">Salary Package</span>
                      <span>
                        <button
                          class="contract-view-payslip-btn"
                          @click="payslipbtn"
                          v-if="
                            $store.getters.tokenValue.profileType ==
                              'PROVIDER' ||
                            $store.getters.tokenValue.profileType == 'MANAGER'
                          "
                        >
                          Generate Payslip
                        </button>
                      </span>
                    </div>
                    <v-row class="widget-body">
                      <v-col md="3">
                        <small>Basic Salary</small>
                        <p>
                          {{ getSalaryForEmployee.Response[0].Salaries }}.00 JOD
                        </p>
                      </v-col>
                      <v-col md="3">
                        <small>Social Security Salary</small>
                        <p>
                          {{ getSalaryForEmployee.Response[0].Salaries }}.00 JOD
                        </p>
                      </v-col>
                      <v-col md="3">
                        <small>Total Salary</small>
                        <p>
                          {{ getSalaryForEmployee.Response[0].Salaries }}.00 JOD
                        </p>
                      </v-col>
                    </v-row>
                    <v-row class="widget-body">
                      <v-col md="3">
                        <small>Social Committee</small>
                        <p>1.00 JOD</p>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col md="12">
                  <div class="widget">
                    <div class="widget-head">
                      <span class="title">TimeOff Balance</span>
                    </div>
                    <v-row class="widget-body">
                      <v-col md="6">
                        <v-row class="justify-center">
                          <div class="pa-5">
                            <img
                              src="https://d2is554mdy16bu.cloudfront.net/assets/timeoff_emojis/house-b0169f734b2364319a8ecca412dd19ed4e05a95fbe326d3def934eaf442929c1.png"
                            />
                            <small>Annual Vacation</small>
                            <div>
                              <!-- <span class="actual-number-balance">{{
                                setSickAndAnnualBalances[0]
                                  .annualBalanceVacation
                              }}</span
                              > -->
                              <span class="left-days-balance">14</span>
                            </div>
                            <small>Days</small>
                          </div>
                        </v-row>
                      </v-col>
                      <v-col md="6">
                        <v-row>
                          <div class="pa-5">
                            <img
                              src="https://d2is554mdy16bu.cloudfront.net/assets/timeoff_emojis/sick-1b1f2fa79bdbb5b4b57bd4d61d466b1f81046d28c29085e4579d835d1ac2f5a4.png"
                            />
                            <small>Sick Days Off</small>
                            <div>
                              <!-- <span class="actual-number-balance">{{
                                setSickAndAnnualBalances[0].sickBalanceVacation
                              }}</span
                              > -->
                              <!-- <span class="left-days-balance">{{
                                setSickAndAnnualBalances[0].sickLeaveBalance
                              }}</span> -->
                            </div>
                            <small>Days</small>
                          </div>
                        </v-row>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div v-else class="load"></div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import GoBack from "../../../components/GoBack.vue";
import TheElipseActions from "../../../components/elipses/TheElipseActions.vue";

export default {
  layout: "dashboard",

  async mounted() {
    this.testparam = JSON.stringify(this.$route.params.EmployeeContract);

    this.actionForGettingSalaryForProvider(this.$route.params.EmployeeContract);
    await this.getEmployees(this.$route.params.EmployeeContract);

    await this.actionsForGettingAllBalances(
      this.$route.params.EmployeeContract
    );
    this.actionForContractInfo(this.employeeUuid);
  },
  data() {
    return {
      salaryDialog: false,
      idForProviderIn: null,
      uuidForProviderIn: null,
      nameForProviderIn: null,
      lastNameForProviderIn: null,
      ageForProviderIn: null,
      genderForProviderIn: null,
      phoneForProviderIn: null,
      educationForProviderIn: null,
      categoryIdForProviderIn: null,
      minorForProvider: null,
      statusForProviderIn: null,
      contractInfo: null,
    };
  },
  methods: {
    ...mapActions([
      "actionForGettingSalaryForProvider",
      "actionsForGettingAllBalances",
      "getEmployees",
      "actionForContractInfo",
    ]),

    viewProviderProfile() {
      this.$router.push(
        "/providerfullscreen/" + this.$route.params.EmployeeContract
      );
    },
    payslipbtn() {
      this.$router.push(
        "/hrpages/payslip/" + this.$route.params.EmployeeContract
      );
    },
    updateBtn() {
      this.salaryDialog = true;
    },
  },
  computed: {
    ...mapGetters([
      "getSalaryForEmployee",
      "info",
      "setSickAndAnnualBalances",
      "getterForContractInfo",
    ]),
    formattedAge() {
      let birth = new Date(this.ageForProviderIn);
      let now = new Date();
      let beforeBirth =
        (() => {
          birth.setDate(now.getDate());
          birth.setMonth(now.getMonth());
          return birth.getTime();
        })() < birth.getTime()
          ? 0
          : 1;
      return now.getFullYear() - birth.getFullYear() - beforeBirth;
    },
    afterOneYear() {
      if (this.getterForContractInfo.resp[0]) {
        let dateString = this.getterForContractInfo.resp[0].joiningDate;
        let mydate = new Date(dateString + "T00:00:00");
        let b = mydate.toDateString();
        const dateCopy = new Date(mydate.getTime());

        dateCopy.setFullYear(mydate.getFullYear() + 1);
        return dateCopy.toDateString();
      } else {
        return "N / A";
      }
    },
  },
  watch: {
    getterForContractInfo() {
      this.contractInfo = this.getterForContractInfo.resp;
    },
  },
  components: { GoBack, TheElipseActions },
};
</script>

<style scoped>
.contract-header-section {
  margin-top: 2em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.contract-view-profile-btn {
  color: #35b5ac;
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 37px;
}
.contract-view-profile-btn:hover {
  border-bottom: 1px solid #35b5ac;
}
.provider-contarct-title {
  margin-top: 1em;
  /* margin-left: 2.9em; */
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 37px;
  border-bottom: 1px solid #cfcccc;
  width: 20%;
}
.user-profile-content {
  margin-bottom: 1em;
  /* margin-left: 2.9em; */

  border-bottom: 1px solid #cfcccc;
  width: 80% !important;
}
.profile-subtitle {
  margin-bottom: 18px;
  font-size: 16px;
  font-weight: 600;
}
.profile-user-info {
  background-color: #f5f5f5;
  margin-bottom: 30px;
}
.profile-user-info small {
  color: #8b8b8b;
}

.profile-user-info p {
  font-weight: 600;
}
.widget {
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid #eeeeee;
}
.widget-head {
  display: flex;
  justify-content: space-between;
}
.widget > .widget-head .title {
  font-size: 1.5rem !important;
}
.widget small {
  color: #8b8b8b;
}
.widget p {
  font-weight: 600;
  font-size: 1.2rem;
}
.contract-view-payslip-btn {
  color: #35b5ac;
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 37px;
}
.contract-view-payslip-btn:hover {
  border-bottom: 1px solid #35b5ac;
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
