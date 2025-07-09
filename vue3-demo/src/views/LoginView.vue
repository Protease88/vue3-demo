

<template>
    <el-row :gutter="40" style="min-height: 100vh; width:1200px">
        <el-col :span="16">
            <img src="../assets/pv-login-background.jpeg" 
                 alt="" 
                 class="login-bg"
                 style="width: 100%; height: 100%">
        </el-col>

        <el-col :span="8">
            <!--登录的form表单-->
            <LoginForm/>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
 import LoginForm from '../components/login/LoginForm.vue';
</script>



<style scoped>
.login-bg {
    filter: brightness(0.8) contrast(1.1);
    object-fit: cover;
    transition: filter 0.3s ease;
}

.el-col:first-child:hover .login-bg {
    filter: brightness(1) contrast(1);
}

.form-container {
    margin-top: 40%;
    padding: 40px 30px;
    background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(12px);
    transform: translateY(-10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-container:hover {
    box-shadow: 0 20px 40px rgba(64, 158, 255, 0.15);
    transform: translateY(0);
}

.form-title {
    color: #2c3e50;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 32px;
    text-align: center;
    position: relative;
}

.form-title::after {
    content: '';
    position: absolute;
    width: 60px;
    height: 3px;
    background: #409eff;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
}

.el-form-item {
    margin-bottom: 24px !important;
}

.el-input__inner {
    padding: 14px 18px !important;
    font-size: 16px !important;
    border-radius: 8px !important;
    border: 2px solid #e4e7ed !important;
    transition: all 0.3s ease;
}

.el-input:focus-within {
    border-color: #409eff !important;
    box-shadow: 0 0 8px rgba(64, 158, 255, 0.3) !important;
}

.login-btn {
    background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
    border-color: #409eff;
    padding: 16px 35px !important;
    font-size: 16px !important;
    font-weight: 600;
    border-radius: 10px !important;
}

.login-btn:hover {
    background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
    box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
}

.cancel-btn {
    color: #67c23a;
    border: 1px solid #e4e7ed;
    padding: 16px 35px !important;
    font-size: 16px !important;
    border-radius: 10px !important;
    margin-left: 15px;
}

.cancel-btn:hover {
    color: #67c23a;
    background: #f8f9fa;
    box-shadow: 0 4px 12px rgba(103, 194, 58, 0.1);
}

/* 响应式优化 */
@media (max-width: 1200px) {
    .el-row {
        width: 90%;
        margin: 0 auto;
    }
    
    .el-col:first-child {
        display: none;
    }
    
    .el-col:last-child {
        width: 100% !important;
    }
}

@media (max-width: 768px) {
    .form-container {
        padding: 30px 20px;
    }
    
    .form-title {
        font-size: 24px;
    }
}
</style>