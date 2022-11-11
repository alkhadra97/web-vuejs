<template>
  <div>
    <v-dialog v-model="showEditMissingDialog" persistent max-width="400">
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title">Edit Missing Punch </span>
            </v-card-title>

            <v-divider class="mx-4"></v-divider>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <v-row>
                    <!-- /////////////////////////////// -->
                    <v-col md="12">
                      <v-text-field
                        v-model="missingPunchDetails.missingType"
                        color="#194569"
                        outlined
                        dense
                        hide-details
                        readonly
                      >
                      </v-text-field>
                    </v-col>
                    <v-col md="12">
                      <v-text-field
                        v-model="missingPunchDetails.date"
                        name="applyDateForMissingPunch"
                        label="Date"
                        readonly
                        dense
                        outlined
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      md="6"
                      v-if="missingPunchDetails.missingType == 'In'"
                    >
                      <v-text-field
                        v-model="missingPunchDetails.time"
                        name="timeFromForMissingPunch"
                        label="Time From"
                        type="time"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      md="6"
                      v-if="missingPunchDetails.missingType == 'Out'"
                    >
                      <v-text-field
                        v-model="missingPunchDetails.time"
                        name="timeToForMissingPunch"
                        label="Time To"
                        type="time"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col md="12">
                      <v-text-field
                        v-model="newReasonForMissing"
                        name="reasonForMissingPunchRequest"
                        :placeholder="missingPunchDetails.reason"
                        type="text"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        :rules="[rules.required]"
                      ></v-text-field>
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
                color="#194569"
                class="white--text"
                type="submit"
                @click="requestMissingPunchRequest"
                :disabled="!isFormValid"
              >
                Request
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
    </v-dialog>
    <v-row v-if="requested">
      <PopupSuccess :dialog2.sync="dialog2" />
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PopupSuccess from "../../dialogs/PopupSuccess.vue";
import { updateTimeAttendanceDataService } from "../../../util/services/hrServices";

export default {
  components: { PopupSuccess },

  props: {
    editMissingDialog: {
      type: Boolean,
      default: false,
    },
    employeeId: {
      type: String,
    },
    missingPunchDetails: {
      type: Object,
    },
  },
  data() {
    return {
      dialog2: false,
      showEditMissingDialog: null,
      newReasonForMissing: null,

      rules: {
        required: (value) => !!value || "Required.",
      },
      isFormValid: false,
      requested: false,
      ///////////
    };
  },

  computed: {
    ...mapGetters([]),
    assignDialog() {
      this.showEditMissingDialog = this.editMissingDialog;
    },
  },
  methods: {
    ...mapActions(["actionForTimeAttendance"]),
    async requestMissingPunchRequest() {
      try {
        //here to update time or reason for missing punch request

        if (this.missingPunchDetails.missingType == "In") {
          await updateTimeAttendanceDataService({
            recordId: this.missingPunchDetails.recordId,
            timeIn: this.missingPunchDetails.time,
            employeeReason: { ar: "", en: this.newReasonForMissing },
          });
          await this.actionForTimeAttendance({
            employeeId: [this.missingPunchDetails.employeeId],
          });
          this.showEditMissingDialog = !this.showEditMissingDialog;
        } else {
          await updateTimeAttendanceDataService({
            recordId: this.missingPunchDetails.recordId,
            timeOut: this.missingPunchDetails.time,
            employeeReason: { ar: "", en: this.newReasonForMissing },
          });
          await this.actionForTimeAttendance({
            employeeId: [this.missingPunchDetails.employeeId],
          });
          this.$emit("update:editMissingDialog", false);
        }
      } catch (error) {
        console.log(error, "edit missing punch request error");
      }
    },
    close() {
      this.$emit("update:editMissingDialog", false);
    },
  },
  mounted() {},
  watch: {},
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
</style>
