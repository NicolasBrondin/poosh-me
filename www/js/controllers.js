angular.module('secureme.controllers', [])

.controller('DashCtrl', function($scope,$cordovaSms,$ionicPlatform,storage,$timeout,$cordovaGeolocation) {
    
    $scope.newPhone='';
    $scope.alertMessage = "J'ai besoin d'aide, vite!";
    $scope.init = function()
    {
        $scope.contacts = storage.getContacts();
        //console.log(window.plugins);
    }();
    
    
    $scope.addPhone = function()
    {
        var number = $scope.newPhone;
        if(""+number.length!=10)
            alert("Ceci n'est pas un numéro valide!");
        else
        {
            $scope.numbers.push(number);
            storage.setPhoneNumbers($scope.numbers);
        }
    }
    
    $scope.reset = function()
    {
        $scope.pending = false;
        $scope.success = false;
    }
    
    $scope.prepareAlert = function()
    {
        $scope.pending = true;
        $scope.timer = $timeout($scope.sendAlert,3000);
    };
    
    $scope.cancelAlert = function()
    {
        $scope.pending = false;
        $timeout.cancel($scope.timer);
    };
    
    $scope.call = function()
    {
        window.plugins.CallNumber.callNumber(function(){}, function(){}, "0610386151", true);
    };
    
    $scope.sendAlert = function()
    {
        $scope.prepareMessage();
        $scope.pending = false;
        $scope.success=true;
    };
    
    $scope.prepareMessage = function()
    {
        $cordovaGeolocation.getCurrentPosition().then(function (position) {
            $scope.location = {lat : position.coords.latitude,long :  position.coords.longitude};
            $scope.alertMessage="J'ai besoin d'aide, je suis ici: "+$scope.location.lat+","+$scope.location.long;
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
     $scope.newContact = {key:'call'};
     $scope.contacts=storage.getContacts();
    console.log($scope.contacts);
         
       /*  [
         {key:"call",value:"0610386151"},
         {key:"sms",value:"0617886725"},
         {key:"mail",value:"MrBrondinNicolas@gmail.com"}
    ];*/

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
        $scope.contacts.push($scope.newContact);
        $scope.newContact = {key:'call'};
        console.log($scope.contacts);
        storage.setContacts($scope.contacts);
    };
})


