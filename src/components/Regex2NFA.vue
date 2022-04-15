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
                正则表达式转 NFA
              </h1>
            </v-col>
          </v-row>
        </v-container>

      </div>
    </v-parallax>
    <v-container style="margin-top: -240px">
      <v-row justify="center" >
        <v-col cols="12">
          <v-card header="正则表达式转 NFA" :style="{padding: cardPadding + 'px' }">
            <v-row justify="center">
              <v-col style="padding-bottom: 0">
                <v-text-field outlined label="正则表达式" id="input-regx" type="text" v-model="inputRegex" :disabled="inputDisabled"/>
              </v-col>
              <v-col style="padding-bottom: 0">
                <v-text-field outlined label="要匹配的字符串" id="input-text" type="text" v-model="inputMatch" :disabled="inputDisabled"/>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" style="padding-top: 0">
                <v-card outlined>
                  <div id="canvas"/>
                  <div style="margin: 16px; position: absolute; top: 0; left: 0">
                    <p>过程演示:</p>
                    <div id="result"/>
                  </div>
                  <div style="margin: 16px; position: absolute; top: 0; right: 0">
<!--                    <v-checkbox dense id="btn-back-track" label="回溯" :disabled="inputDisabled" v-model="isBackTrack"/>-->
                    <v-checkbox dense id="checkbox-physics" v-model="physicsEnabled" label="自动布局" @click="togglePhysics(physicsEnabled)"/>
                  </div>
                  <div style="margin: 16px; position: absolute; bottom: 0; right: 0; text-align: center">
                    <p>
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn dark fab id="btn-run" color="primary" style="margin: 0 8px" v-bind="attrs" v-on="on">
                            <v-icon dark>{{ btnIcon }}</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ btnText }}</span>
                      </v-tooltip>
                    </p>
                    <p>
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn dark fab id="btn-stop" color="error" style="margin: 0 8px" v-bind="attrs" v-on="on">
                            <v-icon dark>mdi-stop</v-icon>
                          </v-btn>
                        </template>
                        <span>结束</span>
                      </v-tooltip>
                    </p>
                    <p>
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn dark fab color="cyan" :href="blobLink" :download="blobName" style="margin: 0 8px" v-bind="attrs" v-on="on">
                            <v-icon dark>mdi-download</v-icon>
                          </v-btn>
                        </template>
                        <span>保存数据到本地</span>
                      </v-tooltip>
                    </p>
                  </div>
                </v-card>
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
  name: "Regex2NFA",
  computed:{
    cardPadding() {
      switch (this.$vuetify.breakpoint.name) {
        case "lg":
        case "xl":
        case "md":
          return 48
        case "xs":
          return 16
        default:
          return 32
      }
    }
  },
  data: function (){
    return{
      inputRegex: '(a+|b)c',
      inputMatch: 'aac',
      isBackTrack: false,
      inputDisabled: false,
      btnText: "执行匹配",
      physicsEnabled: true,
      blobLink: null,
      blobName: Date.now() + '.nfa',
      btnIcon: 'mdi-play'
    }
  },
  mounted() {
    window.regexData = this.$data
    require('../lib/regexLib.js')
    require('../lib/renderer.js')
    require('../lib/simulator.js')
  },
  activated() {
    window.regexData = this.$data
    require('../lib/regexLib.js')
    require('../lib/renderer.js')
    require('../lib/simulator.js')
  },
  methods: {
    togglePhysics(enabled){
      window.togglePhysics(enabled)
    }
  }
}
</script>

<style scoped>
/deep/ .v-parallax__content{
  padding: 0 !important;
}
/deep/ .v-input--selection-controls{
  margin-top: 0 !important;
}
</style>