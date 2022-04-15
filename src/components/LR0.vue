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
                LR(0) 文法判断
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
                  <v-textarea outlined height="400" no-resize label="文法输入" v-model="grammar"/>
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
                    <v-card outlined style="z-index: 1">
                      <v-tabs
                          background-color="white"
                          v-model="tab">
                        <v-tab>项目集规范族</v-tab>
                        <v-tab>DFA 路径</v-tab>
                        <v-tab>LR(0) 分析表</v-tab>
                        <v-tab>识别步骤</v-tab>
                      </v-tabs>
                    </v-card>

                    <v-tabs-items v-model="tab">
                      <v-tab-item>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th
                                  class="text-center text-body-1 font-weight-bold"
                                  v-for="(tableCol, i) in tableDataItemGroup.tableCols"
                                  :key="i">
                                {{ tableCol }}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(data, index) in tableDataItemGroup.tableData" :key="index" class="text-center">
                              <td>
                                {{ data }}
                              </td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-tab-item>
                      <v-tab-item>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th
                                  class="text-center text-body-1 font-weight-bold"
                                  v-for="(tableCol, i) in tableDataDFAPath.tableCols"
                                  :key="i">
                                {{ tableCol }}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(data, index) in tableDataDFAPath.tableData" :key="index" class="text-center">
                              <td>
                                {{ data }}
                              </td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-tab-item>
                      <v-tab-item>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th
                                  class="text-center text-body-1 font-weight-bold"
                                  v-for="(tableHeader, i) in tableDataLR0.tableHeader"
                                  :key="i"
                                  :colspan="tableHeader.span">
                                {{ tableHeader.text }}
                              </th>
                            </tr>
                            <tr>
                              <th
                                  class="text-center text-body-1 font-weight-bold"
                                  v-for="(tableCol, i) in tableDataLR0.tableCols"
                                  :key="i">
                                {{ tableCol }}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(data, index) in tableDataLR0.tableData" :key="index" class="text-center">
                              <td v-for="(e, index) in data" :key="index">
                                {{ e }}
                              </td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-tab-item>
                      <v-tab-item>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th
                                  class="text-center text-body-1 font-weight-bold"
                                  v-for="(tableCol, i) in tableDataStep.tableCols"
                                  :key="i">
                                {{ tableCol }}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(row, index) in tableDataStep.tableData" :key="index" class="text-center">
                              <td v-for="(data, i) in row" :key="i">
                                {{ data }}
                              </td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-tab-item>
                    </v-tabs-items>
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
  name: "LR0",
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
      grammar: 'E->aA\n' +
          'E->bB\n' +
          'E->cA\n' +
          'A->d\n' +
          'B->cB\n' +
          'B->d',
      stringList: 'bcd#',
      result: {},
      input: [],
      panel: 0,
      tab: 0,
      tableDataItemGroup: {},
      tableDataDFAPath: {},
      tableDataLR0: {},
      tableDataStep: {}
    }
  },
  methods: {
    submit() {
      this.isLoading = true;
      let data = {}
      data.Grammars = this.grammar.split('\n')
      data.StringAnalyze = this.stringList
      data.GrammarNum = data.Grammars.length
      let that = this
      that.$axios({
        url: '/api_LR0/lr0syntaxanalysis',
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
            that.showResult(result.data)
          })
          .catch(function (err) {
            console.log(err)
            that.snackbar = true
            that.snackbarMessage = err.toString() + '\n发生错误，请检查输入数据'
            that.isLoading = false
          })
    },
    showResult: function (result) {
      let that = this
      //table for itemGroup
      this.tableDataItemGroup.tableCols = ['项目集规范簇']
      this.tableDataItemGroup.tableData = []
      result.itemsGroup.forEach(function (item){
        let str = ''
        item.forEach(function (e){
          str += e.first + '->' + e.second.slice(0, e.dot) + '.' + e.second.slice(e.dot) + ', '
        })
        that.tableDataItemGroup.tableData.push(str.slice(0, -2))
      })
      //table for DFAPath
      this.tableDataDFAPath.tableCols = ['DFA 路径']
      this.tableDataDFAPath.tableData = []
      result.DFAPath.forEach(function (path){
        that.tableDataDFAPath.tableData.push('I' + path.from + '--' + path.path + '--' + 'I' + path.to)
      })
      //table for LR0
      this.tableDataLR0.tableHeader = []
      this.tableDataLR0.tableCols = []
      this.tableDataLR0.tableData = []
      this.tableDataLR0.tableHeader.push({
        text: 'Action',
        span: result.terminator.length
      })
      this.tableDataLR0.tableHeader.push({
        text: 'Goto',
        span: result.non_terminator.length
      })
      result.terminator.forEach(function (e){
        that.tableDataLR0.tableCols.push(e)
      })
      result.non_terminator.forEach(function (e){
        that.tableDataLR0.tableCols.push(e)
      })
      result.terminatorList.forEach(function (row, index){
        let arr = row
        result.non_terminatorList[index].forEach(function (e){
          if (e === null){e = 'NULL'}
          else {e = e.toString()}
          arr.push(e)
        })
        that.tableDataLR0.tableData.push(arr)
      })
      //table for step
      this.tableDataStep.tableCols = ['步骤', '状态栈', '符号栈', '输入串', 'Action', 'Goto']
      this.tableDataStep.tableData = []
      result.statusStack.forEach(function (step, index){
        let arr = []
        arr.push((index + 1).toString())
        arr.push(step.toString())
        arr.push(result['charStack'][index].toString())
        arr.push(result['substring'][index].toString())
        if (result['action'][index] === null || result['action'][index] === undefined){
          arr.push('NULL')
        }else {
          arr.push(result['action'][index].toString())
        }
        if (result['Goto'][index] === null || result['Goto'][index] === undefined){
          arr.push('NULL')
        }else {
          arr.push(result['Goto'][index].toString())
        }
        that.tableDataStep.tableData.push(arr)
      })
      console.log(this.tableDataStep)
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
/deep/ th {
  border: thin solid rgba(0, 0, 0, 0.06);
}
/deep/ td {
  border: thin solid rgba(0, 0, 0, 0.06);
}
</style>