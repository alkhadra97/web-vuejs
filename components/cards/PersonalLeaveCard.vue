<template>
  <v-card width="590" class="annual-card elevation-5" height="350">
    <v-row>
      <v-col md="6">
        <div class="d-flex align-center">
          <div class="ml-3">
            <img
              class="emoji-img"
              src="https://d2is554mdy16bu.cloudfront.net/assets/timeoff_emojis/house-b0169f734b2364319a8ecca412dd19ed4e05a95fbe326d3def934eaf442929c1.png"
            />
          </div>

          <div class="pa-5">
            <div>Personal Vacation</div>
            <div>
              <!-- <span class="actual-number-balance">{{
                setSickAndAnnualBalances[0].annualBalanceVacation
              }}</span> -->
              <span class="left-days-balance" v-if="setSickAndAnnualBalances[0]"
                >{{ setSickAndAnnualBalances[0].personalLeaveBalance }}/14</span
              >
              <span class="left-days-balance" v-else>0/14</span>
            </div>
            <div>Days</div>
          </div>
        </div>
      </v-col>
      <v-col md="6">
        <div class="emoji-box">
          <div>
            <v-btn
              v-if="$store.getters.tokenValue.profileType != 'MANAGER'"
              class="showLeaveBtn ml-7 mt-4"
              @click="personalLeaveDialog = !personalLeaveDialog"
              >Request Personal Leave</v-btn
            >
          </div>
        </div>
      </v-col>
    </v-row>
    <v-divider class="mx-4"></v-divider>
    <v-row>
      <table class="table-requests">
        <thead>
          <tr>
            <th>Request Type</th>
            <!-- <th>Apply Date</th> -->
            <th>From</th>
            <th>To</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody v-for="(item, index) in filteredData" :key="index">
          <template v-if="item.leaveType == 'personal'">
            <tr>
              <td data-column="ID">{{ item.subLeaveType }}</td>
              <!-- <td data-column="ID">{{ item.applyDate }}</td> -->
              <td data-column="USERNAME">
                {{ item.DateFrom }}
              </td>
              <td data-column="SERVICE">
                {{ item.dateTo }}
              </td>
              <td data-column="ID">
                <span
                  :class="[
                    item.isApproved == 'accepted' ? 'acceptedLeave' : null,
                    item.isApproved == 'on hold' ? 'orginalStatus' : 'null',
                    item.isApproved == 'refused' ? 'refusedLeave' : 'null',
                    item.isApproved == 'New' ? 'New' : 'null',
                    item.isApproved == 'pending' ? 'pending' : 'null',
                    item.isApproved == 'updated' ? 'pending' : 'null',
                  ]"
                >
                  {{ item.isApproved }}</span
                >
              </td>
              <td v-if="item.isApproved == 'pending'">
                <button @click="openUpdateRequestDialog(item.id)">
                  <v-icon color="teal">mdi-view-headline</v-icon>
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <!-- <v-row v-else class="align-center justify-center">
        <h2 class="teal--text">THERE IS NO REQUESTS</h2>
      </v-row> -->
    </v-row>
    <v-divider class="mx-7 mt-2 text-center align-center"></v-divider>

    <v-row class="justify-center mt-0">
      <v-card-actions>
        <button
          class="contract-view-payslip-btn"
          @click="viewHistory"
          v-if="$store.getters.tokenValue.profileType != 'MANAGER'"
        >
          View History
        </button>
      </v-card-actions>
    </v-row>
    <PersonalLeaveForm
      :personalLeaveDialog.sync="personalLeaveDialog"
      :employeeUuid="employeeUuid"
      :nameForProviderIn="nameForProviderIn"
      :idForProviderIn="idForProviderIn"
    />
    <UpdateLeaveEmployee
      :updateLeaveDialog.sync="updateLeaveDialog"
      :leaveId="idForPersonaleaveRequestWantToUpdate"
    />
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import PersonalLeaveForm from "../dialogs/PersonalLeaveForm.vue";
import UpdateLeaveEmployee from "../dialogs/updateLeaveEmployee.vue";

export default {
  props: {
    employeeUuid: {
      type: String,
    },
    nameForProviderIn: {
      type: String,
    },
    idForProviderIn: {
      type: Number,
    },
  },
  data() {
    return {
      personalLeaveDialog: false,
      updateLeaveDialog: false,
      idForPersonaleaveRequestWantToUpdate: null,
      filteredData: [],

      data: [],
    };
  },
  async mounted() {
    await this.actionForGettingAllLeaveWork(this.employeeUuid);

    this.getData();
  },
  methods: {
    ...mapActions(["actionForGettingAllLeaveWork"]),

    openUpdateRequestDialog(id) {
      this.actionForGettingAllLeaveWork(this.employeeUuid);

      this.idForPersonaleaveRequestWantToUpdate = id;
      this.updateLeaveDialog = !this.updateLeaveDialog;
      // console.log(this.updateLeaveDialog, "this.updateLeaveDialog");
    },
    async getData() {
      const arr = [];
      this.getAllLeaveForProviders.data.resp.reverse().forEach((element) => {
        if (element.leaveType == "personal") {
          arr.push({
            id: element.id,
            providerUuid: element.providerUuid,
            employeeName: element.employeeName,
            applyDate: element.applyDate,
            DateFrom: element.DateFrom,
            dateTo: element.dateTo,
            timeFrom: element.timeFrom,
            timeTo: element.timeTo,
            leaveType: element.leaveType,
            subLeaveType: element.subLeaveType,
            howManyDaysEmployeeAskedFor: element.howManyDaysEmployeeAskedFor,
            howManyHoursEmployeeAskedFor: element.howManyHoursEmployeeAskedFor,
            isApproved: element.isApproved,
          });
        }
      });
      this.data = arr;
      this.filteredData = this.data.slice(0, 2);
    },
    viewHistory() {
      this.$router.push(
        "/hrpages/businessHistory/" + this.employeeUuid + "--" + "personal"
      );
    },
  },
  watch: {
    getAllLeaveForProviders() {
      this.getData();
    },
  },
  computed: {
    ...mapGetters(["getAllLeaveForProviders", "setSickAndAnnualBalances"]),
  },
  components: { PersonalLeaveForm, UpdateLeaveEmployee },
};
</script>
<style scoped>
.showLeaveBtn {
  font-family: "CircularStd", sans-serif !important;

  background-color: #4dccc6;
  background-image: linear-gradient(315deg, #4dccc6 0%, #96e4df 74%);
  color: white;
  padding: 0.9em 1em !important;
  font-size: 0.7rem !important;
  cursor: pointer;
  outline-style: none;
  border-radius: 5px;
  cursor: pointer;
}
.actual-number-balance {
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  color: #000000;
}
.left-days-balance {
  font-size: 16px;
  line-height: 20px;
  color: #62769d;
}
.New {
  background: transparent;
  border: #2196f3 solid 1px !important;
  border-radius: 5px;
  color: #2196f3;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
}
.updated {
  background: transparent;
  border: orange solid 1px !important;
  border-radius: 5px;
  color: rgb(255, 166, 1);
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
}
.acceptedLeave {
  background: transparent;
  border: #35b5ac solid 1px !important;
  border-radius: 5px;
  color: #35b5ac;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
}
.pending {
  background: transparent;
  border: orange solid 1px !important;
  border-radius: 5px;
  color: rgb(255, 166, 1);
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
}
.refusedLeave {
  background: transparent;
  border: red solid 1px !important;
  border-radius: 5px;
  color: red;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
}
.contract-view-payslip-btn {
  color: #35b5ac;
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 37px;
}
.table-requests {
  border-collapse: collapse;
  margin: 30px auto;
}
.table-workingHours {
  width: 30vw;
  border-collapse: collapse;
  margin: 30px auto;
}
.table-attendance {
  width: 25vw;
  border-collapse: collapse;
  margin: 30px auto;
}
th {
  background: #35b5ac;
  color: white;
  font-weight: bold;
}

td,
th {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
  font-size: 1.1rem;
}
@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
  table {
    width: 100%;
  }

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #ccc;
  }

  td {
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    /* Now like a table header */
    position: absolute;
    /* Top/left values mimic padding */
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    /* Label the data */
    content: attr(data-column);

    color: #000;
    font-weight: bold;
  }
}
</style>
