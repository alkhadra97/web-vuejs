<template>
  <v-row>
    <v-col md="12">
      <div v-if="filteredData.length != 0">
        <v-card
          v-for="(item, index) in filteredData"
          :key="index"
          class="business-request-card ma-2"
          height="110"
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
                    acceptVacationBtn(
                      item.id,
                      item.howManyDaysEmployeeAskedFor,
                      item.howManyHoursEmployeeAskedFor,
                      item.providerUuid,
                      item.leaveType
                    )
                  "
                  @rejectBtn="rejectVacationBtn(item.id)"
                  @deleteBtn="deleteLeaveBtn(item.id)"
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
          v-for="(item, index) in filteredData2"
          :key="index"
          class="business-request-card ma-2"
          height="110"
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
                    acceptVacationBtn(
                      item.id,
                      item.howManyDaysEmployeeAskedFor,
                      item.howManyHoursEmployeeAskedFor,
                      item.providerUuid,
                      item.leaveType
                    )
                  "
                  @rejectBtn="rejectVacationBtn(item.id)"
                  @deleteBtn="deleteLeaveBtn(item.id)"
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
      <div v-if="toggle">
        <BusinessLeaveForm
          :businessLeaveDialog.sync="businessLeaveDialog"
          :employeeNameForBusinessLeave="employeeNameForBusinessLeave"
          :applyDateForUpdateBusinessLeave="applyDateForUpdateBusinessLeave"
          :dateFromForUpdateBusinessLeave="dateFromForUpdateBusinessLeave"
          :dateToForUpdateBusinessLeave="dateToForUpdateBusinessLeave"
          :timeFromForUpdateBusinessLeave="timeFromForUpdateBusinessLeave"
          :timeToForUpdateBusinessLeave="timeToForUpdateBusinessLeave"
          :howManyDaysEmployeeAskedForUpdate="howManyDaysEmployeeAskedFor"
          :howManyHoursEmployeeAskedForUpdate="
            howManyHoursEmployeeAskedForToLeave
          "
          :reasonFromEmployeeForUpdate="reasonFromEmployeeForUpdate"
          :businessLeaveTypeUpdate="businessLeaveType"
          :statusForUpdateBusinessLeave="statusForBusinessLeave"
          :idForEmployeeUpdate="idForEmployeeUpdate"
          :employeeUuidForUpdateBusinessLeave="
            employeeUuidForUpdateBusinessLeave
          "
          :idForUpdateBusinessLeaveRequest="idForUpdateBusinessLeaveRequest"
          :toggle="toggle"
        />
      </div>

      <DeleteDialog :dialog3.sync="dialog3" />
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import requestBuilder from "../../requestBuilder";
import TheElipseActions from "../elipses/TheElipseActions.vue";
import DeleteDialog from "../dialogs/DeleteDialog.vue";
import BusinessLeaveForm from "../dialogs/BusinessLeaveForm.vue";

export default {
  async mounted() {
    await this.actionForGettingAllLeaveWork({
      providerUuid: null,
      dateFromFiltred: null,
      dateToFiltred: null,
    });
    await this.getData();
  },
  data() {
    return {
      businessLeaveDialog: false,
      dialog3: false,
      ////////////////////////
      idForUpdateBusinessLeaveRequest: null,
      employeeNameForBusinessLeave: null,
      employeeUuidForUpdateBusinessLeave: null,
      applyDateForUpdateBusinessLeave: null,
      dateFromForUpdateBusinessLeave: null,
      dateToForUpdateBusinessLeave: null,
      timeFromForUpdateBusinessLeave: null,
      timeToForUpdateBusinessLeave: null,
      howManyDaysEmployeeAskedFor: null,
      howManyHoursEmployeeAskedForToLeave: null,
      reasonFromEmployeeForUpdate: null,
      statusForbusinessLeave: "",

      idForEmployeeUpdate: null,
      businessLeaveType: null,
      /////////////////////////
      filteredData: [],
      filteredData2: [],
      pages: 0,
      page: 1,
      data: [],
      data2: [],
      toggle: false,
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
        (this.statusForBusinessLeave = isApproved),
          (this.idForUpdateBusinessLeaveRequest = id),
          (this.employeeUuidForUpdateBusinessLeave = providerUuid),
          (this.idForEmployeeUpdate = EmployeeId),
          (this.employeeNameForBusinessLeave = employeeName),
          (this.applyDateForUpdateBusinessLeave = applyDate),
          //////////////
          (this.dateFromForUpdateBusinessLeave = DateFrom),
          (this.dateToForUpdateBusinessLeave = dateTo),
          (this.timeFromForUpdateBusinessLeave = timeFrom),
          (this.timeToForUpdateBusinessLeave = timeTo),
          //////////
          (this.howManyDaysEmployeeAskedFor = howManyDaysEmployeeAskedFor),
          (this.howManyHoursEmployeeAskedForToLeave =
            howManyHoursEmployeeAskedFor),
          //////////////
          (this.reasonFromEmployeeForUpdate = reasonFromEmployee),
          //////////////
          (this.businessLeaveType = subLeaveType),
          (this.businessLeaveDialog = !this.businessLeaveDialog);
        this.toggle = true;
      }
    },
    changePage() {
      let n = (this.page - 1) * 4;
      this.filteredData = this.data.slice(n, n + 4);
    },
    acceptVacationBtn(
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
          leaveType: "business",
        })
      ).then((res) => {
        this.actionForGettingAllLeaveWork({
          providerUuid: null,
          dateFromFiltred: null,
          dateToFiltred: null,
        });
      });
    },
    ////////////////////////
    rejectVacationBtn(id) {
      let path = this.$axios(
        requestBuilder("hr", "/acceptRejectLeaveRequest", "put", {
          leaveIdReject: id,
          typeFromRefused: "business",
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
    deleteLeaveBtn(id) {
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
    /////////////////////////
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
      (this.statusForBusinessLeave = isApproved),
        (this.idForUpdateBusinessLeaveRequest = id),
        (this.employeeUuidForUpdateBusinessLeave = providerUuid),
        (this.idForEmployeeUpdate = EmployeeId),
        (this.employeeNameForBusinessLeave = employeeName),
        (this.applyDateForUpdateBusinessLeave = applyDate),
        //////////////
        (this.dateFromForUpdateBusinessLeave = DateFrom),
        (this.dateToForUpdateBusinessLeave = dateTo),
        (this.timeFromForUpdateBusinessLeave = timeFrom),
        (this.timeToForUpdateBusinessLeave = timeTo),
        //////////
        (this.howManyDaysEmployeeAskedFor = howManyDaysEmployeeAskedFor),
        (this.howManyHoursEmployeeAskedForToLeave =
          howManyHoursEmployeeAskedFor),
        //////////////
        (this.reasonFromEmployeeForUpdate = reasonFromEmployee),
        ///////
        (this.businessLeaveType = subLeaveType),
        (this.businessLeaveDialog = !this.businessLeaveDialog);
      this.toggle = true;
    },
    getData() {
      let arr = [];
      let arr2 = [];
      let dateOffset = 24 * 60 * 60 * 1000; //5 days
      let myDate = new Date();
      myDate.setTime(myDate.getTime() - dateOffset);
      let beforeOneDay = myDate.toISOString().slice(0, 10);

      this.getAllLeaveForProviders.data?.resp.reverse().forEach((element) => {
        if (
          (element.isApproved == "New" && element.leaveType == "business") ||
          (element.isApproved == "updated" && element.leaveType == "business")
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
            EmployeeId: element.EmployeeId,
          });
          this.data = arr;
          this.filteredData = this.data.slice(0, 4);
        } else if (
          element.applyDate >= beforeOneDay &&
          element.leaveType == "business" &&
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
            EmployeeId: element.EmployeeId,
          });
          this.data2 = arr2;
          this.filteredData2 = this.data2.slice(0, 4);
        }
      });
      // this.data = arr;
      // this.filteredData = this.data.slice(0, 4);
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
    BusinessLeaveForm,
  },
};
</script>

<style scoped>
.business-request-card:hover {
  transform: scale(1.01);
}
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
