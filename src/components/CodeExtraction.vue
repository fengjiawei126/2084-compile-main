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
                代码外提
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
            <v-row justify="center">
              <v-col cols="12" md="4">
                <div>
                  <p>请在下方输入框中输入四元式：</p>
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
                  </p>
                </div>
              </v-col>
              <v-col cols="12" md="8">
                <div style="display: flex;align-items: baseline;justify-content: space-between">
                  <p>结果：</p>
                  <!--                  简单展示-->
                  <p style="font-size: small;font-weight: 600;
                 ">{{ this.strResult }}</p>
                  <!--                  <p>{{this.BasicBlockOptimizationResults}}</p>-->


                  <div style="width: 300px;display: flex;justify-content: space-between">

                    <!--                    <p>{{grammar}}</p> &lt;!&ndash;测试用&ndash;&gt;-->


                    <v-btn
                        color="primary"
                        dark
                        @click="firstStep"
                    >第一步
                    </v-btn>
                    <v-btn
                        color="primary"
                        dark
                        @click="secondStep"
                    >第二步
                    </v-btn>
                    <v-btn
                        color="primary"
                        dark

                        @click="thirdStep"
                    >第三步
                    </v-btn>
                    <v-btn
                        color="primary"
                        dark
                        @click="resultStep"
                    >完成
                    </v-btn>

                  </div>
                </div>
                <v-card height="520" outlined>
                  <div v-show="!showOverlay" style="padding: 16px; height: 90%">
                    <v-container fluid style="height: 100%">

                      <v-row style="height: 100%;margin:-23px auto">

                        <v-simple-table dense height="500px">
                          <template v-slot:default>

                            <thead>
                            <tr>
                              <div style="display: flex">
                                <div style="margin-right:200px;margin-left: 15px">
                                  <th class="text-left">行数</th>
                                </div>
                                <div style="margin-left:200px; ">
                                  <th class="text-left">四元式</th>
                                </div>
                              </div>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item,index) in grammarArray" :key="index" :class="changeColor[index]">


                              <td>第{{ index + 1 }}行</td>
                              <td>{{ item }}</td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-row>
                    </v-container>


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
  name: "BasicBlockOptimize",
  computed: {
    //背景样式布局
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
      changeColor: [],
      isLoading: false,
      btnIcon: 'mdi-check',
      btnColor: 'primary',
      snackbar: false,
      snackbarMessage: '',
      grammar: ':= 3.14 # T0 \n'
          + '* 2 T0 T1 \n'
          + '+ R r T2 \n'
          + '* T1 T2 A \n'
          + ':= A # B \n'
          + '* 2 T0 T3 \n'
          + '+ R r T4 \n'
          + '* T3 T4 T5 \n'
          + '- R r T6 \n'
          + '* T5 T6 B \n'
          + ':= 1 # I \n'
          + 'j> I 10 25 \n'
          + '* 2 J T1 \n'
          + '* 10 I T2 \n'
          + '+ T2 T1 T3 \n'
          + '- A 11 T4 \n'
          + '* 2 J T5 \n'
          + '* 10 I T6 \n'
          + '+ T6 T5 T7 \n'
          + '- A 11 T8 \n'
          + '=[] T8 T7 T9 \n'
          + '+ T9 1 X1 \n'
          + '[]= X1 T4 T3 \n'
          + '+ I 1 I \n'
          + 'j # # 11 \n'
          + 'halt # # #',
      grammarArray: [],
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
      stringList: [],
      strResult: '',
      s:[
        "ss1",
        "ss2",
        "ss3",
        "ss4",
      ]

    };
  },


  methods: {
    submit() {
      alert("正在调试！")
      let data = {"s": this.grammar.split('\n').toString().replace(/,/g, '')}
      this.isLoading = true;
      this.grammarArray = this.grammar.split('\n')
      let that = this;
      that.$axios({
        url: 'http://13.70.38.82:7001/getBasicBlock',
        method: 'post',
        data: data,
        paramsSerializer: function (params) {
          return that.$qs.stringify(params, {indices: false})
        }
      }).then(function (result) {
        console.log(result)
        that.result = result.data
        that.showOverlay = false
        that.isLoading = false
        that.showResult(that.result.TransferRelationship
            , that.result.TransferCondition, that.result.BasicBlockOptimizationResults)
      })
          .catch(function (err) {
            console.log(err)
            that.snackbar = true
            that.snackbarMessage = err.toString() + '\n发生错误，请检查输入数据'
            that.isLoading = false
          })
    },
    //从result传递参数到this
    showResult(TransferRelationship, TransferCondition, BasicBlockOptimizationResults) {
      this.TransferRelationship = TransferRelationship
      this.TransferCondition = TransferCondition
      this.BasicBlockOptimizationResults = BasicBlockOptimizationResults

    },
    firstStep() {
      this.strResult = this.TransferRelationship[0][0] + "行跳转到" + this.TransferRelationship[0][1] + "行，此时为无条件跳转"
      this.firstFlag = [this.TransferRelationship[0][0], this.TransferRelationship[0][1]]
      this.changeColor = []
      this.changeColor[this.TransferRelationship[0][0]] = "ss1"
      this.changeColor[this.TransferRelationship[0][1]] = "ss2"


    },
    secondStep() {
      this.strResult = this.TransferRelationship[1][0] + "行跳转到" + this.TransferRelationship[1][1] + "行，此时为有条件跳转到目标的语句"
      this.changeColor = []
      this.changeColor[this.TransferRelationship[1][0]] = "ss3"
      this.changeColor[this.TransferRelationship[1][1]] = "ss4"
    },
    thirdStep() {
      this.strResult = this.TransferRelationship[2][0] + "行跳转到" + this.TransferRelationship[2][1] + "行，此时为无条件跳转"
      this.changeColor = []
      this.changeColor[this.TransferRelationship[2][0]] = "ss1"
      this.changeColor[this.TransferRelationship[2][1]] = "ss3"
    },
    resultStep() {
      this.strResult = "共分四段，以下是详细分段情况"
      this.changeColor = []
      for (let j = 0;j<this.BasicBlockOptimizationResults.length;j++) {
        for (let i = 0; i < this.BasicBlockOptimizationResults[j].length; i++) {
          this.changeColor[this.BasicBlockOptimizationResults[j][i]] = this.s[j]
        }

      }



    },
  },
}
</script>


<style>
.ss1 {
  background: #71b262;
}

.ss2 {
  background: #6288b2;
}

.ss3 {
  background: #ecac60;
}

.ss4 {
  background: #f87171;
}

</style>
