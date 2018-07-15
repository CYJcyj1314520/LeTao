$(function () {
    var id = ct.getParamsByUrl().productId;
    getProductDetail(id,function (data) {
        $('.loading').remove();
        /*console.log(data);*/
       $('.mui-scroll').html(template('detail',data));
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005,
            indicators: false
        });
        mui('.mui-slider').slider({
            interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
        });
        /*1、可以选择尺码*/
        $('.p_size span').on('tap',function () {
            $(this).addClass('now').siblings().removeClass('now');
        })
        /*2、选择数量*/
        $('.p_number span').on('tap',function () {
            var $input = $(this).siblings('input');
            var currentNum = parseInt($input.val());
            var MaxNum = $input.attr('data-max');
            /*console.log(currentNum);*/
            if($(this).hasClass('jian')){
                if(currentNum == 0){
                 return false;
                }
                currentNum--;
            }else{
                if(currentNum >= MaxNum){
                    setTimeout(function () {
                        mui.toast('不能超过最大数量');
                    },200)
                    return false;
                }
                currentNum++;
            }
            $input.val(currentNum);
        })
        /*3、添加到购物车(需要登录)*/
        $('.addcart').on('tap',function () {
            /*数据校验*/
            var $btnchange = $('.btn_size');
            var num = $('.p_number input').val();
            if(!$btnchange.hasClass('now')){
                mui.toast('请选择尺码');
                return false;
            }
            if(num <= 0 ){
                mui.toast('请选择数量');
                return false;
            }
            ct.loginAjax({
                url:'/cart/addCart',
                type:'post',
                data:{
                    productId:id,
                    num:num,
                    size:$btnchange.html()
                },
                datatype:'json',
                success:function (data) {
                    if(data.success == true){
                        mui.confirm('添加成功,去购物车看看?', '温馨提示', ['是','否'], function(e) {
                            if (e.index == 0) {
                                location.href = ct.cartUrl;
                            } else {
                              /*TODO*/
                            }
                        })
                    }
                }
            })
        });
    })
});

function getProductDetail(productID,callback) {
    $.ajax({
        url:'/product/queryProductDetail',
        type:'get',
        data:{id:productID},
        datatype:'json',
        success:function (data) {
            setTimeout(function () {
                callback && callback(data)
            },1000);

        }
    })
}