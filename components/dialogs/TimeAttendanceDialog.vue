<template>
  <div v-if="getAllTimeAttendanceInfo.data">
    <v-dialog v-model="showTimeAttendanceDialog" max-width="700px">
      {{ assignDialog }}

      <v-card>
        <v-card-title>
          <span class="time-attendance-title text-h5">Time Attendance</span>
        </v-card-title>
        <v-card-text>
          <v-row class="justify-space-around pa-5">
            <v-card class="pa-5" height="179">
              <v-card-title>Today's Clocking</v-card-title>
              <div class="d-flex">
                <v-card class="mr-5 pa-4">
                  <h4 class="teal--text">Check In</h4>
                  <v-divider class="mx-3"></v-divider>
                  <div
                    v-for="(item, index) in timeAttendanceArrayFiltred"
                    :key="index"
                  >
                    <template v-if="item.date == todaysDate">
                      <p class="text-center mb-0">
                        {{ item.checkIn }}
                      </p>
                    </template>
                  </div>
                </v-card>
                <v-card class="pa-4">
                  <h4 class="red--text">Check Out</h4>

                  <v-divider class="mx-3"></v-divider>
                  <div
                    v-for="(item, index) in timeAttendanceArrayFiltred"
                    :key="index"
                  >
                    <template v-if="item.date == todaysDate">
                      <p
                        class="text-center mb-0"
                        v-if="item.checkOut != 'null'"
                      >
                        {{ item.checkOut }}
                      </p>
                    </template>
                  </div>
                </v-card>
              </div>
            </v-card>
            <div class="clocking-title font-weight-medium mb-0">
              <v-card>
                <v-card-title> Today's Activity </v-card-title>
                <v-card-text>
                  <div
                    v-for="(item, index) in timeAttendanceArrayFiltred"
                    :key="index"
                  >
                    <template v-if="item.date == todaysDate">
                      <p class="font-weight-black my-0">Puch In at</p>
                      <p class="font-weight-normal my-0 teal">
                        {{ item.checkIn }}
                      </p>
                      <p class="font-weight-black my-0">Puch Out at</p>
                      <p
                        class="font-weight-normal my-0"
                        v-if="item.checkOut != 'null'"
                      >
                        {{ item.checkOut }}
                      </p>
                    </template>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-row>
          <!-- </div> -->
          <v-divider class="mx-4"></v-divider>
          <v-row class="mt-5">
            <table class="table-attendance">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                </tr>
              </thead>
              <tbody
                v-for="(item, index) in timeAttendanceArrayFiltred"
                :key="index"
              >
                <tr v-if="item.date != todaysDate">
                  <td>{{ item.date }}</td>
                  <td>{{ item.checkIn }}</td>
                  <td v-if="item.checkOut != 'null'">{{ item.checkOut }}</td>
                  <td v-else></td>
                </tr>
              </tbody>
            </table>
          </v-row>

          <v-row class="justify-center mt-0">
            <button class="view-time-attendance-btn" @click="viewAttendanceBtn">
              View History
            </button>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import requestBuilder from "../../requestBuilder";
export default {
  props: {
    timeAttendanceDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showTimeAttendanceDialog: null,
    };
  },
  methods: {
    // ...mapActions([
    //   "actionToCheckProviderAppointments",
    //   "actionToCheckEmployeeVcationsAndLeaves",
    // ]),
    viewAttendanceBtn() {
      this.$router.push("/hrpages/attendance/" + this.$route.params.hrHome);
    },

    close() {
      this.$emit("update:timeAttendanceDialog", false);
    },
  },
  async mounted() {},
  computed: {
    ...mapGetters(["getAllTimeAttendanceInfo"]),
    assignDialog() {
      this.showTimeAttendanceDialog = this.timeAttendanceDialog;
    },
    timeAttendanceArrayFiltred() {
      return this.getAllTimeAttendanceInfo.data
        .reverse()
        .slice(0, 3)
        .map((item) => {
          return item;
        });
    },
    todaysDate() {
      let today = new Date().toISOString().slice(0, 10);
      return today;
    },
  },
  watch: {},
  components: {},
};
</script>
<style scoped>
.time-attendance-title {
  text-align: center;
  font-weight: bold;
  color: #009688;
  margin-top: 2em auto;
  padding-bottom: 0.2em;
}
.view-time-attendance-btn {
  color: #35b5ac;
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 37px;
}
.time-attendance-title::after {
  content: "";
  display: block;
  width: 20vw;
  height: 4px;
  background: #01796d;
  margin: 0.5rem auto 0;
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
