<template>
  <div>
    <v-parallax src="../assets/module-bg-s.png" height="400">
      <div style="width: 100%; height: 100%; background-image: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 100%);">
        <v-container>
          <v-row
              align="center"
              justify="center">
            <v-col
                class="text-left"
                cols="10"
                md="11">
              <h1 class="text-h4 font-weight-bold mt-12 black--text text-md-h3">
                可视化
              </h1>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-parallax>
    <v-container style="margin-top: -240px">
      <v-row justify="center">
        <v-col cols="10">
          <v-card :style="{padding: cardPadding + 'px' }">

            <v-row justify="center">
              <v-col cols="12" md="4">
                <v-img height="240" width="220" src="../assets/visual.svg"/>
              </v-col>
              <v-col  style="font-weight:800" cols="12" md="4">
                <div style="margin-top80px;line-height: 2">
                  由于 Vue 的多平台适配，优质布局等特点，将 Vue 作为我们的前端框
                  架，并使用 Vuetify 来搭配 Vue 的开发，兼容性强，更加美观。后端则是使用轻量级的
                  Springboot 框架，将易编所需要的全部服务都部署在后端，保证了数据和源码的安全性，利
                  用 Ajax 异步获取，数据的传输使用 Fastjson。前端呈现简易的用户操作和方便的数据的保存
                  调用，以及未来使用数据库开发登录注册，将历史操作记录在云端等功能，从用户角度出发，
                  在提升易编功能的多样化的同时，也注重用户友好性，让“好用”，“易用”，“多用”的特点，
                  成为易编（Eapile）最大的闪光点。

                </div></v-col>



            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

</template>

<script>
export default {
  name: "Visualization"
}
</script>

<style scoped>

</style>