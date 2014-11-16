// the $http API is based on the deferred/promise APIs exposed by the $q service
// so it returns a promise for us by default
app.factory('PropertyData', function($http, $q, config, propertyCache) {
  /**
   * Workaround for images in EE without Webdav configured. Fixes the reference as stored in EE to a file url.
   * 
   * This method assumes two things:
   * - the file is stored in "{PATH_TO_TOMCAT}webapps\static\buildings\filename.jpg"
   * - the file is accessible under url "/static/buildings/filename.jpg"
   * 
   * @param String ref to the EE image path
   * 
   * @return String file url
   */
  function _fixPhotoRef(ref) {
    var imgurl = '/static/buildings/no_image.jpg';
    if (ref)
      imgurl = ref.split('webapps')[1].replace(/\\/g, '/');

    if (config.localdev)
      imgurl = imgurl.slice(1);

    return imgurl;
  }

  //return a reference to the the PropertyData function
  return{
    getProperties: function() {

      /**
       * Fetch the data from an external source if there is no cache version or if the cache is overdue
       */
      var propCache = propertyCache.get('properties.list');
      var propertiesList;

      if (propCache && (Date.now() - propertyCache.get('properties.ts') < config.cache_refresh )) {
        //we have a cached version of the properties & cache is less than 'config.cache_refresh' old
        console.log("Return from cache");
        return $q.when(propCache);
      } else { //we need to fetch the properties
        if (config.localdev) {
          propertiesList = $http.get('static/js/mock-nijmegen.js');
        } else {
          propertiesList = $http.post(config.baseUrl + config.serviceUrl, {method:config.executeMethodGetList});
        }
      }

      // When our $http promise resolves
      return propertiesList.then(function(response) {
          if (typeof response.data === 'object') {
            for(var i=0; i < response.data.result.length; i++) {
              response.data.result[i].photoref = _fixPhotoRef(response.data.result[i].photoref);
            }
            console.log("Return from http");
            //update the cache
            propertyCache.put('properties.list', response.data)
            propertyCache.put('properties.ts', Date.now())
            return response.data;
          } else {
            // invalid response
            return $q.reject(response.data);
          }
        }, function(response) {
          // something went wrong
          return $q.reject(response.data);
      });
    },
    updateProperty: function(id, name) {
      var arguments    = [id, name];
      return $http.post(config.baseUrl + config.serviceUrl, {method:config.executeMethodSave, args: arguments}).
        then(function(response) {
          if (typeof response.data === 'object') {
            return response.data;
          } else {
            // invalid response
            return $q.reject(response.data);
          }
        }, function(response) {
          // something went wrong
          return $q.reject(response.data);
        });
    }

  };
});
