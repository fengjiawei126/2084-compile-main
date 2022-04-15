<template><v-container>


  <button class="cta">
    <span class="hover-underline-animation"> <a id="teaching"><h1>教学视频</h1></a> </span>
  </button>

  <div class="card">
    <div class="card2">

<div class="aspect-ratio">
    <iframe src="//player.bilibili.com/player.html?aid=725702794&bvid=BV1bS4y1Y76y&cid=575781339&page=1" allowfullscreen="allowfullscreen" width="100%" height="500" scrolling="no" frameborder="0" sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"></iframe>

</div></div>
  </div>
</v-container>

</template>

<script>

</script>

<style scoped>

.aspect-ratio {
  height: 80%;
  width: 96%;

  margin: auto;
}
.card {
  width: 800px;
  height: 520px;
  background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
  border-radius: 20px;
  transition: all .3s;
  margin: auto;
}

.card2 {
  width: 800px;
  height: 520px;
  background-color: #1a1a1a;
  border-radius:;
  transition: all .2s;
}

.card2:hover {
  transform: scale(0.98);
  border-radius: 20px;
}

.card:hover {
  box-shadow: 0px 0px 30px 1px rgba(0, 255, 117, 0.30);
}
.cta {
  border: none;
  background: none;
}

.cta span {
  padding-bottom: 7px;
  letter-spacing: 4px;
  font-size: 9px;
  padding-right: 15px;
  text-transform: uppercase;
}

.cta svg {
  transform: translateX(-8px);
  transition: all 0.3s ease;
}

.cta:hover svg {
  transform: translateX(0);
}

.cta:active svg {
  transform: scale(0.9);
}

.hover-underline-animation {
  position: relative;
  color: black;
  padding-bottom: 20px;
}

.hover-underline-animation:after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 1.5px;
  bottom: 0;
  left: 0;
  background-color: #000000;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.cta:hover .hover-underline-animation:after {
  transform: scaleX(1);
  transform-origin: bottom left;
}
</style>