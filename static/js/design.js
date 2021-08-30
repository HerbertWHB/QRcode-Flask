(function() {
    // 上传图片--------start
    $('.dcmtupld').click(function(){
        $('#file-1').click();
    });
    $('.imageupld').click(function(){
        $('#file-2').click();
    });
    $('.videoupld').click(function(){
        $('#file-3').click();
    });
    //文件
    $('#file-1').change(function(){
        var location1 = this.value;
        $('.hint1').html(location1);

        $('.item-3 .button').click(function(){
            //将图片上传到服务器
            if ($.trim(location1) == "") { alert("请选择要上传的文件"); return; }
            console.log("test");
           // console.log($('#file-2'));
            var file = document.getElementById('file-1').files[0];
            var formdata = new FormData();
            formdata.append('formdata',file);
            $.ajax({
                type:'POST',
                url:'/uploadfile',
                data:formdata,
                dataType:'json',
                async: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log(data.result);
                    // 获取二维码点形状
                    var shape = $('input:radio[name="shapeitem"]:checked').val();
                    // 获取容错率
                    var correctlevel = $('.shuju').text();
                    var number = Number(correctlevel);
                    // 获取大小
                    var size = $('.sizeinput').val();
                    size = size.substr(0, size.length - 2)
                    var original = 256;
                    if (parseInt(size) > 192 && parseInt(size) < 256) {
                        original = size;
                    }
                    var margin = (256 - original) / 2;
                    margin = margin + 'px';
                    original = original + 'px';
                    $('#imgqrcode').css('height', original);
                    $('#imgqrcode').css('width', original);
                    $('#imgqrcode').css('margin', margin);
                    // 获取颜色、内容
                    var colorlight = $('#colorlight').val();
                    var colordark = $('#colordark').val();

                    var content = data.result;
                    // 获取码眼颜色
                    var positionoutground = $('#positionoutground').val();
                    var positioninground = $('#positioninground').val();

                    var logo = $('#qrcode').qrcode({
                        shape: shape,
                        text: utf16to8(content),
                        typeNumber: -1,
                        correctLevel: number,
                        background: colorlight,
                        foreground: colordark,
                        positionoutground: positionoutground,
                        positioninground: positioninground
                    }).hide();
                    // 给canvas动态添加ID
                    var icanvasimg = 'canvasimg' + i;
                    $('#qrcode canvas').eq(i).attr('id', icanvasimg);
                    var canvas = logo.find('canvas').get(i);
                    // canvas转成图片
                    var dataurl = canvas.toDataURL('image/jpg');
                    $('#imgqrcode').attr('src', dataurl);

                    // imgdownload  触发下载事件
                    var a = $('#imgdownload');
                    a.attr('href', dataurl);
                    a.click();
                    i++;
                    },
                error: function (data) {
                     //200的响应也有可能被认定为error，responseText中没有Message部分
                     console.log('error')}
            });
        });
    });
    //图片
    //图片转base64格式
    function getBase64Image(img) {
         var canvas = document.createElement("canvas");
         canvas.width = img.width;
         canvas.height = img.height;
         var ctx = canvas.getContext("2d");
         ctx.drawImage(img, 0, 0, img.width, img.height);
         var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
         var dataURL = canvas.toDataURL("image/"+ext);
         return dataURL;
    }

    $('#file-2').change(function(){
        var location2 = this.value;
        $('.hint2').html(location2);

        $('.item-4 .button').click(function(){
            console.log('i was clicked');
            //将图片上传到服务器
            if ($.trim(location2) == "") { alert("请选择要上传的文件"); return; }
            console.log("test");
           // console.log($('#file-2'));
            var pic = document.getElementById('file-2').files[0];
            var formdata = new FormData();
            formdata.append('formdata',pic);
            //服务器中图片名称
            $.ajax({
                type:'POST',
                url:'/uploadpic',
                data:formdata,
                dataType:'json',
                async: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log(data.result);
                    // 获取二维码点形状
                    var shape = $('input:radio[name="shapeitem"]:checked').val();
                    // 获取容错率
                    var correctlevel = $('.shuju').text();
                    var number = Number(correctlevel);
                    // 获取大小
                    var size = $('.sizeinput').val();
                    size = size.substr(0, size.length - 2)
                    var original = 256;
                    if (parseInt(size) > 192 && parseInt(size) < 256) {
                        original = size;
                    }
                    var margin = (256 - original) / 2;
                    margin = margin + 'px';
                    original = original + 'px';
                    $('#imgqrcode').css('height', original);
                    $('#imgqrcode').css('width', original);
                    $('#imgqrcode').css('margin', margin);
                    // 获取颜色、内容
                    var colorlight = $('#colorlight').val();
                    var colordark = $('#colordark').val();

                    var content = data.result;
                    var picname = content.substr(46);
                    console.log(picname);
                    // 获取码眼颜色
                    var positionoutground = $('#positionoutground').val();
                    var positioninground = $('#positioninground').val();

                    var logo = $('#qrcode').qrcode({
                        shape: shape,
                        text: utf16to8(content),
                        typeNumber: -1,
                        correctLevel: number,
                        background: colorlight,
                        foreground: colordark,
                        positionoutground: positionoutground,
                        positioninground: positioninground
                    }).hide();
                    // 给canvas动态添加ID
                    var icanvasimg = 'canvasimg' + i;
                    $('#qrcode canvas').eq(i).attr('id', icanvasimg);
                    var canvas = logo.find('canvas').get(i);
                    // canvas转成图片
                    var dataurl = canvas.toDataURL('image/jpg');
                    $('#imgqrcode').attr('src', dataurl);

                    // imgdownload  触发下载事件
                    var a = $('#imgdownload');
                    a.attr('href', dataurl);
                    a.click(function () {
                        var image = new Image();
                        image.src = dataurl;
                        image.onload = function () {
                            var base64 = getBase64Image(image);
                            console.log(base64);
                            console.log(picname);
                            $.ajax({
                                url : '/download',
                                type : "POST",
                                datatype : "json",
                                data: {
                                    "content":base64,
                                    "name":picname
                                },
                                success : function(data, stats) {
                                    if (stats == "success") {
                                        console.log('提交成功');
                                        console.log(data.result);
                                    }
                                },
                                error : function(data) {
                                    //alert("请求失败");
                                }
                            });
                        }
                    });
                    i++;
                    },
                error: function (data) {
                     //200的响应也有可能被认定为error，responseText中没有Message部分
                     console.log('error')}
            });
            console.log('???');
        });
    });
    //音视频
    $('#file-3').change(function(){
        var location3 = this.value;
        $('.hint3').html(location3);

        $('.item-5 .button').click(function(){
            //将图片上传到服务器
            if ($.trim(location3) == "") { alert("请选择要上传的文件"); return; }
            console.log("test");
           // console.log($('#file-2'));
            var video = document.getElementById('file-3').files[0];
            var formdata = new FormData();
            formdata.append('formdata',video);
            $.ajax({
                type:'POST',
                url:'/uploadvideo',
                data:formdata,
                dataType:'json',
                async: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log(data.result);
                    // 获取二维码点形状
                    var shape = $('input:radio[name="shapeitem"]:checked').val();
                    // 获取容错率
                    var correctlevel = $('.shuju').text();
                    var number = Number(correctlevel);
                    // 获取大小
                    var size = $('.sizeinput').val();
                    size = size.substr(0, size.length - 2)
                    var original = 256;
                    if (parseInt(size) > 192 && parseInt(size) < 256) {
                        original = size;
                    }
                    var margin = (256 - original) / 2;
                    margin = margin + 'px';
                    original = original + 'px';
                    $('#imgqrcode').css('height', original);
                    $('#imgqrcode').css('width', original);
                    $('#imgqrcode').css('margin', margin);
                    // 获取颜色、内容
                    var colorlight = $('#colorlight').val();
                    var colordark = $('#colordark').val();

                    var content = data.result;
                    // 获取码眼颜色
                    var positionoutground = $('#positionoutground').val();
                    var positioninground = $('#positioninground').val();

                    var logo = $('#qrcode').qrcode({
                        shape: shape,
                        text: utf16to8(content),
                        typeNumber: -1,
                        correctLevel: number,
                        background: colorlight,
                        foreground: colordark,
                        positionoutground: positionoutground,
                        positioninground: positioninground
                    }).hide();
                    // 给canvas动态添加ID
                    var icanvasimg = 'canvasimg' + i;
                    $('#qrcode canvas').eq(i).attr('id', icanvasimg);
                    var canvas = logo.find('canvas').get(i);
                    // canvas转成图片
                    var dataurl = canvas.toDataURL('image/jpg');
                    $('#imgqrcode').attr('src', dataurl);

                    // imgdownload  触发下载事件
                    var a = $('#imgdownload');
                    a.attr('href', dataurl);
                    a.click();
                    i++;
                    },
                error: function (data) {
                     //200的响应也有可能被认定为error，responseText中没有Message部分
                     console.log('error')}
            });
        });
    });
    // 上传图片--------end
    $('.dingzhi').addClass('active');
    // 获取file中的图片路径
    var file = $("#fileinp");
    file.change(function() {
        $("#logo").attr("src", getObjectURL(file[0].files[0]));
    });

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
    $(".solution-more-slide").slide({
        effect: 'fold'
    });
    // 容错率
    $('#home .dropdown-menu a').click(function() {
            var shuju = $(this).html();
            $('.shuju').text(shuju);
        })
    // 颜色选择
    $('#pickerlight').farbtastic('#colorlight');
    $('#pickerdark').farbtastic('#colordark');
    $('#colorlight').click(function() {
        // alert('colorlight');
        $('#pickerlight').show();
        $('#pickerdark').hide();
    });
    $('#colordark').click(function() {
        $('#pickerdark').show();
        $('#pickerlight').hide();
    });
    // 码眼颜色选择
    $('#pickerin').farbtastic('#positioninground');
    $('#pickerout').farbtastic('#positionoutground');
    $('#positionoutground').click(function() {
        // alert('colorlight');
        $('#pickerout').show();
        $('#pickerin').hide();
    });
    $('#positioninground').click(function() {
        $('#pickerin').show();
        $('#pickerout').hide();
    });
    // 上传logo
    $("#fileinp").change(function() {
            $("#logotext").html($("#fileinp").val());
        })
    // 二维码样式设置标签页
    $('#myTabs a').click(function(e) {
        e.preventDefault()
        $(this).tab('show')
    })

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
    var i = 0;
    // 文本、链接生成二维码
    $('.textcreate').click(function() {
        // 获取二维码点形状
        var shape = $('input:radio[name="shapeitem"]:checked').val();
        // 获取容错率
        var correctlevel = $('.shuju').text();
        var number = Number(correctlevel);
        // 获取大小
        var size = $('.sizeinput').val();
        size = size.substr(0, size.length - 2)
        var original = 256;
        if (parseInt(size)>192&&parseInt(size)<256) {
        	original = size;
        }
        var margin = (256-original)/2;
        margin = margin+'px';
        original = original+'px';
        $('#imgqrcode').css('height',original);
        $('#imgqrcode').css('width',original);
        $('#imgqrcode').css('margin',margin);
        // 获取颜色、内容
        var colorlight = $('#colorlight').val();
        var colordark = $('#colordark').val();
        var content = $(this).prev().val();
        // 获取码眼颜色
        var positionoutground = $('#positionoutground').val();
        var positioninground = $('#positioninground').val();

        var logo = $('#qrcode').qrcode({
            shape: shape,
            text: utf16to8(content),
            typeNumber: -1,
            correctLevel: number,
            background: colorlight,
            foreground: colordark,
            positionoutground: positionoutground,
            positioninground: positioninground
        }).hide();
        // 给canvas动态添加ID
        var icanvasimg = 'canvasimg' + i;
        $('#qrcode canvas').eq(i).attr('id', icanvasimg);
        var canvas = logo.find('canvas').get(i);
        // canvas转成图片
        var dataurl = canvas.toDataURL('image/jpg');
        $('#imgqrcode').attr('src', dataurl);
        
        // imgdownload  触发下载事件
        var a = $('#imgdownload');
        a.attr('href', dataurl);
        a.click();
        i++;
    });
    
    // 名片输入框样式
    if (!String.prototype.trim) {
        (function() {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function() {
                return this.replace(rtrim, '');
            };
        })();
    }
    [].slice.call(document.querySelectorAll('input.input__field')).forEach(function(inputEl) {
        // in case the input is already filled..
        if (inputEl.value.trim() !== '') {
            classie.add(inputEl.parentNode, 'input--filled');
        }
        // events:
        inputEl.addEventListener('focus', onInputFocus);
        inputEl.addEventListener('blur', onInputBlur);
    });

    function onInputFocus(ev) {
        classie.add(ev.target.parentNode, 'input--filled');
    }

    function onInputBlur(ev) {
        if (ev.target.value.trim() === '') {
            classie.remove(ev.target.parentNode, 'input--filled');
        }
    }
    // 名片內容获取、生成二维码
    $('.vcard').click(function() {
        // 获取二维码点形状
        var shape = $('input:radio[name="shapeitem"]:checked').val();
        // 获取容错率
        var correctlevel = $('.shuju').text();
        var number = Number(correctlevel);
        // 获取大小
        var size = $('.sizeinput').val();
        size = size.substr(0, size.length - 2)
        var original = 256;
        if (parseInt(size)>192&&parseInt(size)<256) {
        	original = size;
        }
        var margin = (256-original)/2;
        margin = margin+'px';
        original = original+'px';
        $('#imgqrcode').css('height',original);
        $('#imgqrcode').css('width',original);
        $('#imgqrcode').css('margin',margin);
        // 获取颜色、内容
        var colorlight = $('#colorlight').val();
        var colordark = $('#colordark').val();       

        var familyname = $('.familyname').parent().prev().val();
        var firstname = $('.firstname').parent().prev().val();
        var occupation = $('.occupation').parent().prev().val();
        var address = $('.address').parent().prev().val();
        var telephone = $('.telephone').parent().prev().val();
        var call = $('.call').parent().prev().val();
        var net = $('.url').parent().prev().val();
        var mail = $('.mail').parent().prev().val();
        var vcardContent = "BEGIN:VCARD\nN:" + familyname + ";\n" + firstname + ";;;\nFN: " + firstname + " \nTITLE:" + occupation + "\nADR;WORK:;;" + address + ";;;;\nTEL;CELL,VOICE:" + telephone + "\nTEL;WORK,VOICE:" + call + "\nURL;WORK:" + net + "\nEMAIL;INTERNET,HOME:" + mail + "\nEND:VCARD";
        // 获取码眼颜色
        var positionoutground = $('#positionoutground').val();
        var positioninground = $('#positioninground').val();

        var logo = $('#qrcode').qrcode({
            shape: shape,
            text: utf16to8(vcardContent),
            typeNumber: -1,
            correctLevel: number,
            background: colorlight,
            foreground: colordark,
            positionoutground: positionoutground,
            positioninground: positioninground
        }).hide();
        // 给canvas动态添加ID
        var icanvasimg = 'canvasimg' + i;
        $('#qrcode canvas').eq(i).attr('id', icanvasimg);
        var canvas = logo.find('canvas').get(i);
        // canvas转成图片
        var dataurl = canvas.toDataURL('image/jpg');
        $('#imgqrcode').attr('src', dataurl);
        
        // imgdownload  触发下载事件
        var a = $('#imgdownload');
        a.attr('href', dataurl);
        a.click();
        i++;
    });
    // 按钮滑动调节大小-------------start
    $('.audio-setbacks').hide();
    $('#sizebtn').click(function(){
    	$('.audio-setbacks').toggle();
    });
    var box = document.querySelector('.audio-backs-btn');
    var body = document.querySelector('body');
    var index = 0;
    var x1, y1;
    $('.audio-setbacks').click(function(){
    	var e = event || window.event;
    	var y = e.screenY;

    });
    box.onmousedown = function(e) {
        index = 1;
        var y = e.clientY;
        // alert(y);
        var left = this.style.left;
        left = left.substr(0, left.length - 2);  //去掉px
        var top = this.style.top;
        top = top.substr(0, top.length - 2);
        x1 = 986;
        y1 = parseInt(y - top);
    };
    box.onmousemove = function(e) {
        if (index == 1) {
            this.style.left = 977 - x1 + 'px';
            this.style.top = e.clientY - y1 + 'px';
            // if (this.style.left.substr(0, this.style.left.length - 2) < 0) {
            //     this.style.left = 0;
            // };
            if (this.style.top.substr(0, this.style.top.length - 2) < 0) {
                this.style.top = 0;
            };
            if (this.style.top.substr(0, this.style.top.length - 2) > 80) {
                this.style.top = '80px';
            };
            // if (this.style.left.substr(0, this.style.left.length - 2) > 350) {
            //     this.style.left = '350px';
            // };
        }
    };
    box.onmouseup = function(e) {
        index = 0;
        var top = this.style.top;
        top = top.substr(0, top.length - 2);
        var size = 0;
        size = parseInt(256-parseInt(top)/80*(256-192));
        size = size+'px';
        if ($('.audio-setbacks').is(':visible')) {
        	$('.sizeinput').val(size);
        }
    };
    body.onmouseup = function(e) {
        box.onmouseup(); //类似可以index=0;
    }
    // 按钮滑动调节大小-------------end
})();