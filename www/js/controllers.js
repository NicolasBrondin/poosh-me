angular.module('secureme.controllers', [])

.controller('DashCtrl', function($scope,$cordovaSms,$ionicPlatform,storage) {
    
    $scope.newPhone='';
    $scope.init = function()
    {
        $scope.numbers = storage.getPhoneNumbers();
        $scope.mails = storage.getMailAddresses();
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

.controller('SettingsCtrl', function($scope,$cordovaSms,$ionicPlatform,storage) {
    
 $scope.contacts=[
     {key:"T",value:"0610386151"},
     {key:"S",value:"0617886725"},
     {key:"M",value:"MrBrondinNicolas@gmail.com"}
];
    
$scope.toDelete = function(index)
 {
     console.log(index);
     $scope.contacts[index].delete = true;
 };
 
 $scope.delete = function(index)
 {
     console.log(index);
     $scope.contacts.splice(index,1);
 };
})


