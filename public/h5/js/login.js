$(function () {
    /*serialize 序列化表单 返回表单内字符串*/
    $('.btn_login').on('tap',function () {
        var data = $('.form_box').serialize();
        /*字符串转对象*/
        var dataObj = ct.serialize2obj(data);
       /* console.log(dataObj);*/
        /*检验*/
        if(!dataObj.username){
            mui.toast('请输入用户名');
            return false;
        }
        if(!dataObj.password){
            mui.toast('请输入密码');
            return false;
        }
        console.log(dataObj);
        $.ajax({
            url:'/user/login',
            type:'post',
            data:dataObj,
            datatype:'json',
            success:function (data) {
                /*成功 即账号密码正确*/
                if(data.success == true){
                    /*判断有没有传过来的地址*/
                    /*location.search 返回当前Url查询的部分*/
                    var returnUrl = location.search.replace('?returnUrl=','');
                    if(returnUrl){
                        location.href = returnUrl;
                    }else{
                        location.href = ct.userUrl;
                    }
                }else{
                    mui.toast(data.message);
                }

            }
        })

    })


})