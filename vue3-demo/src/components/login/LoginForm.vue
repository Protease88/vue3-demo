<template>
    <div class="form-container">
                <el-form :model="user" status-icon label-width="auto">
                    <h2 class="form-title">系统登录</h2>
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="user.username" type="text" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="user.password" type="password" autocomplete="off" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm()" class="login-btn">
                            立即登录
                        </el-button>
                        <el-button type="text" class="cancel-btn">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
</template>

<script lang="ts" setup>
import { reactive} from 'vue'
import {login} from '../../api/user'

import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'

//定义用户对象
const user = reactive({
    username: '',
    password: ''
})

const router = useRouter()

const submitForm = async () => {
   //向后端发起请求
    const resp=await login(user)
    // console.log(resp)
    if(resp.data.code==200){
        ElMessage({
            message:'用户登录成功',
            type:'success'
        })
        router.push('/test')
    }
    else{
        ElMessage({
            message:'用户登录失败',
            type:'error'
        })
    }
}


</script>