<!--HTML-->
<template>
  <h1>登录页面</h1>
  <h2>{{msg}}</h2>
  <h3 style="color: brown;">{{food}}</h3>

  <h1>姓名: {{ stu.name}}, 年龄:{{stu.age }}, 专业: {{ stu.major }}</h1>
  <img src="../assets/pv-login-background.jpeg" alt="" class="imgClass">
  <button @click="updateWord">点击</button>
</template>


<!-- TS-->
<script setup lang="ts">
 import { reactive } from 'vue'
  const msg='今天天气怎么样'
  const food='米饭菜'

  //定义对象

  const stu = reactive({
    name:'张三',
    age :'23',
    major: '大数据专业'
  })
  const updateWord=()=>{
    alert('测试一下')
    //填入对象的信息
    stu.name='李四'
    stu.age='55'
    stu.major='计算机科学'
  }

</script>


<!--CSS-->
<style lang="less" scoped>
  .imgClass{
    width: 300px;
    height: 200px;
  }

</style>