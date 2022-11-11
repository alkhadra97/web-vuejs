<template>
  <v-dialog v-model="showWorkingHoursDialog" max-width="500px">
    {{ assignWorkingHoursDialog }}
    <v-col md="12">
      <v-row class="align-center justify-center">
        <v-card>
          <v-card-title>
            <span class="request-title text-h5">Working Hours</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <table
                  v-if="getAllWorkingHours.length > 0"
                  class="table-workingHours"
                >
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>From</th>
                      <th>To</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-column="USERNAME">Sunday</td>
                      <td>
                        {{ getAllWorkingHours[0].sunday.from }}
                      </td>
                      <td data-column="ID">
                        {{ getAllWorkingHours[0].sunday.to }}
                      </td>
                      <!-- <td data-column="ID">
                        <v-btn @click="showUpdateWorkingHoursDialog"
                          >Update</v-btn
                        >
                      </td> -->
                    </tr>
                    <tr>
                      <td data-column="USERNAME">Monday</td>
                      <td>
                        {{ getAllWorkingHours[0].monday.from }}
                      </td>
                      <td data-column="ID">
                        {{ getAllWorkingHours[0].monday.to }}
                      </td>
                      <!-- <td data-column="ID">
                        <v-btn @click="showUpdateWorkingHoursDialog"
                          >Update</v-btn
                        >
                      </td> -->
                    </tr>
                    <tr>
                      <td data-column="USERNAME">Tuesday</td>
                      <td>
                        {{ getAllWorkingHours[0].tuesday.from }}
                      </td>
                      <td data-column="ID">
                        {{ getAllWorkingHours[0].tuesday.to }}
                      </td>
                      <!-- <td data-column="ID">
                        <v-btn @click="showUpdateWorkingHoursDialog"
                          >Update</v-btn
                        >
                      </td> -->
                    </tr>

                    <tr>
                      <td data-column="USERNAME">Wednesday</td>
                      <td>
                        {{ getAllWorkingHours[0].wednesday.from }}
                      </td>
                      <td data-column="ID">
                        {{ getAllWorkingHours[0].wednesday.to }}
                      </td>
                      <!-- <td data-column="ID">
                        <v-btn @click="showUpdateWorkingHoursDialog"
                          >Update</v-btn
                        >
                      </td> -->
                    </tr>
                    <tr>
                      <td data-column="USERNAME">Thursday</td>
                      <td>
                        {{ getAllWorkingHours[0].thursday.from }}
                      </td>
                      <td data-column="ID">
                        {{ getAllWorkingHours[0].thursday.to }}
                      </td>
                      <!-- <td data-column="ID">
                        <v-btn @click="showUpdateWorkingHoursDialog"
                          >Update</v-btn
                        >
                      </td> -->
                    </tr>
                    <tr>
                      <td data-column="USERNAME">Friday</td>
                      <td>
                        {{ getAllWorkingHours[0].friday.from }}
                      </td>
                      <td data-column="ID">
                        {{ getAllWorkingHours[0].friday.to }}
                      </td>
                      <!-- <td data-column="ID">
                        <v-btn @click="showUpdateWorkingHoursDialog"
                          >Update</v-btn
                        >
                      </td> -->
                    </tr>
                    <tr>
                      <td data-column="USERNAME">Saturday</td>
                      <td>
                        {{ getAllWorkingHours[0].saturday.from }}
                      </td>
                      <td data-column="ID">
                        {{ getAllWorkingHours[0].saturday.to }}
                      </td>
                      <!-- <td data-column="ID">
                        <v-btn @click="showUpdateWorkingHoursDialog"
                          >Update</v-btn
                        >
                      </td> -->
                    </tr>
                  </tbody>
                </table></v-row
              >
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="teal" text @click="close"> Close </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-col>
  </v-dialog>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    workingHoursDialog: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      showWorkingHoursDialog: null,
    };
  },

  methods: {
    close() {
      this.$emit("update:workingHoursDialog", false);
    },
  },
  computed: {
    ...mapGetters(["getAllWorkingHours"]),
    assignWorkingHoursDialog() {
      this.showWorkingHoursDialog = this.workingHoursDialog;
    },
  },
};
</script>
<style scoped>
.request-title {
  font-weight: bold;
  color: rgb(89, 88, 88);
  margin-top: 2em auto;
  padding-bottom: 0.2em;
}
.request-title::after {
  content: "";
  display: block;
  width: 20vw;
  height: 4px;
  background: #059486;
  margin: 0.5rem auto 0;
}
.table-workingHours {
  width: 30vw;
  border-collapse: collapse;
  margin: 30px auto;
}
.table-attendance {
  width: 25vw;
  border-collapse: collapse;
  margin: 30px auto;
}
th {
  background: #35b5ac;
  color: white;
  font-weight: bold;
}

td,
th {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
  font-size: 1.1rem;
}
@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
  table {
    width: 100%;
  }

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #ccc;
  }

  td {
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    /* Now like a table header */
    position: absolute;
    /* Top/left values mimic padding */
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    /* Label the data */
    content: attr(data-column);

    color: #000;
    font-weight: bold;
  }
}
</style>
