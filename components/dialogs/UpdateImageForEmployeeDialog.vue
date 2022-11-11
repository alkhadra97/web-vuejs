<template>
  <!-- <div class="text-center"> -->
  <v-row justify="center">
    <!-- <v-col md="12"> -->
    <v-dialog v-model="showUpdateImageDialog" max-width="600">
      {{ assignDialog }}
      <v-card>
        <v-card-title>
          <span class="request-title text-h5">Update profile picture</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row class="d-flex justify-center align-center">
              <v-col md="10">
                <!-- /////////////////////////////// -->
                <v-text-field
                  data-cy="cy_employee_name_missing_punch_request_hr"
                  v-model="documentName"
                  name="documentName"
                  readonly
                  outlined
                  label="Image Name"
                  hide-details
                  color="blue2"
                ></v-text-field>
              </v-col>
              <v-col md="2">
                <v-btn
                  depressed
                  color="blue2"
                  class="white--text"
                  @click="selectImage"
                >
                  Select
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#A1A1A1" outlined @click="closeIt"> Close </v-btn>
          <v-btn
            depressed
            color="blue1"
            class="white--text"
            @click="savePhoto"
            :loading="saving"
            :disabled="saving || !dmsData"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- </v-col> -->
    </v-dialog>
    <template v-if="dmsDialog">
      <UploadComponent
        :showDmsDialog="dmsDialog"
        @fileData="fileData"
        @close="close"
      />
    </template>
    <!-- </v-col> -->
  </v-row>
  <!-- </div> -->
</template>

<script>
import UploadComponent from "../../../web.dms.agentsoncloud.com/components/UploadComponent.vue";
import { mapGetters, mapActions } from "vuex";
import { updateEmployeeInformation } from "../../util/services/hrServices";
import { uploadFile } from "../../../web.dms.agentsoncloud.com/static/services/dmsMethod";
import Swal from "sweetalert2";
import { moveFileToDMS } from "../../util/services/sharedServices";
export default {
  props: {
    updateImageDialog: {
      type: Boolean,
      default: false,
    },
    uuidForProviderIn: {
      type: String,
    },
  },
  data() {
    return {
      dmsDialog: false,
      showUpdateImageDialog: null,
      documentName: null,
      dmsData: null,
      saving: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
    assignDialog() {
      this.showUpdateImageDialog = this.updateImageDialog;
    },
    /*
     await this.$store.dispatch("uploadFile", this.dmsData);

      await this.$axios(
        requestBuilder("hr", "/hr/updateProfilePictureForEmployee", "put", {
          employeeUuid: this.uuidForProviderIn,
          updatedImage:
            this.$store.getters.getterForSavingResponse.documentLink,
        })
      ).then(() => {
        this.showUpdateImageDialog = !this.showUpdateImageDialog;
        this.getEmployees(this.uuidForProviderIn);
      });
     */
  },
  methods: {
    ...mapActions(["actionForEmployeeDataApi"]),
    closeIt() {
      this.$emit("update:updateImageDialog", false);
    },
    fileData(file) {
      try {
        console.log(...file, "file for hr");
        this.dmsData = file;
        let converting = [...file];
        console.log(converting);
        this.documentName = converting[0][1].name;
        this.dmsDialog = false;
      } catch (e) {
        console.log(e);
      }
    },
    async savePhoto() {
      try {
        this.saving = true;
        let uploadImage = await uploadFile(this.dmsData);
        console.log(this.uuidForProviderIn, "uuidForProviderIn");
        let updateEmployee = await updateEmployeeInformation({
          recordId: this.uuidForProviderIn || null,
          image: uploadImage[0]?.link || null,
        });
        let moveFileToDms = await moveFileToDMS({
          files: uploadImage,
          referenceId: this.uuidForProviderIn,
          referenceType: "HRS",
          notes: `Image Profile For Employee ID ${this.uuidForProviderIn}`,
          sensitivity: "10",
          createdBy: {
            id: this.user.id || null,
            name: this.user.name || null,
          },
        });
        console.log(updateEmployee, "updateEmployee");
        console.log(moveFileToDms, "moveFileToDms update user image");
        await this.actionForEmployeeDataApi({
          employee_id: this.uuidForProviderIn,
        });
        await Swal.fire({
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        this.dmsDialog = false;
        this.showUpdateImageDialog = false;
        this.saving = false;
        this.documentName = "";
        this.dmsData = null;
      } catch (e) {
        console.log(e);
      }
    },
    testData(param1) {
      let converting = [...param1];
      this.documentName = converting[1][1].name;
      this.dmsData = param1;
    },
    close() {
      this.dmsDialog = false;
    },
    selectImage() {
      this.dmsDialog = true;
    },
  },

  components: { UploadComponent },
};
</script>

<style scoped></style>
