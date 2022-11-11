<template>
  <!-- here we only display the request for employee without any action -->

  <div>
    <v-dialog v-model="showMissingPunchRequest" persistent max-width="500px">
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
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    missingPunchRequest: {
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
      showMissingPunchRequest: null,
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
    close() {
      this.$emit("update:missingPunchRequest", false);
    },
  },
  computed: {
    ...mapGetters(["getterForTimeAttendance", "getterForEmployeesInformation"]),
    assignDialog() {
      this.showMissingPunchRequest = this.missingPunchRequest;
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
