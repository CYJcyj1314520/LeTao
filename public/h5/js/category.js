$(function () {
    /*1、一级分类动态渲染，显示对应的二级内容*/
    GetFirstdata(function (data) {
        $('.lt_left ul').html(template('getfirstdata',data));
        var categoryId = $('.lt_left ul li:first-child').find('a').attr('data-id');
        /*console.log(categoryId);*/
        render(categoryId);
    });
    /*2、点击一级分类，显示对应的二级分类的内容*/
    $('.lt_left ul').on('tap','a',function () {
        if($(this).parent().hasClass('now')) return false;
       $('.lt_left li').removeClass('now');
       $(this).parent().addClass('now');
       var categoryId = $(this).attr('data-id');
       render(categoryId);
    });
});
/*一级菜单渲染*/
function GetFirstdata(callback) {
    $.ajax({
        url:'/category/queryTopCategory',
        type:'get',
        data:'',
        datatype:'json',
        success:function (data) {
          callback && callback(data);
        }
    })
}
/*二级菜单渲染*/
/*params:{id:1}*/
function GetSenconddata(params,callback) {
    $.ajax({
        url:'/category/querySecondCategory',
        type:'get',
        data:params,
        datatype:'json',
        success:function (data) {
            callback && callback(data);
        }
    })
}
function render(categoryId) {
    GetSenconddata({id:categoryId},function (data) {
        /*console.log(data);*/
        $('.lt_right ul').html(template('getseconddata',data));
    });
}