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
                DFA 最小化
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
                <p>源数据：</p>
                <v-card outlined height="520">
                  <v-snackbar v-model="snackbar" color="error lighten-1" elevation="4" multi-line bottom left class="mb-6 ml-4">
                    {{ snackbarMessage }}
                  </v-snackbar>
                  <div id="originGraph"/>
                  <div style="margin: 16px; position: absolute; bottom: 0; right: 0; text-align: center">
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
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <p>结果：</p>
                <v-card outlined height="520">
                  <v-overlay absolute :value="showOverlay">
                    <p>等待输入……</p>
                  </v-overlay>
                  <div id="graph"/>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog
          v-model="editNodeDialog"
          width="480"
          persistent
          transition="scroll-y-transition">
        <v-card>
          <v-card-title class="headline">
            编辑节点
          </v-card-title>
          <v-card-text>
            修改节点类型
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary" text @click="editNode('normal')">设为普通节点</v-btn>
            <v-btn color="red" text @click="editNode('end')">设为终止节点</v-btn>
            <v-btn color="green" text @click="editNode('start')">设为起始节点</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import vis from "vis";
export default {
  name: "DFA",
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
      editNodeDialog: false,
      editingNode: null,
      editingNodeCallback: null,
      DFA_methodsRaw: '',
      DFA_methods: [],
      DFA_nodesRaw: '',
      DFA_nodes: [],
      DFA_start: '',
      DFA_endRaw: '',
      DFA_end: [],
      DFA_linkData: [],
      originNodes: new this.$vis.DataSet([]),
      originEdges: new this.$vis.DataSet([]),
      nodeName: [],
      showOverlay: true,
      isLoading: false,
      btnIcon: 'mdi-check',
      btnColor: 'primary',
      snackbar: false,
      snackbarMessage: '',
      tab: null
    };
  },
  methods:{
    editNode(type) {
      switch (type) {
        case 'start':
          this.editingNode.color = {
            background: '#97fc97',
            border: '#2ae82a',
            highlight: {
              background: '#97fc97',
              border: '#2ae82a'
            }
          }
          this.editingNode.typeOfNode = 'start'
          this.editingNodeCallback(this.editingNode)
          this.editNodeDialog = false
          break
        case 'end':
          this.editingNode.color = {
            background: '#fc9797',
            border: '#e92b2b',
            highlight: {
              background: '#fc9797',
              border: '#e92b2b'
            }
          }
          this.editingNode.typeOfNode = 'end'
          this.editingNodeCallback(this.editingNode)
          this.editNodeDialog = false
          break
        default:
          this.editingNode.color = {
            background: '#97c2fc',
            border: '#2B7CE9',
            highlight: {
              background: '#d2e5ff',
              border: '#2B7CE9'
            }
          }
          this.editingNode.typeOfNode = null
          this.editingNodeCallback(this.editingNode)
          this.editNodeDialog = false
          break
      }
    },
    drawGraph(context, states, linkData, start, end, methods) {
      let container = document.getElementById("graph")
      let nodes = new vis.DataSet([])
      states.forEach(function (state, index) {
        let node = {id: index, label: 'S' + index}
        if(index === start){
          node.color = {
            background: '#97fc97',
            border: '#2ae82a',
            highlight: {
              background: '#97fc97',
              border: '#2ae82a'
            }
          }
        }
        if(end.indexOf(index) !== -1){
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
      })
      let edges = new vis.DataSet([])
      linkData.forEach(function (linkGroup, indexOfGroup) {
        linkGroup.forEach(function (link, indexOfLink){
          let edge = {
            from: states[indexOfGroup],
            to: link,
            label: methods[indexOfLink],
            arrows: {
              to: {
                enabled: true,
                type: "arrow",
                scaleFactor: 0.5
              }
            },
            color:{
              color: '#000000'
            }
          }
          edges.add(edge)
        })
      })
      let data = {
        nodes: nodes,
        edges: edges
      }
      let options = {
        height: "460"
      }
      new vis.Network(container, data, options)
    },
    submit() {
      this.DFA_methodsRaw = ''
      this.DFA_methods = []
      this.DFA_nodesRaw = ''
      this.DFA_nodes = []
      this.DFA_start = ''
      this.DFA_endRaw = ''
      this.DFA_end = []
      this.DFA_linkData = []
      let that = this
      let idToNodeIndex = {}
      this.originNodes.forEach(function (node){
        that.DFA_nodes.push(node.label)
        if(node.typeOfNode === 'end'){
          that.DFA_end.push(node.label)
        }
        if(node.typeOfNode === 'start'){
          that.DFA_start = node.label
        }
        idToNodeIndex[node.id] = that.DFA_nodes.length - 1
      })
      let signs = new Set()
      this.originEdges.forEach(function (edge) {
        //查找所有转移方式
        if(!edge.hasHidden){//没有折叠边，直接添加
          signs.add(edge.label)
        }else {//有折叠边，添加所有折叠边
          edge.hiddenEdges.forEach(function (edge){
            signs.add(edge.label)
          })
        }
      })
      this.DFA_methods = Array.from(signs)
      let methodToIndex = {}
      this.DFA_methods.forEach(function (method, index){
        methodToIndex[method] = index
      })
      let DFA_AdjacencyTable_ls = []
      for(let i = 0; i < that.DFA_nodes.length; i++){
        DFA_AdjacencyTable_ls.push([])
      }
      this.originEdges.forEach(function (edge){
        //查找所有边
        if(!edge.hasHidden){
          if(DFA_AdjacencyTable_ls[idToNodeIndex[edge.from]] === null){
            DFA_AdjacencyTable_ls[idToNodeIndex[edge.from]] = []
          }
          DFA_AdjacencyTable_ls[idToNodeIndex[edge.from]][methodToIndex[edge.label]] = that.DFA_nodes[idToNodeIndex[edge.to]]
        }else {
          edge.hiddenEdges.forEach(function (edge){
            if(DFA_AdjacencyTable_ls[idToNodeIndex[edge.from]] === null){
              DFA_AdjacencyTable_ls[idToNodeIndex[edge.from]] = []
            }
            DFA_AdjacencyTable_ls[idToNodeIndex[edge.from]][methodToIndex[edge.label]] = that.DFA_nodes[idToNodeIndex[edge.to]]
          })
        }
      })
      let params = {
        DFA_EndList_ls: this.DFA_end,
        DFA_StartState_ls: this.DFA_start,
        DFA_StateList_ls: this.DFA_nodes,
        EndCount_ls: this.DFA_end.length,
        SignCount_ls: this.DFA_methods.length,
        Sign_ls: this.DFA_methods,
        StateCount_ls: this.DFA_nodes.length
      }
      that.isLoading = true
      that.$axios({
        url: '/api_DFA/Min_NFA_Input',
        params: params,
        method: "post",
        data: DFA_AdjacencyTable_ls,
        paramsSerializer: function (params) {
          return that.$qs.stringify(params, { indices: false })
        }
      })
          .then(function (result) {
            that.drawGraph(that, result.data.StateListNum, result.data.AdjacencyRelation, result.data.StartStatic, result.data.EndStatic, that.DFA_methods)
            that.showOverlay = false
            that.isLoading = false
          })
          .catch(function (err) {
            console.log(err)
            that.snackbar = true
            that.snackbarMessage = err + '\n发生错误，请检查输入数据'
            that.isLoading = false
          })
    },
    getNewNodeId: function () {
      for (let i = 0; i < this.nodeName.length; i++) {
        if (this.nodeName[i] !== true) {
          this.nodeName[i] = true
          return i
        }
      }
      return -1
    }

  },
  mounted() {
    let that = this
    for (let i = 0; i < 26; i++) {
      this.nodeName[i] = false
    }
    this.nodeName[0] = this.nodeName[1] = true
    this.originNodes = new this.$vis.DataSet([
      {id: 0, label: 'A', typeOfNode: 'start', color: {background: '#97fc97', border: '#2ae82a', highlight: {background: '#97fc97', border: '#2ae82a'}}},
      {id: 1, label: 'B'},
      {id: 2, label: 'C'},
      {id: 3, label: 'D'},
      {id: 4, label: 'E', typeOfNode: 'end', color: {background: '#fc9797', border: '#e92b2b', highlight: {background: '#fc9797', border: '#e92b2b'}}},
    ])
    this.originEdges = new this.$vis.DataSet([
      {from: 0, to: 1, label: 'a', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 0, to: 2, label: 'b', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 1, to: 1, label: 'a', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 1, to: 3, label: 'b', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 2, to: 1, label: 'a', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 2, to: 2, label: 'b', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 3, to: 1, label: 'a', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 3, to: 4, label: 'b', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 4, to: 1, label: 'a', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
      {from: 4, to: 2, label: 'b', arrows: {to: {enabled: true, type: "arrow", scaleFactor: 0.5}}, color: {color: '#000000'}},
    ])
    let container = document.getElementById("originGraph")
    let options = {
      height: "520",
      interaction: {
        multiselect: false
      },
      //启用编辑功能
      manipulation: {
        enabled: true,
        initiallyActive: true,
        addNode: function (nodeData, callback) {
          let id = that.getNewNodeId()
          if (id === -1) {
            alert("节点数量超过上限")
            callback(null)
          } else {
            nodeData.label = String.fromCharCode(id + 65)
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
          if(edgeData.from === edgeData.to){
            let found = false;
            that.originEdges.forEach(function (edge){
              if(edge.from === edgeData.from && edge.to === edgeData.to){
                //找到了一条可能重叠的边，直接把新的边加在旧边上
                if(!edge.hasHidden){
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
            if(found){
              callback(null)
              return
            }
          }
          callback(edgeData)
        },
        editNode: function (data, callback){
          that.editNodeDialog = true
          that.editingNode = data
          that.editingNodeCallback = callback
        },
        editEdge: false,
        deleteNode: function (data, callback) {
          try{
            data.nodes.forEach(function (nodeId) {
              that.nodeName[nodeId] = false
            })
            callback(data)
          }catch (e) {
            console.log(e)
            callback(null)
          }

        },
        deleteEdge: function (data, callback){
          try{
            let targetEdge = null
            that.originEdges.forEach(function (edge){
              if(edge.id === data.edges[0]){
                targetEdge = edge
              }
            })
            if(targetEdge === null){
              callback(null)
              return
            }
            if(targetEdge.hasHidden !== true){//不是折叠边，直接删除
              callback(data)
            }else {//是折叠边，删除其中一个
              targetEdge.hiddenEdges.pop()
              let labels = []
              targetEdge.hiddenEdges.forEach(function (edge){
                labels.push(edge.label)
              })
              targetEdge.label = labels.join('|')
              if(targetEdge.hiddenEdges.length === 1){
                targetEdge.hasHidden = false
              }
              that.originEdges.update(targetEdge)
              callback(null)
            }
          }catch (e) {
            console.log(e)
            callback(null)
          }


        },
      },
    }
    let data = {
      nodes: this.originNodes,
      edges: this.originEdges
    }
    console.log(data)
    let network = new this.$vis.Network(container, data, options)
    console.log(network)
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