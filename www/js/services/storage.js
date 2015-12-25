angular.module('secureme.services', []).service('storage', ['$window', function ($window) {

    this.getPhoneNumbers = function()
    {
        if ($window.localStorage.phoneNumbers && $window.localStorage.phoneNumbers !== null) {
            try {
                return $window.localStorage.phoneNumbers;
            } catch (e) {
                console.log('Problem accessing the local storage');
            }
        }
        else
        {
            return [];
        }
    };
    
    this.setPhoneNumbers = function(numbers)
    {
        if(numbers)
        {
            $windows.localStorage.phoneNumbers = numbers;
            return true;
        }
        else
        {
            return false;
        }
    };
    
    this.getMailAddresses = function()
    {
        if ($window.localStorage.mailAdresses && $window.localStorage.mailAddresses !== null) {
            try {
                return $window.localStorage.mailAddresses;
            } catch (e) {
                console.log('Problem accessing the local storage');
            }
        }
        else
        {
            return [];
        }
    };
    
    this.setMailAddresses = function(addresses)
    {
        if(addresses)
        {
            $windows.localStorage.mailAddresses = addresses;
            return true;
        }
        else
        {
            return false;
        }
    };
    
}]);