<template>
  <div>
    <v-dialog v-model="showLeaveRequestForManager" persistent max-width="500px">
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title">Leave Request </span>
            </v-card-title>

            <v-divider class="mx-4"></v-divider>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <v-row>
                    <!-- /////////////////////////////// -->
                    <v-col md="12">
                      <v-text-field
                        name="leaveType"
                        :value="leaveRequestDetails.leaveType"
                        label="Leave Type"
                        type="text"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col md="12" v-if="leaveRequestDetails.leaveDateDay">
                      <v-text-field
                        :value="leaveRequestDetails.leaveDateDay"
                        label="Date"
                        name="leaveFrom"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col md="6">
                      <v-text-field
                        :value="leaveRequestDetails.from"
                        name="leaveFrom"
                        label="From"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col md="6">
                      <v-text-field
                        :value="leaveRequestDetails.to"
                        name="leaveTo"
                        label="To"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col md="12">
                      <v-text-field
                        :value="leaveRequestDetails.duration"
                        name="leaveDuration"
                        label="Duration"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col md="12">
                      <v-text-field
                        :value="leaveRequestDetails.reason"
                        name="leaveReason"
                        label="Reason"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col
                      md="12"
                      v-if="
                        leaveRequestDetails.status == 'new' ||
                        leaveRequestDetails.status == 'updated'
                      "
                    >
                      <v-autocomplete
                        v-model="managerActionOnRequest"
                        :items="actionsTypes"
                        item-text="name"
                        item-value="id"
                        label="take an action..."
                        color="#194569"
                        dense
                        hide-details
                        outlined
                        :rules="[rules.required]"
                        return-object
                      >
                        <template v-slot:selection="{ item }">
                          {{ getName(item) }}
                        </template>
                        <template v-slot:item="{ item }">
                          {{ getName(item) }}
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col md="12" v-if="managerActionOnRequest.id == 6">
                      <v-text-field
                        v-model="reasonFromManagerToOnHoldRequest"
                        name="reasonFromManagerToOnHoldRequest"
                        label="Reason"
                        type="text"
                        dense
                        outlined
                        hide-details
                        color="#194569"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col md="6">
                      <span
                        :class="[
                          leaveRequestDetails.status == 'new' ? 'new' : null,
                          leaveRequestDetails.status == 'Accepted'
                            ? 'accepted'
                            : 'null',
                          leaveRequestDetails.status == 'rejected'
                            ? 'rejected'
                            : 'null',
                          leaveRequestDetails.status == 'pending'
                            ? 'pending'
                            : null,
                          leaveRequestDetails.status == 'on hold'
                            ? 'onHold'
                            : null,
                          leaveRequestDetails.status == 'updated'
                            ? 'onHold'
                            : null,
                        ]"
                      >
                        {{ leaveRequestDetails.status }}
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
                v-if="
                  leaveRequestDetails.status == 'new' ||
                  leaveRequestDetails.status == 'updated'
                "
                color="#194569"
                class="white--text"
                type="submit"
                @click="submitActionForRequest(managerActionOnRequest)"
                :disabled="!isFormValid"
              >
                Submit
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
import {
  updateLeaveRequestService,
  updateContractInformationService,
} from "../../../util/services/hrServices";
import PopupSuccess from "../../dialogs/PopupSuccess.vue";

export default {
  components: { PopupSuccess },

  props: {
    showLeaveRequestDashboard: {
      type: Boolean,
      default: false,
    },
    leaveRequestDetails: {
      type: Object,
    },
  },

  data() {
    return {
      dialog2: false,
      showLeaveRequestForManager: null,
      ////////////////////////////////
      managerActionOnRequest: "",
      actionsTypes: [
        { id: "2", name: { ar: "", en: "Accepted" } },
        { id: "3", name: { ar: "", en: "Rejected" } },
        { id: "6", name: { ar: "", en: "On Hold" } },
      ],
      reasonFromManagerToOnHoldRequest: null,
      //////////////////////////
      rules: {
        required: (value) => !!value || "Required.",
      },
      isFormValid: false,
      requested: false,
      ///////////
    };
  },
  methods: {
    ...mapActions(["actionForLeaveRequets"]),
    getName: (item) => `${item.name.en}`,

    async submitActionForRequest(managerActionOnRequest) {
      try {
        ///here manager take action on leave request for employee (accept,reject,on hold),then we dispatch leave action to rerender all requests with new status
        await updateLeaveRequestService({
          recordId: this.leaveRequestDetails.recordId,
          status: managerActionOnRequest,

          managerReason: this.reasonFromManagerToOnHoldRequest,
          createdBy: {
            id: "1",
            user: { ar: "", en: "beshir khaled" },
            system: "agents",
            chanel: "12",
          },
        });

        if (
          managerActionOnRequest.id == 2 &&
          this.leaveRequestDetails.duration.length === 6
        ) {
          await updateContractInformationService({
            recordId: this.leaveRequestDetails.employeeId,
            businessLeavesDays:
              this.leaveRequestDetails.reason == "work from home"
                ? this.leaveRequestDetails.duration.slice(0, 1) * 1
                : null,
            sickLeavesDays:
              this.leaveRequestDetails.leaveType == "Sick"
                ? this.leaveRequestDetails.duration.slice(0, 1) * 1
                : null,
            personalLeavesDays:
              this.leaveRequestDetails.leaveType == "Personal"
                ? this.leaveRequestDetails.duration.slice(0, 1) * 1
                : null,
          });
        }

        await this.actionForLeaveRequets({});
        this.$emit("update:showLeaveRequestDashboard", false);
        this.requested = true;
        this.dialog2 = true;
        this.resetFields();
      } catch (error) {
        console.log(error, "take an action on leave request error");
      }
    },
    resetFields() {
      (this.managerActionOnRequest = ""),
        (this.reasonFromManagerToOnHoldRequest = null);
    },
    close() {
      this.$emit("update:showLeaveRequestDashboard", false);
    },
  },
  computed: {
    ...mapGetters(["getterForTimeAttendance", "getterForEmployeesInformation"]),
    assignDialog() {
      this.showLeaveRequestForManager = this.showLeaveRequestDashboard;
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
.pending {
  background: transparent;
  border: orange solid 1px;
  color: orange;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 0.8rem !important;
}
.onHold {
  background: transparent;
  border: orange solid 1px;
  color: orange;
  padding: 5px 8px !important;
  line-height: 1.1rem !important;
  font-weight: 400 !important;
  font-size: 0.8rem !important;
}
</style>
