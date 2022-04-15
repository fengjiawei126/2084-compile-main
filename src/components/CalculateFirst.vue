<template>
  <div>
    <v-parallax height="400" src="../assets/module-bg-s.png">
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
                计算 First 集合
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
                  <v-textarea v-model="grammar" height="420" label="文法输入" no-resize outlined/>
                </div>
                <div style="text-align: center">
                  <p>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn id="btn-run" v-bind="attrs" v-on="on" :color="btnColor" :loading="isLoading" dark
                               fab style="margin: 0 8px" @click="submit">
                          <v-icon dark>{{ btnIcon }}</v-icon>
                        </v-btn>
                      </template>
                      <span>提交</span>
                    </v-tooltip>
                    <v-tooltip v-if="false" bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" :download="blobName" :href="blobLink" color="cyan" dark
                               fab style="margin: 0 8px">
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
                <v-card height="520" outlined>
                  <div v-show="!showOverlay" style="padding: 16px; height: 90%">
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
                              <v-expansion-panel v-for="(sign, index) in signs" :key="index">
                                <v-expansion-panel-header disabled="true" expand-icon="">
                                  <v-row no-gutters>
                                    <v-col cols="2">
                                      {{ sign }}
                                    </v-col>
                                    <v-col
                                        class="text--secondary"
                                        cols="10">
                                      <v-row
                                          no-gutters
                                          style="width: 100%">
                                        <v-col cols="8">
                                          {{ results[index] }}
                                        </v-col>
                                      </v-row>
                                    </v-col>
                                  </v-row>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-row>
                                      <v-col cols="7">{{ panelContents[index].text }}<span style="opacity: 0.5"
                                                                                           class="text--secondary">{{
                                          panelContents[index].at
                                        }}</span></v-col>
                                      <v-spacer/>
                                      <v-col cols="5" class="text--secondary">
                                        {{ "匹配到：" + panelContents[index].foundSigns }}
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
                          <v-pagination total-visible="10" v-model="stepPage" :length="steps.length"
                                        @input="showStepAt(stepPage)"/>

                        </div>

                  </div>
                  <v-overlay :value="showOverlay" absolute>
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
  name: "CalculateFirst",
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
      isLoading: false,
      btnIcon: 'mdi-check',
      btnColor: 'primary',
      snackbar: false,
      snackbarMessage: '',
      grammar: 'E->T E\'\n' +
          'E\'->+ T E\'|￥\n' +
          'T->F T\'\n' +
          'T\'->* F T\'|￥\n' +
          'F->( E )|i',
      analyzeString: '',
      showOverlay: true,
      result: '',
      panel: -1,
      steps: [],
      input: [],
      signs: [],
      panelContents: [],
      results: [],
      stepPage: 0,
      originResultHtml: [],
    };
  },
  methods: {
    submit() {
      this.isLoading = true;
      let data = {
        Result: this.grammar.replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '').replace(/(^\s+)|(\s+$)/g,"").replace(/(\t)/g, '').split('\n'),
        grals: this.analyzeString
      }
      let that = this
      that.$axios({
        url: '/api_Predict/TempAPI',
        method: 'post',
        data: data,
        paramsSerializer: function (params) {
          return that.$qs.stringify(params, {indices: false})
        }
      })
          .then(function (result) {
            console.log(result)
            that.result = result.data
            that.showResult(that.result.TemphashMap, that.result.Firstresult)
            that.showOverlay = false
            that.isLoading = false
            that.signs.forEach(function (sign, index){
              setTimeout(function (){
                that.panel = index
              },0)
              if(index === that.signs.length - 1){
                 setTimeout(function (){
                   that.panel = -1
                 },100)
               }
            })
            that.showOverlay = false
            that.isLoading = false
          })
          .catch(function (err) {
            console.log(err)
            that.snackbar = true
            that.snackbarMessage = err.toString() + '\n发生错误，请检查输入数据'
            that.isLoading = false
          })
    },
    showResult(steps, result) {
      this.steps = []
      this.input = this.grammar.toString().replace(/(\n[\s\t]*\r*\n)/g, '\n')
          .replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
          .replace(/(^\s+)|(\s+$)/g, "")
          .replace(/(\t)/g, '')
          .replace(/( )/g, '')
          .split('\n')
      this.signs = []
      this.panelContents = []
      this.result = ''
      this.panel = -1
      this.stepPage = 0
      let i = 0
      let that = this
      Object.getOwnPropertyNames(steps).forEach(function (sign, signIndex) {
        if (sign === '__ob__') {
          return
        }
        that.signs.push(sign)
        let foundSigns = []
        steps[sign].forEach(function (method) {
          Object.getOwnPropertyNames(method).forEach(function (step) {
            if (step === '__ob__') {
              return
            }
            let child = {}
            child.i = i++
            child.sign = sign
            child.signId = signIndex
            child.highlight = step
            child.lineId = signIndex
            child.fromLine = method[step][0]
            child.result = method[step][1]
            child.text = '正在匹配：' + step
            child.finished = false
            child.foundSigns = []
            if (method[step][1]) {
              foundSigns.push(method[step][1])
            }
            foundSigns.forEach(function (foundSign) {
              child.foundSigns.push(foundSign)
            })
            that.steps.push(child)
          })
          let child = {}
          child.i = i++
          child.sign = sign
          child.signId = signIndex
          child.finished = true
          child.text = '匹配完毕：' + result[signIndex]
          child.fromLine = ''
          child.foundSigns = foundSigns
          that.steps.push(child)
          that.panelContents.push({text: result[signIndex], at: '', foundSigns: []})
        })
      })
      that.results = result
      console.log(that.steps)
    },
    showStepAt(page) {
      let step = this.steps[page - 1]
      let id = step.signId
      this.panelContents[id].text = step.text
      if(step.fromLine !== ''){
        this.panelContents[id].at = ' @' + step.fromLine
      }else{
        this.panelContents[id].at = ''
      }
      this.panelContents[id].foundSigns = JSON.stringify(step.foundSigns)
      this.panel = id
      if (step.highlight){
        this.highlight(step.highlight, this.signs.indexOf(step.fromLine))
      }else {
        this.highlight(null, null)
      }
    },
    highlight(str, at){
      for(let i = 0; i < this.signs.length; i++){
        document.getElementById('result' + i).innerHTML = ''
        document.getElementById('result' + i).innerText = this.input[i]
      }
      if (at >= 0){
        let p = document.getElementById('result' + at)
        p.innerHTML = p.innerHTML.replace(str, '<strong class="primary white--text" >'+ " " + str + " " + '</strong>')
      }
    },
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