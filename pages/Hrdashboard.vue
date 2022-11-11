<template>
  <div>
    <v-container>
      <v-row class="justify-center">
        <UpperScreenDashboard />
      </v-row>
      <v-row>
        <v-col md="12">
          <ToggeelingTabsDashboard />
        </v-col>
      </v-row>

      <div></div>
    </v-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import UpperScreenDashboard from "../components/refactor/myHrUpperSection/upperScreenDashboard.vue";
import ToggeelingTabsDashboard from "../components/refactor/bottomSection/toggeelingTabsDashboard.vue";
export default {
  name: "index",
  layout: "dashboard",

  mounted() {},

  computed: {},
  watch: {},
  methods: {
    ...mapActions([]),
  },
  components: {
    UpperScreenDashboard,
    ToggeelingTabsDashboard,
  },
};
</script>

<style scoped>
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

.load {
  width: 100px;
  height: 100px;
  margin: 110px auto 0;
  border: solid 10px #009688;
  border-radius: 50%;
  border-right-color: transparent;
  border-bottom-color: transparent;
  -webkit-transition: all 0.5s ease-in;
  -webkit-animation-name: rotate;
  -webkit-animation-duration: 1s;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;

  transition: all 0.5s ease-in;
  animation-name: rotate;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
</style>
