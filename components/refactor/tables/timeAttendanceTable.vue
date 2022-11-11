<template>
  <div>
    <v-card class="pa-4 mb-3 elevation-5">
      <v-card-title class="mb-0 py-0 justify-space-between">
        <div>
          <v-row>
            <v-col md="12">
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
                dense
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dates"
                    label="Date"
                    color="#194569"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    dense
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dates"
                  range
                  color="#194569"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </div>
        <div>
          <v-row>
            <v-btn
              color="#194569"
              class="secondry-btn black--text mr-2"
              @click="restAll"
              >Reset</v-btn
            >
            <v-btn
              color="#194569"
              class="white--text"
              @click="filterMany(dates)"
              >Search</v-btn
            >
          </v-row>
        </div>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="timeAttendanceDataDynamic"
          :items-per-page="5"
          class="elevation-1 mt-5"
        ></v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getFormattedDate, calculateHours } from "../../../util/dateFormatting";

export default {
  props: {
    employeeId: {
      type: String,
    },
  },

  data: (vm) => ({
    //////////////////////////

    headers: [
      { text: "Date", value: "date" },
      { text: " Check In", value: "checkIn" },
      { text: "Check Out", value: "checkOut" },
      { text: "Total Hours", value: "totalHours" },
    ],
    timeAttendanceData: [],
    timeAttendanceDataDynamic: [],

    //////////////
    dateFormatted: vm.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
    menu1: false,
    dates: null,
  }),
  methods: {
    ...mapActions(["actionForTimeAttendance"]),
    async getData() {
      try {
        //this method for get data from getter then we rearrange the data to fit our page then we save it in state we call it fixed state

        const arr = [];
        this.getterForTimeAttendance.row.timeAttendance?.forEach((element) => {
          arr.push({
            recordId: element.id,
            employeeId: element.employee.id,
            date: element.date,
            checkIn:
              (element.inStatus !== null &&
                element.inStatus.id == 1 &&
                element.inStatus.id != 2 &&
                element.inStatus.id != 4) ||
              (element.inStatus !== null &&
                element.inStatus.id == 3 &&
                element.inStatus.id != 2 &&
                element.inStatus.id != 4)
                ? element.timeIn
                : null,
            checkOut:
              (element.outStatus !== null &&
                element.outStatus.id == 1 &&
                element.outStatus.id != 2 &&
                element.outStatus.id != 4) ||
              (element.outStatus !== null &&
                element.outStatus.id == 3 &&
                element.outStatus.id != 2 &&
                element.outStatus.id != 4)
                ? element.timeOut
                : null,
            totalHours:
              ((element.inStatus !== null &&
                element.inStatus.id == 1 &&
                element.inStatus.id != 2 &&
                element.inStatus.id != 4) ||
                (element.inStatus !== null &&
                  element.inStatus.id == 3 &&
                  element.inStatus.id != 2 &&
                  element.inStatus.id != 4)) &&
              ((element.outStatus !== null &&
                element.outStatus.id == 1 &&
                element.outStatus.id != 2 &&
                element.outStatus.id != 4) ||
                (element.outStatus !== null &&
                  element.outStatus.id == 3 &&
                  element.outStatus.id != 2 &&
                  element.outStatus.id != 4))
                ? calculateHours(element.timeIn, element.timeOut)
                : null,
          });
        });
        this.timeAttendanceData = arr;
      } catch (error) {
        console.log(error, "get time attendance for employee error");
      }
    },

    filterMany(dates) {
      try {
        const filterDataArr = this.timeAttendanceData.filter((ele) => {
          return dates ? ele.date >= dates[0] && ele.date <= dates[1] : true;
        });
        this.timeAttendanceDataDynamic = filterDataArr;
        return;
      } catch (error) {
        console.log(error.message, "filter time attendance error");
      }
    },
    restAll() {
      this.filtredStatus = null;
      this.filtredType = null;
      this.dates = null;
      this.actionForTimeAttendance({
        employeeId: [this.employeeId],
      });
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    async renderData() {
      await this.actionForTimeAttendance({
        employeeId: [this.employeeId],
      });
      this.getData();
      this.timeAttendanceDataDynamic = this.timeAttendanceData;
    },
  },
  computed: {
    ...mapGetters(["getterForTimeAttendance"]),
  },
  mounted() {
    this.renderData();
  },
  watch: {
    getterForTimeAttendance() {
      this.getData();
    },
  },
};
</script>
<style scoped>
.secondry-btn {
  background: transparent !important;
  border: 1px solid #194569 !important;
}
</style>
