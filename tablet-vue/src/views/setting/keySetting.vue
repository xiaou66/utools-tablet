<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="applicationKey">
        <el-input v-model="keys.applicationKey"></el-input>
      </el-form-item>
      <el-form-item label="HMACKey">
        <el-input v-model="keys.HMACKey"></el-input>
      </el-form-item>
    </el-form>
    <div style="display: flex;justify-content: center">
      <el-popover
        placement="top"
        title="提示"
        width="200"
        trigger="hover"
        content="选择 Web，注册后将 key 会通过 Email 发送给你">
        <el-button @click="getKeyHandler" slot="reference">获取 Key</el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['keys'])
  },
  methods: {
    getKeyHandler () {
      if (window.openUrl) {
        window.openUrl('https://developer.myscript.com/getting-started')
      }
    }
  }
}
</script>

<style scoped>

</style>
