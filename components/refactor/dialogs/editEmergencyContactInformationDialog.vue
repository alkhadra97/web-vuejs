<template>
  <div>
    <v-dialog
      v-model="showEmergencyContactInformationDialog"
      persistent
      width="500"
      height="385"
    >
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title">Edit Emergency Contact</span>
            </v-card-title>

            <v-divider class="mx-4"></v-divider>
            <v-card-text>
              <v-container>
                <v-form v-model="isFormValid">
                  <!-- /////////////////////////////// -->

                  <v-row>
                    <v-col md="6">
                      <v-text-field
                        v-model="newName"
                        name="name"
                        type="text"
                        outlined
                        :rules="[rules.valid]"
                        label="Name"
                        dense
                        hide-details
                        color="#194569"
                      ></v-text-field>
                    </v-col>
                    <v-col md="6">
                      <v-autocomplete
                        v-model="newEmergenctContactRelation"
                        :items="relations"
                        item-text="name"
                        item-value="id"
                        name="relation"
                        type="text"
                        outlined
                        dense
                        label="Relation"
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
                    <v-col md="6">
                      <v-text-field
                        v-model="newPhoneNumber"
                        name="phone"
                        label="Phone"
                        type="text"
                        :rules="[rules.phoneNumber]"
                        outlined
                        dense
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
import { updateEmergencyContactInformationService } from "../../../util/services/hrServices";
import { getAllRelations } from "../../../util/services/sharedServices";

export default {
  components: { PopupSuccess },

  props: {
    editEmergencyContactInformationDialog: {
      type: Boolean,
      default: false,
    },
    employeeId: {
      type: String,
    },
    emergencyContactObj: {
      type: Object,
    },
  },
  data() {
    return {
      showEmergencyContactInformationDialog: false,
      newName: null,
      newPhoneNumber: null,
      newEmergenctContactRelation: null,
      relations: [],
      isFormValid: true,

      rules: {
        phoneNumber: (value) => {
          let testPhone = /(^07[9|7|8]{1}[0-9]{7}$)/.test(value);
          // const pattern = value.length <= 2;
          if (testPhone) {
            this.isFormValid = true;
          } else {
            this.isFormValid = false;
          }
        },
        valid: (value) => {
          // let testPhone = /(^07[9|7|8]{1}[0-9]{7}$)/.test(value);
          const pattern = value.length <= 2;
          if (!pattern) {
            this.isFormValid = true;
          } else {
            this.isFormValid = false;
          }
        },
      },
    };
  },

  computed: {
    ...mapGetters(["getterForEmployeesInformation"]),
    assignDialog() {
      this.showEmergencyContactInformationDialog =
        this.editEmergencyContactInformationDialog;
    },
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),
    restFields() {
      this.newName = this.emergencyContactObj.name;
      this.newPhoneNumber = this.emergencyContactObj.phone;
      this.newEmergenctContactRelation = this.emergencyContactObj.relation;
    },
    close() {
      this.restFields();
      this.$emit("update:editEmergencyContactInformationDialog", false);
    },

    getText: (item) => `${item.name.en}`,

    async saveNewInformation() {
      try {
        await updateEmergencyContactInformationService({
          recordId: this.emergencyContactObj.recordId,

          name:
            this.newName !== null
              ? {
                  ar: "",
                  en: this.newName,
                }
              : null,

          relation: this.newEmergenctContactRelation
            ? this.newEmergenctContactRelation
            : null,
          phone:
            this.newPhoneNumber !== null
              ? { country_code: "962", number: this.newPhoneNumber }
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
        await this.restFields();

        this.$emit("update:editEmergencyContactInformationDialog", false);
      } catch (error) {
        console.log(error, "edit emergency contact error");
      }
    },
    async fetchAllSharedAPIs() {
      try {
        this.relations = await getAllRelations();
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    try {
      this.fetchAllSharedAPIs();
      this.newName = this.emergencyContactObj.name;
      this.newPhoneNumber = this.emergencyContactObj.phone;
      this.newEmergenctContactRelation = this.emergencyContactObj.relation2;
    } catch (e) {
      console.log(e);
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
