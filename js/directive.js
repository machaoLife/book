/**
 * Created by Administrator on 2018/1/6.
 */
(function(){
    angular.module('app.directive',[])
        .directive('pageNav',function(){
            return {
                restrict:'EA',
                replace:true,
                templateUrl:'template/pageNav.html',
                scope:{
                    title:'@'
                },
                controller:function($scope,$location){
                    $scope.goJump = function(url){
                        $location.url(url);
                    }
                }
            }
        })
        .directive('homeList',function(){
            return {
                restrict:'EA',
                replace:true,
                templateUrl:'template/homeList.html',
                scope:{
                    list:'=',
                    index:'@'
                },
                controller:function($scope,$location){
                    $scope.goDetails = function(list){
                        var strUrl='/details/'+list.Book.ISBN;
                        $location.url(strUrl);
                    }
                }
            }
        })
        .directive('loadCache',function(){
            return {
                restrict:'EA',
                replace:true,
                templateUrl:'template/cache.html',
                scope:{
                    show:'='
                }
            }
        })
        .directive('cancelDialog',function(){
            return {
                restrict:'EA',
                replace:true,
                templateUrl:'template/cancelDialog.html',
                scope:{
                    show:'=',
                    affirm:'&',
                    cancel:'&'
                },
                controller:function($scope){
                    $scope.btnCancel = function(){
                        if($scope.cancel){
                            $scope.cancel();
                        }
                    };
                    $scope.btnAffirm = function(){
                        if($scope.affirm){
                            $scope.affirm();
                        }
                    }
                }
            }
        })
        .directive('autoDialog',function(){
            return {
                restrict:'EA',
                replace:true,
                templateUrl:'template/autoDialog.html',
                scope:{
                    content:'@',
                    show:'='
                },
                controller:function($scope){
                    $scope.alertCancel = function(){
                        $scope.show=false;
                    };

                }
            }
        })
        .directive('myBook',function(){
            return {
                restrict:'EA',
                replace:true,
                templateUrl:'template/book.html',
                scope:{
                    book:'=',
                    show:'=',
                    jion:'&',
                    goto:'&'
                },
                controller:function($scope){
                    $scope.joinCase=function(){
                        if($scope.jion){
                            $scope.jion();
                        }
                    };
                    $scope.goBookcase = function(){
                        if($scope.goto){
                            $scope.goto();
                        }
                    }
                }
            }
        })
        .directive('imageonload', function () {
            return {
                restrict: 'EA',
                replace: false,
                link: function ($scope, element, attrs) {
                    element.bind('load', function () {

                        $scope.$apply(attrs.imageonload);
                    });
                    angular.element(window).on('scroll', function() {
                        // 计算距离 切换img属性
                        console.log(this);
                    });
                }
            };
        });
}());