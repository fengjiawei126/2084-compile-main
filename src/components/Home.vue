<template>
  <div>
    <div style="background: linear-gradient(rgb(24, 102, 192), rgb(85,26,139)); margin-top: -64px; padding-top: 64px">
      <v-container fluid>
        <v-row v-show="['xl', 'lg', 'md'].indexOf(this.$vuetify.breakpoint.name) !== -1" style="padding: 100px 200px">
          <v-col cols="6" >

            <h1 class="text-h1 white--text">编译知义-Sapile</h1>
            <h1 class="mt-8 text-h4 white--text">简易、轻量、多平台的编译原理可视化系统。</h1>
            <p><v-btn x-large class="mt-8" color="white" @click="scrollDown">Get Started!</v-btn></p>
          </v-col>
          <v-col cols="6">
            <div class="mt-16" ref="lottie1"/>
          </v-col>
        </v-row>
        <v-row v-show="['xl', 'lg', 'md'].indexOf(this.$vuetify.breakpoint.name) === -1" style="padding: 40px 50px">
          <v-col cols="12">
            <div ref="lottie2"/>
          </v-col>
          <v-col cols="12" >
            <h1 class="text-h4 white--text text-center">Sapile</h1>
            <h1 class="mt-4 text-h6 white--text text-center">简易、轻量、多平台的编译原理可视化系统。</h1>
            <p class="text-center"><v-btn large class="mt-4" color="white" @click="scrollDown">Get Started!</v-btn></p>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <Video/>


    <v-container class="my-16">
      <v-row justify="center">
        <v-col class="text-center" cols="12" lg="3" md="6">
          <div style="display: inline-block">
            <v-img height="240" width="220" src="../assets/flex-study.svg"/>

            <button class="cta">
              <span>   <router-link to="FlexibleLearning" >灵活学习</router-link></span>
            </button>

          </div>
        </v-col>
        <v-col class="text-center" cols="12" lg="3" md="6">
          <div style="display: inline-block">
            <v-img height="240" width="220" src="../assets/easy-teach.svg"/>
            <button class="cta">
              <span>   <router-link to="FlexibleTeaching" >方便教学</router-link></span>
            </button>

          </div>
        </v-col>
        <v-col class="text-center" cols="12" lg="3" md="6">
          <div style="display: inline-block">
            <v-img height="240" width="220" src="../assets/multi-platform.svg"/>
            <button class="cta">
              <span>   <router-link to="Multiplatform" >多平台</router-link></span>

            </button>

          </div>
        </v-col>
        <v-col class="text-center" cols="12" lg="3" md="6">
          <div style="display: inline-block">
            <v-img height="240" width="220" src="../assets/visual.svg"/>
            <button class="cta">
              <span>   <router-link to="Visualization" >可视化</router-link></span>

            </button>


          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-footer padless>
      <v-card flat tile width="100%" class="brown text-center">
        <v-card-text>
          <v-btn class="mx-4 white--text" icon href="https://github.com/ssYanhuo/2084-compile">
            <v-icon>
              mdi-github
            </v-icon>
          </v-btn>
          <v-btn class="mx-4 white--text" icon href="https://2084team.cn/">
            <v-icon>
              mdi-account-multiple
            </v-icon>
          </v-btn>
        </v-card-text>
        <v-divider/>
        <v-card-text class="white--text">
          Copyright ©  {{ new Date().getFullYear() }} <strong>2084 Eapile Team</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </div>

</template>
<style>
a{
  text-decoration: none;
}
.cta {
  position: relative;
  margin: auto;
  padding: 12px 18px;
  transition: all 0.2s ease;
  border: none;
  background: none;
}

.cta:before {
  content: "";
  position: absolute;

  left: -10px;
  display: block;
  border-radius: 50px;
  background: #b1dae7;
  width: 25px;
  height: 25px;
  transition: all 0.3s ease;
}

.cta span {
  position: relative;
  font-family: "Ubuntu", sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #234567;
}

.cta:hover:before {
  width: 115%;
  background: #b1dae7;
}

.cta:hover svg {
  transform: translateX(0);
}

.cta:active {
  transform: scale(0.95);
}

</style>


<script>
  import lottie from 'lottie-web'
  import lottieData from '../assets/anim/Blogging-Minimalistic/Blogging.json'
  import Video from "@/components/Video";
  import Vue from 'vue'
  import axios from 'axios'
  import VueAxios from 'vue-axios'

  Vue.use(VueAxios, axios)
  export default {
    components: {Video},
    name: 'Home',
    data: () => ({

    }),
    methods: {
      scrollDown: function (){
        window.scrollTo(0, 600)
      }
    },
    computed: {
      height () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 220
          case 'sm': return 400
          case 'md': return 500
          case 'lg': return 600
          case 'xl': return 800
          default: return 800
        }
      },
    },
    mounted() {
      lottie.loadAnimation({
        container: this.$refs.lottie1,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: lottieData
      })
      lottie.loadAnimation({
        container: this.$refs.lottie2,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: lottieData
      })
    }
  }
</script>
