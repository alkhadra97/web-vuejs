<template>
  <div>
    <v-dialog
      v-model="showEditExperienceInformationDialog"
      persistent
      width="782.5"
      height="471.5"
    >
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title">Edit Experience </span>
            </v-card-title>

            <v-divider class="mx-4"></v-divider>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <v-row>
                    <!-- /////////////////////////////// -->
                    <v-col md="6">
                      <v-text-field
                        v-model="newTitle"
                        name="title"
                        type="text"
                        :rules="[rules.valid]"
                        outlined
                        dense
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>
                    <v-col md="6">
                      <v-text-field
                        v-model="newCompany"
                        name="company"
                        type="text"
                        :rules="[rules.valid]"
                        outlined
                        dense
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>
                    <!-- <v-col md="6" v-if="experienceObj.location !== null">
                    <v-text-field
                      v-model="experienceObj.location"
                      name="location"
                      type="text"
                      outlined
                      dense
                      label="Location"
                      hide-details
                      color="#194569"
                    ></v-text-field>
                  </v-col>
                  <v-col md="6" v-else>
                    <v-text-field
                      v-model="location"
                      name="location"
                      type="text"
                      outlined
                      dense
                      label="Location"
                      hide-details
                      color="#194569"
                    ></v-text-field>
                  </v-col> -->

                    <v-col md="6">
                      <v-text-field
                        v-model="newDateFrom"
                        name="startDate"
                        type="date"
                        outlined
                        dense
                        label="Start Date"
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>
                    <v-col md="6">
                      <v-text-field
                        v-model="newDateTo"
                        name="endDate"
                        type="date"
                        outlined
                        :min="newDateFrom"
                        dense
                        label="End Date"
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <!-- ////////////////////// -->
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="secondry-btn" @click="close"> Close </v-btn>
              <v-btn
                @click="saveNewInformation()"
                color="#194569"
                class="white--text"
                type="submit"
                :disabled="!isFormValid"
              >
                Save
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
import { updateExperienceInformationService } from "../../../util/services/hrServices";

export default {
  components: { PopupSuccess },

  props: {
    editExperienceInformationDialog: {
      type: Boolean,
      default: false,
    },
    employeeId: {
      type: String,
    },
    experienceObj: {
      type: Object,
    },
  },
  data() {
    return {
      showEditExperienceInformationDialog: false,
      // rules: {
      //   required: (value) => !!value || "Required.",
      // },
      isFormValid: true,
      rules: {
        valid: (value) => {
          const pattern = value.length <= 2;
          if (pattern) {
            this.isFormValid = false;
          } else {
            this.isFormValid = true;
          }
        },
      },
      title: [],
      company: null,
      location: null,
      startDate: null,
      endDate: null,
      newTitle: null,
      newCompany: null,
      newDateFrom: null,
      newDateTo: null,
    };
  },

  computed: {
    ...mapGetters(["getterForEmployeesInformation"]),
    assignDialog() {
      this.showEditExperienceInformationDialog =
        this.editExperienceInformationDialog;
    },
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),
    resetFields() {
      this.newTitle = this.experienceObj.title
        ? this.experienceObj.title.name.en
        : null;
      this.newCompany = this.experienceObj.company.en
        ? this.experienceObj.company.en
        : null;
      this.newDateFrom = this.experienceObj.period.from
        ? this.experienceObj.period.from
        : null;
      this.newDateTo = this.experienceObj.period.to
        ? this.experienceObj.period.to
        : null;
    },
    close() {
      this.resetFields();
      this.$emit("update:editExperienceInformationDialog", false);
    },

    async saveNewInformation() {
      try {
        await updateExperienceInformationService({
          recordId: this.experienceObj.id,

          title:
            this.newTitle !== null
              ? { id: 1, name: { ar: "", en: this.newTitle } }
              : null,

          company:
            this.newCompany !== null ? { ar: "", en: this.newCompany } : null,
          // location:
          // this.experienceObj.location !== null
          //     ? {
          //         country: {
          //           id: "1",
          //           name: {
          //             ar: "",
          //             en:   this.experienceObj.location.location,
          //           },
          //         },
          //         city: {
          //           id: "1",
          //           name: {
          //             ar: "",
          //             en:   this.experienceObj.location,
          //           },
          //         },
          //       }
          //     : null,
          period:
            this.newDateFrom !== null || this.newDateTo
              ? { from: this.newDateFrom, to: this.newDateTo }
              : null,
          createdBy: {
            id: "1",
            user: { ar: "", en: "beshir" },
            system: "agents",
            chanel: "12",
          },
        });
        await this.actionForEmployeeDataApi({
          employee_id: [this.employeeId],
        });
        await this.resetFields();
        this.$emit("update:editExperienceInformationDialog", false);
      } catch (error) {
        console.log(error, "edit education error");
      }
    },
  },
  mounted() {
    this.newTitle = this.experienceObj.title
      ? this.experienceObj.title.name.en
      : null;
    this.newCompany = this.experienceObj.company.en
      ? this.experienceObj.company.en
      : null;
    this.newDateFrom = this.experienceObj.period.from
      ? this.experienceObj.period.from
      : null;
    this.newDateTo = this.experienceObj.period.to
      ? this.experienceObj.period.to
      : null;
  },
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
