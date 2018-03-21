/**
 * Created by Administrator on 2018/1/6.
 */
(function(){
    angular.module('app.service',[])
        .constant('ROOT_URL','http://192.168.12.100/librarywebapi/')
        .service('bookCacheService',function($window){
            //本地存储 localStorage
            this.set = function(key,value){
                $window.localStorage.setItem(key,JSON.stringify(value));
            };
            this.get = function(key){
                var value=JSON.parse($window.localStorage.getItem(key));
                if(value){
                    return value
                }
                return null;
            };
            this.cancel = function(key){
                var value=$window.localStorage.getItem(key);
                if(value){
                    $window.localStorage.removeItem(key);
                    return true;
                }
                return false;
            };
            //本地会话存储
            this.setSession = function(key,value){
                $window.sessionStorage.setItem(key,JSON.stringify(value));
            };
            this.getSession = function(key){
                var value=JSON.parse($window.sessionStorage.getItem(key));
                if(value){
                    return value
                }
                return null;
            };
            this.cancelSession = function(key){
                var value=$window.sessionStorage.getItem(key);
                if(value){
                    $window.sessionStorage.removeItem(key);
                    return true;
                }
                return false;
            }
        })
        .service('dataService',function($http,ROOT_URL){
            //广告
            this.getAdvertising = function(){
                return $http.get(ROOT_URL+'advert/list');
            };
            //主页栏目数据
            this.getHomeList = function(){
                return $http.get(ROOT_URL+'section/list');
            };

            //图书详情数据
            this.getBookDetails = function(isbn){
                return $http.get(ROOT_URL+'book/list',{
                    params:{
                        keyword:isbn
                    }
                });
            };

            //分类数据
            this.getCategroy = function(){
                return $http.get(ROOT_URL+'category/list');
            };

            //图书列表数据 ISBN
            this.getBookList = function(id){
                return $http.get(ROOT_URL+'book/list',{
                    params:{
                        categoryId:id
                    }
                });
            };
            //图书名称
            this.getBookListName = function(id){
                return $http.get(ROOT_URL+'book/list',{
                    params:{
                        keyword:id
                    }
                });
            };
        })
        .service('userService',function($http,ROOT_URL,$window){

            //创建用户历史记录
            this.createUser = function(txt){
                $window.localStorage.setItem('user',JSON.stringify(txt));
            };

            //注销用户信息
            this.clearUser = function(){
                $window.localStorage.removeItem('user');
            };

            //用户登录
            this.userLogin = function(phone,password){
                return $http({
                    url:ROOT_URL+'member/login',
                    method:'POST',
                    data:{
                        phone:phone,
                        password:password
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                });
            };

            //用户获取验证码
            this.getCard = function(phone){
                return $http.get(ROOT_URL+'member/SendCodeForReset',{
                    params:{
                        phone:phone
                    }
                });
            };

            //用户验证手机号与验证码
            this.VerifyCode = function(phone,code){
                return $http({
                    url:ROOT_URL+'member/VerifyCodeForReset',
                    method:'POST',
                    data:{
                        phone:phone,
                        code:code
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                });
            };

            //用户修改密码
            this.amendPassword = function(id,password){
                return $http({
                    url:ROOT_URL+'member/reset',
                    method:'POST',
                    data:{
                        id:id,
                        password:password
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                });
            }
        })
        .service('historyService',function(){
            //创建查询历史记录
            this.createHistory = function(txt){
                var isEqual=false;

                var history=[];
                if(localStorage.getItem('history')!=null){
                    history=JSON.parse(localStorage.getItem('history'));
                }
                for(var i=0;i<history.length;i++){
                    if(history[0]==txt)
                    {
                        isEqual=true;
                        break;
                    }
                }
                if(!isEqual){
                    history.push(txt);

                    localStorage.setItem('history',JSON.stringify(history));
                }
            };

            //清除查询历史记录
            this.clearHistory = function(){
                var clear=[];
                localStorage.setItem('history',JSON.stringify(clear));
            };

        })
        .service('bookCaseService',function($http,ROOT_URL){
            //借书架----加入借书架
            this.joinBookCase = function(readerId,bookId){
                return $http.get(ROOT_URL+'Transaction/AddBookShelf',{
                    params:{
                        readerId:readerId,
                        bookId:bookId
                    }
                });
            };

            //我的借书架
            this.bookCase = function(readerId){
                return $http.get(ROOT_URL+'Transaction/GetMyShelf',{
                    params:{
                        readerId:readerId
                    }
                });
            };
            //移除借书架的图书
            this.CancelBookCase = function(readerId,bookId){
                return $http.get(ROOT_URL+'Transaction/RemoveBookFromShelf',{
                    params:{
                        readerId:readerId,
                        bookId:bookId
                    }
                });
            };
            //移除借书架所有图书
            this.cancelAllerBook = function(readerId){
                return $http.get(ROOT_URL+'Transaction/RemoveMyShelf',{
                    params:{
                        readerId:readerId
                    }
                });
            };
            //提交订单，实现借阅
            this.sumbitOrder = function(id){
                return $http({
                    url:ROOT_URL+'Transaction/SubmitOrder',
                    method:'POST',
                    data:{
                        readerId:id
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                });
            };
            //查询读者所有借阅记录
            this.queryBorrow = function(readerId){
                return $http.get(ROOT_URL+'Transaction/GetBorrowRecords',{
                    params:{
                        readerId:readerId
                    }
                });
            };
            //取消借阅
            this.cancelOrder = function(orderId,readerId){
                return $http({
                    url:ROOT_URL+'Transaction/CancelOrder',
                    method:'POST',
                    data:{
                        orderId:orderId,
                        readerId:readerId
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                });
            };
            //确认收货
            this.affirmOrder = function(orderId,readerId){
                return $http({
                    url:ROOT_URL+'Transaction/ConfirmOrder',
                    method:'POST',
                    data:{
                        orderId:orderId,
                        readerId:readerId
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                });
            };
        });

}());