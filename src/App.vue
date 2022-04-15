<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <v-list nav dense>
        <v-list-item-group color="primary">
          <v-list-item
              link
              @click="routeTo('home'); drawer = false">
            <v-list-item-icon>
              <v-icon> mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>主页</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-subheader>
            词法分析
          </v-subheader>
          <v-list-item
              v-for="item in drawerItems.lexical"
              :key="item.title"
              link
              @click="routeTo(item.route)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-subheader>
            语法分析
          </v-subheader>
          <v-list-item
              v-for="item in drawerItems.grammar"
              :key="item.title"
              link
              @click="routeTo(item.route)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-subheader>
            代码优化
          </v-subheader>
          <v-list-item
              v-for="item in drawerItems.optimization"
              :key="item.title"
              link
              @click="routeTo(item.route)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

      </v-list>
    </v-navigation-drawer>
    <v-app-bar app :elevate-on-scroll="appbarMode[getAppbarMode(route)]" :color="appbarColor[getAppbarMode(route)]"
               :dark="appbarMode[getAppbarMode(route)]" :style="appbarStyle[getAppbarMode(route)]">
      <v-app-bar-nav-icon @click="drawer = !drawer"/>
      <div class="d-flex align-center" >
        <span> <v-toolbar-title>编译原理可视化系统</v-toolbar-title></span>
        <span style="margin:20px">
         <v-toolbar-title><button @click="teach">教学视频</button></v-toolbar-title>
          </span>
      </div>

      <v-spacer></v-spacer>

      <v-btn
          text @click="login">
        <span class="mr-2">登录</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main style="scroll-behavior: smooth">
      <keep-alive>
        <router-view style="scroll-behavior: smooth"/>
      </keep-alive>
    </v-main>
    <div v-show="['xl', 'lg', 'md'].indexOf(this.$vuetify.breakpoint.name) !== -1"
         style="position: fixed; right: 16px; bottom: 16px; z-index: 9999">
      <v-fade-transition>
        <iframe v-show="helper" src="https://powerva.microsoft.com/webchat/bots/51f4f11d-e3b9-4522-952b-691fbe748667"
                frameborder="0" style="width: 100%; height: 400px;"/>
      </v-fade-transition>
      <v-btn style="float: right" fab color="primary" dark @click="helper = !helper">
        <v-icon dark>mdi-account-question</v-icon>
      </v-btn>
    </div>
    <div v-show="['xl', 'lg', 'md'].indexOf(this.$vuetify.breakpoint.name) === -1"
         style="position: fixed; right: 8px; bottom: 16px; z-index: 9999">
      <v-fade-transition>
        <iframe v-show="helper" src="https://powerva.microsoft.com/webchat/bots/51f4f11d-e3b9-4522-952b-691fbe748667"
                frameborder="0" style="width: 100%; height: 400px;"/>
      </v-fade-transition>
      <v-btn style="float: right" x-small tile fab color="primary" dark @click="helper = !helper">
        <v-icon dark>mdi-account-question</v-icon>
      </v-btn>
    </div>
    <v-dialog
        v-model="loginDialog"
        width="480"
        persistent
        transition="scroll-y-transition">
      <v-card>
        <v-card-title class="headline">
          登录
        </v-card-title>
        <v-card-text>
          暂时仅限校内用户使用
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" text @click="loginDialog = false">好的</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>


</template>

<script>

export default {

  name: 'App',
  components: {},
  data: () => ({
    drawer: false,
    drawerItems: {

      optimization: [
        {title: '基本块优化', icon: 'mdi-leek', route: 'basicBlockOptimize'},

        //  未完待续
        {title: '代码外提', icon: 'mdi-alarm', route: 'codeExtraction'},
        {title: '强度削弱', icon: 'mdi-undo-variant', route: 'strengthWeakening'},
        {title: 'DAG 优化', icon: 'mdi-arrow-up-bold-box-outline', route: 'dagOptimize'}
      ],
      lexical: [
        {title: 'DFA 最小化', icon: 'mdi-minus', route: 'dfaMinimize'},
        {title: 'NFA 确定化', icon: 'mdi-check', route: 'nfa2DFA'},
        {title: '正则表达式转 NFA', icon: 'mdi-regex', route: 'regex2NFA'},
      ],
      grammar: [
        {title: '计算 First 集合', icon: 'mdi-numeric-1-circle', route: 'calculateFirst'},
        {title: '计算 Follow 集合', icon: 'mdi-arrow-right-circle', route: 'calculateFollow'},
        {title: '消除左递归', icon: 'mdi-backburger', route: 'elr'},
        {title: 'LL(1) 文法判断', icon: 'mdi-code-tags-check', route: 'll1'},
        {title: '递归下降分析', icon: 'mdi-arrow-down-circle', route: 'rda'},
        {title: '预测分析法', icon: 'mdi-google-analytics', route: 'predict'},
        {title: 'LR(0) 文法判断', icon: 'mdi-code-tags-check', route: 'lr0'}
      ],
    },
    loginDialog: false,
    appbarStyle: [
      'backdrop-filter: blur(30px)',
      ''
    ],
    appbarColor: [
      '#1867C060',
      'white'
    ],
    appbarMode: [
      true,
      false
    ],
    route: '',
    helper: false
  }),
  methods: {


      // 点击左侧菜单栏事件
    teach() {
      console.log("点击成功")
      document.getElementById('teaching').scrollIntoView();
    },



    getAppbarMode: function (route) {
      if (route === 'home' || route === ' ' || !route || route.length === 0) {
        return 0;
      } else {
        return 1;
      }
    },
    routeTo: function (route) {
      this.route = route
      this.$router.push(route)
    },
    toggleDrawer: function () {
      this.drawer = !this.drawer
    },
    login: function () {
      this.loginDialog = true
    }
  },


  mounted() {
    this.route = this.$route.path.substr(1)
    console.log('  ______               _  _       \n' +
        ' |  ____|             (_)| |      \n' +
        ' | |__    __ _  _ __   _ | |  ___ \n' +
        ' |  __|  / _` || \'_ \\ | || | / _ \\\n' +
        ' | |____| (_| || |_) || || ||  __/\n' +
        ' |______|\\__,_|| .__/ |_||_| \\___|\n' +
        '               | |                \n' +
        '               |_|                ')
  }
};





</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}
</style>
