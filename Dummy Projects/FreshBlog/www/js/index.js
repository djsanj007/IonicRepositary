var FBApp= angular.module("FBApp",["ionic"]);

FBApp.service("FBSvc",["$http", "$rootScope", FBSvc]);

FBApp.controller("FBCtrl",
                 ["$scope","$sce",
                  "$ionicLoading","$ionicListDelegate","$ionicPlatform",
                  "FBSvc", FBCtrl]);


function FBCtrl($scope, $sce, $ionicLoading,$ionicListDelegate,$ionicPlatform FBSvc){
    
    $ionicLoading.show({template: '<ion-spinner icon="dots "/>'});
    
     $scope.deviceReady = false;
    
    $ionicPlatform.ready(function() {
        $scope.$apply(function() {
            $scope.deviceReady = true;
        });
    });
    
    $scope.blogs=[];
    $scope.params=[];
    $scope.$on("FBApp.Blogs" , function(_, result){
        result.posts.forEach(function(b){
            $scope.blogs.push({
                name: b.author.name,
                profilePic:b.author.avatar_URL,
                title:$sce.trustAsHtml(b.title),
                URL:b.URL,
                excerpt:$sce.trustAsHtml(b.excerpt)
            });
        });
        $scope.params.before = result.date_range.oldest;
        
        $scope.$broadcast("scroll.infiniteScrollComplete");
        $ionicLoading.hide();
    });
    
    $scope.shareBlog = function ($index){
        $ionicListDelegate.closeOptionButtons()
        console.log("ShareBlog URL: "+$scope.blogs[$index].URL);
    }
    
    $scope.reloadBlogs = function(){
        $scope.blogs=[];
        $scope.params=[];
        FBSvc.loadBlogs();
    }
    $scope.loadMoreBlogs = function(){
        FBSvc.loadBlogs($scope.params);
    }
}


function FBSvc($http, $rootScope){
    this.loadBlogs = function(params){
        $http.get("https://public-api.wordpress.com/rest/v1.1/freshly-pressed/",
                  {params:params})
            .success(
            function(result){
                $rootScope.$broadcast("FBApp.Blogs",result);
            });
        
}}
