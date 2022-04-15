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
                灵活学习
              </h1>
            </v-col>
          </v-row>
          <v-row>
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
                 <v-img height="240" width="220" src="../assets/flex-study.svg"/>
              </v-col>
              <v-col  style="font-weight:800" cols="12" md="4">
                <div style="margin-top:40px;line-height: 2">“编译知义”为学习者提供更灵活的学习选择，学生可以根据自身的时间安排来选择学习相应的知识。
                不仅可以让学生在学习编译原理的过程中只关注某一个词法分析算法或语法分析算法，
                还可以让学生以可视化的方式学习编译器是如何进行词法分析以及语法分析的过程。
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

</template>

<script>
export default {
  name: "FlexibleLearning"
}
</script>

<style scoped>

</style>