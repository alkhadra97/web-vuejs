<template>
  <div v-if="dataReady">
    <v-card class="pa-4 mb-3 elevation-5" max-width="600" height="395">
      <v-card-title class="mb-0 py-0 justify-center">
        <p class="hours-card-title">Today's Activity</p>
      </v-card-title>
      <v-card-text>
        <!-- <div
          v-for="(item, index) in getterForTimeAttendance.data.reverse()"
          :key="index"
        >
          <template v-if="item.date == todaysDate">
            <p class="font-weight-black my-0">Check In at</p>
            <p class="font-weight-normal my-0 teal--text">
              {{ item.checkIn }}
            </p>
            <template v-if="item.checkOut != null">
              <p class="font-weight-black my-0">Check Out at</p>
              <p class="font-weight-normal my-0">
                {{ item.checkOut }}
              </p>
            </template>
          </template>
        </div> -->
        <div class="font-weight-bold ml-8 mb-2">Today</div>
        <v-timeline
          align-top
          dense
          v-for="(item, index) in timeAttendanceData"
          :key="index"
        >
          <v-timeline-item small v-if="item.checkIn != null" color="green">
            <div>
              <div class="font-weight-normal">
                <strong>{{ item.checkIn }}</strong>
              </div>
            </div>
          </v-timeline-item>
          <v-timeline-item small v-if="item.checkOut != null" color="red">
            <div>
              <div class="font-weight-normal">
                <strong>{{ item.checkOut }}</strong>
              </div>
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getFormattedDate } from "../../../util/dateFormatting";

export default {
  props: {
    employeeUuid: {
      type: String,
    },
  },
  async mounted() {
    this.dataReady = true;
  },
  data() {
    return {
      dataReady: false,

      todaysDate: new Date().toISOString().slice(0, 10),
      timeAttendanceData: null,
    };
  },
  methods: {
    ...mapActions([]),
    async getData() {
      //this method for get data from getter then we rearrange the data to fit our page then we save it in state we call it fixed state

      const arr = [];
      this.getterForTimeAttendance.row.timeAttendance?.forEach((element) => {
        if (
          (element.date == getFormattedDate(new Date()) &&
            (element.inStatus !== null || element.outStatus !== null) &&
            (element.inStatus.name.en == "Accepted" ||
              element.outStatus.name.en == "Accepted")) ||
          (element.inStatus !== null &&
            element.outStatus !== null &&
            element.date == getFormattedDate(new Date()) &&
            element.inStatus.name.en == "missingAccepted" &&
            element.outStatus.name.en == "missingAccepted")
        ) {
          arr.push({
            checkIn: element.timeIn ? element.timeIn : null,
            checkOut: element.timeOut ? element.timeOut : null,
          });
        }
      });
      this.timeAttendanceData = arr;
    },
  },
  computed: {
    ...mapGetters(["getterForTimeAttendance"]),
  },
  watch: {
    getterForTimeAttendance() {
      this.getData();
    },
  },
};
</script>

<style scoped>
.hours-card-title {
  font-size: 1.3824rem;
  line-height: 2em;
  color: #194569;
  margin-top: 1em auto;
}
</style>
