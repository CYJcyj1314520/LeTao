$(function(){
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005,
        indicators: false
    });
    /*1、页面初始化让key在搜索框中显示*/
    /*获取关键字*/
    var params = ct.getParamsByUrl();

    /*console.log(params);*/
    var $input = $('input').val(params.key || '');
    /*2、页面初始化的时候根据关键字显示第一页的数据，默认4条*/
    /*GetListData({
        proName:params.key,
        page:1,
        pageSize:4
    },function (data) {
       /!* console.log(data);*!/
        $('.lt_product').html(template('list',data));
    });*/

    /*3、用户在搜索框中输入内容时显示对应的产品名称中包含关键字的数据，重置排序功能*/
     $('.lt_search a').on('tap',function () {
         /*获取输入框中最新的值*/
         var key = $.trim($input.val());
         /*console.log(key);*/
         if(!key){
             mui.toast('请输入关键字');
             return false;
         }
         GetListData({
             proName:key,
             page:1,
             pageSize:4
         },function (data) {
             /*console.log(data);*/
             $('.lt_product').html(template('list',data));
         });
     })

    /*4、用户点击排序功能时，默认把商品进行降序排列，再次点击进行升序排列*/
    /*4.1改变样式*/
    $('.order a').on('tap',function () {
        var $this = $(this);
        if(!$this.hasClass('now')){
           $this.addClass('now').siblings().removeClass('now')
            .find('span').removeClass('fa-angle-up').addClass('fa-angle-down')
        }else{
           if($this.find('span').hasClass('fa-angle-down')){
               $this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
           }else{
               $this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
           }
        }
        /*4.2获取当前点击的功能参数 price 1 2 num 1 2*/
        var order = $this.attr('datatype');
        var orderVal = $this.find('span').hasClass('fa-angle-up')? 1:2;
        /*4.3获取数据并渲染*/
        var key = $.trim($input.val());
        /*console.log(key);*/
        if(!key){
            mui.toast('请输入关键字');
            return false;
        }
        var params = {
            proName:key,
            page:1,
            pageSize:4
        }
        /*把price 1 2 num 1 2添加到params,即把order:orderVal添加到params对象中*/
        params[order] = orderVal;
        GetListData(params,function (data) {
            /*console.log(data);*/
            $('.lt_product').html(template('list',data));
        });

    })
    /*5、用户下拉时，根据当前条件判断，上拉加载重置，排序功能重置）*/
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",
            down: {
                auto: true,
                callback: function () {
                    var key = $.trim($input.val());
                    var that = this;
                    /*console.log(key);*/
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }
                    /*排序功能重置*/
                    $('.order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-dowm');
                    GetListData({
                        proName: key,
                        page: 1,
                        pageSize: 4
                    }, function (data) {
                        setTimeout(function () {
                            $('.lt_product').html(template('list', data));
                            /*下拉停止刷新*/
                            that.endPulldownToRefresh();
                            that.refresh(true);
                        }, 1000)
                    });
                }
            },
            /*6、用户上拉时，显示下一页 */
            up:{
                callback: function () {
                    window.page++
                    var key = $.trim($input.val());
                    var that = this;
                    /*console.log(key);*/
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }
                    /*4.2获取当前点击的功能参数 price 1 2 num 1 2*/
                    var order = $('.order a.now').attr('datatype');
                    var orderVal = $('.order a.now').find('span').hasClass('fa-angle-up')? 1:2;
                    var params = {
                        proName:key,
                        page:window.page,
                        pageSize:4
                    }
                    params[order] = orderVal;
                    GetListData(params, function (data) {
                        setTimeout(function () {
                            $('.lt_product').append(template('list', data));
                            if(data.data.length){
                                that.endPullupToRefresh();
                            }else{
                                that.endPullupToRefresh(true);
                            }
                        }, 1000)
                    });
                }
            }
        }
    });
    /*请求ajax数据*/
    function GetListData(params,callback) {
        $.ajax({
            url:'/product/queryProduct',
            type:'get',
            data:params,
            datatype:'json',
            success:function (data) {
                window.page = data.page;
                callback && callback(data)
            }
        })
    }
});