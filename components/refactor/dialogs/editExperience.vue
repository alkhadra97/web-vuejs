<template>
  <div>
    <v-dialog
      v-model="showEditExperienceDialog"
      persistent
      width="782.5"
      height="471.5"
    >
      {{ assignDialog }}
      <v-col md="12" class="pa-0">
        <v-card>
          <v-card-title>
            <span class="request-title">Edit Experience</span>
          </v-card-title>

          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <v-container>
              <v-form v-model="isFormValid">
                <!-- /////////////////////////////// -->

                <v-row v-for="(item, index) in experience" :key="index">
                  <v-col md="6">
                    <v-text-field
                      v-model="item.title"
                      name="title"
                      type="text"
                      :rules="[rules.required]"
                      outlined
                      dense
                      label="Title"
                      hide-details
                      color="#194569"
                    ></v-text-field>
                  </v-col>
                  <v-col md="6">
                    <v-text-field
                      v-model="item.company"
                      name="company"
                      type="text"
                      outlined
                      :rules="[rules.required]"
                      dense
                      label="Company"
                      hide-details
                      color="#194569"
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col md="6">
                    <v-text-field
                      v-model="item.location"
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
                      v-model="item.startDate"
                      name="startDate"
                      type="date"
                      :rules="[rules.required]"
                      outlined
                      dense
                      label="Start Date"
                      hide-details
                      color="#194569"
                    ></v-text-field>
                  </v-col>
                  <v-col md="6">
                    <v-text-field
                      v-model="item.endDate"
                      name="endDate"
                      type="date"
                      outlined
                      :min="item.startDate"
                      :rules="[rules.required]"
                      dense
                      label="End Date"
                      hide-details
                      color="#194569"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <!-- ////////////////////// -->
                <v-btn
                  color="#194569"
                  class="white--text mt-5"
                  @click="addNewFields"
                >
                  <v-icon>mdi-plus</v-icon>
                  Add More
                </v-btn>
                <v-icon
                  v-if="experience.length > 1"
                  class="cursor"
                  @click="removeField(index)"
                  color="red"
                >
                  mdi-minus
                </v-icon>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="secondry-btn" @click="close"> Close </v-btn>
            <v-btn
              @click="saveNewInformation()"
              :disabled="!isFormValid"
              color="#194569"
              class="white--text"
              type="submit"
            >
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
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
import { addNewExperience } from "../../../util/services/hrServices";

export default {
  components: { PopupSuccess },

  props: {
    editExperienceDialog: {
      type: Boolean,
      default: false,
    },
    employeeId: {
      type: String,
    },
  },
  data() {
    return {
      showEditExperienceDialog: false,
      isFormValid: false,
      rules: {
        required: (value) => !!value || "Required.",
      },

      experience: [
        {
          title: [],
          company: null,
          location: null,
          startDate: null,
          endDate: null,
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["getterForEmployeesInformation"]),
    assignDialog() {
      this.showEditExperienceDialog = this.editExperienceDialog;
    },
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),
    resetFields() {
      this.experience = [
        {
          title: [],
          company: null,
          location: null,
          startDate: null,
          endDate: null,
        },
      ];
    },
    close() {
      this.resetFields();
      this.$emit("update:editExperienceDialog", false);
    },
    addNewFields() {
      this.experience.push({
        title: [],
        company: null,
        location: null,
        startDate: null,
        endDate: null,
      });
    },
    removeField(index) {
      this.experience.splice(-1);
    },
    //   getText: (item) => `${item.name.en}`,

    async saveNewInformation() {
      try {
        let experienceArr = [];
        this.experience.forEach((element) => {
          experienceArr.push({
            title:
              element.title !== null
                ? {
                    id: "1",
                    name: {
                      ar: "",
                      en: element.title,
                    },
                  }
                : "N/A",

            company:
              element.company !== null
                ? {
                    ar: "",
                    en: element.company,
                  }
                : "N/A",
            location:
              element.location !== null
                ? {
                    country: {
                      id: "1",
                      name: {
                        ar: "",
                        en: element.location,
                      },
                    },
                    city: {
                      id: "1",
                      name: {
                        ar: "",
                        en: element.location,
                      },
                    },
                  }
                : "N/A",
            period:
              element.startDate !== null && element.endDate !== null
                ? {
                    from: element.startDate,
                    to: element.endDate,
                  }
                : "N/A",
          });
        });
        await addNewExperience({
          hrsMtProfileId: this.employeeId,

          experience: experienceArr,
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

        this.$emit("update:editExperienceDialog", false);
      } catch (error) {
        console.log(error, "edit education error");
      }
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
