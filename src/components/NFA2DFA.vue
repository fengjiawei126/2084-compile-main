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
                NFA 确定化
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
              <v-col cols="12" md="6">
                <p>源数据：<span class="text--secondary">（用"e"代替"ε"）</span> </p>
                <v-card outlined height="520">
                  <v-snackbar v-model="snackbar" color="error lighten-1" elevation="4" multi-line bottom left class="mb-6 ml-4">
                    {{ snackbarMessage }}
                  </v-snackbar>
                  <div id="originGraph"/>
                  <div style="margin: 16px; position: absolute; bottom: 0; right: 0; text-align: center">
                    <p>
                      <input style="display: none" type="file" id="file-input" @change="praiseFile"/>
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn dark fab color="indigo" style="margin: 0 8px"
                                 v-bind="attrs" v-on="on" @click="uploadFile">
                            <v-icon dark>mdi-upload</v-icon>
                          </v-btn>
                        </template>
                        <span>上传已保存的数据</span>
                      </v-tooltip>
                    </p>
                    <p v-if="false">
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn dark fab color="cyan" :href="blobLink" :download="blobName" style="margin: 0 8px"
                                 v-bind="attrs" v-on="on">
                            <v-icon dark>mdi-download</v-icon>
                          </v-btn>
                        </template>
                        <span>保存数据到本地</span>
                      </v-tooltip>
                    </p>
                    <p>
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn :loading="isLoading" dark fab id="btn-run" :color="btnColor" style="margin: 0 8px"
                                 v-bind="attrs" v-on="on" @click="submit" >
                            <v-icon dark>{{ btnIcon }}</v-icon>
                          </v-btn>
                        </template>
                        <span>提交</span>
                      </v-tooltip>
                    </p>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <p>结果：</p>
                <v-card outlined height="520">
                  <v-overlay absolute :value="showOverlay">
                    <p>等待输入……</p>
                  </v-overlay>
                  <v-card outlined style="z-index: 1">
                    <v-tabs
                        background-color="white"
                        v-model="tab">
                      <v-tab>图形</v-tab>
                      <v-tooltip>

                      </v-tooltip>
                      <v-tab>步骤表</v-tab>
                    </v-tabs>
                  </v-card>

                  <v-tabs-items v-model="tab">
                    <v-tab-item>
                      <div id="graph"/>
                    </v-tab-item>
                    <v-tab-item>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th
                                class="text-center text-body-1 font-weight-bold"
                                v-for="(tableCol, i) in tableCols"
                                :key="i"
                                :prop="tableCol.id">
                              {{ tableCol.name }}
                            </th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="(data, index) in tableData.data" :key="index" class="text-center">
                            <td v-for="(v, k) in data"
                                :key="k"
                                @mouseenter="showStep(tableData.nodes[index])"
                                @mouseleave="hideStep(tableData.nodes[index])">
                              {{ v }}
                            </td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-tab-item>
                  </v-tabs-items>

                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

      </v-row>
      <v-dialog
          v-model="uploadDialog"
          width="480"
          persistent
          transition="scroll-y-transition">
        <v-card>
          <v-card-title class="headline">
            上传文件
          </v-card-title>
          <v-card-text>
            暂时仅限校内用户使用
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary" text @click="uploadDialog = false">好的</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>

  </div>

</template>

<script>
import vis from 'vis'

export default {
  name: "NFA2DFA",
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
      tab: null,
      chars: "",
      selectorCount: 1,
      nodeName: [],
      originNodes: new this.$vis.DataSet([]),
      originEdges: new this.$vis.DataSet([]),
      tableData: {
        data: [],
        nodes: []
      },
      tableCols: [],
      showOverlay: true,
      isLoading: false,
      btnIcon: 'mdi-check',
      btnColor: 'primary',
      snackbar: false,
      snackbarMessage: '',
      network: null,
      networkData: null,
      originOptions: null,
      originNetwork: null,
      uploadDialog: false
    };
  },
  methods: {
    submit() {
      this.isLoading = true
      let params = {
        TransferOfNum: 0,
        TransferOneByOne: [],
        NodeOfNum: 0,
      }
      let transferArrows = []
      let transfers = new Set()
      params.NodeOfNum = this.originNodes.get().length
      this.originEdges.get().forEach(function (edge) {
        if (!edge.hasHidden) {//不是折叠边，直接添加
          transferArrows.push({
            char_ls: edge.label,
            start: edge.from,
            end: edge.to
          })
          if (edge.label !== 'e' && edge.label !== "e") {
            transfers.add(edge.label)
          }
        } else {
          edge.hiddenEdges.forEach(function (hiddenEdge) {//是折叠边，添加所有被折叠的边
            transferArrows.push({
              char_ls: hiddenEdge.label,
              start: hiddenEdge.from,
              end: hiddenEdge.to
            })
            if (hiddenEdge.label !== 'e' && hiddenEdge.label !== "e") {
              transfers.add(hiddenEdge.label)
            }
          })
        }

      })
      transferArrows.push({
        start: 0,
        end: 0,
        char_ls: '#'
      })
      params.TransferOneByOne = Array.from(transfers)
      params.TransferOfNum = params.TransferOneByOne.length
      let that = this
      that.$axios({
        url: '/api_NFA/NFA_def',
        params: params,
        method: "post",
        data: transferArrows,
        paramsSerializer: function (params) {
          return that.$qs.stringify(params, {indices: false})
        }
      })
          .then(function (result) {
            that.isLoading = false
            if (result.data.State === 200) {
              that.showOverlay = false
              that.drawGraph(that, Array.from(transfers), result.data.Calculate, result.data.PrintResultJSon, that.originNodes)
              that.drawTable(that, Array.from(transfers), result.data.Calculate, result.data.PrintResultJSon)
            } else {
              throw new Error(result.data.State + ': ' + result.data.Message)
            }

          })
          .catch(function (err) {
            that.isLoading = false
            console.log(err)
            that.snackbarMessage = err.toString() + '\n发生错误，请检查输入数据'
            that.snackbar = true
          });
    },
    uploadFile(){
      document.getElementById('file-input').click()
    },
    praiseFile(){
      let that = this
      try{
        let file = document.getElementById('file-input').files[0]
        if (file === null || file === undefined) return
        let reader = new FileReader()
        reader.readAsText(file)
        reader.onload = function (){
          let data = JSON.parse(this.result)
          console.log(data)
          that.uploadDialog = true
          // new that.$vis.Network(document.getElementById("originGraph"), data, that.originOptions)
          // that.originEdges = new this.$vis.DataSet(data.edges)
          // that.originNodes = new this.$vis.DataSet(data.nodes)
        }
      }catch (err){
        that.snackbarMessage = err.toString() + '\n发生错误，请检查输入数据'
        that.snackbar = true
        console.log(err)
      }
    },
    getIdInStates(states, mState) {
      for (let i = 0; i < states.length; i++) {
        if (states[i].sort().toString() === mState.sort().toString()) {
          return i
        }
      }
      return -1
    },
    drawGraph: function (context, transferMethods, epsilon, result, originNodes) {
      let container = document.getElementById("graph")
      console.log(epsilon)
      let states = []
      result.forEach(function (step) {
        states.push(step[0])
      })
      let nodes = new vis.DataSet([])
      for (let i = 0; i < result.length; i++) {
        let node = {id: i, label: 'S' + i}
        if (i === 0) {
          node.color = {
            background: '#97fc97',
            border: '#2ae82a',
            highlight: {
              background: '#97fc97',
              border: '#2ae82a'
            }
          }
        }
        if (states[i].indexOf(originNodes.get().length - 1) !== -1) {
          node.color = {
            background: '#fc9797',
            border: '#e92b2b',
            highlight: {
              background: '#fc9797',
              border: '#e92b2b'
            }
          }
        }
        nodes.add(node)
      }
      let edges = new vis.DataSet([])
      result.forEach(function (step) {
        let origin = step[0]
        let transfers = []
        for (let i = 1; i < step.length; i += origin.length + 2) {
          transfers.push(step.slice(i, i + origin.length + 2))
        }
        for (let i = 0; i < transfers.length; i++) {
          let found = false
          if (context.getIdInStates(states, origin) === context.getIdInStates(states, transfers[i].slice(-1)[0])) {
            let id = context.getIdInStates(states, origin)
            edges.forEach(function (edge) {
              if (edge.from === id && edge.to === id) {
                edge.label += '|' + transferMethods[i]
                edges.update(edge)
                found = true
              }
            })
          }
          if (found === true) {
            continue
          }
          edges.add({
            from: context.getIdInStates(states, origin),
            to: context.getIdInStates(states, transfers[i].slice(-1)[0]),
            label: transferMethods[i],
            arrows: {
              to: {
                enabled: true,
                type: "arrow",
                scaleFactor: 0.5
              }
            },
            color: {
              color: '#000000'
            }
          })
        }
      })
      let data = {
        nodes: nodes,
        edges: edges
      }
      let options = {
        height: "460"
      }
      this.network = new vis.Network(container, data, options)
      this.networkData = data
    },
    getNewNodeId: function () {
      for (let i = 0; i < this.nodeName.length; i++) {
        if (this.nodeName[i] !== true) {
          this.nodeName[i] = true
          return i
        }
      }
      return -1
    },
    drawTable: function (context, transferMethods, epsilon, result) {
      context.tableCols = []
      context.tableData = {
        data: [],
        nodes: []
      }
      context.tableCols.push({name: 'I', id: 'I'})
      transferMethods.forEach(function (transferMethod) {
        context.tableCols.push({name: 'ε-closure(move(I,' + transferMethod + '))', id: 'm' + transferMethod})
      })
      let states = []
      result.forEach(function (step) {
        states.push(step[0])
      })
      result.forEach(function (step, stepIndex) {
        let row = {}
        let node = {
          from: [],
          to: []
        }
        row['I'] = 'S' + stepIndex + '=' + '{' + states[stepIndex] + '}';
        node.from = states[stepIndex]
        transferMethods.forEach(function (transferMethod, methodIndex) {
          row['m' + transferMethod] = 'S' + context.getIdInStates(states, step[(methodIndex + 1) * (step[0].length + 2)]) + '=' + '{' + step[(methodIndex + 1) * (step[0].length + 2)] + '}'
          node.to.push(step[(methodIndex + 1) * (step[0].length + 2)])
        })
        console.log(context.tableData)
        context.tableData.data.push(row)
        context.tableData.nodes.push(node)
      })
    },
    showErrorBtn: function () {
      this.btnIcon = 'mdi-close'
      this.btnColor = 'error'
    },
    showNormalBtn: function (){
      this.btnIcon = 'mdi-check'
      this.btnColor = 'primary'
    },
    invokeLater: function (fn, delay = 2000) {
      let timer
      return () => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(), delay)
      }
    },
    showStep: function (data) {
      let that = this
      //处理节点
      data.from.forEach(function (targetNodes){
        that.originNodes.forEach(function (node){
          if (node.label.toString() === targetNodes.toString()){
            node.x = undefined
            node.y = undefined
            node.color = {
              background: '#fcef97',
              border: '#e8e52a',
              highlight: {
                background: '#fcef97',
                border: '#e8e52a'
              }
            }
            that.originNodes.update(node)
          }
        })
      })
      data.to.forEach(function (targetNodeSet){
        targetNodeSet.forEach(function (targetNodes){
          that.originNodes.forEach(function (node){
            if (node.label.toString() === targetNodes.toString()){
              node.color = {
                background: '#9e97fc',
                border: '#8c42ff',
                highlight: {
                  background: '#9e97fc',
                  border: '#8c42ff'
                }
              }
              that.originNodes.update(node)
            }
          })
        })
      })
      data.from.forEach(function (targetNodes){
        that.originNodes.forEach(function (node){
          if (node.label.toString() === targetNodes.toString()){
            node.x = undefined
            node.y = undefined
            node.color = {
              border: '#e8e52a',
              highlight: {
                border: '#e8e52a'
              }
            }
            that.originNodes.update(node)
          }
        })
      })
    },
    hideStep: function (data) {
      let that = this
      //处理节点
      data.from.forEach(function (targetNodes){
        that.originNodes.forEach(function (node){
          if (node.label.toString() === targetNodes.toString()){
            node.x = undefined
            node.y = undefined
            node.color = {
              background: '#97c2fc',
              border: '#2B7CE9',
              highlight: {
                background: '#d2e5ff',
                border: '#2B7CE9'
              }
            }
            that.originNodes.update(node)
          }
        })
      })
      data.to.forEach(function (targetNodeSet){
        targetNodeSet.forEach(function (targetNodes){
          that.originNodes.forEach(function (node){
            if (node.label.toString() === targetNodes.toString()){
              node.color = {
                background: '#97c2fc',
                border: '#2B7CE9',
                highlight: {
                  background: '#d2e5ff',
                  border: '#2B7CE9'
                }
              }
              that.originNodes.update(node)
            }
          })
        })
      })
    }
  },
  mounted() {
    let that = this
    for (let i = 0; i < 26; i++) {
      this.nodeName[i] = false
    }
    this.nodeName[0] = this.nodeName[1] = true
    this.originNodes = new this.$vis.DataSet([
      {id: 0, label: '0'},
      {id: 1, label: '1'},
      {id: 2, label: '2'},
      {id: 3, label: '3'},
      {id: 4, label: '4'},
      {id: 5, label: '5'},
      {id: 6, label: '6'},
      {id: 7, label: '7'}
    ])
    this.originEdges = new this.$vis.DataSet([
      {from: 0, to: 1, label: 'e', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 1, to: 1, label: 'a', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 1, to: 1, label: 'b', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 1, to: 2, label: 'e', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 2, to: 3, label: 'a', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 2, to: 4, label: 'b', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 3, to: 5, label: 'a', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 4, to: 5, label: 'b', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 5, to: 6, label: 'e', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 6, to: 6, label: 'a', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 6, to: 6, label: 'b', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 6, to: 7, label: 'e', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
    ])
    let container = document.getElementById("originGraph")
    let options = {
      height: "520",
      interaction: {
        multiselect: false
      },
      nodes:{
        borderWidth: 4,
      },
      physics: {
        enabled: true
      },
      //启用节点编辑功能
      manipulation: {
        enabled: true,
        initiallyActive: true,
        addNode: function (nodeData, callback) {
          let id = that.getNewNodeId()
          if (id === -1) {
            alert("节点数量超过上限")
            callback(null)
          } else {
            nodeData.label = id.toString()
            nodeData.id = id
            callback(nodeData)
          }
        },
        addEdge: function (edgeData, callback) {
          edgeData.label = prompt('输入转移方式', 'a')
          if (edgeData.label === null) {
            edgeData.label = 'a'
          }
          edgeData.arrows = {
            to: {
              enabled: true,
              type: "arrow",
              scaleFactor: 0.5
            }
          }
          edgeData.color = {
            color: '#000000'
          }
          //检查是否有重叠的边
          if (edgeData.from === edgeData.to) {
            let found = false;
            that.originEdges.forEach(function (edge) {
              if (edge.from === edgeData.from && edge.to === edgeData.to) {
                //找到了一条可能重叠的边，直接把新的边加在旧边上
                if (!edge.hasHidden) {
                  edge.hasHidden = true
                  edge.hiddenEdges = []
                  edge.hiddenEdges.push({
                    from: edge.from,
                    to: edge.to,
                    label: edge.label
                  })
                }
                edge.hiddenEdges.push(edgeData)
                edge.label += '|' + edgeData.label
                found = true
                that.originEdges.update(edge)
                console.log(edge)
              }
            })
            if (found) {
              callback(null)
              return
            }
          }

          callback(edgeData)
        },
        editNode: undefined,
        editEdge: false,
        deleteNode: function (data, callback) {
          try {
            data.nodes.forEach(function (nodeId) {
              that.nodeName[nodeId] = false
            })
            callback(data)
          } catch (e) {
            console.log(e)
            callback(null)
          }
        },
        deleteEdge: function (data, callback) {
          try {
            let targetEdge = null
            that.originEdges.forEach(function (edge) {
              if (edge.id === data.edges[0]) {
                targetEdge = edge
              }
            })
            if (targetEdge === null) {
              callback(null)
              return
            }
            if (targetEdge.hasHidden !== true) {//不是折叠边，直接删除
              callback(data)
            } else {//是折叠边，删除其中一个
              targetEdge.hiddenEdges.pop()
              let labels = []
              targetEdge.hiddenEdges.forEach(function (edge) {
                labels.push(edge.label)
              })
              targetEdge.label = labels.join('|')
              if (targetEdge.hiddenEdges.length === 1) {
                targetEdge.hasHidden = false
              }
              that.originEdges.update(targetEdge)
              callback(null)
            }
          } catch (e) {
            console.log(e)
            callback(null)
          }


        },
      },
    }
    this.originOptions = options
    let data = {
      nodes: this.originNodes,
      edges: this.originEdges
    }
    // this.originNetwork = new this.$vis.Network(container, data, options)
    new this.$vis.Network(container, data, options)
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