import Vue from 'vue'
import VueRouter from 'vue-router';

import './registerServiceWorker'
import predict from "@/components/Predict";
import nfa2DFA from "@/components/NFA2DFA";
import dfaMinimize from "@/components/DFAMinimize";
import regex2NFA from "@/components/Regex2NFA";
import home from "@/components/Home"
import calculateFirst from "@/components/CalculateFirst";
import calculateFollow from "@/components/CalculateFollow";
import ll1 from "@/components/LL1";
import elr from "@/components/ELR";
import rda from "@/components/RDA";
import lr0 from "@/components/LR0";
import dag from "@/components/DAGOptimize";
import FlexibleLearning from "@/components/FlexibleLearning";
import FlexibleTeaching from "@/components/FlexibleTeaching";
import Multiplatform from "@/components/Multiplatform";
import Visualization from "@/components/Visualization";
import basicBlockOptimize from "@/components/BasicBlockOptimize";
import StrengthWeakening from "@/components/StrengthWeakening";
import codeExtraction from "@/components/CodeExtraction";

Vue.use(VueRouter)

const routes = [
    {path: '/codeExtraction',component:codeExtraction,name: 'codeExtraction' },
    {path: '/strengthWeakening',component:StrengthWeakening,name: 'strengthWeakening' },
    {path: '/basicBlockOptimize',component:basicBlockOptimize,name: 'BBOptimize' },
    {path: '/dagOptimize',component:dag,name: 'DAGOptimize' },
    {path: '/predict', component: predict, name: 'Predict'},
    {path: '/nfa2DFA', component: nfa2DFA, name: 'NFA2DFA'},
    {path: '/dfaMinimize', component: dfaMinimize, name: 'DFAMinimize'},
    {path: '/regex2NFA', component: regex2NFA, name: 'Regex2NFA'},
    {path: '/calculateFirst', component: calculateFirst, name: 'calculateFirst'},
    {path: '/calculateFollow', component: calculateFollow, name: 'calculateFollow'},
    {path: '/ll1', component: ll1, name: "LL1"},
    {path: '/home', component: home, name: 'Home'},
    {path: '/elr', component: elr, name: 'ELR'},
    {path: '/rda', component: rda, name: 'RDA'},
    {path: '/lr0', component: lr0, name: 'LR0'},
    {path: '/flexibleLearning',component: FlexibleLearning,name:'FlexibleLearning'},
    {path:'/flexibleTeaching',component: FlexibleTeaching,name: 'FlexibleTeaching'},
    {path:'/multiplatform',component: Multiplatform,name:'Multiplatform'},
    {path:'/Visualization',component: Visualization,name:'Visualization'},
    {path: '/', component: home, name: 'Default'}


]
const router =  new VueRouter({routes});

export default router