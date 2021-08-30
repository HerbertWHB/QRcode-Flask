//pagination
    //全局变量
        var numCount;       //数据总数量
        var columnsCounts;  //数据列数量
        var pageCount;      //每页显示的数量
        var pageNum;        //总页数
        var currPageNum ;   //当前页数

        //页面标签变量
        var blockTable;
        var preSpan;
        var firstSpan;
        var nextSpan;
        var lastSpan;
        var pageNumSpan;
        var currPageSpan;

        window.onload=function(){
            //页面标签变量
            blockTable = document.getElementById("blocks");
            preSpan = document.getElementById("spanPre");
            firstSpan = document.getElementById("spanFirst");
            nextSpan = document.getElementById("spanNext");
            lastSpan = document.getElementById("spanLast");
            pageNumSpan = document.getElementById("spanTotalPage");
            currPageSpan = document.getElementById("spanPageNum");

            numCount = document.getElementById("blocks").rows.length - 1;       //取table的行数作为数据总数量（减去标题行1）
            // alert(numCount)
            columnsCounts = blockTable.rows[0].cells.length;
            pageCount = 5;
            pageNum = parseInt(numCount / pageCount);
            if(0 != numCount%pageCount){
                pageNum += 1;
            }

            firstPage();
        };

    $('.user').addClass('active');
    $('.update').click(function(){
        $('#upload').click();
    });
    var picname = '';
    var url = '';
    $('#profile .table tr').click(function () {
        url = $(this).children('td').eq(3).html();
        url = 'http://kdhly.ddns.net:5000/static/uploads/pic/'+ url + '?t='+ Math.random();
        console.log(url);
        $('.qrcode').attr('src',url);
        picname = url.substr(46,20);
        console.log(picname);
    });
    $('#upload').change(function () {
        $('.confirm').click(function () {
            console.log(picname,url);
            url = url.substr(0,68)+Math.random();
            var pic = document.getElementById('upload').files[0];
            console.log(pic);
            var formdata = new FormData();
            formdata.append('picname',picname);
            formdata.append('formdata',pic);
            //服务器中图片名称
            $.ajax({
                type:'POST',
                url:'/modifypic',
                data:formdata,
                dataType:'json',
                async: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log(data.result);
                    $('.qrcode').attr('src',url);
                    },
                error: function (data) {
                    console.log('error');
                }
            });
        })
    });

    //    delete
    $('.delete').click(function () {
        $(this).parent().parent().remove();
        var id = $(this).parent().parent().children('td').eq(0).html();
        console.log(id);
        $.ajax({
             url : '/deletepic',
             type : "POST",
             datatype : "json",
             data: {
                 "id":id
             },
             success : function(data) {
                 console.log('提交成功');
             },
             error : function(data) {
                //alert("请求失败");
             }
        })
    })


