$(function () {
    /*点击搜索按钮跳转到商品搜索详细页面，带key*/
    $('.lt_search a').on('tap',function () {
        var key =  $.trim($('.lt_search input').val());
        /*console.log(key);*/
        if(!key){
           mui.toast('请输入关键字');
           return false;
        }
        location.href = 'searchList.html?key='+key;
    })
});