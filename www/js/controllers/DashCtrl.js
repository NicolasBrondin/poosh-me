app.controller('DashCtrl', function($scope,$rootScope,$cordovaSms,$ionicPlatform,storage,$timeout,$interval,$cordovaGeolocation,$location) {
    $scope.state = 'idle';
    $scope.init = function()
    {
        $rootScope.contacts = storage.getContacts();
        console.log($rootScope.contacts);
    }();
    
    $scope.reset = function()
    {
        $scope.state = 'idle';
        $interval.cancel($scope.pendingTimer);
    };
    
    $scope.countdown = function()
    {
        $scope.pendingTime--;
    };
    
    $scope.prepareAlert = function()
    {
        if($rootScope.contacts.length==0)
        {
            $location.path('/settings');
        }
        else
        {
            $scope.state='pending';
            $scope.pendingTime = 3;
            $scope.pendingTimer = $interval($scope.countdown,1000);
            $scope.timer = $timeout($scope.sendAlert,3000);
        }
    };
    
    $scope.cancelAlert = function()
    {
        $scope.state = 'idle';
        $interval.cancel($scope.pendingTimer);
        $scope.pendingTime = 3;
        $timeout.cancel($scope.timer);
    };
    
    $scope.call = function()
    {
        var number = $rootScope.contacts.find(function(item,index,array){return item.key=="call";});
        if(number)
        {    
            window.plugins.CallNumber.callNumber(function(){}, function(error){console.error(error);}, number, true);
        }
    };
    
    $scope.sendAlert = function()
    {
        $scope.prepareMessage();
        $scope.state = 'success';
        $interval.cancel($scope.pendingTimer);
        $scope.pendingTime = 3;
    };
    
    $scope.prepareMessage = function()
    {
        $cordovaGeolocation.getCurrentPosition().then(function (position) {
            $scope.location = {lat : position.coords.latitude, long :  position.coords.longitude};
            
            $scope.alertMessage =  "ALERTE URGENCE\n\n"
            $scope.alertMessage += "J'ai un problème, besoin d'aide rapidement, voilà ma position GPS:\n\n"
            $scope.alertMessage += $scope.location.lat+", "+$scope.location.long+"\n\n";
            $scope.alertMessage += "Ceci est un message automatique Poosh Me";
            
            $scope.sendSMS();
            $scope.call();
        }, function(err) {
            console.error(err);
        });
        
    };  
    
    $scope.sendSMS = function()
    {
        $ionicPlatform.ready(function() {
            $rootScope.contacts.forEach(function(item, index, array){
                if(item.key=="sms")
                {
                    console.log("Sending SMS to "+item.value+"...");
                    $cordovaSms.send(item.value, $scope.alertMessage, {})
                    .then(function() {
                        console.log("SMS successfully sent to "+item.value+"!");
                    }, function(error) {
                        console.error(error);
                    });
                }
            });
        });
    };
    

});