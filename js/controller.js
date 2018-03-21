/**
 * Created by Administrator on 2018/1/8.
 */
(function(){
    angular.module('app.controller',[])
        .controller('homeController',function($scope,dataService,$rootScope,$interval,$location,$timeout){
            $rootScope.backPlace='';
            $scope.loadSuccess=false;
            //广告
            dataService.getAdvertising().then(function(response){
                if(response.data.Code == 100){
                    $scope.advertImg=response.data.Data;
                }
            });
            $scope.imgSrc = 'http://192.168.12.100/LibraryWebapi/images/11c5e122-f47a-11e7-84b2-54e1adda4205.jpg';
           var index=1;
            var time=$interval(function(){
                if(index>3){
                    index=0;
                }
               $scope.imgSrc =  $scope.advertImg[index].Image;
                index++;
            },2500);
            time.then(function(){
                $interval.cancel(time);
            });

           //首页栏目
            $scope.listIndex=0;

            dataService.getHomeList().then(function(response){
                if(response.data.Code == 100){
                   data=response.data.Data;
                    //栏目
                    $scope.column=data;

                    var time=$timeout(function(){
                        $scope.loadSuccess=true;
                        $timeout.cancel(time);
                    },1000);
                    //对应栏目数据
                    $scope.list=data[$scope.listIndex].Books;
                }
            });
            $scope.showHomeList = function(index){
                $scope.listIndex=index;
                $scope.list=data[$scope.listIndex].Books;
            };

            $scope.goSearch = function(){
                $location.url('/search');
            }
        })
        .controller('searchController',function($scope,$location,historyService,bookCacheService){
                $scope.historyList=bookCacheService.get('history');
                $scope.goHome = function(){
                    $location.url('/home');
                };

                $scope.searchBook = function(){

                    if($scope.txtSearch){
                        historyService.createHistory($scope.txtSearch);

                        var strlUrl='/booksList/'+$scope.txtSearch+'/1';
                        $location.url(strlUrl);
                    }
                };

                $scope.searchHistory = function(item){
                    var strlUrl='/booksList/'+item+'/1';
                    $location.url(strlUrl);
                };

                $scope.clearSearch = function(){
                    $scope.historyList=[];
                    historyService.clearHistory();
                }

        })
        .controller('listController',function($scope,$location,dataService){
            dataService.getCategroy().then(function(response){
                if(response.data.Code == 100){
                    $scope.categoryList=response.data.Data;
                    for(var i=0;i<$scope.categoryList.length;i++){
                        $scope.categoryList[i].Image='images/'+(i+1)+'.png';
                    }
                }
            });
            $scope.goBookList = function(id){
                var strUrl='/booksList/'+id+'/0';
                $location.url(strUrl);
            }

        })
        .controller('cartController',function($scope,$location){

        })
        .controller('mineController',function($scope,$location,$rootScope,bookCacheService){
            $scope.user='尚未登录';
            $scope.userImg='images/nologin.jpg';
            var user=bookCacheService.get('user');
            $rootScope.userName=user;

            if($rootScope.userName){
                //登录成功时
                $scope.user=$rootScope.userName.Name;
                $scope.userImg='images/header1.jpg'
            }

            $scope.goLogin = function(){
                if(!$rootScope.userName){
                    $location.url('/login');
                }
                else{
                    //个人管理页面
                    $location.url('/personal');
                }
            };
            $scope.showBookcase = function(){
                if(!$rootScope.userName){
                    $location.url('/login');
                }
                else{
                    //我的借书架
                    $location.url('/bookCase');
                }
            };

            $scope.myBorrow = function(){
                if(!$rootScope.userName){
                    $location.url('/login');
                }
                else{
                    //我的借阅
                    $location.url('/myBorrow');
                }
            };

            $scope.address = function(){
                if(!$rootScope.userName){
                    $location.url('/login');
                }
                else{
                    //我的地址

                }
            };


        })
        .controller('loginController',function($scope,$location,$rootScope,userService,$window){

            $scope.account={
                username:'',
                password:''
            };

            $scope.login = function(){

                //登录
                userService.userLogin($scope.account.username,$scope.account.password).then(function(response){
                    if(response.data.Code == 100){
                        $rootScope.userName=response.data.Data;
                        userService.createUser(response.data.Data);
                        $location.url('/mine');
                    }
                })
            };

            $scope.loginBack = function(){
                $window.history.back();
            };
            $scope.verification = function(){
                $location.url('/verification');
            }

        })
        .controller('booksController',function($scope,$location,$rootScope,$routeParams,dataService,$timeout){
            var id=$routeParams.id;
            var key=$routeParams.key;
            var temp=[];
            $scope.loadState={
                isLoad:true,
                loading:false,
                title:'点击加载更多'
            };
            $scope.page={
                index:1,
                size:5,
                total:0
            };

            $scope.loadImage = function(src){
                var self=event.target;
                var time=$timeout(function(){
                    if(self.src != src){
                        self.src = src;
                    }
                    $timeout.cancel(time);
                },1600)
            };

            //加载更多
            $scope.loadMore = function(){
                if($scope.page.index<$scope.page.total){
                    $scope.loadState.isLoad=false;
                    $scope.loadState.loading=true;
                    var time=$timeout(function(){
                        $scope.page.index++;
                        $scope.loadState.loading=false;
                        var item=temp.slice(( $scope.page.index - 1) * $scope.page.size , $scope.page.index * $scope.page.size);
                        for(var i=0;i<item.length;i++){
                            $scope.bookList.push(item[i]);
                        }
                        $scope.loadState.isLoad=true;
                        $timeout.cancel(time);
                    },1500)
                }
                else{
                    $scope.loadState.title='已经全部加载了.'
                }
            };

            $rootScope.backPlace='/booksList/'+id+'/'+key;
            $scope.goList = function(){
                if(key==0){
                    $location.url('/list');
                }
                else
                    $location.url('/search');
            };

            $scope.moment=false;
            //图书列表
            if(key==0){
                dataService.getBookList(id).then(function(response){
                    if(response.status==200&&response.data.Code == 100){
                        if(response.data.Data.length!=0){
                            temp=response.data.Data;
                            //总页码
                            $scope.bookList=temp.slice(( $scope.page.index - 1) * $scope.page.size , $scope.page.index * $scope.page.size);
                            $scope.page.total=parseInt(Math.ceil(temp.length/$scope.page.size));

                            if($scope.page.total>1){
                                //显示可加载更多
                            }
                        }
                        else{
                            $scope.moment=true;
                        }
                    }
                })
            }
            else{
                dataService.getBookListName(id).then(function(response){
                    if(response.status==200&&response.data.Code == 100){
                        $scope.bookList=response.data.Data;
                        if($scope.bookList.length==0){
                            $scope.moment=true;
                        }
                    }
                });
            }

            $scope.goDetails = function(item){
                var strUrl='/details/'+item.ISBN;
                $location.url(strUrl);
            }

        })
        .controller('detailsController',function($scope,$window,$rootScope,$location,dataService,$routeParams,bookCaseService){
            var isbn=$routeParams.isbn;
            var user=JSON.parse(localStorage.getItem('user'));
            $scope.isShow=false;
            dataService.getBookDetails(isbn).then(function(response){
                if(response.status==200&&response.data.Code == 100){
                    $scope.book=response.data.Data[0].Book;
                    $scope.num=response.data.Data[0].Number;
                }
            });

            $scope.goHome = function(){
                $window.history.back();
            };
            $scope.goBookcase = function(){
                if(user){
                    $location.url('/bookCase');
                }
                else{
                    $location.url('/login');
                }
            };
            $scope.jionCase = function(){
                if(user){
                    if($scope.num!=0){
                        bookCaseService.joinBookCase(user.Id,$scope.book.Id).then(function(response){
                            if(response.data.Code = 100){
                                $location.url('/bookCase');
                            }
                        });
                    }
                    else{
                        //没有库存了
                        $scope.isShow=true;
                    }
                }
                else{
                    $location.url('/login');
                }
            };
        })
        .controller('bookCaseController',function($scope,$window,$rootScope,$timeout,$location,bookCaseService,bookCacheService){
            //我的借阅架
            $scope.count=0;
            $scope.single={
                cancel:false,
                item:'',
                index:'',
                name:''
            };
            $scope.checkData={
                checkSingle:[],
                checkTotal:false
            };
            $scope.goMine = function(){
                $window.history.back();
            };

            var books=bookCacheService.get('bookCase');
            if(books){
                $scope.bookCase=books;
            }
            //获取借书架
            var user=bookCacheService.get('user');
            bookCaseService.bookCase(user.Id).then(function(response){
                if(response.data.Code=100){
                    bookCacheService.set('bookCase',response.data.Data);
                    $scope.bookCase=response.data.Data;
                }
            });

            //全选
            $scope.checkAllers = function(){
                $scope.checkData.checkTotal=!$scope.checkData.checkTotal;
                $scope.count=$scope.checkData.checkTotal?$scope.bookCase.length:0;
            };
            $scope.check = function(index,e){
                //单选项改变

                var selectIndex=$scope.checkData.checkSingle.indexOf(index);
                if(selectIndex!=-1){
                    if($scope.count==0){
                        return;
                    }
                    $scope.checkData.checkSingle.splice(selectIndex,1);
                    $scope.count--;
                    e.target.className='fa fa-check-circle-o';
                }
                else{
                    $scope.count++;
                    $scope.checkData.checkSingle.push(index);
                    e.target.className='fa fa-check-circle-o checkActive';
                }
            };

            //清除单选图书
            $scope.cancelSingleBook = function(item,index){
                $scope.single={
                    cancel:true,
                    item:item,
                    index:index,
                    name:item.Name
                };
            };
            $scope.affirmBook = function(){
                bookCaseService.CancelBookCase(user.Id,$scope.single.item.Id).then(function(response){
                    if(response.data.Code = 100){
                        $scope.single.cancel=false;
                        $scope.bookCase.splice($scope.single.index,1);
                        bookCacheService.set('bookCase',$scope.bookCase);
                    }
                });
            };
            $scope.cancelBook = function(){
                $scope.single.cancel=false;
            };

            //清除借书架
            $scope.alles = function(){
                bookCaseService.cancelAllerBook(user.Id).then(function(response){
                    if(response.data.Code = 100){
                        bookCacheService.cancel('bookCase');
                        $scope.bookCase=null;
                    }
                });
            };
            //提交订单，实现借阅
            $scope.sumbit =function(){
                if($scope.bookCase){
                    bookCaseService.sumbitOrder(user.Id).then(function(response){
                        if(response.data.Code = 100){
                            $location.url('/myBorrow?readerId'+user.Id);
                        }
                    });
                }
            };

            $scope.goDetails = function(name){
                $location.url('/details/'+name);
            };
        })
        .controller('myBorrowController',function($scope,$rootScope,$location,bookCaseService,bookCacheService){

            //我的借阅
            $scope.isShow=true;
            $scope.bookRecord=[];
            $scope.loadSuccess=false;
            $scope.abolish={
                cancel:false,
                name:''
            };

            $scope.goMine = function(){
                $location.url('/mine');
            };

            $scope.listIndex=0;

            //对象数组排序要用到的比较函数
            function compare(property){
                return function(a,b){
                    var value1=a[property];
                    var value2=b[property];
                    return value2-value1; //降序
                }
            }
            $scope.showBorrow = function(index){
                if($scope.listIndex==index){
                    return;
                }
                $scope.listIndex=index;
                if(index==0){
                    //当前借阅
                    $scope.isShow=true;
                }
                else{
                    //借阅历史
                    $scope.isShow=false;
                    $scope.bookRecord=bookCacheService.get('borrowHistory');
                }
            };
            var user=bookCacheService.get('user');
            getBookCase();
            //获取借阅记录
            function getBookCase(){
                //清除借阅
                bookCacheService.cancel('borrowHistory');

                bookCaseService.queryBorrow(user.Id).then(function(response){
                    if(response.status == 200&&response.data.Code == 100){
                        $scope.loadSuccess=true;
                        $scope.bookCase=response.data.Data.sort(compare('State'));

                        //遍历已归还图书
                        var newBookCase=[];
                        for(var i=0;i<$scope.bookCase.length;i++){
                            if($scope.bookCase[i].State == 4){
                                var history=[];
                                if(bookCacheService.get('borrowHistory')!=null){
                                    history=bookCacheService.get('borrowHistory');
                                }
                                history.push($scope.bookCase[i]);

                                bookCacheService.set('borrowHistory',history);
                            }
                            else{
                                newBookCase.push($scope.bookCase[i]);
                            }
                        }
                        $scope.bookCase=angular.copy(newBookCase);
                    }
                });
            }

            //借阅历史 -->图书详情
            $scope.goDetails = function(item){
                $location.url('/details/'+item.BookName);
            };

            //借阅订单状态
            $scope.state = function(state){
                if(state==0){
                    $scope.cancel=false;
                    $scope.affirm=false;
                    return '已取消';
                }
                else if(state==1){
                    $scope.cancel=true;
                    $scope.affirm=false;
                    return '待配送';
                }
                else if(state==2){
                    $scope.cancel=false;
                    $scope.affirm=true;
                    return '待确认';
                }
                else if(state==3){
                    $scope.cancel=false;
                    $scope.affirm=false;
                    return '借阅中';
                }
                else{
                    $scope.cancel=false;
                    $scope.affirm=false;
                    return '已归还';
                }
            };


            //取消订单
            $scope.cancelOrder = function(orderId,name){
                $scope.abolish.cancel=true;
                $scope.abolish.name=name;
                $scope.orderId=orderId;
            };
            $scope.affirmIndent = function(){
                $scope.abolish.cancel=false;
                bookCaseService.cancelOrder($scope.orderId,user.Id).then(function(response){
                    if(response.status = 200&&response.data.Code ==100){
                        getBookCase();
                    }
                });
            };
            $scope.cancelIndent = function(){
                $scope.abolish.cancel=false;
            };
            //确认收货
            $scope.affirmOrder = function(orderId){
                bookCaseService.affirmOrder(orderId,user.Id).then(function(response){
                    if(response.status = 200&&response.data.Code ==100){
                        getBookCase();
                    }
                });
            };

            $scope.goState = function(item){
                $location.url('/state?state='+item.State+'&name='+item.BookName);
            };
        })
        .controller('personalController',function($scope,$rootScope,$location,userService,bookCacheService){
            //个人管理
            $scope.goMine = function(){
                $location.url('/mine');
            };
            $scope.loginout = function(){
                //注销
                userService.clearUser();
                $rootScope.userName='';
                $location.url('/mine');
            };

            $scope.user = bookCacheService.get('user');

        })
        .controller('verificationController',function($scope,$rootScope,bookCacheService,$location,userService,$interval,$window){
            $scope.wait = function(){
                $scope.cardTime=true;

                var time=$interval(function(){
                    bookCacheService.setSession('codeTime',$scope.i);
                    $scope.cardContent='等待'+$scope.i+'s';
                    $scope.i--;
                    if($scope.i<=0){
                        $scope.cardContent='获取验证码';
                        $scope.cardTime=false;
                        $interval.cancel(time);
                        bookCacheService.cancelSession('codeTime');
                        return;
                    }
                },1000);
            };

            $scope.i=90;
            $scope.cardTime=true;
            var codeTime=bookCacheService.getSession('codeTime');
            if(codeTime){
                $scope.cardContent='短信已发送';
                $scope.i=codeTime;

                $scope.wait();
            }
            else{
                $scope.cardContent='获取验证码';
            }


            //重置密码
            $scope.account={
                username:'',
                code:''
            };

            $scope.goLogin = function(){
                $window.history.back();
            };

            //获取验证码
            $scope.getCard = function(){
                if($scope.account.username){
                    userService.getCard($scope.account.username).then(function(response){
                        if(response.data.Code = 100){
                            $scope.wait();
                        }
                    });
                }

            };

            //下一步
            $scope.goNext = function(){
                if($scope.account.username&&$scope.account.code){
                    userService.VerifyCode($scope.account.username,$scope.account.code).then(function(response){
                       console.log(response);
                        if(response.data.Code = 100){
                            $location.url('/amend?id='+response.data.Data.Id);
                        }
                    });
                }
            }

        })
        .controller('amendController',function($scope,$rootScope,$location,userService,$routeParams){
            var id=$routeParams.id;
            $scope.account={
                username:''
            };
            //修改密码
            $scope.goVerification = function(){
                $location.url('/verification');
            };

            $scope.sumbit = function(){
                if($scope.account.username){
                    userService.amendPassword(id,$scope.account.username).then(function(response){
                        if(response.data.Code = 100){
                            $location.url('/login');
                        }
                    });
                }
            }
        })
        .controller('stateController',function($scope,$rootScope,$location,$routeParams,dataService){
            $scope.goMyBoorow = function(){
                $location.url('/myBorrow');
            };
            $scope.name=$routeParams.name;
            var state=$routeParams.state;
            $scope.state = function(){
                if(state==0){
                    return '已取消订单';
                }
                else if(state==1){
                    return '已提交订单';
                }
                else if(state==2){
                    return '图书已配送';
                }
                else if(state==3){
                    return '图书已签收';
                }
                else{
                    return '图书已归还';
                }
            };

            dataService.getBookDetails($scope.name).then(function(response){
                if(response.status==200&&response.data.Code == 100){
                    $scope.book=response.data.Data[0].Book;
                    console.log($scope.book);
                }
            });
            $scope.goDetails = function(name){
                var strUrl='/details/'+name;
                $location.url(strUrl);
            }
        });

}());