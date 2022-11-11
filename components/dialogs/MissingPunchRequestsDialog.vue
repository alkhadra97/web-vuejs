<template>
  <div>
    <v-dialog v-model="showMissingPunchRequests" width="1000">
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title text-h5">Missing Punch Requests</span>
              <!-- <v-row class="mt-3" no-gutters>
                <v-col md="12">
                
                </v-col>
              </v-row> -->
            </v-card-title>
            <v-card-text>
              <div v-if="filterMissingPunchData.length != 0">
                <v-card
                  class="business-request-card mx-5 my-7 elevation-3"
                  v-for="(item, index) in filterMissingPunchData"
                  :key="index"
                  @click="viewMissingPunchDetails()"
                >
                  <v-row class="px-5">
                    <v-col md="3">
                      <p class="employee-leave-name">
                        Name:
                        <span class="font-weight-regular"
                          >{{ item.employeeName }}
                        </span>
                      </p>
                    </v-col>
                    <v-col md="3">
                      <p class="employee-leave-name">
                        Date:
                        <span class="font-weight-regular"
                          >{{ item.date }}
                        </span>
                      </p>
                    </v-col>
                    <v-col
                      md="2"
                      v-if="item.status == 'missing punch (checkIn)'"
                    >
                      <p class="leave-time">
                        From:
                        <span class="font-weight-regular"
                          >{{ item.checkIn }}
                        </span>
                      </p>
                    </v-col>
                    <v-col
                      md="2"
                      v-if="item.status == 'missing punch (checkOut)'"
                    >
                      <p class="leave-time">
                        To:
                        <span class="font-weight-regular"
                          >{{ item.checkOut }}
                        </span>
                      </p>
                    </v-col>
                    <v-col md="4" v-if="item.status == 'missing punch (both)'">
                      <div class="d-flex align-center">
                        <p class="leave-time">
                          From:
                          <span class="font-weight-regular"
                            >{{ item.checkIn }}--
                          </span>
                        </p>
                        <p class="leave-time">
                          To:
                          <span class="font-weight-regular"
                            >{{ item.checkOut }}
                          </span>
                        </p>
                      </div>
                    </v-col>
                    <!-- {{ statusForbusinessLeave }} -->
                    <v-col
                      md="3"
                      v-if="item.status == 'missing punch (checkIn)'"
                    >
                      <p>
                        Type:
                        <span class="font-weight-regular"> Check In</span>
                      </p>
                    </v-col>
                    <v-col
                      md="3"
                      v-if="item.status == 'missing punch (checkOut)'"
                    >
                      <p>
                        Type:
                        <span class="font-weight-regular"> Check Out</span>
                      </p>
                    </v-col>
                    <v-col md="8" v-if="item.status == 'missing punch (both)'">
                      <p>
                        Type:
                        <span class="font-weight-regular">
                          Check In && Check Out</span
                        >
                      </p>
                    </v-col>
                    <v-col md="1">
                      <ElipseForTwo
                        v-if="
                          $store.getters.tokenValue.profileType == 'MANAGER'
                        "
                        @acceptBtn="acceptMissingPunchRequest(item.id)"
                        @rejectBtn="rejectMissingPunchRequest(item.id)"
                      />
                    </v-col>
                    <v-col md="8">
                      <v-divider></v-divider>
                      <p>
                        Reason:
                        <span class="font-weight-regular">{{
                          item.reasonForMissing
                        }}</span>
                      </p>
                    </v-col>
                    <v-col md="4">
                      <span
                        :class="[
                          item.statusForMissingPunsh == 'accepted'
                            ? 'accepted'
                            : null,
                          item.statusForMissingPunsh == 'rejected'
                            ? 'rejected'
                            : 'null',
                          item.statusForMissingPunsh == 'new' ? 'New' : 'null',
                        ]"
                      >
                        {{ item.statusForMissingPunsh }}</span
                      >
                    </v-col>
                  </v-row>
                </v-card>
              </div>
              <div v-else>
                <h3>There's no missing punch requests</h3>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="teal" right text @click="close" class="white--text">
                Close
              </v-btn>
              <v-spacer></v-spacer>

              <!-- <v-card-actions> -->
              <button
                class="contract-view-payslip-btn"
                @click="viewHistory()"
                v-if="$store.getters.tokenValue.profileType == 'MANAGER'"
              >
                View History
              </button>
              <!-- </v-card-actions> -->
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import requestBuilder from "../../requestBuilder";
import ElipseForTwo from "../elipses/ElipseForTwo.vue";

export default {
  props: {
    missingPunchRequestsDialog: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.dataForAttendance = this.getAllTimeAttendanceInfo;
  },
  data() {
    return {
      showMissingPunchRequests: null,
      dataForAttendance: null,
    };
  },
  methods: {
    ...mapActions(["actionForGettingAllTimeAttendance"]),
    viewMissingPunchDetails() {
      console.log("hi");
    },
    close() {
      this.$emit("update:missingPunchRequestsDialog", false);
    },
    async acceptMissingPunchRequest(id) {
      // console.log(id);
      let path = await this.$axios(
        requestBuilder("hr", "/hr/acceptMissingPunchRequest", "put", {
          rowId: id,
          type: "accepted",
        })
      );
      if (path.status == 200) {
        // this.$store.commit("decreaseCounterOfMissing");
        this.actionForGettingAllTimeAttendance({});
      }
    },
    async rejectMissingPunchRequest(id) {
      let path = await this.$axios(
        requestBuilder("hr", "/hr/acceptMissingPunchRequest", "put", {
          rowId: id,
          type: "rejected",
        })
      );
      if (path.status == 200) {
        // this.$store.commit("decreaseCounterOfMissing");

        this.actionForGettingAllTimeAttendance({ type: "requestsMissing" });
      }
    },
    // /
    viewHistory() {
      this.actionForGettingAllTimeAttendance({
        providerUuid: null,
        filtredMonth: null,
      });
      this.$router.push("/hrpages/missingPunchHistory/");
    },
  },
  computed: {
    ...mapGetters(["getAllTimeAttendanceInfo"]),
    assignDialog() {
      this.showMissingPunchRequests = this.missingPunchRequestsDialog;
    },
    filterMissingPunchData() {
      let arr = [];
      // console.log(this.getAllTimeAttendanceInfo.data);
      this.dataForAttendance.data?.forEach((item) => {
        if (
          item.statusForMissingPunsh == "new" &&
          (item.status == "missing punch (both)" ||
            item.status == "missing punch (checkIn)" ||
            item.status == "missing punch (checkOut)")
        ) {
          arr.push(item);
        }
      });
      return arr;
    },
  },
  watch: {
    getAllTimeAttendanceInfo() {
      this.dataForAttendance = this.getAllTimeAttendanceInfo;
    },
  },
  components: { ElipseForTwo },
};
</script>

<style scoped>
.request-title {
  font-weight: bold;
  color: rgb(89, 88, 88);
  margin-top: 2em auto;
  padding-bottom: 0.2em;
}
.contract-view-payslip-btn {
  color: #35b5ac;
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 37px;
}
.request-title::after {
  content: "";
  display: block;
  width: 20vw;
  height: 4px;
  background: #059486;
  margin: 0.5rem auto 0;
}
.accepted {
  background: transparent;
  border: #35b5ac solid 1px !important;
  border-radius: 5px;
  color: #35b5ac;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
}
.rejected {
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
</style>
