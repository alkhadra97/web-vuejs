<template>
  <div>
    <v-dialog
      v-model="showEditEducationInformationDialog"
      persistent
      width="782.5"
      height="471.5"
    >
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title">Edit Education</span>
            </v-card-title>

            <v-divider class="mx-4"></v-divider>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <!-- /////////////////////////////// -->
                  <v-row>
                    <v-col md="6">
                      <v-autocomplete
                        v-model="newUniversityName"
                        name="instituation"
                        :items="universities"
                        item-value="id"
                        outlined
                        dense
                        :item-text="`name`"
                        :placeholder="educationObj.universiity.en"
                        hide-details
                        color="#194569"
                        return-object
                      >
                        <template v-slot:selection="{ item }">
                          {{ getText(item) }}
                        </template>
                        <template v-slot:item="{ item }">
                          {{ getText(item) }}
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <!-- <v-col md="6">
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
                        v-model="newFaculity"
                        name="subject"
                        type="text"
                        outlined
                        dense
                        :placeholder="educationObj.faculty"
                        :rules="[rules.valid]"
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>
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
import { updateEducationInformationService } from "../../../util/services/hrServices";
import {
  getAllRelations,
  getAllUniversities,
} from "../../../util/services/sharedServices";

export default {
  components: { PopupSuccess },

  props: {
    editEducationInformationDialog: {
      type: Boolean,
      default: false,
    },
    employeeId: {
      type: String,
    },
    educationObj: {
      type: Object,
    },
  },
  data() {
    return {
      showEditEducationInformationDialog: false,
      newUniversityName: null,
      newFaculity: null,
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
      universities: [],
      rules: {
        required: (value) => !!value || "Required.",
      },
    };
  },

  computed: {
    ...mapGetters(["getterForEmployeesInformation"]),
    assignDialog() {
      this.showEditEducationInformationDialog =
        this.editEducationInformationDialog;
    },
    activeLanguage: "activeLanguage",
    inactiveLanguage: "inactiveLanguage",
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),

    close() {
      this.$emit("update:editEducationInformationDialog", false);
    },

    getText: (item) => `${item.name.en}`,

    async saveNewInformation() {
      try {
        await updateEducationInformationService({
          recordId: this.educationObj.id,

          university:
            this.newUniversityName !== null
              ? this.newUniversityName.name
              : null,

          //   location:
          //     element.location !== null
          //       ? {
          //           id: "1",
          //           name: {
          //             ar: "",
          //             en: element.location,
          //           },
          //         }
          //       : null,
          faculty: this.newFaculity !== null ? this.newFaculity : null,
          period:
            this.newDateFrom !== null && this.newDateTo !== null
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
        // this.showEditEducationInformationDialog = false;
        this.$emit("update:editEducationInformationDialog", false);
      } catch (error) {
        console.log(error, "edit education information error");
      }
    },
    async fetchAllSharedAPIs() {
      try {
        this.universities = await getAllUniversities({
          id: "LKP-LCN-JOR-a63aeb82-2b0f-4e18-af57-799ca288be48",
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    try {
      this.fetchAllSharedAPIs();
      this.newFaculity = this.educationObj.faculty
        ? this.educationObj.faculty
        : null;
      this.newUniversityName = this.educationObj.universiity
        ? this.educationObj.universiity
        : null;
      this.newDateFrom = this.educationObj.period.from
        ? this.educationObj.period.from
        : null;
      this.newDateTo = this.educationObj.period.to
        ? this.educationObj.period.to
        : null;
    } catch (e) {
      console.log(e.message, "edit education mounted");
    }
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
