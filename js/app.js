/**
 * Created by Administrator on 2018/1/6.
 * http://192.168.12.100/AngularDoc/
 */
(function(){
    angular.module('app',['ngRoute','app.controller','app.directive','app.service'])
        .config(function($routeProvider,$locationProvider){
            $locationProvider.hashPrefix('');

            $routeProvider
                .when('/home',{
                    templateUrl:'view/home.html',
                    controller:'homeController'
                })
                .when('/list',{
                    templateUrl:'view/list.html',
                    controller:'listController'
                })
                .when('/cart',{
                    templateUrl:'view/cart.html',
                    controller:'cartController'
                })
                .when('/mine',{
                    templateUrl:'view/mine.html',
                    controller:'mineController'
                })
                .when('/login',{
                    templateUrl:'view/login.html',
                    controller:'loginController'
                })
                .when('/booksList/:id/:key',{
                    templateUrl:'view/booksList.html',
                    controller:'booksController'
                })
                .when('/details/:isbn',{
                    templateUrl:'view/details.html',
                    controller:'detailsController'
                })
                .when('/search',{
                    templateUrl:'view/search.html',
                    controller:'searchController'
                })
                .when('/bookCase',{
                    templateUrl:'view/bookCase.html',
                    controller:'bookCaseController'
                })
                .when('/myBorrow',{
                    templateUrl:'view/myBorrow.html',
                    controller:'myBorrowController'
                })
                .when('/personal',{
                    templateUrl:'view/personal.html',
                    controller:'personalController'
                })
                .when('/verification',{
                    templateUrl:'view/verification.html',
                    controller:'verificationController'
                })
                .when('/amend',{
                    templateUrl:'view/amend.html',
                    controller:'amendController'
                })
                .when('/state',{
                    templateUrl:'view/state.html',
                    controller:'stateController'
                })
                .when('/splash',{
                    templateUrl:'view/state.html',
                    controller:'stateController'
                })
                .otherwise({redirectTo:'/home'});
        });

    //图片懒加载
    //var images = document.querySelectorAll('img[data-src]');
    //
    //images.forEach(function(item){
    //    item.onload = function(e){
    //        var source = this.getAttribute('data-src');
    //        console.log(this.src + ':' + source);
    //        if(this.src != source){
    //            this.src = source;
    //        }
    //    }
    //});
}());