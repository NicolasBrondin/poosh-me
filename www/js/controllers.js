angular.module('secureme.controllers', [])

.controller('DashCtrl', function($scope,$rootScope,$cordovaSms,$ionicPlatform,storage,$timeout,$interval,$cordovaGeolocation,$location) {
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
    
    
})

.controller('SettingsCtrl', function($scope,$rootScope,$cordovaSms,$ionicPlatform,storage,$timeout) {
     $scope.newContact = {key:'sms'};
     $rootScope.contacts=storage.getContacts();

    $scope.toDeleteCallback = function(id)
    {
         if($rootScope.contacts[id])
         {
             $rootScope.contacts[id].delete = false;
         }
    };

    $scope.toDelete = function(index)
     {
         $rootScope.contacts[index].delete = true;
         $rootScope.contacts[index].timer = $timeout($scope.toDeleteCallback,3000,true,index);
     };

     $scope.delete = function(index)
     {
         console.log(index);
         $timeout.cancel($scope.contacts[index].timer);
         $rootScope.contacts.splice(index,1);
         storage.setContacts($scope.contacts);
     };
    
    $scope.add = function()
    {
        if($rootScope.contacts.find(function(item,index,array){return item.key=="call";})&&$scope.newContact.key=="call")
        {
            
            $scope.error = "Vous ne pouvez appeler qu'un seul numéro à la fois";
            $timeout(function(){$scope.error=undefined;},3000);
        }
        else if($rootScope.contacts.find(function(item,index,array){return item.key==$scope.newContact.key&&item.value==$scope.newContact.value;}))
        {
            $scope.error = "Vous ne pouvez pas ajouter deux fois le même contact";
            $timeout(function(){$scope.error=undefined;},3000);
        }
        else if(!$scope.newContact.value)
        {
            $scope.error = "Ce contact est vide";
            $timeout(function(){$scope.error=undefined;},3000);
        }
        else
        {
            if($scope.newContact.key!="mail")
            {
                $scope.newContact.value = $scope.newContact.value.replace(/\s+/g, '').replace(/\.+/g, '').replace(/-+/g, '');
                
            }
            if($scope.newContact.key!="mail" && $scope.newContact.value.match(/^[+]?[0-9]+$/))
            {
                $rootScope.contacts.push($scope.newContact);
                $scope.newContact = {key:'sms'};
                console.log($scope.contacts);
                storage.setContacts($rootScope.contacts);
            }
            else
            {
                $scope.error = "Un numéro de téléphone ne doit comporter que des chiffres";
                $timeout(function(){$scope.error=undefined;},3000);
            }
        }
        
    };
})


