angular.module('secureme.services', []).service('storage', ['$window', function ($window) {

    this.getContacts = function()
    {
        if ($window.localStorage.contacts && $window.localStorage.contacts !== null) {
            var contacts =  JSON.parse($window.localStorage.contacts);
            if(!contacts)
                contacts = [];
            return contacts;
        }
        else
        {
            return [];
        }
    };
    
    this.setContacts = function(contacts)
    {
        if(contacts)
        {
            $window.localStorage.contacts = JSON.stringify(contacts);
            return true;
        }
        else
        {
            return false;
        }
    };
    
}]);