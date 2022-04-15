<template>
  <div>
    <v-parallax src="../assets/module-bg-s.png" height="400">
      <div
          style="width: 100%; height: 100%; background-image: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 100%);">
        <v-container>
          <v-row
              align="center"
              justify="center">
            <v-col
                class="text-left"
                cols="10"
                md="11">
              <h1 class="text-h4 font-weight-bold mt-12 black--text text-md-h3">
                消除左递归
              </h1>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-parallax>
    <v-container style="margin-top: -240px">
      <v-row justify="center">
        <v-col cols="12">
          <v-card :style="{padding: cardPadding + 'px' }">
            <v-snackbar v-model="snackbar" color="error lighten-1" elevation="4" multi-line bottom left class="mb-6 ml-4">
              {{ snackbarMessage }}
            </v-snackbar>
            <v-row justify="center">
              <v-col cols="12" md="4">
                <div>
                  <p>源数据：</p>
                  <v-textarea outlined height="420" no-resize label="文法输入" v-model="grammar"/>
                </div>
                <div style="text-align: center">
                  <p>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn :loading="isLoading" dark fab id="btn-run" :color="btnColor" style="margin: 0 8px"
                               v-bind="attrs" v-on="on" @click="submit">
                          <v-icon dark>{{ btnIcon }}</v-icon>
                        </v-btn>
                      </template>
                      <span>提交</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="false">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn dark fab color="cyan" :href="blobLink" :download="blobName" style="margin: 0 8px"
                               v-bind="attrs" v-on="on">
                          <v-icon dark>mdi-download</v-icon>
                        </v-btn>
                      </template>
                      <span>保存数据到本地</span>
                    </v-tooltip>
                  </p>
                </div>
              </v-col>
              <v-col cols="12" md="8">
                <p>结果：</p>
                <v-card outlined height="520">
                  <div style="padding: 16px; height: 90%" v-if="!showOverlay">
                    <v-container fluid style="height: 100%">
                      <v-row style="height: 100%">
                        <v-col cols="4">
                          <p>高亮展示: </p>
                          <p :id="'result' + index" v-for="(line, index) in input" :key="index">{{ line }}</p>
                        </v-col>
                        <v-divider vertical/>
                        <v-col cols="8">
                          <div>
                            <v-expansion-panels popout v-model="panel">
                              <v-expansion-panel>
                                <v-expansion-panel-header disabled="true" expand-icon="">
                                  消除间接左递归
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                  {{ panelContent[0] }}
                                </v-expansion-panel-content>
                              </v-expansion-panel>
                              <v-expansion-panel>
                                <v-expansion-panel-header disabled="true" expand-icon="">
                                  消除直接左递归
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                  <v-row>
                                    <v-col cols="12">
                                      <p v-for="(line, index) in panelContent[1]" :key="index">{{ line }}</p>
                                    </v-col>
                                  </v-row>
                                </v-expansion-panel-content>
                              </v-expansion-panel>
                              <v-expansion-panel>
                                <v-expansion-panel-header disabled="true" expand-icon="">
                                  结果
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                  <v-row>
                                    <v-col cols="12">
                                      <p v-for="(line, index) in panelContent[2]" :key="index">{{ line }}</p>
                                    </v-col>
                                  </v-row>
                                </v-expansion-panel-content>
                              </v-expansion-panel>
                            </v-expansion-panels>
                          </div>
                        </v-col>
                      </v-row>
                    </v-container>
                    <div class="text-center" style="bottom: 8px;">
                      <v-pagination total-visible="10" v-model="stepPage" :length="pageCount"
                                    @input="showStepAt(stepPage)"/>

                    </div>
                  </div>
                  <v-overlay absolute :value="showOverlay">
                    <p>等待输入……</p>
                  </v-overlay>
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
  name: "ELR",
  computed: {
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
  data: function () {
    return {
      showOverlay: true,
      isLoading: false,
      btnIcon: 'mdi-check',
      btnColor: 'primary',
      snackbar: false,
      snackbarMessage: '',
      grammar: 'S->Q c|c\n' +
          'Q->R b|b\n' +
          'R->S a|a',
      result: '',
      input: [],
      panel: 0,
      panelContent: [],
      steps: [],
      stepPage: 0,
      pageCount: 0,
      step: 0,
      finalInput: []
    }
  },
  methods: {
    submit() {
      this.isLoading = true;
      let data = this.grammar.toString().replace(/(\n[\s\t]*\r*\n)/g, '\n')
          .replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
          .replace(/(^\s+)|(\s+$)/g, "")
          .replace(/(\t)/g, '')
          .split('\n')
      let that = this
      that.$axios({
        url: '/api_Predict/ELR_API',
        method: 'post',
        data: data,
        paramsSerializer: function (params) {
          return that.$qs.stringify(params, {indices: false})
        }
      })
          .then(function (result) {
            console.log(result)
            that.showOverlay = false
            that.isLoading = false
            that.result = result.data
            that.showResult(that.result.GrammaticalTransformation2, that.result.DisplayAandB2, that.result.GrammaticalResults)
          })
          .catch(function (err) {
            console.log(err)
            if(err.toString().indexOf('Html') === -1 && err.toString().indexOf('panel') === -1){
              that.snackbar = true
              that.snackbarMessage = err.toString() + '\n发生错误，请检查输入数据'
            }
            that.isLoading = false
          })
    },
    showResult: function (indirect, direct, result) {
      this.result = ''
      this.stepPage = 0
      this.pageCount = 0
      this.steps = []
      let that = this
      this.input = this.grammar.replace(/(\n[\s\t]*\r*\n)/g, '\n')
          .replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
          .replace(/(^\s+)|(\s+$)/g, "")
          .replace(/(\t)/g, '')
          .replace(/( )/g, '')
          .split('\n')
      indirect.forEach(function (s, index) {
        that.pageCount++
        let step = {}
        step.panel = 0
        step.to = []
        s.forEach(function (e, index) {
          if(index === 0){
            step.from = e
          }else if(index !== s.length - 1){
            step.to.push(e)
          }
        })
        if(index === 0){
          step.input = that.grammar.replace(/(\n[\s\t]*\r*\n)/g, '\n')
              .replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
              .replace(/(^\s+)|(\s+$)/g, "")
              .replace(/(\t)/g, '')
              .replace(/( )/g, '')
              .replace(step.from, step.to.join('|'))
              .split('\n')

        }else{
          step.input = that.finalInput.join('\n')
              .replace(/(\n[\s\t]*\r*\n)/g, '\n')
              .replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
              .replace(/(^\s+)|(\s+$)/g, "")
              .replace(/(\t)/g, '')
              .replace(/( )/g, '')
              .replace(step.from, step.to.join('|'))
              .split('\n')
        }
        that.finalInput = step.input
        that.steps.push(step)
      })
      direct.forEach(function (s) {
        that.pageCount++
        let step = {}
        step.panel = 1
        step.stepString = []
        s.forEach(function (e, index){
          if(index === 1){
            step.highlight = e
          }else if(index > 1){
            step.stepString.push(e)
          }
        })
        that.steps.push(step)
      })
      that.pageCount++
      that.steps.push({
        panel: 2,
        stepString: result
      })
      this.showStepAt(1)
      this.stepPage = 1
      console.log(this.steps)
    },
    showStepAt(page){
      let step = this.steps[page - 1]
      if(step.panel === 0){
        this.panelContent[0] = "将 " + step.from + " 替换为 " + step.to.join('|')
        this.input = step.input
        this.panel = 0
        this.highlight(step.to.join('|'))
      } else if(step.panel === 1){
        this.input = this.finalInput
        this.panelContent[1] = step.stepString
        this.panel = 1
        this.highlight('')
      } else if(step.panel === 2){
        this.panelContent[2] = step.stepString
        this.input = this.finalInput
        this.panel = 2
        this.highlight('')
      }
    },
    highlight: function (str){
      if(str !== ''){
        for(let i = 0; i < this.input.length; i++){
          console.log(str)
          let p = document.getElementById('result' + i)
          p.innerHtml = ''
          if(this.steps[this.stepPage - 1].panel === 0){
            p.innerText = this.steps[this.stepPage - 1].input[i]
          }else{
            p.innerText = this.finalInput[i]
          }
          p.innerHTML = p.innerHTML.replace(str, '<strong class="primary white--text" >'+ " " + str + " " + '</strong>')
        }
      }else{
        for(let i = 0; i < this.input.length; i++) {
          console.log(str)
          let p = document.getElementById('result' + i)
          p.innerHtml = ''
          if (this.steps[this.stepPage - 1].panel === 0) {
            p.innerText = this.steps[this.stepPage - 1].input[i]
          } else {
            p.innerText = this.finalInput[i]
          }
        }
      }
    }
  }
}
</script>

<style scoped>
/deep/ .v-parallax__content {
  padding: 0 !important;
}

/deep/ .v-input--selection-controls {
  margin-top: 0 !important;
}
</style>