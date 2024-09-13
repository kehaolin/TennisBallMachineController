<template>
  <view class="battery">
    <view class="battery-body" :style="{ backgroundColor: batteryColor }">
      <view class="battery-fill" :style="{ width: batteryLevel + '%', backgroundColor: chargeColor }"></view>
    </view>
    <view class="battery-bolt" v-if="isCharging"></view>
  </view>
</template>

<script>
export default {
  props: {
    batteryLevel: {
      type: Number,
      default: 50
    },
    batteryColor: {
      type: String,
      default: '#333'
    },
    chargeColor: {
      type: String,
      default: '#008000'
    },
    isCharging: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.battery {
  width: 60px;
  height: 20px;
  position: relative;
}

.battery-body {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

.battery-fill {
  height: 100%;
  border-radius: 5px;
  background-color: #008000; /* Default charge color */
}

.battery-bolt {
  width: 10px;
  height: 20px;
  background-color: red;
  position: absolute;
  right: -5px;
  top: -5px;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
</style>
