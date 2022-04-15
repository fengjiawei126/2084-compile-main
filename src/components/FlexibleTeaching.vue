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
                方便教学
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
                <v-img height="240" width="220" src="../assets/easy-teach.svg"/>
              </v-col>   <v-col  style="font-weight:800" cols="12" md="4">
              <div style="margin-top:60px;line-height: 2">通过“编译知义”，教师可自定义语法规则来展示词法分析与语法分析。借助于多媒体技
                术，把抽象的知识通过文字、图像、动画、表格等组合的方式展示给学生。不仅使知识变
                得更易于理解接受，同时也能大大提高学生学习抽象知识的兴趣。

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
  name: "FacilicateTeaching"
}
</script>

<style scoped>

</style>