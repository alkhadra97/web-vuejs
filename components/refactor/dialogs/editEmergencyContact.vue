<template>
  <div>
    <v-dialog
      v-model="showEditEmergencyContactDialog"
      persistent
      width="782.5"
      height="471.5"
    >
      {{ assignDialog }}
      <v-col md="12" class="pa-0">
        <v-card>
          <v-card-title>
            <span class="request-title">Add Emergency Contact</span>
          </v-card-title>

          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <v-container>
              <v-form v-model="isFormValid">
                <!-- /////////////////////////////// -->

                <v-row v-for="(item, index) in emergencyContact" :key="index">
                  <v-col md="6">
                    <v-text-field
                      v-model="item.name"
                      name="name"
                      type="text"
                      outlined
                      dense
                      label="Name"
                      hide-details
                      :rules="[rules.required]"
                      color="#194569"
                    ></v-text-field>
                  </v-col>
                  <v-col md="6">
                    <v-autocomplete
                      v-model="item.relation"
                      :items="relations"
                      item-text="name"
                      name="relation"
                      type="text"
                      outlined
                      dense
                      :rules="[rules.required]"
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
                      v-model="item.phone"
                      name="phone"
                      type="text"
                      outlined
                      dense
                      :rules="phoneRules"
                      label="Phone"
                      hide-details
                      color="#194569"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <!-- ////////////////////// -->
                <v-btn
                  v-if="emergencyContact.length === 1"
                  color="#194569"
                  class="white--text mt-5"
                  @click="addNewFields"
                >
                  <v-icon>mdi-plus</v-icon>
                  Emergency contact
                </v-btn>
                <v-icon
                  v-if="emergencyContact.length > 1"
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
              color="#194569"
              class="white--text"
              :disabled="!isFormValid"
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
import { addNewEmergencyContact } from "../../../util/services/hrServices";
import { getAllRelations } from "../../../util/services/sharedServices";

export default {
  components: { PopupSuccess },

  props: {
    editEmergencyContact: {
      type: Boolean,
      default: false,
    },
    employeeId: {
      type: String,
    },
  },
  data() {
    return {
      showEditEmergencyContactDialog: false,
      isFormValid: false,
      relations: [],

      emergencyContact: [
        {
          name: [],
          relation: null,
          phone: null,
        },
      ],
      rules: {
        required: (value) => !!value || "Required.",
      },
      phoneRules: [
        (v) =>
          /(^07[9|7|8]{1}[0-9]{7}$)/.test(v) ||
          "Phone number must be 10 numbers",
      ],
    };
  },

  computed: {
    ...mapGetters(["getterForEmployeesInformation"]),
    assignDialog() {
      this.showEditEmergencyContactDialog = this.editEmergencyContact;
    },
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),
    resetFields() {
      this.emergencyContact = [
        {
          name: [],
          relation: null,
          phone: null,
        },
      ];
    },
    close() {
      this.resetFields();
      this.$emit("update:editEmergencyContact", false);
    },
    addNewFields() {
      this.emergencyContact.push({
        name: [],
        relation: null,
        phone: null,
      });
    },
    removeField(index) {
      this.emergencyContact.splice(-1);
    },
    getText: (item) => `${item.name.en}`,

    async saveNewInformation() {
      try {
        let emergencyContactArr = [];
        this.emergencyContact.forEach((element) => {
          emergencyContactArr.push({
            name:
              element.name !== null
                ? {
                    ar: "",
                    en: element.name,
                  }
                : "N/A",

            relation: element.relation !== null ? element.relation : "N/A",
            phone:
              element.phone !== null
                ? { country_code: "962", number: element.phone }
                : "N/A",
          });
        });
        await addNewEmergencyContact({
          hrsMtProfileId: this.employeeId,

          emergencyContact: emergencyContactArr,
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
        this.$emit("update:editEmergencyContact", false);
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
