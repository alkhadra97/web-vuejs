<template>
  <v-dialog v-model="showDeleteDialog" max-width="500px">
    {{ assignDialog }}

    <v-card>
      <v-card-title class="text-h5"
        >Are you sure you want to delete this item?</v-card-title
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="deleteItemConfirm(item, deleteType)"
          >OK</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    deleteDialog: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
    },
    deleteType: {
      type: String,
    },
  },
  data() {
    return {
      showDeleteDialog: false,
    };
  },
  computed: {
    assignDialog() {
      this.showDeleteDialog = this.deleteDialog;
    },
  },
  methods: {
    closeDelete() {
      this.$emit("update:deleteDialog", false);
    },
    deleteItemConfirm(item, deleteType) {
      this.$emit("deleteItem", item, deleteType);
    },
  },
};
</script>

<style scoped></style>
