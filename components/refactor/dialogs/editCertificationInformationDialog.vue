<template>
  <div>
    <v-dialog
      v-model="showEditCertificationInformationDialog"
      persistent
      width="782.5"
      height="471.5"
    >
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title">Edit Certfication</span>
            </v-card-title>

            <v-divider class="mx-4"></v-divider>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <!-- /////////////////////////////// -->
                  <v-row>
                    <v-col md="6">
                      <v-text-field
                        v-model="newLicence"
                        name="name"
                        :rules="[rules.valid]"
                        type="text"
                        outlined
                        dense
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>
                    <v-col md="6">
                      <v-text-field
                        v-model="newCompany"
                        :rules="[rules.valid]"
                        name="company"
                        type="text"
                        outlined
                        dense
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>
                    <!-- <v-col md="6">
                      <v-text-field
                        v-model="licenseObj.description"
                        name="description"
                        type="text"
                        outlined
                        dense
                        label="Description"
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
import { updateCertificationInformationService } from "../../../util/services/hrServices";

export default {
  components: { PopupSuccess },

  props: {
    editCerrtificationInformationDialog: {
      type: Boolean,
      default: false,
    },
    employeeId: {
      type: String,
    },
    licenseObj: {
      type: Object,
    },
  },
  data() {
    return {
      newLicence: null,
      newCompany: null,
      showEditCertificationInformationDialog: false,
      newDateFrom: null,
      newDateTo: null,
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
    };
  },

  computed: {
    ...mapGetters(["getterForEmployeesInformation"]),
    assignDialog() {
      this.showEditCertificationInformationDialog =
        this.editCerrtificationInformationDialog;
    },
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),
    resetFields() {
      this.newLicence = this.licenseObj.name.en
        ? this.licenseObj.name.en
        : null;
      this.newCompany = this.licenseObj.company.en
        ? this.licenseObj.company.en
        : null;
      this.newDateFrom = this.licenseObj.period.from
        ? this.licenseObj.period.from
        : null;
      this.newDateTo = this.licenseObj.period.to
        ? this.licenseObj.period.to
        : null;
    },
    close() {
      this.resetFields();
      this.$emit("update:editCerrtificationInformationDialog", false);
    },

    //   getText: (item) => `${item.name.en}`,

    async saveNewInformation() {
      try {
        await updateCertificationInformationService({
          recordId: this.licenseObj.id,

          name:
            this.newLicence !== null ? { ar: "", en: this.newLicence } : null,

          company:
            this.newCompany !== null ? { ar: "", en: this.newCompany } : null,
          //   description:
          //     element.description !== null
          //       ? {
          //           ar: "",
          //           en: element.description,
          //         }
          //       : "N/A",
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

        this.$emit("update:editCerrtificationInformationDialog", false);
      } catch (error) {
        console.log(error, "edit education error");
      }
    },
  },
  mounted() {
    this.newLicence = this.licenseObj.name.en ? this.licenseObj.name.en : null;
    this.newCompany = this.licenseObj.company.en
      ? this.licenseObj.company.en
      : null;
    this.newDateFrom = this.licenseObj.period.from
      ? this.licenseObj.period.from
      : null;
    this.newDateTo = this.licenseObj.period.to
      ? this.licenseObj.period.to
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
