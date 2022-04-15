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
                递归下降分析
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
                  <v-text-field outlined label="起始字符" v-model="startSymbol"/>
                  <v-textarea outlined height="340" no-resize label="文法输入" v-model="grammar"/>
                  <v-text-field outlined label="匹配字符串" v-model="stringList"/>
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
                <v-card outlined height="520" style="overflow-y: scroll">
                  <div v-if="!showOverlay">
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                        <tr>
                          <th
                              class="text-center text-body-1 font-weight-bold"
                              v-for="(tableCol, i) in tableData.cols"
                              :key="i">
                            {{ tableCol }}
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(row, index) in tableData.data" :key="index" class="text-center">
                          <td v-for="(data, i) in row" :key="i">
                            {{ data }}
                          </td>
                        </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
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
  name: "RDA",
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
      startSymbol:'E',
      grammar: 'E->aAbE bcaBnv\n' +
          'A->a\n' +
          'B->hjkA',
      stringList: 'aabbcahjkanv',
      result: {},
      input: [],
      panel: 0,
      tableData: {}
    }
  },
  methods: {
    submit() {
      this.isLoading = true;
      let data = {}
      data.start = this.startSymbol
      data.production = {}
      data.string_list = []
      this.grammar.split('\n').forEach(function (e){
        data.production[e[0]] = e.substring(3).split(' ')
      })
      data.string_list[0] = this.stringList
      let that = this
      that.$axios({
        url: '/api_RDA/RecursiveDescent',
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
            that.showResult(that.result.process)
          })
          .catch(function (err) {
            console.log(err)
            that.snackbar = true
            that.snackbarMessage = err.toString() + '\n发生错误，请检查输入数据'
            that.isLoading = false
          })
    },
    showResult: function (process) {
      let that = this
      this.tableData.cols = ['步骤', '过程']
      this.tableData.data = []
      process.forEach(function (step, index){
        let arr = []
        arr.push((index + 1).toString())
        arr.push(step)
        that.tableData.data.push(arr)
      })
      console.log(this.tableData)
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