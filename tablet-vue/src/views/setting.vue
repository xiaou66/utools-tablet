<template>
  <div>
    <el-page-header style="padding: 15px;" @back="goBack"/>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane :label="item.name" :name="item.name" v-for="(item,key) in tabsData" :key="key">
        <div style="padding: 20px 30px">
          <router-view/>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabsData: [
        { name: 'key 设置', router: { name: 'keySetting' } }
      ],
      activeName: 'key 设置'
    }
  },
  mounted () {
    this.$router.push({ name: 'keySetting' })
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'index' })
    },
    handleClick () {
      const item = this.tabsData.find(i => i.name === this.activeName)
      this.$router.replace(item.router)
    }
  }
}
</script>

<style scoped>

</style>
