angular.module('secureme.controllers', [])

.controller('DashCtrl', function($scope,$cordovaSms,$ionicPlatform,storage) {
    
    $scope.newPhone='';
    $scope.init = function()
    {
        $scope.contacts = storage.getContacts();
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
    
    $scope.sendSMS = function()
    {
        console.log("sending SMS...");
        $ionicPlatform.ready(function() {
        $cordovaSms.send('0610386151', 'SMS content', {})
      .then(function() {
        console.log("success");
      }, function(error) {
        console.error(error);
      });
        });
    };
    
    $scope.settings = function()
    {
        $scope.open = !$scope.open;
        if($scope.open)
            $scope.state = 'settings';
        else
            $scope.state = 'idle';
    }
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


