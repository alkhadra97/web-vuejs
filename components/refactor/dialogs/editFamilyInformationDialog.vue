<template>
  <div>
    <v-dialog
      v-model="showEditInformationDialog"
      persistent
      width="782.5"
      height="471.5"
    >
      {{ assignDialog }}
      <v-col md="12">
        <v-row class="align-center justify-center">
          <v-card>
            <v-card-title>
              <span class="request-title">Edit family Information</span>
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
                        dense
                        :rules="[rules.valid]"
                        :placeholder="familyObj.name"
                        hide-details
                        label="Name"
                        color="#194569"
                      ></v-text-field>
                    </v-col>
                    <v-col md="6">
                      <v-autocomplete
                        v-model="newFamilyRelation"
                        :items="relations"
                        :item-text="`name`"
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
                          {{ getName(item) }}
                        </template>
                        <template v-slot:item="{ item }">
                          {{ getName(item) }}
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col md="6">
                      <v-text-field
                        v-model="newDob"
                        name="dob"
                        type="date"
                        outlined
                        :max="nowDate"
                        dense
                        label="Date Of Birth"
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
import { updateFamilyInformationService } from "../../../util/services/hrServices";
import { getAllRelations } from "../../../util/services/sharedServices";
export default {
  components: { PopupSuccess },

  props: {
    editFamilyInformationDialog2: {
      type: Boolean,
      default: false,
    },
    employeeId: {
      type: String,
    },
    familyObj: {
      type: Object,
    },
  },
  data() {
    return {
      showEditInformationDialog: false,
      nowDate: new Date().toISOString().slice(0, 10),
      newDob: null,
      newFamilyRelation: null,

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
      newName: null,
      relations: [],
    };
  },

  computed: {
    ...mapGetters(["getterForEmployeesInformation"]),
    assignDialog() {
      this.showEditInformationDialog = this.editFamilyInformationDialog2;
    },
    // activeLanguage: "activeLanguage",
    // inactiveLanguage: "inactiveLanguage",
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),
    resetField() {
      this.newName = this.familyObj.name;
      this.newDob = this.familyObj.dob;
      this.newFamilyRelation = this.familyObj.relation2;
    },

    close() {
      this.resetField();

      this.$emit("update:editFamilyInformationDialog2", false);
    },

    getName: (item) => `${item.name.en}`,
    async saveNewInformation() {
      try {
        await updateFamilyInformationService({
          recordId: this.familyObj.recordId,
          name:
            this.newName !== null
              ? {
                  ar: "",
                  en: this.newName,
                }
              : null,

          relation:
            this.newFamilyRelation !== null ? this.newFamilyRelation : null,
          dob: this.newDob !== null ? this.newDob : null,
          createdBy: {
            id: "1",
            user: {
              ar: "",
              en: "beshir",
            },
            system: "agents",
            chanel: "12",
          },
        });
        await this.actionForEmployeeDataApi({
          employee_id: [this.employeeId],
        });
        await this.resetField();
        this.$emit("update:editFamilyInformationDialog2", false);
      } catch (error) {
        console.log(error, "edit family information error");
      }
    },
    async fetchAllSharedAPIs() {
      try {
        this.relations = await getAllRelations();
      } catch (e) {
        console.log(e, "      ");
      }
    },
  },

  mounted() {
    try {
      this.fetchAllSharedAPIs();
      this.newName = this.familyObj.name;
      this.newDob = this.familyObj.dob;
      this.newFamilyRelation = this.familyObj.relation2;
    } catch (error) {
      console.log(error);
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
