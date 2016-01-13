app.controller('SettingsCtrl', function($scope,$rootScope,$cordovaSms,$ionicPlatform,storage,$timeout) {
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
});