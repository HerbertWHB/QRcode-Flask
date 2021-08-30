(function() {
        // 切换模板
        var index = 0;
        $('.templates img').eq(index).addClass('show');
        $('.glyphicon-chevron-left').click(function() {
            index--;
            if (index < 0) {
                index = index + 2;
                $('.templates img').removeClass('show');
                $('.templates img').eq(index).addClass('show');
            } else {
                $('.templates img').removeClass('show');
                $('.templates img').eq(index).addClass('show');
            }
        });
        $('.glyphicon-chevron-right').click(function() {
            index++;
            if (index > 1) {
                index = index - 2;
                $('.templates img').removeClass('show');
                $('.templates img').eq(index).addClass('show');
            } else {
                $('.templates img').removeClass('show');
                $('.templates img').eq(index).addClass('show');
            }
        });
        // 点击上传图片
        $('.uploadbtn').click(function() {
            $('#upload').click();
        });
        // 二维码生成、图片绘制
        var i = 0;

        function utf16to8(str) {
            var out, i, len, c;
            out = "";
            len = str.length;
            for (i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                if ((c >= 0x0001) && (c <= 0x007F)) {
                    out += str.charAt(i);
                } else if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                } else {
                    out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
            }
            return out;
        };
        //上传二维码图片------------------------------------------>
        function getObjectURL(file) {
            var url = null;
            /* window.URL = window.URL || window.webkitURL;*/
            if (window.createObjcectURL != undefined) {
                url = window.createOjcectURL(file);
            } else if (window.URL != undefined) {
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) {
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        }
        // 获取file中的图片路径
        var file = $("#upload");
        file.change(function () {
            var s = getObjectURL(file[0].files[0]);
            qrcode.decode(s);
            qrcode.callback = function (imgMsg) {
                $('.decodeContent').html(imgMsg);
            }
        })
        $('.decode').click(function () {
            // create qrcode
                var content = $('.decodeContent').html();
                console.log('content:' + content);
                var logo = $('#qrcode').qrcode({
                    text: utf16to8(content),
                    typeNumber: -1,
                    background: '#fff',
                    foreground: '#d84672',
                    doublecolor: '#f8b62b',
                    triplecolor: '#30b1da'
                }).hide();
                // 给canvas动态添加ID
                var icanvasimg = 'canvasimg' + i;
                $('#qrcode canvas').eq(i).attr('id', icanvasimg);

                var canvas = logo.find('canvas').get(i);
                // canvas转成图片
                var dataurl = canvas.toDataURL('image/jpg');
                $('#imgqrcode').attr('src', dataurl);
                //拼接图片
                var finalpic = document.getElementById('finalpic');
                var context = finalpic.getContext('2d');
                var pic1 = document.getElementsByClassName('show')[0];
                var pic2 = document.getElementById('imgqrcode');
                if (pic1.width == 282){
                    finalpic.width = 281.25;
                    finalpic.height = 500;
                    context.drawImage(pic1,0,0,281.25,500);
                }else{
                    finalpic.width = 300;
                    finalpic.height = 212;
                    context.drawImage(pic1,0,0,300,212);
                }
                pic2.onload = function () {
                    if (pic1.width == 282){
                        context.drawImage(pic2,77.71,168.64,126,126);
                    }else{
                        context.drawImage(pic2,78,58.58,94.8,94.8);
                    }
                    var imgurl = finalpic.toDataURL('image/jpg');
                    $('#finalimg').attr('src', imgurl);
                    $('.previewimage').attr('src',imgurl).load(function() {
                        var realWidth = this.width;
                        var realHeight = this.height;
                        console.log(realWidth,realHeight);
                        if(realWidth<realHeight){
                            $(this).css("height","100%");
                            $(this).width(80*realWidth/realHeight);
                            $(this).css('display','block');
                        } else{
                            $(this).css("width",'100%').css("height",80*realHeight/realWidth+'px');
                            $(this).css('display','block');
                        }
                        $(".previewimage").mouseenter(function(){
                            $(this).animate({width:$(this).width()*3+'px',height:$(this).height()*3+'px'});
                        }).mouseleave(function(){
                            $(this).animate({width:$(this).width()/3+'px',height:$(this).height()/3+'px'});
                        })
                    });
                    // textdownload  触发下载事件
                    var a = $('#qrcodedownload');
                    a.attr('href', imgurl);
                    a.click();
                }
                $('.decodeContent').html('');
            i++;
        });
        //end--------------------------------------------------------->
        //文本内容
        $('.inputtext').change(function() {
            // create qrcode
            var content = $('.inputtext').val();
            console.log(content);
            var logo = $('#qrcode').qrcode({
                text: utf16to8(content),
                typeNumber: -1,
                background: '#fff',
                foreground: '#d84672',
                doublecolor:'#f8b62b',
                triplecolor:'#30b1da'
            }).hide();
            // 给canvas动态添加ID
            var icanvasimg = 'canvasimg' + i;
            $('#qrcode canvas').eq(i).attr('id', icanvasimg);

            var canvas = logo.find('canvas').get(i);
            // canvas转成图片
            var dataurl = canvas.toDataURL('image/jpg');
            $('#imgqrcode').attr('src', dataurl);
            //拼接图片
            var finalpic = document.getElementById('finalpic');
            var context = finalpic.getContext('2d');
            var pic1 = document.getElementsByClassName('show')[0];
            var pic2 = document.getElementById('imgqrcode');
            if (pic1.width == 282){
                finalpic.width = 281.25;
                finalpic.height = 500;
                context.drawImage(pic1,0,0,281.25,500);
            }else{
                finalpic.width = 300;
                finalpic.height = 212;
                context.drawImage(pic1,0,0,300,212);
            }
            console.log(pic1.width);
            pic2.onload = function () {
                if (pic1.width == 282){
                    context.drawImage(pic2,77.71,168.64,126,126);
                }else{
                    context.drawImage(pic2,78,58.58,94.8,94.8);
                }
                var imgurl = finalpic.toDataURL('image/jpg');
                // console.log(imgurl);
                $('#finalimg').attr('src', imgurl);
                $('.previewtext').attr('src',imgurl).load(function() {
                        var realWidth = this.width;
                        var realHeight = this.height;
                        console.log(realWidth,realHeight);
                        if(realWidth<realHeight){
                            $(this).css("height","100%");
                            $(this).width(80*realWidth/realHeight);
                            $(this).css('display','block');
                        } else{
                            $(this).css("width",'100%').css("height",80*realHeight/realWidth+'px');
                            $(this).css('display','block');
                        }
                        $(".previewtext").mouseenter(function(){
                            $(this).animate({width:$(this).width()*3+'px',height:$(this).height()*3+'px'});
                        }).mouseleave(function(){
                            $(this).animate({width:$(this).width()/3+'px',height:$(this).height()/3+'px'});
                        })
                    });
                // textdownload  触发下载事件
                var a = $('#textdownload');
                a.attr('href', imgurl);
                a.click();
            }
            i++;
        });

})();