<template>
  <v-container>
    <div class="step">
      <div>
        <div class="circle">1</div>
      </div>
      <div>
        <div class="title">Uw identity</div>
        <div class="caption">
          Using your phone with the app verify you will scan your id card or
          passport and then use the frontal camera to match it with your own
          face. This ensures that you are really you.
        </div>
      </div>
    </div>
    <div class="step step-active">
      <div>
        <div class="circle">2</div>
      </div>
      <div>
        <div class="title">Second Step</div>
      </div>
    </div>
    <div class="step">
      <div>
        <div class="circle">3</div>
      </div>
      <div>
        <div class="title">Third Step</div>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "addEmployeeSteps",
};
</script>

<style scoped lang="scss">
/* Delete these base styles before copying and pasting into your CSS */
body {
  font-size: 18px;
  font-family: SenticoSansDT,sans-serif;
  margin: 30px 30px;
}
*,
*:before,
*:after {
  box-sizing: border-box;
}
/* End of delete base styles */

/* -------------------------------------------------------------------------
  VERTICAL STEPPERS
-------------------------------------------------------------------------- */

/* Steps */
.step {
  position: relative;
  min-height: 1em;
  color: grey;
}
.step + .step {
  margin-top: 1.5em;
}
.step > div:first-child {
  position: static;
  height: 0;
}
.step > div:not(:first-child) {
  margin-left: 1.5em;
  padding-left: 1em;
}
.step.step-active {
  color: #4285f4;
}
.step.step-active .circle {
  background-color: #0069b4;
}

/* Circle */
.circle {
  background: #0069b4;
  position: relative;
  width: 1.5em;
  height: 1.5em;
  line-height: 1.5em;
  border-radius: 100%;
  color: #fff;
  text-align: center;
  box-shadow: 0 0 0 3px #fff;
}

/* Vertical Line */
.circle:after {
  content: " ";
  position: absolute;
  display: block;
  top: 1px;
  right: 50%;
  bottom: 1px;
  left: 50%;
  height: 100%;
  width: 2px;
  transform: scale(1, 2);
  transform-origin: 50% -100%;
  background-color: #0069b4;
  z-index: -1;
}
.step:last-child .circle:after {
  display: none;
}

.step:first-child .circle:after {
  height: 100%;
  z-index: -1;
}

/* Stepper Titles */
.title {
  line-height: 1.5em;
  font-weight: bold;
}
.caption {
  font-size: 0.8em;
}
</style>
