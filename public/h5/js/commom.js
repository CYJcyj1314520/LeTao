var ct = {};
 ct.getParamsByUrl = function () {
    var params = {};
     var search = location.search;
    /*console.log(search);*/
    if(search){
        /*如果地址栏中有多个参数*/
        search = search.replace('?','');
        var arr = search.split('&');
        /*console.log(arr);*/
        arr.forEach(function (item,i) {
            var arrItem = item.split('=');
            /*console.log(arrItem[0]);*/
            params[arrItem[0]] = arrItem[1];
        })

    }
    return params;
}
/*去购物车页面*/
ct.cartUrl = '/h5/user/cart.html';
/*跳转到首页*/
ct.loginUrl = '/h5/user/login.html';
/*跳转到个人中心*/
ct.userUrl = '/h5/user/index.html';
/*需要登录的ajax请求*/
ct.loginAjax = function (params) {
    $.ajax({
        url:params.url,
        type:params.type,
        data:params.data,
        datatype:params.datatype,
        success:function (data) {
            /*{error: 400, message: "未登录！"}
            * 所有需要登录的ajax请求 没有登录返回此数据*/
            if(data.error == 400){
                /*跳转到登录页，并带上当前页的地址*/
                location.href = ct.loginUrl + '?returnUrl=' + location.href;
                return false;
            }else{
             params.success && params.success(data);
            }
        },
        error:function () {
          mui.toast('服务器繁忙');
        }
    })
}
/*serialize获取元素转化为对象*/
/*IE 6 7 不支持JSON*/
ct.serialize2obj = function (serializeStr) {
    var obj = {};
    if(serializeStr){
        var arr = serializeStr.split('&');
        arr.forEach(function (item,i) {
          var itemArr =  item.split('=');
          /*[key,val]*/
          obj[itemArr[0]] = itemArr[1];
        })
    }
    return obj;
}
/*获取当前商品对应的ID*/
/*遍历数组 forEach 遍历JQ对象 each*/
ct.getItemByID = function (arr,id) {
    var ItemId = null;
    arr.forEach(function (item,i) {
        if(item.id == id ){
            ItemId = item;
        }
    })
    return ItemId;
}
