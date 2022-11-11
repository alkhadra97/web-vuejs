<template>
  <div>
    <v-dialog
      v-model="showEditEducationDialog"
      persistent
      width="782.5"
      height="471.5"
    >
      {{ assignDialog }}
      <v-col md="12" class="pa-0">
        <v-card>
          <v-card-title>
            <span class="request-title">Add New Education</span>
          </v-card-title>

          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <v-container>
              <v-form v-model="isFormValid">
                <!-- /////////////////////////////// -->

                <v-row v-for="(item, index) in education" :key="index">
                  <v-col md="6">
                    <v-autocomplete
                      v-model="item.instituation"
                      name="instituation"
                      :items="universities"
                      :rules="[rules.required]"
                      outlined
                      dense
                      :item-text="`name`"
                      hide-details
                      color="#194569"
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
                      v-model="item.instituation"
                      name="instituation"
                      type="text"
                      :rules="[rules.required]"
                      outlined
                      dense
                      label="Instituation"
                      hide-details
                      color="#194569"
                    ></v-text-field>
                  </v-col> -->
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
                      v-model="item.subject"
                      name="subject"
                      type="text"
                      :rules="[rules.required]"
                      outlined
                      dense
                      label="Subject"
                      hide-details
                      color="#194569"
                    ></v-text-field>
                  </v-col>
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
                  v-if="education.length === 1"
                  color="#194569"
                  class="white--text mt-5"
                  @click="addNewFields"
                >
                  <v-icon>mdi-plus</v-icon>
                  Add More
                </v-btn>
                <v-icon
                  v-if="education.length > 1"
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
import { addNewEducation } from "../../../util/services/hrServices";
import { getAllUniversities } from "../../../util/services/sharedServices";

export default {
  components: { PopupSuccess },

  props: {
    editEducationDialog: {
      type: Boolean,
      default: false,
    },
    employeeId: {
      type: String,
    },
  },
  data() {
    return {
      showEditEducationDialog: false,
      isFormValid: false,
      rules: {
        required: (value) => !!value || "Required.",
      },
      universities: [],

      education: [
        {
          instituation: [],
          location: null,
          subject: null,
          startDate: null,
          endDate: null,
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["getterForEmployeesInformation"]),
    assignDialog() {
      this.showEditEducationDialog = this.editEducationDialog;
    },
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),
    resetFields() {
      this.education = [
        {
          instituation: [],
          location: null,
          subject: null,
          startDate: null,
          endDate: null,
        },
      ];
    },
    close() {
      this.resetFields();
      this.$emit("update:editEducationDialog", false);
    },
    getText: (item) => `${item.name.en}`,

    addNewFields() {
      this.education.push({
        instituation: [],
        location: null,
        subject: null,
        startDate: null,
        endDate: null,
      });
    },
    removeField(index) {
      this.education.splice(-1);
    },
    //   getText: (item) => `${item.name.en}`,

    async saveNewInformation() {
      try {
        let educationArr = [];
        this.education.forEach((element) => {
          educationArr.push({
            university:
              element.instituation !== null ? element.instituation : null,

            location:
              element.location !== null
                ? {
                    id: "1",
                    name: {
                      ar: "",
                      en: element.location,
                    },
                  }
                : "N/A",
            faculity: element.subject !== null ? element.subject : "N/A",
            period:
              element.startDate !== null && element.endDate !== null
                ? {
                    from: element.startDate,
                    to: element.endDate,
                  }
                : "N/A",
          });
        });
        await addNewEducation({
          hrsMtProfileId: this.employeeId,

          education: educationArr,
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

        this.$emit("update:editEducationDialog", false);
      } catch (error) {
        console.log(error, "edit education error");
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
    this.fetchAllSharedAPIs();
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
