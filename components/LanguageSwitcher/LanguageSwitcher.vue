<template>
  <button @click="switchLanguage">
    {{ $t('switchLanguage') }}
  </button>
</template>

<script>
import { useI18n } from '@dcloudio/uni-i18n';

export default {
  setup() {
    const { locale } = useI18n();

    const switchLanguage = () => {
      locale.value = locale.value === 'zh' ? 'en' : 'zh';
    };

    return {
      switchLanguage
    };
  }
};
</script>

<style scoped>
button {
  padding: 10px;
  font-size: 16px;
}
</style>
