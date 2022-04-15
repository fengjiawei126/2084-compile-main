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
                多平台
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
                <v-img height="240" width="220" src="../assets/multi-platform.svg"/>
              </v-col>       <v-col  style="font-weight:800" cols="12" md="4">
        <div style="margin-top:25px;line-height: 2">由于编译原理理论性强、抽象概念多且复杂，往往使学习
          者感觉乏味难理解。枯燥的理论知识加上传统的学习模式使它成为计算机基础专业课中学
          生认为最难学、教师认为最难讲的一门课。 为了弥补这一弊端，在仔细分析当前编译原理教学及学习方法中的不足之后，我们研
          究并设计了一个基于 Web 与手机 APP 的编译原理辅助教学系统——编译知义(Sapile）。

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
  name: "Multiplatform"
}
</script>

<style scoped>

</style>