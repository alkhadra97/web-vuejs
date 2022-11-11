<template>
  <client-only>
    <div id="chart">
      <VueApexCharts
        type="bar"
        height="350"
        :options="chartOptions"
        :series="series"
        ref="exampleChart"
      ></VueApexCharts>
      <button @click="change">change</button>
    </div>
  </client-only>
</template>
<script>
export default {
  name: "AverageWorkingHoursForEmployee",
  data() {
    return {
      series: [
        {
          data: [
            8550405, 3971883, 2720546, 2296224, 1567442, 1563025, 1469845,
            1394928, 1300092, 1026908,
          ],
        },
      ],
      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        theme: {
          mode: "dark",
        },

        xaxis: {
          categories: [
            "New York",
            "Los Angeles",
            "Chicago",
            "Houston",
            "Philadelphia",
            "Phoenix",
            "San Antonio",
            "San Diego",
            "Dallas",
            "San Jose",
          ],
        },
        fill: {
          colors: ["#F44336"],
        },
        dataLabels: {
          enabled: false,
        },

        title: {
          text: "Largest US Cities By Population",
          align: "center",
          margin: 20,
          offsetY: 20,
          style: {
            fontSize: "25px",
          },
        },
      },
    };
  },
  methods: {
    change() {
      this.$refs.exampleChart.updateOptions({
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
      });
    },
  },
  components: {
    VueApexCharts: () => import("vue-apexcharts"),
  },
};
</script>
