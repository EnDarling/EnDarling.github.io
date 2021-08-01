layui.use(['jquery','flow'], function () {
    var $ = layui.jquery;
    $('.yearToggle').click(function () {
        $(this).parent('h2').siblings('.timeline-month').slideToggle('slow');
        $(this).siblings('i').toggleClass('fa-chevron-circle-down fa-chevron-circle-right');
    });
});
