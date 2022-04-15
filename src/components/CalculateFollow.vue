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
                计算 Follow 集合
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
                  <v-textarea  outlined height="420" no-resize label="文法输入" v-model="grammar"/>
                </div>
                <div style="text-align: center">
                  <p>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn :loading="isLoading" dark fab id="btn-run" :color="btnColor" style="margin: 0 8px"
                               v-bind="attrs" v-on="on" @click="submit" >
                          <v-icon dark>{{ btnIcon }}</v-icon>
                        </v-btn>
                      </template>
                      <span>提交</span>
                    </v-tooltip>
                    <v-tooltip v-if="false" bottom>
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
                  <div style="padding: 16px" v-if="!showOverlay">
                    <p>Follow 集合：</p>
                    <p v-for="(text, index) in followSet" :key="index"> {{ text }} </p>
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
  name: "CalculateFollow",
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
      followSet: [],
      followSteps: []
    };
  },
  methods:{
    submit() {
      this.isLoading = true;
      let data = {
        Result: this.grammar.toString().replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '').replace(/(^\s+)|(\s+$)/g,"").replace(/(\t)/g, '').split('\n'),
        grals: this.analyzeString
      }
      let that = this
      that.$axios({
        url: '/api_Predict/TempAPI',
        method: 'post',
        data: data,
        paramsSerializer: function (params) {
          return that.$qs.stringify(params, { indices: false })
        }
      })
          .then(function (result) {
            console.log(result)
            that.showOverlay = false
            that.isLoading = false
            that.result = result.data
            that.showResult(that.result.Followresult, that.result.LastFollow)
          })
          .catch(function (err) {
            console.log(err)
            that.snackbar = true
            that.snackbarMessage = err.toString() + '\n发生错误，请检查输入数据'
            that.isLoading = false
          })
    },
    showResult: function (setData, follow){
      this.followSet = follow
      let that = this
      let i = 0
      console.log(setData)
      Object.getOwnPropertyNames(setData).forEach(function (sign){
        if (sign === '__ob__'){return}
        let s = {}
        s.id = ++i
        s.name = sign + ':'
        s.children = []
        Object.getOwnPropertyNames(setData[sign]).forEach(function (method){
          if (method === '__ob__'){return}
          let child = {}
          child.id = ++i
          child.name = method + ': ' + JSON.stringify(setData[sign][method])
          s.children.push(child)
        })
        that.followSteps.push(s)
      })
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