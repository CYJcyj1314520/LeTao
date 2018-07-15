$(function(){
    /*滚动*/
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005,
        indicators: false
    });
    /*1、下拉刷新 页面自动初始化*/
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",
            down: {
                auto: true,
                callback: function () {
                    var that = this;
                    setTimeout(function () {
                        /*1、下拉刷新 页面自动初始化*/
                        getCartDate(function (data) {
                            $('.mui-table-view').html(template('cart',data));
                        })
                        that.endPulldownToRefresh();
                        $('.fa-refresh').on('tap',function () {
                            that.pulldownLoading();
                        });

                    }, 1000)
                    }
                }
        }
    });
    /*2、右滑点击编辑按钮可以编辑当前商品*/
    $('.mui-table-view').on('tap','.mui-icon-compose',function () {
        /*获取当前产品对应的数据*/
        var id = $(this).parent().attr('data-id');
       /* console.log(id);*/
        var item = ct.getItemByID(window.Cart.data,id);
        /*console.log(window.Cart.data);*/
        var html = template('edit',item);
        /*模块渲染默认会把 \n 替换为 br*/
        mui.confirm(html.replace(/\n/g,''), '编辑商品', ['确定','取消'], function(e) {
            var Size = $('.btn_size.now').html();
            var Num = $('.p_number input').val();
            if (e.index == 0) {
                ct.loginAjax({
                    url:'/cart/updateCart',
                    type:'post',
                    data:{
                        id:id,
                        num:Num,
                        size:Size
                    },
                    success:function (data) {
                        if(data.success == true){
                            /*更新列表 提示用户*/
                            item.num = Num;
                            item.size = Size;
                            $('.mui-table-view').html(template('cart',window.Cart));
                            mui.toast('编辑成功');
                            return false;
                        }
                    }
                })
            } else {
               /* TODO*/
            }
        })
    })
    /*可以选择尺码*/
    $('body').on('tap','.p_size span',function () {
        $(this).addClass('now').siblings().removeClass('now');
    })
    /*选择数量*/
    $('body').on('tap','.p_number span',function () {
        var $input = $(this).siblings('input');
        var currentNum = parseInt($input.val());
        var MaxNum = $input.attr('data-max');
        /*console.log(currentNum);*/
        if($(this).hasClass('jian')){
            if(currentNum <= 1){
                mui.toast('至少选择一件商品');
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
    /*3、右滑点击删除按钮可以删除当前商品*/
    $('.mui-table-view').on('tap','.mui-icon-trash',function () {
        /*获取当前产品对应的数据*/
        var $this = $(this);
        var id = $this.parent().attr('data-id');
        mui.confirm('您是否确定删除该商品', '删除商品', ['确定','取消'], function(e) {
            if (e.index == 0) {
                ct.loginAjax({
                    url:'/cart/deleteCart',
                    type:'get',
                    data:{
                        id:id
                    },
                    success:function (data) {
                        if(data.success == true){
                            $this.parent().parent().remove();
                            setAmountPrice();
                        }
                    }
                })
            } else {
                /* TODO*/
            }
        })
    })
    /*选择input的checkbox，价格变化*/
    $('body').on('change','[type=checkbox]',function () {
       /* console.log(111)*/
       /*计算总金额*/
       setAmountPrice();
    })
    function setAmountPrice() {
        /*获取所有被选中的checkbox*/
        var $checkBox = $('[type=checkbox]:checked');
        /*获取商品的ID*/
        var Amount = 0;
        $checkBox.each(function (i,item) {
            var id = $(this).attr('data-id');
            var item = ct.getItemByID(window.Cart.data,id);
            var num = item.num;
            var price = item.price;
            var amount = num * price;
            Amount += amount;
        })
        Amount = Math.floor(Amount*100)/100;
        $('#cartAmount').html(Amount);
    }

    /*初始化,获取购物车数据*/
    function getCartDate(callback) {
        ct.loginAjax({
            url:'/cart/queryCartPaging',
            type:'get',
            data:{
                page:1,
                pageSize:100
            },
            datatype:'json',
            success:function (data) {
                /*缓存,记录购物车商品的数据*/
                window.Cart = data;
                /*console.log(window.Cart);*/
                callback && callback(data);
            }

        })
    }
});