$(function(){
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005,
        indicators: false
    });
    mui('.mui-slider').slider({
        interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
    });
});