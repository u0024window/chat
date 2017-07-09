$('#bigimg').on('click', function (e) {//大图消失
    e = e || window.event;
    e.preventDefault();
    // $(this).hide();
    // $('#bigimg img').attr('src',"#resourcePrefix#/img/cschatroom/ing.jpg")
});
$('#bigimg img').on('click', function (e) {
    e = e || window.event;
    e.stopPropagation();
});
