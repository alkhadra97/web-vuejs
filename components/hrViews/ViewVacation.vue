<template>
  <v-row>
    <v-col md="12">
      <div v-if="filteredData.length != 0">
        <v-card
          class="ma-2"
          v-for="(item, index) in filteredData"
          :key="index"
          @click="
            viewLeaveDetails(
              item.id,
              item.employeeName,
              item.providerUuid,
              item.applyDate,
              item.DateFrom,
              item.dateTo,
              item.timeFrom,
              item.timeTo,
              item.leaveType,
              item.subLeaveType,
              item.howManyDaysEmployeeAskedFor,
              item.howManyHoursEmployeeAskedFor,
              item.isApproved,
              item.reasonFromEmployee,
              item.EmployeeId
            )
          "
        >
          <div class="leave-card-content">
            <v-col md="3">
              <p class="employee-leave-name">Dr.{{ item.employeeName }}</p>
            </v-col>
            <v-col md="5">
              <p class="leave-time" v-if="item.DateFrom !== item.dateTo">
                <span class="leave-times-from-to">From:</span>
                {{ item.DateFrom }} --
                <span class="leave-times-from-to">To:</span>
                {{ item.dateTo }}
              </p>
              <p class="leave-time" v-else>
                <span class="leave-times-from-to">From:</span>
                {{ item.timeFrom }} --
                <span class="leave-times-from-to">To:</span>
                {{ item.timeTo }}
              </p>
            </v-col>
            <v-col md="3">
              <v-row class="justify-space-around">
                <span
                  :class="[
                    item.isApproved == 'accepted' ? 'acceptedLeave' : null,
                    item.isApproved == 'on hold' ? 'orginalStatus' : 'null',
                    item.isApproved == 'refused' ? 'refusedLeave' : 'null',
                    item.isApproved == 'New' ? 'New' : 'null',
                    item.isApproved == 'updated' ? 'updated' : 'null',
                  ]"
                >
                  {{ item.isApproved }}</span
                >
                <!-- </v-col>
                <v-col md="1"> -->
                <TheElipseActions
                  v-if="
                    $store.getters.tokenValue.profileType != 'RECEPTIONIST' &&
                    $store.getters.tokenValue.profileType != 'PROVIDER'
                  "
                  @acceptBtn="
                    acceptLeaveRequestBtn(
                      item.id,
                      item.howManyDaysEmployeeAskedFor,
                      item.howManyHoursEmployeeAskedFor,
                      item.providerUuid,
                      item.leaveType
                    )
                  "
                  @rejectBtn="rejectLeaveRequest(item.id)"
                  @deleteBtn="deleteLeaveRequest(item.id)"
                  @updateBtn="
                    updateBtn(
                      item.id,
                      item.employeeName,
                      item.providerUuid,
                      item.applyDate,
                      item.DateFrom,
                      item.dateTo,
                      item.timeFrom,
                      item.timeTo,
                      item.leaveType,
                      item.subLeaveType,
                      item.howManyDaysEmployeeAskedFor,
                      item.howManyHoursEmployeeAskedFor,
                      item.isApproved,
                      item.reasonFromEmployee,

                      item.EmployeeId
                    )
                  "
                />
              </v-row>
            </v-col>
          </div>
        </v-card>
      </div>
      <div v-else>
        <v-card
          class="ma-2"
          v-for="(item, index) in filteredData2"
          :key="index"
          @click="
            viewLeaveDetails(
              item.id,
              item.employeeName,
              item.providerUuid,
              item.applyDate,
              item.DateFrom,
              item.dateTo,
              item.timeFrom,
              item.timeTo,
              item.leaveType,
              item.subLeaveType,
              item.howManyDaysEmployeeAskedFor,
              item.howManyHoursEmployeeAskedFor,
              item.isApproved,
              item.reasonFromEmployee,
              item.EmployeeId
            )
          "
        >
          <div class="leave-card-content">
            <v-col md="3">
              <p class="employee-leave-name">Dr.{{ item.employeeName }}</p>
            </v-col>
            <v-col md="5">
              <p class="leave-time" v-if="item.DateFrom !== item.dateTo">
                <span class="leave-times-from-to">From:</span>
                {{ item.DateFrom }} --
                <span class="leave-times-from-to">To:</span>
                {{ item.dateTo }}
              </p>
              <p class="leave-time" v-else>
                <span class="leave-times-from-to">From:</span>
                {{ item.timeFrom }} --
                <span class="leave-times-from-to">To:</span>
                {{ item.timeTo }}
              </p>
            </v-col>
            <v-col md="3">
              <v-row class="justify-space-around">
                <span
                  :class="[
                    item.isApproved == 'accepted' ? 'acceptedLeave' : null,
                    item.isApproved == 'on hold' ? 'orginalStatus' : 'null',
                    item.isApproved == 'refused' ? 'refusedLeave' : 'null',
                    item.isApproved == 'New' ? 'New' : 'null',
                    item.isApproved == 'updated' ? 'updated' : 'null',
                  ]"
                >
                  {{ item.isApproved }}</span
                >
                <!-- </v-col>
                <v-col md="1"> -->
                <TheElipseActions
                  v-if="
                    $store.getters.tokenValue.profileType != 'RECEPTIONIST' &&
                    $store.getters.tokenValue.profileType != 'PROVIDER'
                  "
                  @acceptBtn="
                    acceptLeaveRequestBtn(
                      item.id,
                      item.howManyDaysEmployeeAskedFor,
                      item.howManyHoursEmployeeAskedFor,
                      item.providerUuid,
                      item.leaveType
                    )
                  "
                  @rejectBtn="rejectLeaveRequest(item.id)"
                  @deleteBtn="deleteLeaveRequest(item.id)"
                  @updateBtn="
                    updateBtn(
                      item.id,
                      item.employeeName,
                      item.providerUuid,
                      item.applyDate,
                      item.DateFrom,
                      item.dateTo,
                      item.timeFrom,
                      item.timeTo,
                      item.leaveType,
                      item.subLeaveType,
                      item.howManyDaysEmployeeAskedFor,
                      item.howManyHoursEmployeeAskedFor,
                      item.isApproved,
                      item.reasonFromEmployee,

                      item.EmployeeId
                    )
                  "
                />
              </v-row>
            </v-col>
          </div>
        </v-card>
      </div>

      <!-- <v-pagination
        v-model="page"
        :length="pages"
        @input="changePage"
        class=""
        height="100%"
      ></v-pagination> -->
      <PersonalLeaveForm
        :personalLeaveDialog.sync="personalLeaveDialog"
        :employeeNameForUpdatePersonalLeave="employeeNameForUpdatePersonalLeave"
        :applyDateForUpdatePersonalLeave="applyDateForUpdatePersonalLeave"
        :dateFromForUpdatePersonalLeave="dateFromForUpdatePersonalLeave"
        :dateToForUpdatePersonalLeave="dateToForUpdatePersonalLeave"
        :timeFromForUpdatePersonalLeave="timeFromForUpdatePersonalLeave"
        :timeToForUpdatePersoanlLeave="timeToForUpdatePersoanlLeave"
        :howManyDaysEmployeeAskedForUpdate="howManyDaysEmployeeAskedFor"
        :howManyHoursEmployeeAskedForUpdate="howManyHoursEmployeeAskedFor"
        :reasonFromEmployeeForUpdate="reasonFromEmployeeForUpdate"
        :personalLeaveTypeForUpdate="personalLeaveType"
        :statusForUpdatePersonalLeave="statusForPersonalLeave"
        :idForUpdatePersonalLeave="idForUpdatePersonalLeave"
        :idForEmployeeUpdate="idForEmployeeUpdate"
        :employeeUuidForUpdatePersonalLeave="employeeUuidForUpdatePersonalLeave"
      />

      <DeleteDialog :dialog3.sync="dialog3" />
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import requestBuilder from "../../requestBuilder";

import TheElipseActions from "../elipses/TheElipseActions.vue";
import DeleteDialog from "../dialogs/DeleteDialog.vue";
import PersonalLeaveForm from "../dialogs/PersonalLeaveForm.vue";

export default {
  async mounted() {
    await this.actionForGettingAllLeaveWork({
      providerUuid: null,
      dateFromFiltred: null,
      dateToFiltred: null,
    });
    this.getData();
  },
  // created() {
  //   this.getData();
  // },
  data() {
    return {
      dialog3: false,
      personalLeaveDialog: false,
      //////////////////
      idForUpdatePersonalLeave: null,
      employeeNameForUpdatePersonalLeave: null,
      employeeUuidForUpdatePersonalLeave: null,
      applyDateForUpdatePersonalLeave: null,
      dateFromForUpdatePersonalLeave: null,
      dateToForUpdatePersonalLeave: null,
      timeFromForUpdatePersonalLeave: null,
      timeToForUpdatePersoanlLeave: null,
      howManyDaysEmployeeAskedFor: null,
      howManyHoursEmployeeAskedFor: null,
      reasonFromEmployeeForUpdate: null,
      statusForPersonalLeave: null,
      idForEmployeeUpdate: null,
      personalLeaveType: null,
      ///////////////////
      filteredData: [],
      filteredData2: [],
      pages: 0,
      page: 1,
      data: [],
      data2: [],
    };
  },
  methods: {
    ...mapActions(["actionForGettingAllLeaveWork"]),

    viewLeaveDetails(
      id,
      employeeName,
      providerUuid,
      applyDate,
      DateFrom,
      dateTo,
      timeFrom,
      timeTo,
      leaveType,
      subLeaveType,
      howManyDaysEmployeeAskedFor,
      howManyHoursEmployeeAskedFor,
      isApproved,
      reasonFromEmployee,
      EmployeeId
    ) {
      if (
        this.$store.getters.tokenValue.profileType != "PROVIDER" &&
        this.$store.getters.tokenValue.profileType != "RECEPTIONIST"
      ) {
        (this.statusForPersonalLeave = isApproved),
          // console.log(this.statusForPersonalLeave);
          (this.idForUpdatePersonalLeave = id),
          (this.employeeUuidForUpdatePersonalLeave = providerUuid),
          (this.idForEmployeeUpdate = EmployeeId),
          (this.employeeNameForUpdatePersonalLeave = employeeName),
          (this.applyDateForUpdatePersonalLeave = applyDate),
          //////////////
          (this.dateFromForUpdatePersonalLeave = DateFrom),
          (this.dateToForUpdatePersonalLeave = dateTo),
          (this.timeFromForUpdatePersonalLeave = timeFrom),
          (this.timeToForUpdatePersoanlLeave = timeTo),
          //////////
          (this.howManyDaysEmployeeAskedFor = howManyDaysEmployeeAskedFor),
          (this.howManyHoursEmployeeAskedFor = howManyHoursEmployeeAskedFor),
          //////////////
          (this.reasonFromEmployeeForUpdate = reasonFromEmployee),
          ////////////
          (this.personalLeaveType = subLeaveType),
          (this.personalLeaveDialog = !this.personalLeaveDialog);
      }
    },
    changePage() {
      let n = (this.page - 1) * 4;
      this.filteredData = this.data.slice(n, n + 4);
    },
    //////////////////////////////////////
    acceptLeaveRequestBtn(
      id,
      howManyDaysEmployeeAskedFor,
      howManyHoursEmployeeAskedFor,
      providerUuid
    ) {
      let path = this.$axios(
        requestBuilder("hr", "/acceptRejectLeaveRequest", "put", {
          leaveId: id,
          requestedDays: howManyDaysEmployeeAskedFor,
          requestedHours: howManyHoursEmployeeAskedFor,
          providerUuid: providerUuid,
          leaveType: "personal",
        })
      ).then((res) => {
        this.actionForGettingAllLeaveWork({
          providerUuid: null,
          dateFromFiltred: null,
          dateToFiltred: null,
        });
      });
    },
    rejectLeaveRequest(id) {
      let path = this.$axios(
        requestBuilder("hr", "/acceptRejectLeaveRequest", "put", {
          leaveIdReject: id,
          typeFromRefused: "personal",
        })
      ).then((res) => {
        this.actionForGettingAllLeaveWork({
          providerUuid: null,
          dateFromFiltred: null,
          dateToFiltred: null,
        });
      });
    },
    /////////////////
    deleteLeaveRequest(id) {
      let path = this.$axios(
        requestBuilder("hr", "/deleteLeaveForEmployee", "put", {
          leaveIdUpdate: id,
        })
      ).then((res) => {
        this.actionForGettingAllLeaveWork({
          providerUuid: null,
          dateFromFiltred: null,
          dateToFiltred: null,
        });
      });
      this.dialog3 = true;
    },
    updateBtn(
      id,
      employeeName,
      providerUuid,
      applyDate,
      DateFrom,
      dateTo,
      timeFrom,
      timeTo,
      leaveType,
      subLeaveType,
      howManyDaysEmployeeAskedFor,
      howManyHoursEmployeeAskedFor,
      isApproved,
      reasonFromEmployee,
      EmployeeId
    ) {
      (this.statusForPersonalLeave = isApproved),
        // console.log(this.statusForPersonalLeave);
        (this.idForUpdatePersonalLeave = id),
        (this.employeeUuidForUpdatePersonalLeave = providerUuid),
        (this.idForEmployeeUpdate = EmployeeId),
        (this.employeeNameForUpdatePersonalLeave = employeeName),
        (this.applyDateForUpdatePersonalLeave = applyDate),
        //////////////
        (this.dateFromForUpdatePersonalLeave = DateFrom),
        (this.dateToForUpdatePersonalLeave = dateTo),
        (this.timeFromForUpdatePersonalLeave = timeFrom),
        (this.timeToForUpdatePersoanlLeave = timeTo),
        //////////
        (this.howManyDaysEmployeeAskedFor = howManyDaysEmployeeAskedFor),
        (this.howManyHoursEmployeeAskedFor = howManyHoursEmployeeAskedFor),
        //////////////
        (this.reasonFromEmployeeForUpdate = reasonFromEmployee),
        ////////////////
        (this.personalLeaveType = subLeaveType),
        (this.personalLeaveDialog = !this.personalLeaveDialog);
    },
    getData() {
      let dateOffset = 24 * 60 * 60 * 1000; //5 days
      let myDate = new Date();
      myDate.setTime(myDate.getTime() - dateOffset);
      let beforeOneDay = myDate.toISOString().slice(0, 10);
      // let dateOffset2 = 24 * 60 * 60 * 1000 * 7; //5 days
      // let myDate2 = new Date();
      // myDate2.setTime(myDate.getTime() - dateOffset2);
      // let beforeSevenDay = myDate.toISOString().slice(0, 10);
      const arr = [];
      const arr2 = [];
      this.getAllLeaveForProviders.data?.resp.reverse().forEach((element) => {
        if (
          (element.isApproved == "New" && element.leaveType == "personal") ||
          (element.isApproved == "updated" && element.leaveType == "personal")
        ) {
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
            reasonFromEmployee: element.reasonFromEmployee,
          });
          this.data = arr;
          // this.pages = Math.ceil(this.data.length / 4);
          this.filteredData = this.data.slice(0, 4);
        } else if (
          element.applyDate >= beforeOneDay &&
          element.leaveType == "personal" &&
          (element.isApproved == "accepted" || element.isApproved == "refused")
        ) {
          arr2.push({
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
            reasonFromEmployee: element.reasonFromEmployee,
          });
          this.data2 = arr2;
          // this.pages = Math.ceil(this.data.length / 4);
          this.filteredData2 = this.data2.slice(0, 4);
        }
      });
    },
  },
  computed: {
    ...mapGetters(["getAllLeaveForProviders"]),
  },
  watch: {
    getAllLeaveForProviders() {
      this.getData();
    },
  },

  components: {
    TheElipseActions,
    DeleteDialog,
    PersonalLeaveForm,
  },
};
</script>

<style scoped>
.leave-card-content {
  display: flex;
  align-items: center;
}
.employee-leave-name {
  font-style: normal;
  font-weight: 450;
  font-size: 1.1rem !important ;
  line-height: 37px;
  color: #004d40;
}
.leave-time {
  font-style: normal;
  font-weight: 350;
  font-size: 1.1rem !important ;
  line-height: 37px;
  color: #35b5ac;
}

.leave-times-from-to {
  color: #00796b;
  font-size: 1.2rem;
  font-weight: 400;
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
</style>
