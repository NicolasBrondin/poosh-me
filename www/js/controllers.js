angular.module('secureme.controllers', [])

.controller('DashCtrl', function($scope,$cordovaSms,$ionicPlatform,storage,$timeout,$interval,$cordovaGeolocation) {
    
    $scope.init = function()
    {
        $scope.contacts = storage.getContacts();
        //console.log(window.plugins);
    }();
    
    $scope.reset = function()
    {
        $scope.pending = false;
        $interval.cancel($scope.pendingTimer);
        $scope.success = false;
    };
    
    $scope.countdown = function()
    {
        $scope.pendingTime--;
        console.log($scope.pendingTime);
    };
    
    $scope.prepareAlert = function()
    {
        $scope.pending = true;
        $scope.pendingTime = 3;
        $scope.pendingTimer = $interval($scope.countdown,1000);
        $scope.timer = $timeout($scope.sendAlert,3000);
    };
    
    $scope.cancelAlert = function()
    {
        $scope.pending = false;
        $interval.cancel($scope.pendingTimer);
        $scope.pendingTime = 3;
        $timeout.cancel($scope.timer);
    };
    
    $scope.call = function()
    {
        var number = $scope.contacts.find(function(item,index,array){return item.key=="call";});
        if(number)
        {    
            window.plugins.CallNumber.callNumber(function(){}, function(error){console.error(error);}, number, true);
        }
    };
    
    $scope.sendAlert = function()
    {
        $scope.prepareMessage();
        $scope.pending = false;
        $interval.cancel($scope.pendingTimer);
        $scope.pendingTime = 3;
        $scope.success=true;
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
            $scope.contacts.forEach(function(item, index, array){
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

.controller('SettingsCtrl', function($scope,$cordovaSms,$ionicPlatform,storage,$timeout) {
     $scope.newContact = {key:'sms'};
     $scope.contacts=storage.getContacts();

    $scope.toDeleteCallback = function(id)
    {
         if($scope.contacts[id])
         {
             $scope.contacts[id].delete = false;
         }
    };

    $scope.toDelete = function(index)
     {
         $scope.contacts[index].delete = true;
         $scope.contacts[index].timer = $timeout($scope.toDeleteCallback,3000,true,index);
     };

     $scope.delete = function(index)
     {
         console.log(index);
         $timeout.cancel($scope.contacts[index].timer);
         $scope.contacts.splice(index,1);
         storage.setContacts($scope.contacts);
     };
    
    $scope.add = function()
    {
        if($scope.contacts.find(function(item,index,array){return item.key=="call";})&&$scope.newContact.key=="call")
        {
            
            $scope.error = "Vous ne pouvez appeler qu'un seul numéro à la fois";
            $timeout(function(){$scope.error=undefined;},3000);
        }
        else if($scope.contacts.find(function(item,index,array){return item.key==$scope.newContact.key&&item.value==$scope.newContact.value;}))
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
                $scope.contacts.push($scope.newContact);
                $scope.newContact = {key:'sms'};
                console.log($scope.contacts);
                storage.setContacts($scope.contacts);
            }
            else
            {
                $scope.error = "Un numéro de téléphone ne doit comporter que des chiffres";
                $timeout(function(){$scope.error=undefined;},3000);
            }
        }
        
    };
})


