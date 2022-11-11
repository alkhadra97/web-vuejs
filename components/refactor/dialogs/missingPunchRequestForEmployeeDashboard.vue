<template v-if="settingsData.length > 0">
  <div>
    <v-dialog v-model="showMissingPunchDialog" persistent max-width="500px">
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title">Missing Punch Request</span>
            </v-card-title>

            <v-divider class="mx-4"></v-divider>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <v-row>
                    <!-- /////////////////////////////// -->

                    <v-col md="12">
                      <v-text-field
                        name="missingType"
                        :value="missingPunchDetails.missingType"
                        label="Missing Type"
                        type="text"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col md="6">
                      <v-text-field
                        :value="missingPunchDetails.time"
                        name="missingTime"
                        label="Time"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col md="6">
                      <v-text-field
                        :value="missingPunchDetails.date"
                        name="missingDate"
                        label="Date"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col md="12">
                      <v-text-field
                        :value="missingPunchDetails.reason"
                        name="missingReason"
                        label="Reason"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col md="12" v-if="missingPunchDetails.status == 'New'">
                      <v-autocomplete
                        v-if="settingsData[0]"
                        v-model="managerActionOnRequest"
                        :items="settingsData[0].timeAttendanceStatus"
                        item-text="value"
                        label="take an action..."
                        color="#194569"
                        dense
                        hide-details
                        return-object
                        outlined
                        :rules="[rules.required]"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col md="6">
                      <span
                        :class="[
                          missingPunchDetails.status == 'New' ? 'new' : null,
                          missingPunchDetails.status == 'Accepted'
                            ? 'accepted'
                            : 'null',
                          missingPunchDetails.status == 'Rejected'
                            ? 'rejected'
                            : 'null',
                        ]"
                      >
                        {{ missingPunchDetails.status }}
                      </span>
                    </v-col>

                    <!-- ////////////////////// -->
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="secondry-btn" @click="close"> Close </v-btn>
              <v-btn
                v-if="missingPunchDetails.status == 'New'"
                color="#194569"
                class="white--text"
                type="submit"
                :disabled="!isFormValid"
                @click="submitActionForRequest(managerActionOnRequest)"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
    </v-dialog>
    <!-- <v-row v-if="requested">
          <PopupSuccess :dialog2.sync="dialog2" />
        </v-row> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PopupSuccess from "../../dialogs/PopupSuccess.vue";
import {
  acceptMissingInService,
  acceptMissingOutService,
  rejectMissingInService,
  rejectMissingOutService,
} from "../../../util/services/hrServices";
export default {
  components: { PopupSuccess },

  props: {
    showMissingPunchDashboard: {
      type: Boolean,
      default: false,
    },
    missingPunchDetails: {
      type: Object,
    },
  },
  data() {
    return {
      dialog2: false,
      showMissingPunchDialog: null,
      //////////////////////////
      managerActionOnRequest: "",
      settingsData: [],
      actionsTypes: [
        { text: "Accept", value: "missingAccepted" },
        { text: "Reject", value: "missingRejected" },
      ],
      rules: {
        required: (value) => !!value || "Required.",
      },
      isFormValid: false,
      requested: false,
      ///////////
    };
  },

  computed: {
    ...mapGetters(["getterForEmployeesInformation", "getterForSettingsData"]),
    assignDialog() {
      this.showMissingPunchDialog = this.showMissingPunchDashboard;
    },
  },
  methods: {
    ...mapActions(["actionForTimeAttendance"]),
    getName: (item) => `${item.name.en}`,

    async submitActionForRequest(managerActionOnRequest) {
      try {
        ///here manager take action on missing punch request for employee (accept,reject),then we dispatch leave action to rerender all requests with new status
        if (
          managerActionOnRequest.name.en == "missingAccepted" &&
          this.missingPunchDetails.missingType == "In"
        ) {
          await acceptMissingInService({
            recordId: this.missingPunchDetails.recordId,
            inStatus: {
              id: managerActionOnRequest.id,
              name: managerActionOnRequest.name,
            },
            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir khaled" },
              system: "agents",
              chanel: "12",
            },
          });
        } else if (
          managerActionOnRequest.name.en == "missingAccepted" &&
          this.missingPunchDetails.missingType == "Out"
        ) {
          await acceptMissingOutService({
            recordId: this.missingPunchDetails.recordId,
            outStatus: {
              id: managerActionOnRequest.id,
              name: managerActionOnRequest.name,
            },
            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir khaled" },
              system: "agents",
              chanel: "12",
            },
          });
        } else if (
          managerActionOnRequest.name.en == "missingRejected" &&
          this.missingPunchDetails.missingType == "In"
        ) {
          await rejectMissingInService({
            recordId: this.missingPunchDetails.recordId,
            inStatus: {
              id: managerActionOnRequest.id,
              name: managerActionOnRequest.name,
            },
            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir khaled" },
              system: "agents",
              chanel: "12",
            },
          });
        } else {
          await rejectMissingOutService({
            recordId: this.missingPunchDetails.recordId,
            outStatus: {
              id: managerActionOnRequest.id,
              name: managerActionOnRequest.name,
            },
            createdBy: {
              id: "1",
              user: { ar: "", en: "beshir khaled" },
              system: "agents",
              chanel: "12",
            },
          });
        }

        await this.actionForTimeAttendance({});
        this.$emit("update:showMissingPunchDashboard", false);
        this.requested = true;
        this.dialog2 = true;
        this.resetFields();
      } catch (error) {
        console.log(error.message, "take an action on missing punch error");
      }
    },
    resetFields() {
      this.managerActionOnRequest = "";
    },
    close() {
      this.$emit("update:showMissingPunchDashboard", false);
    },
  },
  mounted() {
    this.settingsData = this.getterForSettingsData.row.settings;
  },
  watch: {
    getterForSettingsData() {
      this.settingsData = this.getterForSettingsData.row.settings;
    },
  },
};
</script>

<style scoped>
.request-title {
  font-size: 1.404rem;
  color: #194569;
  margin-top: 2em auto;
  padding-bottom: 0.2em;
}
.secondry-btn {
  background: transparent !important;
  border: 1px solid #194569 !important;
}
.accepted {
  background: transparent;
  border: #35b5ac solid 1px;
  color: #35b5ac;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 0.8rem !important;
}
.rejected {
  background: transparent;
  border: red solid 1px;
  color: red;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 0.8rem !important;
}
.new {
  background: transparent;
  border: #2196f3 solid 1px;
  color: #2196f3;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 0.8rem !important;
}
</style>
