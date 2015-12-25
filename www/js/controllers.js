angular.module('secureme.controllers', [])

.controller('DashCtrl', function($scope,$cordovaSms,$ionicPlatform,storage) {
    
    $scope.newPhone='';
    $scope.buttons = [{id:1,position:"before"},{id:2,position:"before"},{id:3,position:"current"},{position:"after"}];
    $scope.state = "idle";
    $scope.init = function()
    {
        var items = document.querySelectorAll('.circle a');
        for(var i = 0, l = items.length; i < l; i++) 
        {
            items[i].style.left = (50 - 35*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
            items[i].style.top = (60 + 35*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
        }
        
        $scope.numbers = storage.getPhoneNumbers();
        $scope.mails = storage.getMailAddresses();
    }();
    
    $scope.changeState = function(state)
    {
        $scope.state = state;
    };
    
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
    
    
    $scope.changeButton = function(index,direction)
    {
        $scope.open=false;
        var length=$scope.buttons.length;
        if(direction=="right")
        {
            $scope.buttons[index].position = "after";
            if(index>0)
                $scope.buttons[index-1%length].position = "current";
            else
                $scope.buttons[length-1].position = "current";
            $scope.buttons[(index+1)%length].position = "before";
        }
        else
        {
            $scope.buttons[index].position = "before";
            
            $scope.buttons[index+1%length].position = "current";
            
            if(index<length)
                $scope.buttons[(index-1)%length].position = "after";
            else
                $scope.buttons[0].position = "after";
        }
        console.log(index);
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

