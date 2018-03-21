/**
 * Created by Administrator on 2017/12/25.
 */
(function($){
    var $dialogConfirmContent=$(' <div class="mc-dialog-bg">'
                            +' <div class="mc-dialog">'
                            +' <div class="mc-dialog-header">提示</div>'
                            +'<div class="mc-dialog-main">信息</div>'
                            +'<div class="mc-dialog-footer">'
                            +'<button id="mc-dialog-affirm">确认</button>'
                            +'<button id="mc-dialog-cancel">取消</button>'
                            +'</div>'
                            +'</div>'
                            +'</div>');

    var $dialogAlertContent=$(' <div class="mc-dialog-bg">'
        +' <div class="mc-dialog">'
        +' <div class="mc-dialog-header">提示</div>'
        +'<div class="mc-dialog-main">信息</div>'
        +'<div class="mc-dialog-footer">'
        +'<button id="mc-dialog-close">关闭</button>'
        +'</div>'
        +'</div>'
        +'</div>');

    /*function mcDialogEqual(options){
        var title='默认提示';
        var message='默认信息';

        if(options&&typeof(options)==='object'){
            if(options.title){
                title=options.title;
            }
            if(options.message){
                message=options.message;
            }
        }

        $('.mc-dialog-header').text(title);
        $('.mc-dialog-main').text(message);
    }*/

    function closeDialog(){
        $('.mc-dialog-bg').css('display','none');
        $('.mc-dialog-bg').remove();
    }

    $.mcDialog={
        //确认框
        confirm:function(options){
            var title='默认提示';
            var message='默认信息';

            if(options&&typeof(options)==='object'){
                if(options.title){
                    title=options.title;
                }
                if(options.message){
                    message=options.message;
                }
            }

            $dialogConfirmContent.appendTo('body');
            $('.mc-dialog-bg').css('display','block');
            $('.mc-dialog-header').text(title);
            $('.mc-dialog-main').text(message);

            //取消
            $('#mc-dialog-cancel').bind('click',function(e){
                if(options.afterCancel&&typeof(options.afterCancel)==='function'){
                    options.afterCancel();
                }
                closeDialog();
            });

            //确认
            $('#mc-dialog-affirm').bind('click',function(e){
                if(options.afterConfirm&&typeof(options.afterCancel)==='function'){
                    options.afterConfirm();
                }
                closeDialog();
            });
        },
        //对话框
        alert:function(options){
            var title='默认提示';
            var message='默认信息';

            if(options&&typeof(options)==='object'){
                if(options.title){
                    title=options.title;
                }
                if(options.message){
                    message=options.message;
                }
            }
            $dialogAlertContent.appendTo('body');
            $('.mc-dialog-header').text(title);
            $('.mc-dialog-main').text(message);
            $('.mc-dialog-bg').css('display','block');

            if(options.isAutoHide){
                var timer=window.setTimeout(function(){
                    closeDialog();

                    window.clearTimeout(timer);
                },3000);
            }

            $('#mc-dialog-close').bind('click',function(e){
                closeDialog();

                window.clearTimeout(timer);
            });
        }
    }

}(jQuery));